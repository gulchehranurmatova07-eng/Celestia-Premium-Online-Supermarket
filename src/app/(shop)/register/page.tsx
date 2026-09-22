"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Logo } from "@/components/brand/Logo";
import { useToast } from "@/components/ui/Toast";

export default function RegisterPage() {
  const router = useRouter();
  const { show } = useToast();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await fetch("/api/auth/customer/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, phone, password }),
    });
    setLoading(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error === "phone_taken" ? "Этот номер телефона уже зарегистрирован." : "Проверьте данные (пароль минимум 6 символов).");
      return;
    }
    show("Регистрация прошла успешно!");
    router.push("/account");
    router.refresh();
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-12 sm:px-6">
      <div className="mb-8 flex justify-center">
        <Logo showTagline />
      </div>
      <div className="rounded-2xl border border-navy-900/8 bg-white p-7 shadow-sm">
        <h1 className="mb-1 text-center font-display text-2xl font-semibold text-navy-900">Регистрация</h1>
        <p className="mb-6 text-center text-sm text-navy-900/50">Yangi hisob yarating</p>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-navy-900/70">Имя</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full rounded-xl border border-navy-900/15 px-3.5 py-2.5 text-sm outline-none focus:border-gold-500"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-navy-900/70">Номер телефона</label>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+998 90 123 45 67"
              required
              className="w-full rounded-xl border border-navy-900/15 px-3.5 py-2.5 text-sm outline-none focus:border-gold-500"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-navy-900/70">Пароль</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full rounded-xl border border-navy-900/15 px-3.5 py-2.5 text-sm outline-none focus:border-gold-500"
            />
          </div>
          {error && <p className="text-sm font-medium text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-navy-900 py-3 text-sm font-semibold text-white transition hover:bg-navy-700 disabled:opacity-50"
          >
            {loading ? "..." : "Зарегистрироваться"}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-navy-900/55">
          Уже есть аккаунт?{" "}
          <Link href="/login" className="font-medium text-navy-900 underline underline-offset-2">
            Войти
          </Link>
        </p>
      </div>
    </div>
  );
}
