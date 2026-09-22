import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCustomerSession } from "@/lib/auth";
import { getSettings } from "@/lib/data";
import { computeDeliveryFee, meetsMinOrder, type DeliveryMethod } from "@/lib/delivery";
import { validatePromo } from "@/lib/promo";

type OrderItemInput = { productId: string; quantity: number };

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "invalid_body" }, { status: 400 });

  const {
    customerName,
    phone,
    city = "Toshkent",
    district,
    street,
    house,
    apartment,
    entrance,
    floor,
    comment,
    deliveryMethod,
    zoneId,
    pickupLocationId,
    paymentMethod,
    promoCode,
    items,
  } = body as {
    customerName?: string;
    phone?: string;
    city?: string;
    district?: string;
    street?: string;
    house?: string;
    apartment?: string;
    entrance?: string;
    floor?: string;
    comment?: string;
    deliveryMethod?: DeliveryMethod;
    zoneId?: string;
    pickupLocationId?: string;
    paymentMethod?: "CASH" | "CARD" | "CLICK" | "PAYME" | "UZUM";
    promoCode?: string;
    items?: OrderItemInput[];
  };

  if (!customerName || !phone) {
    return NextResponse.json({ error: "missing_contact" }, { status: 400 });
  }
  if (!items || items.length === 0) {
    return NextResponse.json({ error: "empty_cart" }, { status: 400 });
  }
  if (!deliveryMethod || !["STANDARD", "EXPRESS", "PICKUP"].includes(deliveryMethod)) {
    return NextResponse.json({ error: "invalid_delivery_method" }, { status: 400 });
  }
  if (!paymentMethod || !["CASH", "CARD", "CLICK", "PAYME", "UZUM"].includes(paymentMethod)) {
    return NextResponse.json({ error: "invalid_payment_method" }, { status: 400 });
  }
  if (deliveryMethod !== "PICKUP" && (!district || !street || !house)) {
    return NextResponse.json({ error: "missing_address" }, { status: 400 });
  }
  if (deliveryMethod === "PICKUP" && !pickupLocationId) {
    return NextResponse.json({ error: "missing_pickup_location" }, { status: 400 });
  }

  const productIds = items.map((i) => i.productId);
  const products = await db.product.findMany({ where: { id: { in: productIds } } });
  const productMap = new Map(products.map((p) => [p.id, p]));

  for (const item of items) {
    const product = productMap.get(item.productId);
    if (!product) return NextResponse.json({ error: "product_not_found", productId: item.productId }, { status: 400 });
    if (!product.isAvailable || product.stock < item.quantity) {
      return NextResponse.json({ error: "out_of_stock", productId: item.productId, name: product.name }, { status: 400 });
    }
  }

  const subtotal = items.reduce((sum, item) => {
    const product = productMap.get(item.productId)!;
    return sum + product.price * item.quantity;
  }, 0);

  const settings = await getSettings();

  if (!meetsMinOrder(subtotal, settings)) {
    return NextResponse.json({ error: "below_min_order", minOrder: settings.minOrderAmount }, { status: 400 });
  }

  let zoneFee: number | null = null;
  let pickupLocation = null;
  if (deliveryMethod === "STANDARD") {
    if (!zoneId) {
      return NextResponse.json({ error: "zone_unavailable" }, { status: 400 });
    }
    const zone = await db.deliveryZone.findUnique({ where: { id: zoneId } });
    if (!zone) return NextResponse.json({ error: "zone_unavailable" }, { status: 400 });
    zoneFee = zone.fee;
  }
  if (deliveryMethod === "PICKUP") {
    pickupLocation = await db.pickupLocation.findUnique({ where: { id: pickupLocationId! } });
    if (!pickupLocation || !pickupLocation.isActive) {
      return NextResponse.json({ error: "pickup_unavailable" }, { status: 400 });
    }
  }

  const deliveryFee = computeDeliveryFee({ method: deliveryMethod, subtotal, zoneFee, settings });

  let discount = 0;
  let appliedPromoCode: string | null = null;
  if (promoCode) {
    const promoResult = await validatePromo(promoCode, subtotal);
    if (!promoResult.ok) {
      return NextResponse.json({ error: "invalid_promo", reason: promoResult.reason }, { status: 400 });
    }
    discount = promoResult.discount;
    appliedPromoCode = promoResult.code;
  }

  const total = Math.max(0, subtotal - discount + deliveryFee);

  const session = await getCustomerSession();
  const orderCount = await db.order.count();
  const orderNumber = `CEL-${10000 + orderCount + 1}`;

  const order = await db.$transaction(async (tx) => {
    const created = await tx.order.create({
      data: {
        orderNumber,
        userId: session?.userId,
        customerName,
        phone,
        city,
        district: deliveryMethod === "PICKUP" ? null : district,
        street: deliveryMethod === "PICKUP" ? null : street,
        house: deliveryMethod === "PICKUP" ? null : house,
        apartment,
        entrance,
        floor,
        comment,
        deliveryMethod,
        pickupLocationId: deliveryMethod === "PICKUP" ? pickupLocationId : null,
        deliveryFee,
        subtotal,
        discount,
        promoCode: appliedPromoCode,
        total,
        paymentMethod,
        paymentStatus: "PENDING",
        orderStatus: "NEW",
        items: {
          create: items.map((item) => {
            const product = productMap.get(item.productId)!;
            return {
              productId: product.id,
              name: product.name,
              image: product.image,
              weight: product.weight,
              price: product.price,
              quantity: item.quantity,
            };
          }),
        },
      },
      include: { items: true, pickupLocation: true },
    });

    for (const item of items) {
      const product = productMap.get(item.productId)!;
      const newStock = product.stock - item.quantity;
      await tx.product.update({
        where: { id: product.id },
        data: { stock: newStock, isAvailable: newStock > 0 },
      });
    }

    if (appliedPromoCode) {
      await tx.promoCode.update({ where: { code: appliedPromoCode }, data: { usedCount: { increment: 1 } } });
    }

    return created;
  });

  return NextResponse.json({ order });
}
