"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useWishlistStore } from "@/store/wishlist";
import { ProductCard, ProductCardSkeleton } from "@/components/product/ProductCard";
import { useLocale } from "@/i18n/LocaleProvider";
import type { ProductCardData } from "@/types";

export default function WishlistPage() {
  const { t } = useLocale();
  const ids = useWishlistStore((s) => s.ids);
  const hasHydrated = useWishlistStore((s) => s.hasHydrated);
  const [products, setProducts] = useState<ProductCardData[]>([]);
  const [fetchedKey, setFetchedKey] = useState("");
  const idsKey = ids.join(",");

  useEffect(() => {
    if (!hasHydrated || ids.length === 0) return;
    fetch(`/api/cart-products?ids=${encodeURIComponent(idsKey)}`)
      .then((r) => r.json())
      .then((data) => {
        setProducts(data.products);
        setFetchedKey(idsKey);
      });
  }, [idsKey, hasHydrated, ids.length]);

  const loading = !hasHydrated || (idsKey !== "" && fetchedKey !== idsKey);
  const visibleProducts = ids.length === 0 ? [] : products;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <h1 className="mb-6 font-display text-2xl font-semibold text-navy-900 sm:text-3xl">
        ❤️ {t("account.wishlist")}
      </h1>

      {loading ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      ) : visibleProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-navy-900/15 py-24 text-center">
          <span className="text-4xl">🤍</span>
          <p className="mt-3 text-navy-900/60">Sevimlilar ro‘yxati bo‘sh</p>
          <Link href="/search" className="mt-4 rounded-full bg-navy-900 px-6 py-2.5 text-sm font-semibold text-white hover:bg-navy-700">
            {t("cart.continueShopping")}
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {visibleProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
