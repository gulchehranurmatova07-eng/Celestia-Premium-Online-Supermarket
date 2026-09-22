"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { Logo } from "@/components/brand/Logo";
import { useToast } from "@/components/ui/Toast";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { show } = useToast();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await fetch("/api/auth/customer/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone, password }),
    });
    setLoading(false);
    if (!res.ok) {
      setError("Telefon raqam yoki parol noto‘g‘ri.");
      return;
    }
    show("Xush kelibsiz!");
    router.push(searchParams.get("next") || "/account");
    router.refresh();
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-12 sm:px-6">
      <div className="mb-8 flex justify-center">
        <Logo showTagline />
      </div>
      <div className="rounded-2xl border border-navy-900/8 bg-white p-7 shadow-sm">
        <h1 className="mb-1 text-center font-display text-2xl font-semibold text-navy-900">Kirish</h1>
        <p className="mb-6 text-center text-sm text-navy-900/50">Hisobingizga kiring</p>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-navy-900/70">Telefon raqam</label>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+998 90 123 45 67"
              required
              className="w-full rounded-xl border border-navy-900/15 px-3.5 py-2.5 text-sm outline-none focus:border-gold-500"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-navy-900/70">Parol</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-xl border border-navy-900/15 px-3.5 py-2.5 text-sm outline-none focus:border-gold-500"
            />
          </div>
          {error && <p className="text-sm font-medium text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-navy-900 py-3 text-sm font-semibold text-white transition hover:bg-navy-700 disabled:opacity-50"
          >
            {loading ? "..." : "Kirish"}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-navy-900/55">
          Hisobingiz yo‘qmi?{" "}
          <Link href="/register" className="font-medium text-navy-900 underline underline-offset-2">
            Ro‘yxatdan o‘tish
          </Link>
        </p>
        <p className="mt-3 rounded-lg bg-cream-200 px-3 py-2 text-center text-xs text-navy-900/50">
          Demo: +998901234567 / customer123
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
