import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-guard";

export async function PATCH(request: NextRequest, ctx: RouteContext<"/api/admin/pickup-locations/[id]">) {
  const auth = await requireAdmin(["SUPER_ADMIN"]);
  if (auth instanceof NextResponse) return auth;
  const { id } = await ctx.params;
  const body = await request.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "invalid_body" }, { status: 400 });

  const location = await db.pickupLocation.update({
    where: { id },
    data: { name: body.name, address: body.address, openHours: body.openHours, isActive: body.isActive },
  });
  return NextResponse.json({ location });
}

export async function DELETE(_request: Request, ctx: RouteContext<"/api/admin/pickup-locations/[id]">) {
  const auth = await requireAdmin(["SUPER_ADMIN"]);
  if (auth instanceof NextResponse) return auth;
  const { id } = await ctx.params;
  await db.pickupLocation.delete({ where: { id } }).catch(() => null);
  return NextResponse.json({ ok: true });
}
