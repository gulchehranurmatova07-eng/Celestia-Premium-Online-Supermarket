import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-guard";

export async function PATCH(request: NextRequest, ctx: RouteContext<"/api/admin/zones/[id]">) {
  const auth = await requireAdmin(["SUPER_ADMIN"]);
  if (auth instanceof NextResponse) return auth;

  const { id } = await ctx.params;
  const body = await request.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "invalid_body" }, { status: 400 });

  const zone = await db.deliveryZone.update({
    where: { id },
    data: {
      name: body.name,
      minKm: body.minKm != null ? Number(body.minKm) : undefined,
      maxKm: body.maxKm != null ? Number(body.maxKm) : undefined,
      fee: body.fee != null ? Number(body.fee) : undefined,
      sortOrder: body.sortOrder != null ? Number(body.sortOrder) : undefined,
    },
  });
  return NextResponse.json({ zone });
}

export async function DELETE(_request: Request, ctx: RouteContext<"/api/admin/zones/[id]">) {
  const auth = await requireAdmin(["SUPER_ADMIN"]);
  if (auth instanceof NextResponse) return auth;

  const { id } = await ctx.params;
  await db.deliveryZone.delete({ where: { id } }).catch(() => null);
  return NextResponse.json({ ok: true });
}
