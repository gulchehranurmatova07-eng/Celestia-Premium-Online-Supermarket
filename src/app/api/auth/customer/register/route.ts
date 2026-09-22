import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { hashPassword, createCustomerSession } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const name = body?.name?.trim();
  const phone = body?.phone?.trim();
  const password = body?.password;

  if (!name || !phone || !password || password.length < 6) {
    return NextResponse.json({ error: "invalid_input" }, { status: 400 });
  }

  const existing = await db.user.findUnique({ where: { phone } });
  if (existing) {
    return NextResponse.json({ error: "phone_taken" }, { status: 409 });
  }

  const user = await db.user.create({
    data: { name, phone, passwordHash: await hashPassword(password) },
  });

  await createCustomerSession({ userId: user.id, name: user.name, phone: user.phone });
  return NextResponse.json({ user: { id: user.id, name: user.name, phone: user.phone } });
}
