"use client";

import { ProductCard } from "@/components/product/ProductCard";
import { FilterSidebar, SortDropdown } from "@/components/product/Filters";
import { Pagination } from "@/components/product/Pagination";
import { useLocale } from "@/i18n/LocaleProvider";
import type { ProductCardData } from "@/types";

export function SearchResults({
  products,
  total,
  page,
  pageCount,
  brands,
  priceRange,
  heading,
  categoryNote,
  basePath,
  currentParams,
}: {
  products: ProductCardData[];
  total: number;
  page: number;
  pageCount: number;
  brands: string[];
  priceRange: { min: number; max: number };
  heading: string;
  categoryNote?: string;
  basePath: string;
  currentParams: Record<string, string>;
}) {
  const { t } = useLocale();

  function makePageHref(p: number) {
    const params = new URLSearchParams(currentParams);
    params.set("page", String(p));
    return `${basePath}?${params.toString()}`;
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <h1 className="font-display text-2xl font-semibold text-navy-900 sm:text-3xl">{heading}</h1>
      <p className="mt-1 text-sm text-navy-900/55">
        {total} {t("search.results")}
      </p>

      <div className="mt-6 flex flex-col gap-8 lg:flex-row">
        <FilterSidebar brands={brands} priceRange={priceRange} showCategoryNote={categoryNote} />

        <div className="flex-1">
          <div className="mb-5 flex justify-end">
            <SortDropdown />
          </div>

          {products.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-navy-900/15 py-24 text-center">
              <span className="text-4xl">🔍</span>
              <p className="mt-3 text-navy-900/60">{t("search.noResults")}</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 xl:grid-cols-4">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}

          <Pagination page={page} pageCount={pageCount} makeHref={makePageHref} />
        </div>
      </div>
    </div>
  );
}
