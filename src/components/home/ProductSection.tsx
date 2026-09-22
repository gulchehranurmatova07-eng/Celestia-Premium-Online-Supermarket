"use client";

import Link from "next/link";
import { ProductCard } from "@/components/product/ProductCard";
import { useLocale } from "@/i18n/LocaleProvider";
import type { ProductCardData } from "@/types";

export function ProductSection({
  titleKey,
  products,
  viewAllHref,
  tint = false,
}: {
  titleKey: string;
  products: ProductCardData[];
  viewAllHref: string;
  tint?: boolean;
}) {
  const { t } = useLocale();
  if (products.length === 0) return null;

  return (
    <section className={tint ? "bg-cream-200/60 py-12 sm:py-16" : "py-12 sm:py-16"}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-6 flex items-end justify-between">
          <h2 className="font-display text-2xl font-semibold text-navy-900 sm:text-3xl">{t(titleKey)}</h2>
          <Link href={viewAllHref} className="text-sm font-medium text-navy-700 transition hover:text-gold-600">
            {t("section.viewAll")} →
          </Link>
        </div>
        <div className="scrollbar-none -mx-4 flex gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-3 sm:gap-5 sm:overflow-visible sm:px-0 lg:grid-cols-4">
          {products.map((p) => (
            <div key={p.id} className="w-[168px] shrink-0 sm:w-auto">
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
