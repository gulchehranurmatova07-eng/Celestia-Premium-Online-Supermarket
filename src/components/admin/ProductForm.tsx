"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ImageUploader } from "./ImageUploader";
import { useToast } from "@/components/ui/Toast";

type Category = { id: string; name: string };

export type ProductFormValues = {
  id?: string;
  sku: string;
  name: string;
  brand: string;
  categoryId: string;
  description: string;
  ingredients: string;
  nutrition: string;
  weight: string;
  price: number;
  oldPrice: number | null;
  stock: number;
  rating: number;
  isAvailable: boolean;
  isFeatured: boolean;
  image: string;
};

export function ProductForm({ categories, initial }: { categories: Category[]; initial?: ProductFormValues }) {
  const router = useRouter();
  const { show } = useToast();
  const isEdit = !!initial?.id;

  const [values, setValues] = useState<ProductFormValues>(
    initial ?? {
      sku: "",
      name: "",
      brand: "",
      categoryId: categories[0]?.id ?? "",
      description: "",
      ingredients: "",
      nutrition: "",
      weight: "",
      price: 0,
      oldPrice: null,
      stock: 0,
      rating: 0,
      isAvailable: true,
      isFeatured: false,
      image: "",
    }
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function set<K extends keyof ProductFormValues>(key: K, val: ProductFormValues[K]) {
    setValues((v) => ({ ...v, [key]: val }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);

    const res = await fetch(isEdit ? `/api/admin/products/${initial!.id}` : "/api/admin/products", {
      method: isEdit ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    setSaving(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error === "sku_taken" ? "Bu SKU allaqachon mavjud." : "Saqlashda xatolik yuz berdi.");
      return;
    }
    show(isEdit ? "Mahsulot yangilandi." : "Mahsulot qo‘shildi.");
    router.push("/admin/products");
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          <div className="rounded-2xl border border-navy-900/8 bg-white p-5">
            <h3 className="mb-4 font-display text-lg font-semibold text-navy-900">Asosiy ma’lumotlar</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <TextField label="Mahsulot nomi" value={values.name} onChange={(v) => set("name", v)} required className="sm:col-span-2" />
              <TextField label="SKU" value={values.sku} onChange={(v) => set("sku", v)} required disabled={isEdit} />
              <TextField label="Brend" value={values.brand} onChange={(v) => set("brand", v)} />
              <TextField label="Og‘irligi / hajmi" value={values.weight} onChange={(v) => set("weight", v)} required placeholder="masalan, 500 g" />
              <div>
                <label className="mb-1.5 block text-sm font-medium text-navy-900/70">Kategoriya</label>
                <select
                  value={values.categoryId}
                  onChange={(e) => set("categoryId", e.target.value)}
                  className="w-full rounded-xl border border-navy-900/15 px-3.5 py-2.5 text-sm outline-none focus:border-gold-500"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-navy-900/8 bg-white p-5">
            <h3 className="mb-4 font-display text-lg font-semibold text-navy-900">Tavsif</h3>
            <div className="space-y-4">
              <TextArea label="Tavsif" value={values.description} onChange={(v) => set("description", v)} />
              <TextArea label="Tarkibi" value={values.ingredients} onChange={(v) => set("ingredients", v)} />
              <TextArea label="Ozuqaviy qiymati" value={values.nutrition} onChange={(v) => set("nutrition", v)} />
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div className="rounded-2xl border border-navy-900/8 bg-white p-5">
            <ImageUploader value={values.image} onChange={(url) => set("image", url)} />
          </div>

          <div className="rounded-2xl border border-navy-900/8 bg-white p-5">
            <h3 className="mb-4 font-display text-lg font-semibold text-navy-900">Narx va zaxira</h3>
            <div className="space-y-4">
              <NumberField label="Narxi (so‘m)" value={values.price} onChange={(v) => set("price", v)} required />
              <NumberField label="Eski narxi (chegirma uchun)" value={values.oldPrice ?? ""} onChange={(v) => set("oldPrice", v)} />
              <NumberField label="Zaxira miqdori" value={values.stock} onChange={(v) => set("stock", v)} />
              <NumberField label="Reyting (0-5)" value={values.rating} onChange={(v) => set("rating", v)} step="0.1" max={5} />
            </div>
          </div>

          <div className="rounded-2xl border border-navy-900/8 bg-white p-5 space-y-3">
            <label className="flex items-center justify-between text-sm font-medium text-navy-900">
              Mavjud (sotuvda)
              <input type="checkbox" checked={values.isAvailable} onChange={(e) => set("isAvailable", e.target.checked)} className="h-4 w-4 accent-navy-900" />
            </label>
            <label className="flex items-center justify-between text-sm font-medium text-navy-900">
              Mashhur (bosh sahifada)
              <input type="checkbox" checked={values.isFeatured} onChange={(e) => set("isFeatured", e.target.checked)} className="h-4 w-4 accent-navy-900" />
            </label>
          </div>
        </div>
      </div>

      {error && <p className="text-sm font-medium text-red-600">{error}</p>}

      <div className="flex gap-3">
        <button type="submit" disabled={saving} className="rounded-full bg-navy-900 px-7 py-3 text-sm font-semibold text-white hover:bg-navy-700 disabled:opacity-50">
          {saving ? "Saqlanmoqda..." : isEdit ? "Saqlash" : "Mahsulot qo‘shish"}
        </button>
        <button type="button" onClick={() => router.back()} className="rounded-full border border-navy-900/15 px-7 py-3 text-sm font-medium text-navy-900">
          Bekor qilish
        </button>
      </div>
    </form>
  );
}

function TextField({
  label,
  value,
  onChange,
  required,
  disabled,
  placeholder,
  className = "",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="mb-1.5 block text-sm font-medium text-navy-900/70">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        disabled={disabled}
        placeholder={placeholder}
        className="w-full rounded-xl border border-navy-900/15 px-3.5 py-2.5 text-sm outline-none focus:border-gold-500 disabled:bg-cream-100 disabled:text-navy-900/50"
      />
    </div>
  );
}

function TextArea({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-navy-900/70">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={3}
        className="w-full rounded-xl border border-navy-900/15 px-3.5 py-2.5 text-sm outline-none focus:border-gold-500"
      />
    </div>
  );
}

function NumberField({
  label,
  value,
  onChange,
  required,
  step,
  max,
}: {
  label: string;
  value: number | string;
  onChange: (v: number) => void;
  required?: boolean;
  step?: string;
  max?: number;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-navy-900/70">{label}</label>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value === "" ? 0 : Number(e.target.value))}
        required={required}
        step={step}
        max={max}
        min={0}
        className="w-full rounded-xl border border-navy-900/15 px-3.5 py-2.5 text-sm outline-none focus:border-gold-500"
      />
    </div>
  );
}
