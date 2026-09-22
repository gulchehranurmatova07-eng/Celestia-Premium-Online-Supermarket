import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export const dynamic = "force-dynamic";

export default async function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  return (
    <div className="flex min-h-screen bg-cream-200">
      <AdminSidebar name={session.name} role={session.role} />
      <main className="min-w-0 flex-1 overflow-x-hidden p-6 sm:p-8">{children}</main>
    </div>
  );
}
