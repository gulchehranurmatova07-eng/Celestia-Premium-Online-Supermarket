"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Logo } from "@/components/brand/Logo";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await fetch("/api/auth/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    setLoading(false);
    if (!res.ok) {
      setError("Email yoki parol noto‘g‘ri.");
      return;
    }
    router.push("/admin");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="mb-8 [&_span]:text-white [&_span:last-child]:text-gold-400">
        <Logo showTagline />
      </div>

      <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-navy-900 p-7 shadow-2xl">
        <h1 className="mb-1 text-center font-display text-xl font-semibold text-white">Admin Panel</h1>
        <p className="mb-6 text-center text-sm text-white/45">Boshqaruv paneliga kirish</p>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-white/70">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-xl border border-white/15 bg-white/5 px-3.5 py-2.5 text-sm text-white outline-none focus:border-gold-500"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-white/70">Parol</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-xl border border-white/15 bg-white/5 px-3.5 py-2.5 text-sm text-white outline-none focus:border-gold-500"
            />
          </div>
          {error && <p className="text-sm font-medium text-red-400">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-gold-500 py-3 text-sm font-semibold text-navy-950 transition hover:bg-gold-400 disabled:opacity-50"
          >
            {loading ? "..." : "Kirish"}
          </button>
        </form>

        <p className="mt-5 rounded-lg bg-white/5 px-3 py-2 text-center text-xs text-white/40">
          Demo: admin@celestia.uz / Celestia2026!
        </p>
      </div>
    </div>
  );
}
