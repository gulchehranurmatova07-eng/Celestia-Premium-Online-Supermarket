import { NextRequest, NextResponse } from "next/server";
import { validatePromo } from "@/lib/promo";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const code = body?.code as string | undefined;
  const subtotal = Number(body?.subtotal ?? 0);

  if (!code) return NextResponse.json({ ok: false, reason: "invalid" }, { status: 400 });

  const result = await validatePromo(code, subtotal);
  if (!result.ok) return NextResponse.json(result, { status: 400 });
  return NextResponse.json(result);
}
