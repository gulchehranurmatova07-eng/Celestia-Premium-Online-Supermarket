import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyPassword, createAdminSession } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const email = body?.email?.trim().toLowerCase();
  const password = body?.password;

  if (!email || !password) return NextResponse.json({ error: "invalid_input" }, { status: 400 });

  const admin = await db.adminUser.findUnique({ where: { email } });
  if (!admin || !(await verifyPassword(password, admin.passwordHash))) {
    return NextResponse.json({ error: "invalid_credentials" }, { status: 401 });
  }

  await createAdminSession({ adminId: admin.id, role: admin.role, name: admin.name, email: admin.email });
  return NextResponse.json({ admin: { id: admin.id, name: admin.name, role: admin.role } });
}
