"use client";

import Link from "next/link";
import { useCartStore } from "@/store/cart";
import { useCartProducts } from "@/store/useCartProducts";
import { useSettings } from "@/store/useSettings";
import { computeDeliveryFee, meetsMinOrder } from "@/lib/delivery";
import { formatSum } from "@/lib/format";
import { useLocale } from "@/i18n/LocaleProvider";
import { ProductCardSkeleton } from "@/components/product/ProductCard";

export default function CartPage() {
  const { t } = useLocale();
  const { lines, subtotal, loading } = useCartProducts();
  const setQty = useCartStore((s) => s.setQty);
  const remove = useCartStore((s) => s.remove);
  const { settings } = useSettings();

  const estimatedDelivery = settings
    ? computeDeliveryFee({ method: "STANDARD", subtotal, zoneFee: settings.standardDeliveryFee, settings })
    : null;
  const belowMin = settings ? !meetsMinOrder(subtotal, settings) : false;
  const remainingForFree =
    settings && settings.freeDeliveryEnabled ? Math.max(0, settings.freeDeliveryThreshold - subtotal) : 0;

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (lines.length === 0) {
    return (
      <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-24 text-center">
        <span className="text-5xl">🛒</span>
        <h1 className="mt-4 font-display text-2xl font-semibold text-navy-900">{t("cart.empty")}</h1>
        <p className="mt-2 text-navy-900/55">{t("cart.emptySub")}</p>
        <Link href="/search" className="mt-6 rounded-full bg-navy-900 px-7 py-3 text-sm font-semibold text-white hover:bg-navy-700">
          {t("cart.continueShopping")}
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <h1 className="mb-6 font-display text-2xl font-semibold text-navy-900 sm:text-3xl">{t("cart.title")}</h1>

      <div className="flex flex-col gap-8 lg:flex-row">
        <div className="flex-1 divide-y divide-navy-900/8 rounded-2xl border border-navy-900/8 bg-white">
          {lines.map(({ product, quantity }) => (
            <div key={product.id} className="flex items-center gap-4 p-4">
              <Link href={`/product/${product.id}`} className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-cream-200">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
              </Link>
              <div className="min-w-0 flex-1">
                <Link href={`/product/${product.id}`} className="line-clamp-1 font-medium text-navy-900 hover:text-navy-700">
                  {product.name}
                </Link>
                <div className="mt-0.5 text-xs text-navy-900/50">{product.weight}</div>
                <div className="mt-1.5 font-display font-semibold text-navy-900">{formatSum(product.price)}</div>
              </div>
              <div className="flex items-center rounded-full border border-navy-900/15">
                <button onClick={() => setQty(product.id, quantity - 1)} className="flex h-8 w-8 items-center justify-center text-navy-900">
                  −
                </button>
                <span className="min-w-[1.5rem] text-center text-sm font-semibold text-navy-900">{quantity}</span>
                <button
                  onClick={() => setQty(product.id, quantity + 1)}
                  disabled={quantity >= product.stock}
                  className="flex h-8 w-8 items-center justify-center text-navy-900 disabled:opacity-30"
                >
                  +
                </button>
              </div>
              <button onClick={() => remove(product.id)} aria-label={t("cart.remove")} className="text-navy-900/40 transition hover:text-red-500">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0-1 14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2L4 6h16Z" />
                </svg>
              </button>
            </div>
          ))}
        </div>

        <div className="w-full shrink-0 rounded-2xl border border-navy-900/8 bg-white p-5 lg:w-80">
          {remainingForFree > 0 && (
            <p className="mb-4 rounded-xl bg-gold-400/15 px-3 py-2.5 text-xs font-medium text-gold-700">
              {t("cart.freeDeliveryHint").replace("{amount}", formatSum(remainingForFree))}
            </p>
          )}
          <div className="flex flex-col gap-2.5 text-sm">
            <div className="flex justify-between text-navy-900/70">
              <span>{t("cart.subtotal")}</span>
              <span className="font-medium text-navy-900">{formatSum(subtotal)}</span>
            </div>
            <div className="flex justify-between text-navy-900/70">
              <span>{t("cart.delivery")}</span>
              <span className="font-medium text-navy-900">
                {estimatedDelivery === 0 ? t("cart.freeDelivery") : estimatedDelivery != null ? formatSum(estimatedDelivery) : "—"}
              </span>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between border-t border-navy-900/8 pt-4">
            <span className="font-medium text-navy-900">{t("cart.total")}</span>
            <span className="font-display text-xl font-semibold text-navy-900">
              {formatSum(subtotal + (estimatedDelivery ?? 0))}
            </span>
          </div>

          {belowMin && settings && (
            <p className="mt-3 text-xs font-medium text-red-600">
              {t("cart.minOrder").replace("{amount}", formatSum(settings.minOrderAmount))}
            </p>
          )}

          <Link
            href="/checkout"
            aria-disabled={belowMin}
            className={`mt-5 block w-full rounded-full py-3.5 text-center text-sm font-semibold transition ${
              belowMin ? "pointer-events-none bg-navy-900/15 text-navy-900/40" : "bg-navy-900 text-white hover:bg-navy-700"
            }`}
          >
            {t("cart.checkout")}
          </Link>
        </div>
      </div>
    </div>
  );
}
