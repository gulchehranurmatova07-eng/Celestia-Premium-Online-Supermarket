"use client";

import Link from "next/link";
import { useState } from "react";
import { Price } from "@/components/ui/Price";
import { Stars } from "@/components/ui/Stars";
import { useCartStore } from "@/store/cart";
import { useWishlistStore } from "@/store/wishlist";
import { useToast } from "@/components/ui/Toast";
import { useLocale } from "@/i18n/LocaleProvider";
import type { ProductCardData } from "@/types";

export function ProductCard({ product }: { product: ProductCardData }) {
  const { t } = useLocale();
  const { show } = useToast();
  const add = useCartStore((s) => s.add);
  const items = useCartStore((s) => s.items);
  const setQty = useCartStore((s) => s.setQty);
  const wished = useWishlistStore((s) => s.has(product.id));
  const toggleWish = useWishlistStore((s) => s.toggle);
  const [justAdded, setJustAdded] = useState(false);

  const line = items.find((i) => i.productId === product.id);
  const qty = line?.quantity ?? 0;
  const outOfStock = !product.isAvailable || product.stock <= 0;

  function handleAdd() {
    if (outOfStock) return;
    add(product.id, 1);
    show(t("toast.addedToCart"));
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 400);
  }

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-navy-900/8 bg-white shadow-sm shadow-navy-900/[0.03] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-navy-900/10">
      <button
        onClick={() => {
          toggleWish(product.id);
          show(wished ? t("toast.removedFromWishlist") : t("toast.addedToWishlist"));
        }}
        aria-label="wishlist"
        className="absolute right-2.5 top-2.5 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-navy-900 shadow-sm backdrop-blur transition-transform hover:scale-110"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill={wished ? "var(--color-gold-500)" : "none"} stroke={wished ? "var(--color-gold-500)" : "currentColor"} strokeWidth={2}>
          <path d="M12 21s-6.7-4.35-9.3-8.1C1 10.2 1.6 6.6 4.7 5.1c2.4-1.15 4.7-.2 6 1.4 1.3-1.6 3.6-2.55 6-1.4 3.1 1.5 3.7 5.1 2 7.8C18.7 16.65 12 21 12 21z" />
        </svg>
      </button>

      {product.discount > 0 && (
        <span className="absolute left-2.5 top-2.5 z-10 rounded-full bg-navy-900 px-2 py-1 text-[11px] font-semibold text-gold-400">
          −{product.discount}%
        </span>
      )}

      <Link href={`/product/${product.id}`} className="block overflow-hidden bg-cream-200">
        <div className="relative aspect-square w-full overflow-hidden">
          {outOfStock && (
            <div className="absolute inset-0 z-[1] flex items-center justify-center bg-white/60 backdrop-blur-[1px]">
              <span className="rounded-full bg-navy-900 px-3 py-1 text-xs font-medium text-white">{t("product.outOfStock")}</span>
            </div>
          )}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      </Link>

      <div className="flex flex-1 flex-col gap-1.5 p-3.5">
        <span className="text-[11px] font-medium uppercase tracking-wide text-navy-900/45">{product.brand}</span>
        <Link href={`/product/${product.id}`} className="line-clamp-2 min-h-[2.5rem] font-display text-[0.95rem] font-medium leading-snug text-navy-900 hover:text-navy-700">
          {product.name}
        </Link>
        <span className="text-xs text-navy-900/50">{product.weight}</span>

        <div className="flex items-center gap-1.5">
          <Stars rating={product.rating} size={12} />
          <span className="text-[11px] text-navy-900/45">({product.ratingCount})</span>
        </div>

        <div className="mt-1 flex items-center justify-between gap-2">
          <Price price={product.price} oldPrice={product.oldPrice} />
        </div>

        {product.stock > 0 && product.stock <= 5 && (
          <span className="text-[11px] font-medium text-amber-600">{t("product.lowStock").replace("{n}", String(product.stock))}</span>
        )}

        <div className="mt-1.5">
          {qty > 0 ? (
            <div className="flex items-center justify-between rounded-full border border-navy-900/15 bg-cream-100 px-1 py-1">
              <button
                onClick={() => setQty(product.id, qty - 1)}
                className="flex h-7 w-7 items-center justify-center rounded-full text-navy-900 transition hover:bg-white"
                aria-label="decrease"
              >
                −
              </button>
              <span className="min-w-[1.5rem] text-center text-sm font-semibold text-navy-900">{qty}</span>
              <button
                onClick={() => setQty(product.id, qty + 1)}
                disabled={qty >= product.stock}
                className="flex h-7 w-7 items-center justify-center rounded-full text-navy-900 transition hover:bg-white disabled:opacity-30"
                aria-label="increase"
              >
                +
              </button>
            </div>
          ) : (
            <button
              onClick={handleAdd}
              disabled={outOfStock}
              className={`w-full rounded-full py-2 text-sm font-medium transition-all ${
                outOfStock
                  ? "cursor-not-allowed bg-navy-900/10 text-navy-900/40"
                  : `bg-navy-900 text-white hover:bg-navy-700 ${justAdded ? "scale-95" : ""}`
              }`}
            >
              {t("product.addToCart")}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-navy-900/8 bg-white">
      <div className="animate-skeleton aspect-square w-full bg-navy-900/5" />
      <div className="flex flex-col gap-2 p-3.5">
        <div className="animate-skeleton h-3 w-1/3 rounded bg-navy-900/5" />
        <div className="animate-skeleton h-4 w-3/4 rounded bg-navy-900/5" />
        <div className="animate-skeleton h-3 w-1/2 rounded bg-navy-900/5" />
        <div className="animate-skeleton h-8 w-full rounded-full bg-navy-900/5" />
      </div>
    </div>
  );
}
