import Link from "next/link";
import { db } from "@/lib/db";
import { formatSum } from "@/lib/format";
import { AdminSearchBox } from "@/components/admin/AdminSearchBox";
import { OrderStatusSelect, PaymentStatusSelect } from "@/components/admin/StatusSelects";

export const dynamic = "force-dynamic";

const TABS = [
  { value: "", label: "Barchasi" },
  { value: "NEW", label: "Yangi" },
  { value: "PREPARING", label: "Tayyorlanmoqda" },
  { value: "OUT_FOR_DELIVERY", label: "Yetkazilmoqda" },
  { value: "DELIVERED", label: "Yetkazildi" },
  { value: "CANCELLED", label: "Bekor qilindi" },
];

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string }>;
}) {
  const { q, status } = await searchParams;

  const orders = await db.order.findMany({
    where: {
      AND: [
        q ? { OR: [{ orderNumber: { contains: q } }, { customerName: { contains: q } }, { phone: { contains: q } }] } : {},
        status ? { orderStatus: status as never } : {},
      ],
    },
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="mb-1 font-display text-2xl font-semibold text-navy-900">Buyurtmalar</h1>
      <p className="mb-6 text-sm text-navy-900/50">{orders.length} ta buyurtma</p>

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <AdminSearchBox placeholder="Buyurtma raqami, mijoz yoki telefon..." />
        <div className="flex flex-wrap gap-2">
          {TABS.map((tab) => (
            <Link
              key={tab.value}
              href={tab.value ? `/admin/orders?status=${tab.value}` : "/admin/orders"}
              className={`rounded-full px-3.5 py-2 text-xs font-medium transition ${
                (status ?? "") === tab.value ? "bg-navy-900 text-white" : "border border-navy-900/12 text-navy-900/60 hover:bg-white"
              }`}
            >
              {tab.label}
            </Link>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-navy-900/8 bg-white">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-navy-900/8 text-xs uppercase tracking-wide text-navy-900/45">
              <th className="px-4 py-3">Buyurtma</th>
              <th className="px-4 py-3">Mijoz</th>
              <th className="px-4 py-3">Jami</th>
              <th className="px-4 py-3">To‘lov</th>
              <th className="px-4 py-3">Holat</th>
              <th className="px-4 py-3">Sana</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-navy-900/6">
            {orders.map((o) => (
              <tr key={o.id} className="hover:bg-cream-100/60">
                <td className="px-4 py-3">
                  <Link href={`/admin/orders/${o.id}`} className="font-medium text-navy-900 hover:text-gold-600">
                    {o.orderNumber}
                  </Link>
                  <div className="text-xs text-navy-900/45">{o.items.length} mahsulot</div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-navy-900">{o.customerName}</div>
                  <div className="text-xs text-navy-900/45">{o.phone}</div>
                </td>
                <td className="px-4 py-3 font-medium text-navy-900">{formatSum(o.total)}</td>
                <td className="px-4 py-3">
                  <PaymentStatusSelect orderId={o.id} value={o.paymentStatus} />
                </td>
                <td className="px-4 py-3">
                  <OrderStatusSelect orderId={o.id} value={o.orderStatus} />
                </td>
                <td className="px-4 py-3 text-xs text-navy-900/50">
                  {o.createdAt.toLocaleDateString("uz-UZ")} {o.createdAt.toLocaleTimeString("uz-UZ", { hour: "2-digit", minute: "2-digit" })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {orders.length === 0 && <p className="py-16 text-center text-sm text-navy-900/40">Buyurtmalar topilmadi</p>}
      </div>
    </div>
  );
}
