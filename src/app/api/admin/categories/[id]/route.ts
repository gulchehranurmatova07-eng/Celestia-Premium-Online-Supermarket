import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-guard";

export async function PATCH(request: NextRequest, ctx: RouteContext<"/api/admin/categories/[id]">) {
  const auth = await requireAdmin(["SUPER_ADMIN", "PRODUCT_MANAGER"]);
  if (auth instanceof NextResponse) return auth;

  const { id } = await ctx.params;
  const body = await request.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "invalid_body" }, { status: 400 });

  const category = await db.category.update({
    where: { id },
    data: {
      name: body.name,
      icon: body.icon,
      image: body.image,
      sortOrder: body.sortOrder != null ? Number(body.sortOrder) : undefined,
      visible: body.visible,
    },
  });
  return NextResponse.json({ category });
}

export async function DELETE(_request: Request, ctx: RouteContext<"/api/admin/categories/[id]">) {
  const auth = await requireAdmin(["SUPER_ADMIN", "PRODUCT_MANAGER"]);
  if (auth instanceof NextResponse) return auth;

  const { id } = await ctx.params;
  const count = await db.product.count({ where: { categoryId: id } });
  if (count > 0) {
    return NextResponse.json({ error: "has_products", count }, { status: 409 });
  }
  await db.category.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
