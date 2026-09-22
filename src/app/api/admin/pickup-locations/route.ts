import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-guard";

export async function GET() {
  const auth = await requireAdmin(["SUPER_ADMIN"]);
  if (auth instanceof NextResponse) return auth;
  const locations = await db.pickupLocation.findMany();
  return NextResponse.json({ locations });
}

export async function POST(request: NextRequest) {
  const auth = await requireAdmin(["SUPER_ADMIN"]);
  if (auth instanceof NextResponse) return auth;

  const body = await request.json().catch(() => null);
  if (!body?.name || !body?.address) return NextResponse.json({ error: "invalid_input" }, { status: 400 });

  const location = await db.pickupLocation.create({
    data: { name: body.name, address: body.address, openHours: body.openHours || "09:00–21:00", isActive: body.isActive ?? true },
  });
  return NextResponse.json({ location });
}
