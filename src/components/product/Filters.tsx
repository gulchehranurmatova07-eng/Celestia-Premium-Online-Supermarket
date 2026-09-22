"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState } from "react";
import { useLocale } from "@/i18n/LocaleProvider";
import { formatSum } from "@/lib/format";

const SORTS: { value: string; labelKey: string }[] = [
  { value: "popular", labelKey: "search.sort.popular" },
  { value: "cheapest", labelKey: "search.sort.cheapest" },
  { value: "expensive", labelKey: "search.sort.expensive" },
  { value: "rating", labelKey: "search.sort.rating" },
  { value: "newest", labelKey: "search.sort.newest" },
  { value: "discount", labelKey: "search.sort.discount" },
];

export function SortDropdown() {
  const { t } = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const current = searchParams.get("sort") ?? "popular";

  function onChange(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", value);
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <select
      value={current}
      onChange={(e) => onChange(e.target.value)}
      className="rounded-full border border-navy-900/15 bg-white px-4 py-2 text-sm font-medium text-navy-900 outline-none focus:border-gold-500"
    >
      {SORTS.map((s) => (
        <option key={s.value} value={s.value}>
          {t(s.labelKey)}
        </option>
      ))}
    </select>
  );
}

export function FilterSidebar({
  brands,
  priceRange,
  showCategoryNote,
}: {
  brands: string[];
  priceRange: { min: number; max: number };
  showCategoryNote?: string;
}) {
  const { t } = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);

  const activeBrand = searchParams.get("brand") ?? "";
  const minPrice = searchParams.get("minPrice") ?? "";
  const maxPrice = searchParams.get("maxPrice") ?? "";
  const discount = searchParams.get("discount") === "1";
  const minRating = searchParams.get("minRating") ?? "";
  const available = searchParams.get("available") === "1";

  function update(updates: Record<string, string | null>) {
    const params = new URLSearchParams(searchParams.toString());
    for (const [k, v] of Object.entries(updates)) {
      if (v === null || v === "") params.delete(k);
      else params.set(k, v);
    }
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  }

  function clearAll() {
    const params = new URLSearchParams();
    const q = searchParams.get("q");
    if (q) params.set("q", q);
    router.push(`${pathname}?${params.toString()}`);
  }

  const content = (
    <div className="flex flex-col gap-6">
      {showCategoryNote && <p className="text-xs text-navy-900/50">{showCategoryNote}</p>}

      {brands.length > 0 && (
        <div>
          <h4 className="mb-2.5 text-sm font-semibold text-navy-900">{t("search.brand")}</h4>
          <div className="flex max-h-44 flex-col gap-1.5 overflow-y-auto pr-1">
            {brands.map((b) => (
              <label key={b} className="flex items-center gap-2 text-sm text-navy-900/75">
                <input
                  type="radio"
                  name="brand"
                  checked={activeBrand === b}
                  onChange={() => update({ brand: activeBrand === b ? null : b })}
                  className="accent-navy-900"
                />
                {b}
              </label>
            ))}
          </div>
        </div>
      )}

      <div>
        <h4 className="mb-2.5 text-sm font-semibold text-navy-900">{t("search.priceRange")}</h4>
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder={formatSum(priceRange.min)}
            defaultValue={minPrice}
            onBlur={(e) => update({ minPrice: e.target.value })}
            className="w-full rounded-lg border border-navy-900/15 px-2.5 py-1.5 text-sm outline-none focus:border-gold-500"
          />
          <span className="text-navy-900/30">—</span>
          <input
            type="number"
            placeholder={formatSum(priceRange.max)}
            defaultValue={maxPrice}
            onBlur={(e) => update({ maxPrice: e.target.value })}
            className="w-full rounded-lg border border-navy-900/15 px-2.5 py-1.5 text-sm outline-none focus:border-gold-500"
          />
        </div>
      </div>

      <div>
        <h4 className="mb-2.5 text-sm font-semibold text-navy-900">{t("search.rating")}</h4>
        <div className="flex flex-col gap-1.5">
          {[4, 3, 2].map((r) => (
            <label key={r} className="flex items-center gap-2 text-sm text-navy-900/75">
              <input
                type="radio"
                name="rating"
                checked={minRating === String(r)}
                onChange={() => update({ minRating: minRating === String(r) ? null : String(r) })}
                className="accent-navy-900"
              />
              {r}+ ★
            </label>
          ))}
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm text-navy-900/75">
        <input
          type="checkbox"
          checked={discount}
          onChange={(e) => update({ discount: e.target.checked ? "1" : null })}
          className="accent-navy-900"
        />
        {t("search.discount")}
      </label>

      <label className="flex items-center gap-2 text-sm text-navy-900/75">
        <input
          type="checkbox"
          checked={available}
          onChange={(e) => update({ available: e.target.checked ? "1" : null })}
          className="accent-navy-900"
        />
        {t("product.inStock")}
      </label>

      <button onClick={clearAll} className="text-left text-sm font-medium text-navy-700 underline underline-offset-2 hover:text-gold-600">
        {t("search.clear")}
      </button>
    </div>
  );

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="mb-4 flex items-center gap-2 rounded-full border border-navy-900/15 px-4 py-2 text-sm font-medium text-navy-900 lg:hidden"
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <path d="M4 6h16M7 12h10M10 18h4" />
        </svg>
        {t("search.filters")}
      </button>

      <aside className="hidden w-64 shrink-0 lg:block">{content}</aside>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div onClick={() => setOpen(false)} className="absolute inset-0 bg-navy-950/50" />
          <div className="absolute bottom-0 left-0 right-0 max-h-[85vh] overflow-y-auto rounded-t-3xl bg-white p-5">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-display text-lg font-semibold text-navy-900">{t("search.filters")}</h3>
              <button onClick={() => setOpen(false)} className="text-navy-900/50">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path d="M6 6l12 12M18 6 6 18" />
                </svg>
              </button>
            </div>
            {content}
            <button
              onClick={() => setOpen(false)}
              className="mt-6 w-full rounded-full bg-navy-900 py-3 text-sm font-semibold text-white"
            >
              {t("search.apply")}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
