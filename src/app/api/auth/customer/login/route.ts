import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyPassword, createCustomerSession } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const phone = body?.phone?.trim();
  const password = body?.password;

  if (!phone || !password) return NextResponse.json({ error: "invalid_input" }, { status: 400 });

  const user = await db.user.findUnique({ where: { phone } });
  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    return NextResponse.json({ error: "invalid_credentials" }, { status: 401 });
  }

  await createCustomerSession({ userId: user.id, name: user.name, phone: user.phone });
  return NextResponse.json({ user: { id: user.id, name: user.name, phone: user.phone } });
}
