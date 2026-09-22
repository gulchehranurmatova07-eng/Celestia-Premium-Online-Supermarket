"use client";

import { useState } from "react";
import { useLocale } from "@/i18n/LocaleProvider";

export function ProductTabs({
  description,
  ingredients,
  nutrition,
}: {
  description: string;
  ingredients: string;
  nutrition: string;
}) {
  const { t } = useLocale();
  const tabs = [
    { key: "description", label: t("product.description"), content: description },
    { key: "ingredients", label: t("product.ingredients"), content: ingredients },
    { key: "nutrition", label: t("product.nutrition"), content: nutrition },
  ];
  const [active, setActive] = useState("description");

  return (
    <div>
      <div className="flex gap-1 border-b border-navy-900/10">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActive(tab.key)}
            className={`border-b-2 px-4 py-3 text-sm font-medium transition ${
              active === tab.key ? "border-gold-500 text-navy-900" : "border-transparent text-navy-900/50 hover:text-navy-900"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="py-5 text-sm leading-relaxed text-navy-900/75">
        {tabs.find((t2) => t2.key === active)?.content}
      </div>
    </div>
  );
}
