import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { formatSum } from "@/lib/format";
import { OrderTracker } from "@/components/order/OrderTracker";
import { OrderStatusBadge, PaymentStatusBadge } from "@/components/order/StatusBadge";

export const dynamic = "force-dynamic";

export default async function OrderSuccessPage({ params }: { params: Promise<{ orderNumber: string }> }) {
  const { orderNumber } = await params;
  const order = await db.order.findUnique({
    where: { orderNumber },
    include: { items: true, pickupLocation: true },
  });
  if (!order) notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <div className="flex flex-col items-center text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-3xl">✅</div>
        <h1 className="mt-4 font-display text-2xl font-semibold text-navy-900 sm:text-3xl">Buyurtmangiz qabul qilindi!</h1>
        <p className="mt-2 text-navy-900/55">
          Buyurtma raqami: <span className="font-semibold text-navy-900">{order.orderNumber}</span>
        </p>
      </div>

      <div className="mt-8 rounded-2xl border border-navy-900/8 bg-white p-6">
        <div className="mb-5">
          <OrderTracker status={order.orderStatus} isPickup={order.deliveryMethod === "PICKUP"} />
        </div>

        <div className="flex flex-wrap items-center gap-2 border-t border-navy-900/8 pt-4">
          <span className="text-sm text-navy-900/55">Holat:</span>
          <OrderStatusBadge status={order.orderStatus} />
          <span className="ml-4 text-sm text-navy-900/55">To‘lov:</span>
          <PaymentStatusBadge status={order.paymentStatus} />
        </div>

        <div className="mt-5 divide-y divide-navy-900/8 border-t border-navy-900/8">
          {order.items.map((item) => (
            <div key={item.id} className="flex items-center gap-3 py-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.image} alt={item.name} className="h-12 w-12 rounded-lg object-cover" />
              <div className="min-w-0 flex-1">
                <div className="line-clamp-1 text-sm text-navy-900">{item.name}</div>
                <div className="text-xs text-navy-900/45">
                  {item.weight} × {item.quantity}
                </div>
              </div>
              <div className="text-sm font-medium text-navy-900">{formatSum(item.price * item.quantity)}</div>
            </div>
          ))}
        </div>

        <div className="mt-4 space-y-2 border-t border-navy-900/8 pt-4 text-sm">
          <Row label="Mahsulotlar" value={formatSum(order.subtotal)} />
          {order.discount > 0 && <Row label="Chegirma" value={`−${formatSum(order.discount)}`} />}
          <Row label="Yetkazib berish" value={order.deliveryFee === 0 ? "Bepul" : formatSum(order.deliveryFee)} />
          <div className="flex justify-between border-t border-navy-900/8 pt-2 text-base font-semibold text-navy-900">
            <span>Jami</span>
            <span>{formatSum(order.total)}</span>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-3 border-t border-navy-900/8 pt-4 text-sm sm:grid-cols-2">
          <div>
            <div className="text-navy-900/45">Mijoz</div>
            <div className="font-medium text-navy-900">{order.customerName} · {order.phone}</div>
          </div>
          <div>
            <div className="text-navy-900/45">
              {order.deliveryMethod === "PICKUP" ? "Olib ketish manzili" : "Yetkazib berish manzili"}
            </div>
            <div className="font-medium text-navy-900">
              {order.deliveryMethod === "PICKUP"
                ? order.pickupLocation?.address
                : `${order.city}, ${order.district}, ${order.street} ${order.house}${order.apartment ? `, kv. ${order.apartment}` : ""}`}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
        <Link href="/account/orders" className="rounded-full bg-navy-900 px-6 py-3 text-center text-sm font-semibold text-white hover:bg-navy-700">
          Buyurtmalarimni ko‘rish
        </Link>
        <Link href="/" className="rounded-full border border-navy-900/15 px-6 py-3 text-center text-sm font-semibold text-navy-900 hover:bg-navy-900/5">
          Xaridni davom ettirish
        </Link>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-navy-900/70">
      <span>{label}</span>
      <span className="font-medium text-navy-900">{value}</span>
    </div>
  );
}
