import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-guard";

export async function GET() {
  const auth = await requireAdmin(["SUPER_ADMIN"]);
  if (auth instanceof NextResponse) return auth;
  const zones = await db.deliveryZone.findMany({ orderBy: { sortOrder: "asc" } });
  return NextResponse.json({ zones });
}

export async function POST(request: NextRequest) {
  const auth = await requireAdmin(["SUPER_ADMIN"]);
  if (auth instanceof NextResponse) return auth;

  const body = await request.json().catch(() => null);
  if (!body?.name || body.fee == null) return NextResponse.json({ error: "invalid_input" }, { status: 400 });

  const zone = await db.deliveryZone.create({
    data: {
      name: body.name,
      minKm: Number(body.minKm ?? 0),
      maxKm: Number(body.maxKm ?? 0),
      fee: Number(body.fee),
      sortOrder: Number(body.sortOrder ?? 0),
    },
  });
  return NextResponse.json({ zone });
}
