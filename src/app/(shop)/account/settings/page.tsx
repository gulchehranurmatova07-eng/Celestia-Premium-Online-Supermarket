"use client";

import { useRouter } from "next/navigation";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";

export default function SettingsPage() {
  const router = useRouter();

  async function logout() {
    await fetch("/api/auth/customer/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  return (
    <div className="space-y-4">
      <h1 className="mb-1 font-display text-2xl font-semibold text-navy-900">Sozlamalar</h1>

      <div className="flex items-center justify-between rounded-2xl border border-navy-900/8 bg-white p-5">
        <div>
          <div className="font-medium text-navy-900">Til</div>
          <div className="text-sm text-navy-900/55">Interfeys tilini tanlang</div>
        </div>
        <LanguageSwitcher />
      </div>

      <div className="flex items-center justify-between rounded-2xl border border-navy-900/8 bg-white p-5">
        <div>
          <div className="font-medium text-navy-900">Bildirishnomalar</div>
          <div className="text-sm text-navy-900/55">Buyurtma holati haqida xabarnoma olish</div>
        </div>
        <label className="relative inline-flex h-6 w-11 cursor-pointer items-center">
          <input type="checkbox" defaultChecked className="peer sr-only" />
          <span className="absolute inset-0 rounded-full bg-navy-900/15 transition peer-checked:bg-navy-900" />
          <span className="absolute left-1 h-4 w-4 rounded-full bg-white transition peer-checked:translate-x-5" />
        </label>
      </div>

      <button
        onClick={logout}
        className="rounded-full border border-red-200 px-6 py-2.5 text-sm font-semibold text-red-500 transition hover:bg-red-50"
      >
        Hisobdan chiqish
      </button>
    </div>
  );
}
