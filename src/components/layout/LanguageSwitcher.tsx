"use client";

import { useState } from "react";
import { useLocale } from "@/i18n/LocaleProvider";
import { locales, localeLabels } from "@/i18n/dictionaries";

export function LanguageSwitcher({ compact = false }: { compact?: boolean }) {
  const { locale, setLocale } = useLocale();
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        onBlur={() => setTimeout(() => setOpen(false), 120)}
        className={`flex items-center gap-1 rounded-full font-medium text-navy-900/70 transition hover:text-navy-900 ${
          compact ? "px-2 py-1 text-xs" : "border border-navy-900/12 px-3 py-2 text-sm"
        }`}
      >
        {localeLabels[locale]}
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
      {open && (
        <div className="absolute right-0 top-full z-20 mt-2 w-24 overflow-hidden rounded-xl border border-navy-900/10 bg-white py-1 shadow-lg">
          {locales.map((l) => (
            <button
              key={l}
              onMouseDown={() => setLocale(l)}
              className={`block w-full px-3 py-2 text-left text-sm font-medium transition hover:bg-cream-100 ${
                l === locale ? "text-gold-600" : "text-navy-900/70"
              }`}
            >
              {localeLabels[l]}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
