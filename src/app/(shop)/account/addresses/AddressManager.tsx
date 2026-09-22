"use client";

import { useState } from "react";
import { useToast } from "@/components/ui/Toast";

type Address = {
  id: string;
  label: string;
  city: string;
  district: string;
  street: string;
  house: string;
  apartment: string | null;
  entrance: string | null;
  floor: string | null;
  isDefault: boolean;
};

export function AddressManager({ initialAddresses }: { initialAddresses: Address[] }) {
  const { show } = useToast();
  const [addresses, setAddresses] = useState(initialAddresses);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ label: "Дом", district: "", street: "", house: "", apartment: "", entrance: "", floor: "" });
  const [saving, setSaving] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const res = await fetch("/api/account/addresses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaving(false);
    if (res.ok) {
      const data = await res.json();
      setAddresses((prev) => [...prev, data.address]);
      setShowForm(false);
      setForm({ label: "Дом", district: "", street: "", house: "", apartment: "", entrance: "", floor: "" });
      show("Адрес добавлен.");
    }
  }

  async function remove(id: string) {
    setAddresses((prev) => prev.filter((a) => a.id !== id));
    await fetch(`/api/account/addresses/${id}`, { method: "DELETE" });
  }

  return (
    <div className="space-y-4">
      {addresses.map((a) => (
        <div key={a.id} className="flex items-start justify-between gap-4 rounded-2xl border border-navy-900/8 bg-white p-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-medium text-navy-900">{a.label}</span>
              {a.isDefault && <span className="rounded-full bg-gold-400/20 px-2 py-0.5 text-[11px] font-medium text-gold-700">Основной</span>}
            </div>
            <p className="mt-1 text-sm text-navy-900/60">
              {a.city}, {a.district}, {a.street} {a.house}
              {a.apartment ? `, кв. ${a.apartment}` : ""}
              {a.entrance ? `, подъезд ${a.entrance}` : ""}
              {a.floor ? `, ${a.floor} этаж` : ""}
            </p>
          </div>
          <button onClick={() => remove(a.id)} className="shrink-0 text-sm text-red-500 hover:underline">
            Удалить
          </button>
        </div>
      ))}

      {showForm ? (
        <form onSubmit={submit} className="space-y-3 rounded-2xl border border-navy-900/8 bg-white p-5">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Название" value={form.label} onChange={(v) => setForm({ ...form, label: v })} />
            <Field label="Район" value={form.district} onChange={(v) => setForm({ ...form, district: v })} required />
            <Field label="Улица" value={form.street} onChange={(v) => setForm({ ...form, street: v })} required />
            <Field label="Дом" value={form.house} onChange={(v) => setForm({ ...form, house: v })} required />
            <Field label="Квартира" value={form.apartment} onChange={(v) => setForm({ ...form, apartment: v })} />
            <Field label="Этаж" value={form.floor} onChange={(v) => setForm({ ...form, floor: v })} />
          </div>
          <div className="flex gap-2">
            <button type="submit" disabled={saving} className="rounded-full bg-navy-900 px-5 py-2 text-sm font-semibold text-white disabled:opacity-50">
              {saving ? "..." : "Сохранить"}
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="rounded-full border border-navy-900/15 px-5 py-2 text-sm font-medium text-navy-900">
              Отмена
            </button>
          </div>
        </form>
      ) : (
        <button
          onClick={() => setShowForm(true)}
          className="w-full rounded-2xl border border-dashed border-navy-900/20 py-4 text-sm font-medium text-navy-900/60 transition hover:border-gold-400 hover:text-navy-900"
        >
          + Добавить новый адрес
        </button>
      )}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
}) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-navy-900/60">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="w-full rounded-lg border border-navy-900/15 px-3 py-2 text-sm outline-none focus:border-gold-500"
      />
    </div>
  );
}
