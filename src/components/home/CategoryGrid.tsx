"use client";

import Link from "next/link";
import { useLocale } from "@/i18n/LocaleProvider";

type Cat = { slug: string; name: string; icon: string; count: number };

export function CategoryGrid({ categories }: { categories: Cat[] }) {
  const { t } = useLocale();

  return (
    <section id="categories" className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <h2 className="font-display text-2xl font-semibold text-navy-900 sm:text-3xl">{t("section.categories")}</h2>
          <p className="mt-1 text-sm text-navy-900/55">{t("section.categories.sub")}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-6">
        {categories.map((c, i) => (
          <Link
            key={c.slug}
            href={`/category/${c.slug}`}
            style={{ animationDelay: `${i * 40}ms` }}
            className="animate-fade-in-up group flex flex-col items-center gap-3 rounded-2xl border border-navy-900/8 bg-white p-5 text-center shadow-sm shadow-navy-900/[0.02] transition-all duration-300 hover:-translate-y-1 hover:border-gold-400/40 hover:shadow-lg hover:shadow-navy-900/10"
          >
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cream-200 text-2xl transition-colors group-hover:bg-gold-400/15">
              {c.icon}
            </span>
            <div>
              <div className="text-sm font-medium text-navy-900">{c.name}</div>
              <div className="mt-0.5 text-xs text-navy-900/45">{c.count} товаров</div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
