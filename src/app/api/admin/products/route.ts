import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-guard";

export async function GET(request: NextRequest) {
  const auth = await requireAdmin(["SUPER_ADMIN", "PRODUCT_MANAGER"]);
  if (auth instanceof NextResponse) return auth;

  const q = request.nextUrl.searchParams.get("q") ?? "";
  const stock = request.nextUrl.searchParams.get("stock");

  const where: NonNullable<Parameters<typeof db.product.findMany>[0]>["where"] = {
    AND: [
      q
        ? {
            OR: [
              { name: { contains: q, mode: "insensitive" } },
              { sku: { contains: q, mode: "insensitive" } },
              { brand: { contains: q, mode: "insensitive" } },
            ],
          }
        : {},
      stock === "low" ? { stock: { gt: 0, lte: 5 } } : {},
      stock === "out" ? { stock: { lte: 0 } } : {},
    ],
  };

  const products = await db.product.findMany({
    where,
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ products });
}

export async function POST(request: NextRequest) {
  const auth = await requireAdmin(["SUPER_ADMIN", "PRODUCT_MANAGER"]);
  if (auth instanceof NextResponse) return auth;

  const body = await request.json().catch(() => null);
  if (!body?.name || !body?.categoryId || !body?.price || !body?.weight || !body?.sku) {
    return NextResponse.json({ error: "invalid_input" }, { status: 400 });
  }

  const existingSku = await db.product.findUnique({ where: { sku: body.sku } });
  if (existingSku) return NextResponse.json({ error: "sku_taken" }, { status: 409 });

  const price = Number(body.price);
  const oldPrice = body.oldPrice && Number(body.oldPrice) > 0 ? Number(body.oldPrice) : null;
  const discount = oldPrice && oldPrice > price ? Math.round(((oldPrice - price) / oldPrice) * 100) : 0;
  const stock = Number(body.stock ?? 0);

  const product = await db.product.create({
    data: {
      sku: body.sku,
      name: body.name,
      brand: body.brand || "",
      categoryId: body.categoryId,
      description: body.description || "",
      ingredients: body.ingredients || "",
      nutrition: body.nutrition || "",
      weight: body.weight,
      price,
      oldPrice,
      discount,
      stock,
      rating: body.rating ? Number(body.rating) : 0,
      isAvailable: body.isAvailable ?? stock > 0,
      isFeatured: !!body.isFeatured,
      image: body.image || "/products/placeholder.svg",
    },
  });

  return NextResponse.json({ product });
}
