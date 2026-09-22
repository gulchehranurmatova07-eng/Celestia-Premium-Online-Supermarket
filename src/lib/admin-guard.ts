import { NextResponse } from "next/server";
import { getAdminSession, type AdminSession } from "@/lib/auth";

export async function requireAdmin(allowedRoles?: string[]): Promise<AdminSession | NextResponse> {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  if (allowedRoles && !allowedRoles.includes(session.role)) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  return session;
}
