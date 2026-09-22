"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/Toast";
import { formatSum } from "@/lib/format";
import { DeleteButton } from "./DeleteButton";

type Settings = {
  standardDeliveryFee: number;
  standardEtaMin: number;
  standardEtaMax: number;
  standardEnabled: boolean;
  expressDeliveryFee: number;
  expressEtaMin: number;
  expressEtaMax: number;
  expressEnabled: boolean;
  pickupEnabled: boolean;
  freeDeliveryThreshold: number;
  freeDeliveryEnabled: boolean;
  minOrderAmount: number;
  minOrderEnabled: boolean;
};

type Zone = { id: string; name: string; minKm: number; maxKm: number; fee: number };
type PickupLocation = { id: string; name: string; address: string; openHours: string; isActive: boolean };
type PromoCode = {
  id: string;
  code: string;
  type: string;
  value: number;
  minOrder: number;
  maxDiscount: number | null;
  usageLimit: number | null;
  usedCount: number;
  active: boolean;
};

export function DeliveryManager({
  initialSettings,
  initialZones,
  initialPickupLocations,
  initialPromoCodes,
}: {
  initialSettings: Settings;
  initialZones: Zone[];
  initialPickupLocations: PickupLocation[];
  initialPromoCodes: PromoCode[];
}) {
  return (
    <div className="space-y-8">
      <SettingsSection initial={initialSettings} />
      <ZonesSection initial={initialZones} />
      <PickupSection initial={initialPickupLocations} />
      <PromoSection initial={initialPromoCodes} />
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-navy-900/8 bg-white p-6">
      <h2 className="mb-4 font-display text-lg font-semibold text-navy-900">{title}</h2>
      {children}
    </div>
  );
}

function ToggleRow({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center justify-between py-1 text-sm font-medium text-navy-900">
      {label}
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="h-4 w-4 accent-navy-900" />
    </label>
  );
}

function NumInput({ label, value, onChange, suffix }: { label: string; value: number; onChange: (v: number) => void; suffix?: string }) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-navy-900/60">{label}</label>
      <div className="flex items-center gap-2">
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full rounded-lg border border-navy-900/15 px-3 py-2 text-sm outline-none focus:border-gold-500"
        />
        {suffix && <span className="shrink-0 text-xs text-navy-900/45">{suffix}</span>}
      </div>
    </div>
  );
}

function SettingsSection({ initial }: { initial: Settings }) {
  const { show } = useToast();
  const [s, setS] = useState(initial);
  const [saving, setSaving] = useState(false);

  async function save() {
    setSaving(true);
    const res = await fetch("/api/admin/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(s),
    });
    setSaving(false);
    if (res.ok) show("Sozlamalar saqlandi.");
  }

  return (
    <Card title="Umumiy sozlamalar">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <div className="space-y-3 rounded-xl bg-cream-100 p-4">
          <ToggleRow label="Standart yetkazib berish" checked={s.standardEnabled} onChange={(v) => setS({ ...s, standardEnabled: v })} />
          <NumInput label="Narxi" value={s.standardDeliveryFee} onChange={(v) => setS({ ...s, standardDeliveryFee: v })} suffix="so‘m" />
          <div className="grid grid-cols-2 gap-2">
            <NumInput label="Min (daqiqa)" value={s.standardEtaMin} onChange={(v) => setS({ ...s, standardEtaMin: v })} />
            <NumInput label="Max (daqiqa)" value={s.standardEtaMax} onChange={(v) => setS({ ...s, standardEtaMax: v })} />
          </div>
        </div>

        <div className="space-y-3 rounded-xl bg-cream-100 p-4">
          <ToggleRow label="Tezkor yetkazib berish" checked={s.expressEnabled} onChange={(v) => setS({ ...s, expressEnabled: v })} />
          <NumInput label="Narxi" value={s.expressDeliveryFee} onChange={(v) => setS({ ...s, expressDeliveryFee: v })} suffix="so‘m" />
          <div className="grid grid-cols-2 gap-2">
            <NumInput label="Min (daqiqa)" value={s.expressEtaMin} onChange={(v) => setS({ ...s, expressEtaMin: v })} />
            <NumInput label="Max (daqiqa)" value={s.expressEtaMax} onChange={(v) => setS({ ...s, expressEtaMax: v })} />
          </div>
        </div>

        <div className="space-y-3 rounded-xl bg-cream-100 p-4">
          <ToggleRow label="Do‘kondan olib ketish" checked={s.pickupEnabled} onChange={(v) => setS({ ...s, pickupEnabled: v })} />
          <ToggleRow label="Bepul yetkazib berish" checked={s.freeDeliveryEnabled} onChange={(v) => setS({ ...s, freeDeliveryEnabled: v })} />
          <NumInput label="Bepul chegara summasi" value={s.freeDeliveryThreshold} onChange={(v) => setS({ ...s, freeDeliveryThreshold: v })} suffix="so‘m" />
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 rounded-xl bg-cream-100 p-4 sm:grid-cols-3">
        <ToggleRow label="Minimal buyurtma qoidasi" checked={s.minOrderEnabled} onChange={(v) => setS({ ...s, minOrderEnabled: v })} />
        <NumInput label="Minimal summa" value={s.minOrderAmount} onChange={(v) => setS({ ...s, minOrderAmount: v })} suffix="so‘m" />
      </div>

      <button onClick={save} disabled={saving} className="mt-5 rounded-full bg-navy-900 px-6 py-2.5 text-sm font-semibold text-white disabled:opacity-50">
        {saving ? "Saqlanmoqda..." : "Sozlamalarni saqlash"}
      </button>
    </Card>
  );
}

function ZonesSection({ initial }: { initial: Zone[] }) {
  const router = useRouter();
  const { show } = useToast();
  const [zones, setZones] = useState(initial);
  const [form, setForm] = useState({ name: "", minKm: 0, maxKm: 5, fee: 20000 });
  const [saving, setSaving] = useState(false);

  async function add(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const res = await fetch("/api/admin/zones", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, sortOrder: zones.length }),
    });
    setSaving(false);
    if (res.ok) {
      const data = await res.json();
      setZones((prev) => [...prev, data.zone]);
      setForm({ name: "", minKm: 0, maxKm: 5, fee: 20000 });
      show("Hudud qo‘shildi.");
      router.refresh();
    }
  }

  return (
    <Card title="Yetkazib berish hududlari">
      <div className="mb-4 divide-y divide-navy-900/8">
        {zones.map((z) => (
          <div key={z.id} className="flex items-center justify-between py-2.5 text-sm">
            <div>
              <span className="font-medium text-navy-900">{z.name}</span>
              <span className="ml-2 text-navy-900/50">{z.minKm}–{z.maxKm} km</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-medium text-navy-900">{formatSum(z.fee)}</span>
              <DeleteButton
                url={`/api/admin/zones/${z.id}`}
                confirmText={`"${z.name}" hududini o‘chirishni xohlaysizmi?`}
                onSuccess={() => setZones((prev) => prev.filter((x) => x.id !== z.id))}
              />
            </div>
          </div>
        ))}
        {zones.length === 0 && <p className="py-4 text-sm text-navy-900/40">Hududlar qo‘shilmagan</p>}
      </div>

      <form onSubmit={add} className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        <input placeholder="Nomi" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="rounded-lg border border-navy-900/15 px-3 py-2 text-sm outline-none focus:border-gold-500 sm:col-span-2" />
        <input type="number" placeholder="Min km" value={form.minKm} onChange={(e) => setForm({ ...form, minKm: Number(e.target.value) })} className="rounded-lg border border-navy-900/15 px-3 py-2 text-sm outline-none focus:border-gold-500" />
        <input type="number" placeholder="Max km" value={form.maxKm} onChange={(e) => setForm({ ...form, maxKm: Number(e.target.value) })} className="rounded-lg border border-navy-900/15 px-3 py-2 text-sm outline-none focus:border-gold-500" />
        <input type="number" placeholder="Narx" value={form.fee} onChange={(e) => setForm({ ...form, fee: Number(e.target.value) })} className="rounded-lg border border-navy-900/15 px-3 py-2 text-sm outline-none focus:border-gold-500" />
        <button type="submit" disabled={saving} className="col-span-2 rounded-full bg-navy-900 px-4 py-2 text-xs font-semibold text-white disabled:opacity-50 sm:col-span-5 sm:w-fit">
          {saving ? "..." : "+ Hudud qo‘shish"}
        </button>
      </form>
    </Card>
  );
}

function PickupSection({ initial }: { initial: PickupLocation[] }) {
  const router = useRouter();
  const { show } = useToast();
  const [locations, setLocations] = useState(initial);
  const [form, setForm] = useState({ name: "", address: "", openHours: "09:00–21:00" });
  const [saving, setSaving] = useState(false);

  async function add(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const res = await fetch("/api/admin/pickup-locations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaving(false);
    if (res.ok) {
      const data = await res.json();
      setLocations((prev) => [...prev, data.location]);
      setForm({ name: "", address: "", openHours: "09:00–21:00" });
      show("Filial qo‘shildi.");
      router.refresh();
    }
  }

  return (
    <Card title="Do‘kon filiallari (olib ketish)">
      <div className="mb-4 divide-y divide-navy-900/8">
        {locations.map((l) => (
          <div key={l.id} className="flex items-center justify-between py-2.5 text-sm">
            <div>
              <div className="font-medium text-navy-900">{l.name}</div>
              <div className="text-xs text-navy-900/50">{l.address} · {l.openHours}</div>
            </div>
            <DeleteButton
              url={`/api/admin/pickup-locations/${l.id}`}
              confirmText={`"${l.name}" filialini o‘chirishni xohlaysizmi?`}
              onSuccess={() => setLocations((prev) => prev.filter((x) => x.id !== l.id))}
            />
          </div>
        ))}
        {locations.length === 0 && <p className="py-4 text-sm text-navy-900/40">Filiallar qo‘shilmagan</p>}
      </div>

      <form onSubmit={add} className="grid grid-cols-1 gap-3 sm:grid-cols-4">
        <input placeholder="Filial nomi" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="rounded-lg border border-navy-900/15 px-3 py-2 text-sm outline-none focus:border-gold-500" />
        <input placeholder="Manzil" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} required className="rounded-lg border border-navy-900/15 px-3 py-2 text-sm outline-none focus:border-gold-500 sm:col-span-2" />
        <input placeholder="Ish vaqti" value={form.openHours} onChange={(e) => setForm({ ...form, openHours: e.target.value })} className="rounded-lg border border-navy-900/15 px-3 py-2 text-sm outline-none focus:border-gold-500" />
        <button type="submit" disabled={saving} className="rounded-full bg-navy-900 px-4 py-2 text-xs font-semibold text-white disabled:opacity-50 sm:col-span-4 sm:w-fit">
          {saving ? "..." : "+ Filial qo‘shish"}
        </button>
      </form>
    </Card>
  );
}

function PromoSection({ initial }: { initial: PromoCode[] }) {
  const router = useRouter();
  const { show } = useToast();
  const [codes, setCodes] = useState(initial);
  const [form, setForm] = useState({ code: "", type: "PERCENT", value: 10, minOrder: 0, maxDiscount: "", usageLimit: "" });
  const [saving, setSaving] = useState(false);

  async function add(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const res = await fetch("/api/admin/promo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        maxDiscount: form.maxDiscount || undefined,
        usageLimit: form.usageLimit || undefined,
      }),
    });
    setSaving(false);
    if (res.ok) {
      const data = await res.json();
      setCodes((prev) => [data.code, ...prev]);
      setForm({ code: "", type: "PERCENT", value: 10, minOrder: 0, maxDiscount: "", usageLimit: "" });
      show("Promo kod qo‘shildi.");
      router.refresh();
    }
  }

  async function toggleActive(c: PromoCode) {
    setCodes((prev) => prev.map((x) => (x.id === c.id ? { ...x, active: !x.active } : x)));
    await fetch(`/api/admin/promo/${c.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !c.active }),
    });
    router.refresh();
  }

  return (
    <Card title="Promo kodlar">
      <div className="mb-4 divide-y divide-navy-900/8">
        {codes.map((c) => (
          <div key={c.id} className="flex items-center justify-between py-2.5 text-sm">
            <div>
              <span className="font-mono font-semibold text-navy-900">{c.code}</span>
              <span className="ml-2 text-navy-900/50">
                {c.type === "PERCENT" ? `${c.value}%` : formatSum(c.value)} · min {formatSum(c.minOrder)} · {c.usedCount}/{c.usageLimit ?? "∞"}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => toggleActive(c)}
                className={`rounded-full px-2.5 py-1 text-xs font-medium ${c.active ? "bg-emerald-100 text-emerald-700" : "bg-navy-900/10 text-navy-900/50"}`}
              >
                {c.active ? "Faol" : "Nofaol"}
              </button>
              <DeleteButton
                url={`/api/admin/promo/${c.id}`}
                confirmText={`"${c.code}" promo kodini o‘chirishni xohlaysizmi?`}
                onSuccess={() => setCodes((prev) => prev.filter((x) => x.id !== c.id))}
              />
            </div>
          </div>
        ))}
        {codes.length === 0 && <p className="py-4 text-sm text-navy-900/40">Promo kodlar qo‘shilmagan</p>}
      </div>

      <form onSubmit={add} className="grid grid-cols-2 gap-3 sm:grid-cols-6">
        <input placeholder="KOD" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} required className="rounded-lg border border-navy-900/15 px-3 py-2 text-sm outline-none focus:border-gold-500 sm:col-span-2" />
        <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="rounded-lg border border-navy-900/15 px-3 py-2 text-sm outline-none focus:border-gold-500">
          <option value="PERCENT">Foiz %</option>
          <option value="FIXED">Belgilangan</option>
        </select>
        <input type="number" placeholder="Qiymat" value={form.value} onChange={(e) => setForm({ ...form, value: Number(e.target.value) })} className="rounded-lg border border-navy-900/15 px-3 py-2 text-sm outline-none focus:border-gold-500" />
        <input type="number" placeholder="Min buyurtma" value={form.minOrder} onChange={(e) => setForm({ ...form, minOrder: Number(e.target.value) })} className="rounded-lg border border-navy-900/15 px-3 py-2 text-sm outline-none focus:border-gold-500" />
        <input type="number" placeholder="Limit (ixtiyoriy)" value={form.usageLimit} onChange={(e) => setForm({ ...form, usageLimit: e.target.value })} className="rounded-lg border border-navy-900/15 px-3 py-2 text-sm outline-none focus:border-gold-500" />
        <button type="submit" disabled={saving} className="col-span-2 rounded-full bg-navy-900 px-4 py-2 text-xs font-semibold text-white disabled:opacity-50 sm:col-span-6 sm:w-fit">
          {saving ? "..." : "+ Promo kod qo‘shish"}
        </button>
      </form>
    </Card>
  );
}
