import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-guard";

export async function GET() {
  const auth = await requireAdmin(["SUPER_ADMIN"]);
  if (auth instanceof NextResponse) return auth;
  const codes = await db.promoCode.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json({ codes });
}

export async function POST(request: NextRequest) {
  const auth = await requireAdmin(["SUPER_ADMIN"]);
  if (auth instanceof NextResponse) return auth;

  const body = await request.json().catch(() => null);
  if (!body?.code || body.value == null) return NextResponse.json({ error: "invalid_input" }, { status: 400 });

  const existing = await db.promoCode.findUnique({ where: { code: body.code.toUpperCase() } });
  if (existing) return NextResponse.json({ error: "code_taken" }, { status: 409 });

  const code = await db.promoCode.create({
    data: {
      code: body.code.toUpperCase(),
      type: body.type === "FIXED" ? "FIXED" : "PERCENT",
      value: Number(body.value),
      minOrder: Number(body.minOrder ?? 0),
      maxDiscount: body.maxDiscount ? Number(body.maxDiscount) : null,
      expiresAt: body.expiresAt ? new Date(body.expiresAt) : null,
      usageLimit: body.usageLimit ? Number(body.usageLimit) : null,
      active: body.active ?? true,
    },
  });
  return NextResponse.json({ code });
}
