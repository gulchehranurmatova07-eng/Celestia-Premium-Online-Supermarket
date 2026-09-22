"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Logo } from "@/components/brand/Logo";

const NAV = [
  { href: "/admin", label: "Boshqaruv paneli", icon: "📊", roles: ["SUPER_ADMIN", "PRODUCT_MANAGER", "ORDER_MANAGER"] },
  { href: "/admin/products", label: "Mahsulotlar", icon: "🛒", roles: ["SUPER_ADMIN", "PRODUCT_MANAGER"] },
  { href: "/admin/categories", label: "Kategoriyalar", icon: "🗂️", roles: ["SUPER_ADMIN", "PRODUCT_MANAGER"] },
  { href: "/admin/orders", label: "Buyurtmalar", icon: "📦", roles: ["SUPER_ADMIN", "ORDER_MANAGER"] },
  { href: "/admin/delivery", label: "Yetkazib berish", icon: "🚚", roles: ["SUPER_ADMIN"] },
];

const ROLE_LABELS: Record<string, string> = {
  SUPER_ADMIN: "Super Admin",
  PRODUCT_MANAGER: "Mahsulot menejeri",
  ORDER_MANAGER: "Buyurtma menejeri",
};

export function AdminSidebar({ name, role }: { name: string; role: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const items = NAV.filter((n) => n.roles.includes(role));

  async function logout() {
    await fetch("/api/auth/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <aside className="flex h-screen w-64 shrink-0 flex-col border-r border-white/10 bg-navy-950 text-white">
      <div className="border-b border-white/10 px-5 py-5 [&_span]:text-white [&_span:last-child]:text-gold-400">
        <Logo markClassName="h-8 w-8" showTagline />
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {items.map((item) => {
          const active = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition ${
                active ? "bg-gold-500 text-navy-950" : "text-white/65 hover:bg-white/5 hover:text-white"
              }`}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/10 p-4">
        <div className="mb-3 flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-sm font-semibold text-gold-400">
            {name.charAt(0)}
          </div>
          <div className="min-w-0">
            <div className="truncate text-sm font-medium text-white">{name}</div>
            <div className="text-xs text-white/40">{ROLE_LABELS[role] ?? role}</div>
          </div>
        </div>
        <Link href="/" target="_blank" className="mb-2 block rounded-lg px-3 py-2 text-center text-xs font-medium text-white/60 hover:bg-white/5">
          Saytni ko‘rish ↗
        </Link>
        <button onClick={logout} className="w-full rounded-lg bg-white/5 px-3 py-2 text-xs font-medium text-red-300 hover:bg-white/10">
          Chiqish
        </button>
      </div>
    </aside>
  );
}
