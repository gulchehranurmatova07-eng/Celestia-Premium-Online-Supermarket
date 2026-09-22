import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { formatSum } from "@/lib/format";
import { OrderStatusSelect, PaymentStatusSelect } from "@/components/admin/StatusSelects";

const DELIVERY_LABELS: Record<string, string> = { STANDARD: "Standart", EXPRESS: "Tezkor", PICKUP: "Do‘kondan olib ketish" };
const PAYMENT_LABELS: Record<string, string> = { CASH: "Naqd pul", CARD: "Bank karta", CLICK: "Click", PAYME: "Payme", UZUM: "Uzum Bank" };

export default async function AdminOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = await db.order.findUnique({ where: { id }, include: { items: true, pickupLocation: true } });
  if (!order) notFound();

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold text-navy-900">Buyurtma {order.orderNumber}</h1>
          <p className="text-sm text-navy-900/50">
            {order.createdAt.toLocaleDateString("uz-UZ")} {order.createdAt.toLocaleTimeString("uz-UZ", { hour: "2-digit", minute: "2-digit" })}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <PaymentStatusSelect orderId={order.id} value={order.paymentStatus} />
          <OrderStatusSelect orderId={order.id} value={order.orderStatus} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-2xl border border-navy-900/8 bg-white p-5">
            <h3 className="mb-4 font-display text-lg font-semibold text-navy-900">Mahsulotlar</h3>
            <div className="divide-y divide-navy-900/8">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center gap-3 py-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.image} alt={item.name} className="h-12 w-12 rounded-lg object-cover" />
                  <div className="min-w-0 flex-1">
                    <div className="line-clamp-1 text-sm text-navy-900">{item.name}</div>
                    <div className="text-xs text-navy-900/45">{item.weight} × {item.quantity}</div>
                  </div>
                  <div className="text-sm font-medium text-navy-900">{formatSum(item.price * item.quantity)}</div>
                </div>
              ))}
            </div>
            <div className="mt-4 space-y-1.5 border-t border-navy-900/8 pt-4 text-sm">
              <Row label="Mahsulotlar" value={formatSum(order.subtotal)} />
              {order.discount > 0 && <Row label={`Chegirma${order.promoCode ? ` (${order.promoCode})` : ""}`} value={`−${formatSum(order.discount)}`} />}
              <Row label="Yetkazib berish" value={order.deliveryFee === 0 ? "Bepul" : formatSum(order.deliveryFee)} />
              <div className="flex justify-between border-t border-navy-900/8 pt-2 text-base font-semibold text-navy-900">
                <span>Jami</span>
                <span>{formatSum(order.total)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-navy-900/8 bg-white p-5">
            <h3 className="mb-3 font-display text-base font-semibold text-navy-900">Mijoz</h3>
            <p className="text-sm text-navy-900">{order.customerName}</p>
            <p className="text-sm text-navy-900/60">{order.phone}</p>
          </div>

          <div className="rounded-2xl border border-navy-900/8 bg-white p-5">
            <h3 className="mb-3 font-display text-base font-semibold text-navy-900">Yetkazib berish</h3>
            <p className="text-sm text-navy-900">{DELIVERY_LABELS[order.deliveryMethod]}</p>
            {order.deliveryMethod === "PICKUP" ? (
              <p className="mt-1 text-sm text-navy-900/60">{order.pickupLocation?.name} — {order.pickupLocation?.address}</p>
            ) : (
              <p className="mt-1 text-sm text-navy-900/60">
                {order.city}, {order.district}, {order.street} {order.house}
                {order.apartment ? `, kv. ${order.apartment}` : ""}
              </p>
            )}
            {order.comment && <p className="mt-2 text-xs text-navy-900/45">Izoh: {order.comment}</p>}
          </div>

          <div className="rounded-2xl border border-navy-900/8 bg-white p-5">
            <h3 className="mb-3 font-display text-base font-semibold text-navy-900">To‘lov</h3>
            <p className="text-sm text-navy-900">{PAYMENT_LABELS[order.paymentMethod]}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-navy-900/70">
      <span>{label}</span>
      <span className="font-medium text-navy-900">{value}</span>
    </div>
  );
}
