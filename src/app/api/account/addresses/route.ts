import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCustomerSession } from "@/lib/auth";

export async function GET() {
  const session = await getCustomerSession();
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const addresses = await db.address.findMany({ where: { userId: session.userId }, orderBy: { isDefault: "desc" } });
  return NextResponse.json({ addresses });
}

export async function POST(request: NextRequest) {
  const session = await getCustomerSession();
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const body = await request.json().catch(() => null);
  if (!body?.district || !body?.street || !body?.house) {
    return NextResponse.json({ error: "invalid_input" }, { status: 400 });
  }

  if (body.isDefault) {
    await db.address.updateMany({ where: { userId: session.userId }, data: { isDefault: false } });
  }

  const address = await db.address.create({
    data: {
      userId: session.userId,
      label: body.label || "Uy",
      city: body.city || "Toshkent",
      district: body.district,
      street: body.street,
      house: body.house,
      apartment: body.apartment || null,
      entrance: body.entrance || null,
      floor: body.floor || null,
      note: body.note || null,
      isDefault: !!body.isDefault,
    },
  });
  return NextResponse.json({ address });
}
