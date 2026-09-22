"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const LINKS = [
  { href: "/account", label: "Profil", icon: "👤" },
  { href: "/account/orders", label: "Buyurtmalarim", icon: "📦" },
  { href: "/wishlist", label: "Sevimlilar", icon: "❤️" },
  { href: "/account/addresses", label: "Manzillarim", icon: "📍" },
  { href: "/account/payments", label: "To‘lov usullari", icon: "💳" },
  { href: "/account/settings", label: "Sozlamalar", icon: "⚙️" },
];

export function AccountNav({ name, phone }: { name: string; phone: string }) {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch("/api/auth/customer/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  return (
    <aside className="w-full shrink-0 lg:w-64">
      <div className="mb-4 rounded-2xl border border-navy-900/8 bg-white p-4">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-navy-900 font-display text-lg font-semibold text-gold-400">
          {name.charAt(0).toUpperCase()}
        </div>
        <div className="mt-2.5">
          <div className="font-medium text-navy-900">{name}</div>
          <div className="text-xs text-navy-900/50">{phone}</div>
        </div>
      </div>

      <nav className="flex flex-col gap-1 rounded-2xl border border-navy-900/8 bg-white p-2">
        {LINKS.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className={`flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
              pathname === l.href ? "bg-navy-900 text-white" : "text-navy-900/70 hover:bg-cream-100"
            }`}
          >
            <span>{l.icon}</span>
            {l.label}
          </Link>
        ))}
        <button
          onClick={logout}
          className="mt-1 flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-red-500 transition hover:bg-red-50"
        >
          <span>🚪</span>
          Chiqish
        </button>
      </nav>
    </aside>
  );
}
