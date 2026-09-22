import Link from "next/link";
import { db } from "@/lib/db";
import { formatSum } from "@/lib/format";

export default async function AdminDashboardPage() {
  const [
    totalProducts,
    totalCategories,
    totalOrders,
    totalCustomers,
    lowStock,
    outOfStock,
    paidOrders,
    recentOrders,
  ] = await Promise.all([
    db.product.count(),
    db.category.count(),
    db.order.count(),
    db.user.count(),
    db.product.count({ where: { stock: { gt: 0, lte: 5 } } }),
    db.product.count({ where: { stock: { lte: 0 } } }),
    db.order.findMany({ where: { paymentStatus: "PAID" }, select: { total: true, createdAt: true } }),
    db.order.findMany({ orderBy: { createdAt: "desc" }, take: 6, include: { items: true } }),
  ]);

  const revenue = paidOrders.reduce((sum, o) => sum + o.total, 0);

  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    d.setHours(0, 0, 0, 0);
    return d;
  });
  const dayTotals = days.map((day) => {
    const next = new Date(day);
    next.setDate(next.getDate() + 1);
    return paidOrders
      .filter((o) => o.createdAt >= day && o.createdAt < next)
      .reduce((sum, o) => sum + o.total, 0);
  });
  const maxDay = Math.max(1, ...dayTotals);

  const cards = [
    { label: "Jami mahsulotlar", value: totalProducts, icon: "🛒", href: "/admin/products" },
    { label: "Kategoriyalar", value: totalCategories, icon: "🗂️", href: "/admin/categories" },
    { label: "Buyurtmalar", value: totalOrders, icon: "📦", href: "/admin/orders" },
    { label: "Daromad", value: formatSum(revenue), icon: "💰", href: "/admin/orders" },
    { label: "Mijozlar", value: totalCustomers, icon: "👥", href: null },
    { label: "Kam qolgan", value: lowStock, icon: "🟡", href: "/admin/products?stock=low" },
    { label: "Tugagan", value: outOfStock, icon: "🔴", href: "/admin/products?stock=out" },
  ];

  return (
    <div>
      <h1 className="mb-1 font-display text-2xl font-semibold text-navy-900">Boshqaruv paneli</h1>
      <p className="mb-6 text-sm text-navy-900/50">Celestia supermarketi — umumiy ko‘rsatkichlar</p>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {cards.map((c) => {
          const inner = (
            <>
              <div className="flex items-center justify-between">
                <span className="text-2xl">{c.icon}</span>
              </div>
              <div className="mt-3 font-display text-2xl font-semibold text-navy-900">{c.value}</div>
              <div className="mt-0.5 text-xs text-navy-900/50">{c.label}</div>
            </>
          );
          return c.href ? (
            <Link key={c.label} href={c.href} className="rounded-2xl border border-navy-900/8 bg-white p-5 transition hover:border-gold-400/40 hover:shadow-md">
              {inner}
            </Link>
          ) : (
            <div key={c.label} className="rounded-2xl border border-navy-900/8 bg-white p-5">
              {inner}
            </div>
          );
        })}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-navy-900/8 bg-white p-6 lg:col-span-2">
          <h2 className="mb-5 font-display text-lg font-semibold text-navy-900">Oxirgi 7 kunlik daromad</h2>
          <div className="flex h-48 items-end gap-3">
            {days.map((day, i) => (
              <div key={i} className="flex flex-1 flex-col items-center gap-2">
                <div className="flex h-40 w-full items-end">
                  <div
                    className="w-full rounded-t-lg bg-gradient-to-t from-navy-900 to-navy-700 transition-all"
                    style={{ height: `${Math.max(4, (dayTotals[i] / maxDay) * 100)}%` }}
                    title={formatSum(dayTotals[i])}
                  />
                </div>
                <span className="text-[10px] text-navy-900/45">{day.toLocaleDateString("uz-UZ", { day: "2-digit", month: "2-digit" })}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-navy-900/8 bg-white p-6">
          <h2 className="mb-4 font-display text-lg font-semibold text-navy-900">So‘nggi buyurtmalar</h2>
          <div className="flex flex-col divide-y divide-navy-900/8">
            {recentOrders.map((o) => (
              <Link key={o.id} href={`/admin/orders/${o.id}`} className="flex items-center justify-between py-3 text-sm transition hover:text-gold-600">
                <div>
                  <div className="font-medium text-navy-900">{o.orderNumber}</div>
                  <div className="text-xs text-navy-900/45">{o.customerName}</div>
                </div>
                <div className="text-right font-medium text-navy-900">{formatSum(o.total)}</div>
              </Link>
            ))}
            {recentOrders.length === 0 && <p className="py-6 text-center text-sm text-navy-900/40">Hozircha buyurtmalar yo‘q</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
