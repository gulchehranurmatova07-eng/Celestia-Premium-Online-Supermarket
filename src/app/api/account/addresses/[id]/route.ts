import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCustomerSession } from "@/lib/auth";

export async function DELETE(_request: Request, ctx: RouteContext<"/api/account/addresses/[id]">) {
  const session = await getCustomerSession();
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { id } = await ctx.params;
  const address = await db.address.findUnique({ where: { id } });
  if (!address || address.userId !== session.userId) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }
  await db.address.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
