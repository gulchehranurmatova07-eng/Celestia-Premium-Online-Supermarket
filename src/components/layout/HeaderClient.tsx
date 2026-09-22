"use client";

import Link from "next/link";
import { useState } from "react";
import { Logo } from "@/components/brand/Logo";
import { SearchBar } from "./SearchBar";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { MobileNav } from "./MobileNav";
import { useCartStore } from "@/store/cart";
import { useWishlistStore } from "@/store/wishlist";
import { useLocale } from "@/i18n/LocaleProvider";

type Cat = { slug: string; name: string; icon: string };

export function HeaderClient({ categories, customerName }: { categories: Cat[]; customerName: string | null }) {
  const { t } = useLocale();
  const [mobileOpen, setMobileOpen] = useState(false);
  const cartCount = useCartStore((s) => s.items.reduce((n, i) => n + i.quantity, 0));
  const wishCount = useWishlistStore((s) => s.ids.length);

  return (
    <header className="sticky top-0 z-50 border-b border-navy-900/8 bg-cream-100/90 backdrop-blur-md">
      {/* Top utility bar - desktop only */}
      <div className="hidden border-b border-navy-900/6 bg-navy-900 text-white lg:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-1.5 text-xs">
          <span className="text-gold-300">Har kuni kerakli mahsulotlar — bir joyda.</span>
          <div className="flex items-center gap-4 text-white/80">
            <span>+998 71 200 00 00</span>
            <span>Toshkent, Yunusobod tumani</span>
          </div>
        </div>
      </div>

      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 sm:px-6 lg:gap-6 lg:py-4">
        <button
          onClick={() => setMobileOpen(true)}
          className="flex h-10 w-10 items-center justify-center rounded-full text-navy-900 lg:hidden"
          aria-label={t("nav.menu")}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path d="M4 7h16M4 12h16M4 17h16" />
          </svg>
        </button>

        <Logo markClassName="h-8 w-8 lg:h-9 lg:w-9" showTagline className="shrink-0" />

        <div className="hidden flex-1 items-center gap-1.5 lg:flex">
          <button className="flex shrink-0 items-center gap-1.5 rounded-full border border-navy-900/12 px-3 py-2 text-sm font-medium text-navy-900/70 transition hover:border-navy-900/25">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 1 1 16 0Z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            {t("nav.location")}
          </button>
          <SearchBar className="mx-2 flex-1" />
        </div>

        <div className="ml-auto flex items-center gap-1 lg:ml-0 lg:gap-2">
          <div className="hidden lg:block">
            <LanguageSwitcher />
          </div>

          <Link
            href="/wishlist"
            className="relative hidden h-10 w-10 items-center justify-center rounded-full text-navy-900 transition hover:bg-navy-900/5 lg:flex"
            aria-label={t("nav.wishlist")}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M12 21s-6.7-4.35-9.3-8.1C1 10.2 1.6 6.6 4.7 5.1c2.4-1.15 4.7-.2 6 1.4 1.3-1.6 3.6-2.55 6-1.4 3.1 1.5 3.7 5.1 2 7.8C18.7 16.65 12 21 12 21z" />
            </svg>
            {wishCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-gold-500 text-[10px] font-bold text-white">
                {wishCount}
              </span>
            )}
          </Link>

          <Link
            href={customerName ? "/account" : "/login"}
            className="hidden h-10 items-center gap-2 rounded-full px-3 text-sm font-medium text-navy-900 transition hover:bg-navy-900/5 lg:flex"
          >
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <circle cx="12" cy="8" r="4" />
              <path d="M4 21c0-4 4-6 8-6s8 2 8 6" />
            </svg>
            {customerName ? customerName.split(" ")[0] : t("nav.login")}
          </Link>

          <Link
            href="/cart"
            className="relative flex h-10 w-10 items-center justify-center rounded-full text-navy-900 transition hover:bg-navy-900/5 sm:w-auto sm:gap-2 sm:px-3"
            aria-label={t("nav.cart")}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <circle cx="9" cy="21" r="1" />
              <circle cx="19" cy="21" r="1" />
              <path d="M2.5 3h2l2.7 12.4a2 2 0 0 0 2 1.6h7.6a2 2 0 0 0 2-1.6L21 8H6" />
            </svg>
            <span className="hidden text-sm font-medium sm:inline">{t("nav.cart")}</span>
            {cartCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-navy-900 px-1 text-[10px] font-bold text-gold-400 sm:static sm:ml-0.5">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* mobile search */}
      <div className="border-t border-navy-900/6 px-4 py-2.5 sm:px-6 lg:hidden">
        <SearchBar />
      </div>

      {/* desktop category strip */}
      <nav className="hidden border-t border-navy-900/6 lg:block">
        <div className="mx-auto flex max-w-7xl items-center gap-5 overflow-x-auto px-6 py-2.5 text-sm scrollbar-none">
          {categories.map((c) => (
            <Link
              key={c.slug}
              href={`/category/${c.slug}`}
              className="flex shrink-0 items-center gap-1.5 whitespace-nowrap font-medium text-navy-900/70 transition hover:text-navy-900"
            >
              <span>{c.icon}</span>
              {c.name}
            </Link>
          ))}
        </div>
      </nav>

      <MobileNav
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        categories={categories}
        customerName={customerName}
      />
    </header>
  );
}
