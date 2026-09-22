import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCustomerSession, createCustomerSession } from "@/lib/auth";

export async function GET() {
  const session = await getCustomerSession();
  if (!session) return NextResponse.json({ user: null });
  const user = await db.user.findUnique({
    where: { id: session.userId },
    select: { id: true, name: true, phone: true, email: true, createdAt: true },
  });
  return NextResponse.json({ user });
}

export async function PATCH(request: NextRequest) {
  const session = await getCustomerSession();
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const body = await request.json().catch(() => null);
  const name = body?.name?.trim();
  const email = body?.email?.trim() || null;
  if (!name) return NextResponse.json({ error: "invalid_input" }, { status: 400 });

  const user = await db.user.update({ where: { id: session.userId }, data: { name, email } });
  await createCustomerSession({ userId: user.id, name: user.name, phone: user.phone });
  return NextResponse.json({ user });
}
