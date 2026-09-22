import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-guard";
import type { $Enums } from "@/generated/prisma/client";

const ORDER_STATUSES = ["NEW", "CONFIRMED", "PREPARING", "READY", "OUT_FOR_DELIVERY", "READY_FOR_PICKUP", "DELIVERED", "PICKED_UP", "CANCELLED"];
const PAYMENT_STATUSES = ["PENDING", "PAID", "FAILED", "REFUND_PENDING", "REFUNDED", "CANCELLED"];

export async function GET(_request: Request, ctx: RouteContext<"/api/admin/orders/[id]">) {
  const auth = await requireAdmin(["SUPER_ADMIN", "ORDER_MANAGER"]);
  if (auth instanceof NextResponse) return auth;

  const { id } = await ctx.params;
  const order = await db.order.findUnique({ where: { id }, include: { items: true, pickupLocation: true } });
  if (!order) return NextResponse.json({ error: "not_found" }, { status: 404 });
  return NextResponse.json({ order });
}

export async function PATCH(request: NextRequest, ctx: RouteContext<"/api/admin/orders/[id]">) {
  const auth = await requireAdmin(["SUPER_ADMIN", "ORDER_MANAGER"]);
  if (auth instanceof NextResponse) return auth;

  const { id } = await ctx.params;
  const body = await request.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "invalid_body" }, { status: 400 });

  const data: { orderStatus?: $Enums.OrderStatus; paymentStatus?: $Enums.PaymentStatus } = {};
  if (body.orderStatus) {
    if (!ORDER_STATUSES.includes(body.orderStatus)) return NextResponse.json({ error: "invalid_order_status" }, { status: 400 });
    data.orderStatus = body.orderStatus as $Enums.OrderStatus;
  }
  if (body.paymentStatus) {
    if (!PAYMENT_STATUSES.includes(body.paymentStatus)) return NextResponse.json({ error: "invalid_payment_status" }, { status: 400 });
    data.paymentStatus = body.paymentStatus as $Enums.PaymentStatus;
  }

  const order = await db.order.update({ where: { id }, data, include: { items: true, pickupLocation: true } });
  return NextResponse.json({ order });
}
