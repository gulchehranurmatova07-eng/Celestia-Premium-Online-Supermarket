"use client";

import Link from "next/link";
import { useLocale } from "@/i18n/LocaleProvider";

const COLLAGE = [
  { src: "/products/president-yogi.png", alt: "Сливочное масло President" },
  { src: "/products/olma-1kg.png", alt: "Olma" },
  { src: "/products/coca-cola.png", alt: "Coca-Cola" },
  { src: "/products/nestle-sut.png", alt: "Nestlé Sut" },
];

export function Hero() {
  const { t } = useLocale();

  return (
    <section className="relative overflow-hidden bg-navy-900">
      <div className="pointer-events-none absolute -left-24 -top-24 h-80 w-80 rounded-full bg-gold-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 right-0 h-96 w-96 rounded-full bg-gold-400/10 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-6 py-14 sm:py-20 lg:grid-cols-2 lg:py-28">
        <div className="animate-fade-in-up">
          <span className="inline-flex items-center gap-2 rounded-full border border-gold-400/30 bg-gold-400/10 px-3.5 py-1.5 text-xs font-medium text-gold-300">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l1.8 6.2L20 10l-6.2 1.8L12 18l-1.8-6.2L4 10l6.2-1.8L12 2z" />
            </svg>
            {t("hero.badge")}
          </span>

          <h1 className="mt-5 font-display text-4xl font-semibold leading-[1.1] text-white sm:text-5xl lg:text-6xl">
            {t("hero.title")}
          </h1>
          <p className="mt-5 max-w-lg text-base text-white/70 sm:text-lg">{t("hero.subtitle")}</p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="/search"
              className="rounded-full bg-gold-500 px-7 py-3.5 text-sm font-semibold text-navy-950 shadow-lg shadow-gold-500/20 transition hover:bg-gold-400"
            >
              {t("hero.cta.shop")}
            </Link>
            <Link
              href="#categories"
              className="rounded-full border border-white/20 px-7 py-3.5 text-sm font-semibold text-white transition hover:border-white/40 hover:bg-white/5"
            >
              {t("hero.cta.categories")}
            </Link>
          </div>

          <div className="mt-10 flex items-center gap-8 text-white/70">
            <Stat value="1 200+" label="товаров" />
            <Stat value="30 мин" label="быстрая доставка" />
            <Stat value="4.8★" label="оценка клиентов" />
          </div>
        </div>

        <div className="relative animate-fade-in-up [animation-delay:150ms]">
          <div className="mx-auto grid max-w-md grid-cols-2 gap-4">
            {COLLAGE.map((item, i) => (
              <div
                key={item.src}
                className={`overflow-hidden rounded-3xl bg-cream-100 shadow-2xl shadow-black/30 ${i === 0 ? "translate-y-4" : ""} ${i === 3 ? "-translate-y-2" : ""}`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.src} alt={item.alt} className="aspect-square w-full object-cover" />
              </div>
            ))}
          </div>
          <div className="absolute -bottom-6 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-2xl bg-white px-5 py-3 shadow-xl">
            <span className="text-xl">🚚</span>
            <div className="text-left leading-tight">
              <div className="text-sm font-semibold text-navy-900">Доставим сегодня</div>
              <div className="text-xs text-navy-900/50">за 30–90 минут</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div className="font-display text-xl font-semibold text-gold-300">{value}</div>
      <div className="text-xs text-white/50">{label}</div>
    </div>
  );
}
