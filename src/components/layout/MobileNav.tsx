"use client";

import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { useLocale } from "@/i18n/LocaleProvider";

type Cat = { slug: string; name: string; icon: string };

export function MobileNav({
  open,
  onClose,
  categories,
  customerName,
}: {
  open: boolean;
  onClose: () => void;
  categories: Cat[];
  customerName: string | null;
}) {
  const { t } = useLocale();

  return (
    <div className={`fixed inset-0 z-[60] lg:hidden ${open ? "" : "pointer-events-none"}`}>
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-navy-950/50 transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0"}`}
      />
      <div
        className={`absolute left-0 top-0 h-full w-[84%] max-w-xs overflow-y-auto bg-cream-100 shadow-2xl transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-navy-900/8 px-4 py-4">
          <Logo markClassName="h-8 w-8" href={null} />
          <button onClick={onClose} className="flex h-9 w-9 items-center justify-center rounded-full text-navy-900" aria-label="close">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M6 6l12 12M18 6 6 18" />
            </svg>
          </button>
        </div>

        <div className="border-b border-navy-900/8 px-4 py-3">
          <Link href={customerName ? "/account" : "/login"} onClick={onClose} className="flex items-center gap-2 text-sm font-medium text-navy-900">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <circle cx="12" cy="8" r="4" />
              <path d="M4 21c0-4 4-6 8-6s8 2 8 6" />
            </svg>
            {customerName ? customerName.split(" ")[0] : t("account.login")}
          </Link>
        </div>

        <div className="px-4 py-3">
          <span className="text-xs font-semibold uppercase tracking-wide text-navy-900/40">{t("nav.categories")}</span>
          <div className="mt-2 flex flex-col">
            {categories.map((c) => (
              <Link
                key={c.slug}
                href={`/category/${c.slug}`}
                onClick={onClose}
                className="flex items-center gap-3 rounded-lg px-2 py-2.5 text-sm font-medium text-navy-900 transition hover:bg-white"
              >
                <span className="text-lg">{c.icon}</span>
                {c.name}
              </Link>
            ))}
          </div>
        </div>

        <div className="border-t border-navy-900/8 px-4 py-3">
          <div className="flex flex-col">
            <Link href="/account/orders" onClick={onClose} className="rounded-lg px-2 py-2.5 text-sm font-medium text-navy-900 hover:bg-white">
              {t("account.orders")}
            </Link>
            <Link href="/wishlist" onClick={onClose} className="rounded-lg px-2 py-2.5 text-sm font-medium text-navy-900 hover:bg-white">
              {t("account.wishlist")}
            </Link>
            <Link href="/cart" onClick={onClose} className="rounded-lg px-2 py-2.5 text-sm font-medium text-navy-900 hover:bg-white">
              {t("nav.cart")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
