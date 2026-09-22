import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-guard";

export async function GET(request: NextRequest) {
  const auth = await requireAdmin(["SUPER_ADMIN", "ORDER_MANAGER"]);
  if (auth instanceof NextResponse) return auth;

  const q = request.nextUrl.searchParams.get("q") ?? "";
  const status = request.nextUrl.searchParams.get("status") ?? "";

  const orders = await db.order.findMany({
    where: {
      AND: [
        q
          ? {
              OR: [
                { orderNumber: { contains: q, mode: "insensitive" } },
                { customerName: { contains: q, mode: "insensitive" } },
                { phone: { contains: q, mode: "insensitive" } },
              ],
            }
          : {},
        status ? { orderStatus: status as never } : {},
      ],
    },
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ orders });
}
