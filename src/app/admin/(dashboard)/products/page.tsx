import Link from "next/link";
import { db } from "@/lib/db";
import { formatSum } from "@/lib/format";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { AdminSearchBox } from "@/components/admin/AdminSearchBox";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; stock?: string }>;
}) {
  const { q, stock } = await searchParams;

  const products = await db.product.findMany({
    where: {
      AND: [
        q
          ? {
              OR: [
                { name: { contains: q, mode: "insensitive" } },
                { sku: { contains: q, mode: "insensitive" } },
                { brand: { contains: q, mode: "insensitive" } },
              ],
            }
          : {},
        stock === "low" ? { stock: { gt: 0, lte: 5 } } : {},
        stock === "out" ? { stock: { lte: 0 } } : {},
      ],
    },
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold text-navy-900">Mahsulotlar</h1>
          <p className="text-sm text-navy-900/50">{products.length} ta mahsulot</p>
        </div>
        <Link href="/admin/products/new" className="rounded-full bg-navy-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-navy-700">
          + Mahsulot qo‘shish
        </Link>
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <AdminSearchBox placeholder="Nomi, SKU yoki brend bo‘yicha qidirish..." />
        <div className="flex gap-2">
          <FilterTab href="/admin/products" active={!stock} label="Barchasi" />
          <FilterTab href="/admin/products?stock=low" active={stock === "low"} label="🟡 Kam qolgan" />
          <FilterTab href="/admin/products?stock=out" active={stock === "out"} label="🔴 Tugagan" />
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-navy-900/8 bg-white">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-navy-900/8 text-xs uppercase tracking-wide text-navy-900/45">
              <th className="px-4 py-3">Mahsulot</th>
              <th className="px-4 py-3">Kategoriya</th>
              <th className="px-4 py-3">Narx</th>
              <th className="px-4 py-3">Zaxira</th>
              <th className="px-4 py-3">Holat</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-navy-900/6">
            {products.map((p) => (
              <tr key={p.id} className="transition hover:bg-cream-100/60">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.image} alt={p.name} className="h-10 w-10 rounded-lg object-cover" />
                    <div>
                      <div className="line-clamp-1 font-medium text-navy-900">{p.name}</div>
                      <div className="text-xs text-navy-900/45">{p.sku} · {p.weight}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-navy-900/70">{p.category.name}</td>
                <td className="px-4 py-3">
                  <div className="font-medium text-navy-900">{formatSum(p.price)}</div>
                  {p.oldPrice && <div className="text-xs text-navy-900/40 line-through">{formatSum(p.oldPrice)}</div>}
                </td>
                <td className="px-4 py-3">
                  <StockBadge stock={p.stock} />
                </td>
                <td className="px-4 py-3">
                  {p.isAvailable && p.stock > 0 ? (
                    <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-700">Faol</span>
                  ) : (
                    <span className="rounded-full bg-navy-900/10 px-2.5 py-1 text-xs font-medium text-navy-900/50">Nofaol</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-3">
                    <Link href={`/admin/products/${p.id}`} className="text-navy-900/60 hover:text-navy-900">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                        <path d="M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
                      </svg>
                    </Link>
                    <DeleteButton url={`/api/admin/products/${p.id}`} confirmText={`Ushbu mahsulotni o‘chirishni xohlaysizmi? — ${p.name}`} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {products.length === 0 && <p className="py-16 text-center text-sm text-navy-900/40">Mahsulotlar topilmadi</p>}
      </div>
    </div>
  );
}

function StockBadge({ stock }: { stock: number }) {
  if (stock <= 0) return <span className="text-sm font-medium text-red-600">🔴 Tugagan</span>;
  if (stock <= 5) return <span className="text-sm font-medium text-amber-600">🟡 {stock} ta qoldi</span>;
  return <span className="text-sm font-medium text-emerald-600">🟢 {stock} ta</span>;
}

function FilterTab({ href, active, label }: { href: string; active: boolean; label: string }) {
  return (
    <Link
      href={href}
      className={`rounded-full px-3.5 py-2 text-xs font-medium transition ${
        active ? "bg-navy-900 text-white" : "border border-navy-900/12 text-navy-900/60 hover:bg-white"
      }`}
    >
      {label}
    </Link>
  );
}
