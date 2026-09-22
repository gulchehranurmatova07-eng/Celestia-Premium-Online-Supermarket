"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/Toast";
import { DeleteButton } from "./DeleteButton";

type Category = {
  id: string;
  slug: string;
  name: string;
  icon: string;
  image: string | null;
  sortOrder: number;
  visible: boolean;
  productCount: number;
};

export function CategoryManager({ initial }: { initial: Category[] }) {
  const router = useRouter();
  const { show } = useToast();
  const [categories, setCategories] = useState(initial);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", icon: "🛒", sortOrder: 0, visible: true });
  const [saving, setSaving] = useState(false);

  function startEdit(c: Category) {
    setEditingId(c.id);
    setForm({ name: c.name, icon: c.icon, sortOrder: c.sortOrder, visible: c.visible });
    setShowForm(true);
  }

  function startNew() {
    setEditingId(null);
    setForm({ name: "", icon: "🛒", sortOrder: categories.length, visible: true });
    setShowForm(true);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const res = await fetch(editingId ? `/api/admin/categories/${editingId}` : "/api/admin/categories", {
      method: editingId ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaving(false);
    if (res.ok) {
      show(editingId ? "Kategoriya yangilandi." : "Kategoriya qo‘shildi.");
      setShowForm(false);
      router.refresh();
    }
  }

  async function toggleVisible(c: Category) {
    setCategories((prev) => prev.map((x) => (x.id === c.id ? { ...x, visible: !x.visible } : x)));
    await fetch(`/api/admin/categories/${c.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ visible: !c.visible }),
    });
  }

  return (
    <div>
      <div className="mb-4">
        <button onClick={startNew} className="rounded-full bg-navy-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-navy-700">
          + Kategoriya qo‘shish
        </button>
      </div>

      {showForm && (
        <form onSubmit={submit} className="mb-5 grid grid-cols-1 gap-3 rounded-2xl border border-navy-900/8 bg-white p-5 sm:grid-cols-4">
          <div className="sm:col-span-2">
            <label className="mb-1 block text-xs font-medium text-navy-900/60">Nomi</label>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              className="w-full rounded-lg border border-navy-900/15 px-3 py-2 text-sm outline-none focus:border-gold-500"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-navy-900/60">Ikonka (emoji)</label>
            <input
              value={form.icon}
              onChange={(e) => setForm({ ...form, icon: e.target.value })}
              className="w-full rounded-lg border border-navy-900/15 px-3 py-2 text-sm outline-none focus:border-gold-500"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-navy-900/60">Tartib raqami</label>
            <input
              type="number"
              value={form.sortOrder}
              onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })}
              className="w-full rounded-lg border border-navy-900/15 px-3 py-2 text-sm outline-none focus:border-gold-500"
            />
          </div>
          <div className="flex items-end gap-2 sm:col-span-4">
            <button type="submit" disabled={saving} className="rounded-full bg-navy-900 px-5 py-2 text-sm font-semibold text-white disabled:opacity-50">
              {saving ? "..." : "Saqlash"}
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="rounded-full border border-navy-900/15 px-5 py-2 text-sm font-medium text-navy-900">
              Bekor qilish
            </button>
          </div>
        </form>
      )}

      <div className="overflow-x-auto rounded-2xl border border-navy-900/8 bg-white">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-navy-900/8 text-xs uppercase tracking-wide text-navy-900/45">
              <th className="px-4 py-3">Kategoriya</th>
              <th className="px-4 py-3">Mahsulotlar</th>
              <th className="px-4 py-3">Ko‘rinish</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-navy-900/6">
            {categories.map((c) => (
              <tr key={c.id} className="hover:bg-cream-100/60">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl">{c.icon}</span>
                    <span className="font-medium text-navy-900">{c.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-navy-900/70">{c.productCount}</td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => toggleVisible(c)}
                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${c.visible ? "bg-emerald-100 text-emerald-700" : "bg-navy-900/10 text-navy-900/50"}`}
                  >
                    {c.visible ? "Ko‘rinadi" : "Yashirilgan"}
                  </button>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-3">
                    <button onClick={() => startEdit(c)} className="text-navy-900/60 hover:text-navy-900">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                        <path d="M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
                      </svg>
                    </button>
                    <DeleteButton
                      url={`/api/admin/categories/${c.id}`}
                      confirmText={`Ushbu kategoriyani o‘chirishni xohlaysizmi? — ${c.name}`}
                      onSuccess={() => setCategories((prev) => prev.filter((x) => x.id !== c.id))}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
