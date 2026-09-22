import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-guard";

export async function GET(_request: Request, ctx: RouteContext<"/api/admin/products/[id]">) {
  const auth = await requireAdmin(["SUPER_ADMIN", "PRODUCT_MANAGER"]);
  if (auth instanceof NextResponse) return auth;

  const { id } = await ctx.params;
  const product = await db.product.findUnique({ where: { id } });
  if (!product) return NextResponse.json({ error: "not_found" }, { status: 404 });
  return NextResponse.json({ product });
}

export async function PATCH(request: NextRequest, ctx: RouteContext<"/api/admin/products/[id]">) {
  const auth = await requireAdmin(["SUPER_ADMIN", "PRODUCT_MANAGER"]);
  if (auth instanceof NextResponse) return auth;

  const { id } = await ctx.params;
  const body = await request.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "invalid_body" }, { status: 400 });

  const price = body.price != null ? Number(body.price) : undefined;
  const oldPriceRaw = body.oldPrice != null ? Number(body.oldPrice) : undefined;
  const oldPrice = oldPriceRaw != null ? (oldPriceRaw > 0 ? oldPriceRaw : null) : undefined;
  let discount: number | undefined;
  if (price != null && oldPrice) {
    discount = oldPrice > price ? Math.round(((oldPrice - price) / oldPrice) * 100) : 0;
  } else if (oldPrice === null) {
    discount = 0;
  }

  const stock = body.stock != null ? Number(body.stock) : undefined;

  const product = await db.product.update({
    where: { id },
    data: {
      name: body.name,
      brand: body.brand,
      categoryId: body.categoryId,
      description: body.description,
      ingredients: body.ingredients,
      nutrition: body.nutrition,
      weight: body.weight,
      price,
      oldPrice,
      discount,
      stock,
      isAvailable: stock != null ? stock > 0 && (body.isAvailable ?? true) : body.isAvailable,
      isFeatured: body.isFeatured,
      image: body.image,
      rating: body.rating != null ? Number(body.rating) : undefined,
    },
  });

  return NextResponse.json({ product });
}

export async function DELETE(_request: Request, ctx: RouteContext<"/api/admin/products/[id]">) {
  const auth = await requireAdmin(["SUPER_ADMIN", "PRODUCT_MANAGER"]);
  if (auth instanceof NextResponse) return auth;

  const { id } = await ctx.params;
  await db.product.delete({ where: { id } }).catch(() => null);
  return NextResponse.json({ ok: true });
}
