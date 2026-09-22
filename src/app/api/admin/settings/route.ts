import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-guard";
import { getSettings } from "@/lib/data";

export async function GET() {
  const auth = await requireAdmin(["SUPER_ADMIN"]);
  if (auth instanceof NextResponse) return auth;
  const settings = await getSettings();
  return NextResponse.json({ settings });
}

export async function PATCH(request: NextRequest) {
  const auth = await requireAdmin(["SUPER_ADMIN"]);
  if (auth instanceof NextResponse) return auth;

  const body = await request.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "invalid_body" }, { status: 400 });

  await getSettings();
  const settings = await db.settings.update({
    where: { id: "settings" },
    data: {
      standardDeliveryFee: body.standardDeliveryFee != null ? Number(body.standardDeliveryFee) : undefined,
      standardEtaMin: body.standardEtaMin != null ? Number(body.standardEtaMin) : undefined,
      standardEtaMax: body.standardEtaMax != null ? Number(body.standardEtaMax) : undefined,
      standardEnabled: body.standardEnabled,
      expressDeliveryFee: body.expressDeliveryFee != null ? Number(body.expressDeliveryFee) : undefined,
      expressEtaMin: body.expressEtaMin != null ? Number(body.expressEtaMin) : undefined,
      expressEtaMax: body.expressEtaMax != null ? Number(body.expressEtaMax) : undefined,
      expressEnabled: body.expressEnabled,
      pickupEnabled: body.pickupEnabled,
      freeDeliveryThreshold: body.freeDeliveryThreshold != null ? Number(body.freeDeliveryThreshold) : undefined,
      freeDeliveryEnabled: body.freeDeliveryEnabled,
      minOrderAmount: body.minOrderAmount != null ? Number(body.minOrderAmount) : undefined,
      minOrderEnabled: body.minOrderEnabled,
    },
  });
  return NextResponse.json({ settings });
}
