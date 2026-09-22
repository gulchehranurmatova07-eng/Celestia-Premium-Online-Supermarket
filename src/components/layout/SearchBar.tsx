"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useLocale } from "@/i18n/LocaleProvider";

export function SearchBar({ className = "", initialQuery = "" }: { className?: string; initialQuery?: string }) {
  const { t } = useLocale();
  const router = useRouter();
  const [q, setQ] = useState(initialQuery);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    router.push(q.trim() ? `/search?q=${encodeURIComponent(q.trim())}` : "/search");
  }

  return (
    <form onSubmit={submit} className={`relative ${className}`}>
      <svg className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-navy-900/40" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
        <circle cx="11" cy="11" r="7" />
        <path d="m21 21-4.3-4.3" />
      </svg>
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        type="search"
        placeholder={t("nav.search")}
        className="w-full rounded-full border border-navy-900/12 bg-cream-100 py-2.5 pl-10 pr-4 text-sm text-navy-900 placeholder:text-navy-900/40 outline-none transition focus:border-gold-500 focus:bg-white focus:ring-2 focus:ring-gold-500/20"
      />
    </form>
  );
}
