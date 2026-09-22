"use client";

import { useState } from "react";
import { useToast } from "@/components/ui/Toast";

export function ProfileForm({ name, phone, email }: { name: string; phone: string; email: string }) {
  const { show } = useToast();
  const [formName, setFormName] = useState(name);
  const [formEmail, setFormEmail] = useState(email);
  const [saving, setSaving] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const res = await fetch("/api/account/me", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: formName, email: formEmail }),
    });
    setSaving(false);
    if (res.ok) show("Данные сохранены.");
  }

  return (
    <form onSubmit={submit} className="max-w-md space-y-4">
      <div>
        <label className="mb-1.5 block text-sm font-medium text-navy-900/70">Имя</label>
        <input
          value={formName}
          onChange={(e) => setFormName(e.target.value)}
          className="w-full rounded-xl border border-navy-900/15 px-3.5 py-2.5 text-sm outline-none focus:border-gold-500"
        />
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium text-navy-900/70">Номер телефона</label>
        <input disabled value={phone} className="w-full rounded-xl border border-navy-900/10 bg-cream-100 px-3.5 py-2.5 text-sm text-navy-900/50" />
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium text-navy-900/70">Email</label>
        <input
          type="email"
          value={formEmail}
          onChange={(e) => setFormEmail(e.target.value)}
          placeholder="email@example.com"
          className="w-full rounded-xl border border-navy-900/15 px-3.5 py-2.5 text-sm outline-none focus:border-gold-500"
        />
      </div>
      <button
        type="submit"
        disabled={saving}
        className="rounded-full bg-navy-900 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-navy-700 disabled:opacity-50"
      >
        {saving ? "..." : "Сохранить"}
      </button>
    </form>
  );
}
