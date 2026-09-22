import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(_request: Request, ctx: RouteContext<"/api/orders/[orderNumber]">) {
  const { orderNumber } = await ctx.params;
  const order = await db.order.findUnique({
    where: { orderNumber },
    include: { items: true, pickupLocation: true },
  });
  if (!order) return NextResponse.json({ error: "not_found" }, { status: 404 });
  return NextResponse.json({ order });
}
