"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCartStore } from "@/store/cart";
import { useWishlistStore } from "@/store/wishlist";
import { useToast } from "@/components/ui/Toast";
import { useLocale } from "@/i18n/LocaleProvider";

export function ProductActions({ productId, stock, isAvailable }: { productId: string; stock: number; isAvailable: boolean }) {
  const { t } = useLocale();
  const router = useRouter();
  const { show } = useToast();
  const add = useCartStore((s) => s.add);
  const items = useCartStore((s) => s.items);
  const setQty = useCartStore((s) => s.setQty);
  const wished = useWishlistStore((s) => s.has(productId));
  const toggleWish = useWishlistStore((s) => s.toggle);

  const line = items.find((i) => i.productId === productId);
  const [localQty, setLocalQty] = useState(1);
  const outOfStock = !isAvailable || stock <= 0;
  const qty = line?.quantity ?? 0;

  function handleAdd() {
    if (outOfStock) return;
    add(productId, localQty);
    show(t("toast.addedToCart"));
  }

  function handleBuyNow() {
    if (outOfStock) return;
    if (!line) add(productId, localQty);
    router.push("/checkout");
  }

  return (
    <div className="flex flex-col gap-4">
      {!outOfStock && (
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-navy-900/70">Количество:</span>
          <div className="flex items-center rounded-full border border-navy-900/15">
            <button
              onClick={() => setLocalQty((q) => Math.max(1, q - 1))}
              className="flex h-10 w-10 items-center justify-center text-navy-900"
            >
              −
            </button>
            <span className="min-w-[2rem] text-center font-semibold text-navy-900">{localQty}</span>
            <button
              onClick={() => setLocalQty((q) => Math.min(stock, q + 1))}
              className="flex h-10 w-10 items-center justify-center text-navy-900"
            >
              +
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3">
        {qty > 0 ? (
          <div className="flex items-center gap-3 rounded-full bg-navy-900 px-2 py-1.5 text-white">
            <button onClick={() => setQty(productId, qty - 1)} className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-white/10">
              −
            </button>
            <span className="min-w-[1.5rem] text-center font-semibold">{qty}</span>
            <button
              onClick={() => setQty(productId, qty + 1)}
              disabled={qty >= stock}
              className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-white/10 disabled:opacity-30"
            >
              +
            </button>
          </div>
        ) : (
          <button
            onClick={handleAdd}
            disabled={outOfStock}
            className={`rounded-full px-7 py-3.5 text-sm font-semibold transition ${
              outOfStock ? "cursor-not-allowed bg-navy-900/10 text-navy-900/40" : "bg-navy-900 text-white hover:bg-navy-700"
            }`}
          >
            {t("product.addToCart")}
          </button>
        )}

        <button
          onClick={handleBuyNow}
          disabled={outOfStock}
          className={`rounded-full border px-7 py-3.5 text-sm font-semibold transition ${
            outOfStock ? "cursor-not-allowed border-navy-900/10 text-navy-900/30" : "border-gold-500 text-navy-900 hover:bg-gold-500/10"
          }`}
        >
          {t("product.buyNow")}
        </button>

        <button
          onClick={() => {
            toggleWish(productId);
            show(wished ? t("toast.removedFromWishlist") : t("toast.addedToWishlist"));
          }}
          className="flex h-12 w-12 items-center justify-center rounded-full border border-navy-900/15 text-navy-900 transition hover:border-gold-400"
          aria-label="wishlist"
        >
          <svg width="19" height="19" viewBox="0 0 24 24" fill={wished ? "var(--color-gold-500)" : "none"} stroke={wished ? "var(--color-gold-500)" : "currentColor"} strokeWidth={2}>
            <path d="M12 21s-6.7-4.35-9.3-8.1C1 10.2 1.6 6.6 4.7 5.1c2.4-1.15 4.7-.2 6 1.4 1.3-1.6 3.6-2.55 6-1.4 3.1 1.5 3.7 5.1 2 7.8C18.7 16.65 12 21 12 21z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
