import Link from "next/link";
import { getCustomerSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { formatSum } from "@/lib/format";
import { OrderStatusBadge, PaymentStatusBadge } from "@/components/order/StatusBadge";

export default async function OrdersPage() {
  const session = await getCustomerSession();
  const orders = await db.order.findMany({
    where: { userId: session!.userId },
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="mb-5 font-display text-2xl font-semibold text-navy-900">Мои заказы</h1>

      {orders.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-navy-900/15 bg-white py-16 text-center">
          <p className="text-navy-900/55">Пока нет заказов</p>
          <Link href="/search" className="mt-4 inline-block rounded-full bg-navy-900 px-6 py-2.5 text-sm font-semibold text-white hover:bg-navy-700">
            Начать покупки
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {orders.map((order) => (
            <Link
              key={order.id}
              href={`/checkout/success/${order.orderNumber}`}
              className="block rounded-2xl border border-navy-900/8 bg-white p-5 transition hover:border-gold-400/50 hover:shadow-md"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <span className="font-semibold text-navy-900">{order.orderNumber}</span>
                  <span className="ml-2 text-sm text-navy-900/45">
                    {order.createdAt.toLocaleDateString("ru-RU")}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <OrderStatusBadge status={order.orderStatus} />
                  <PaymentStatusBadge status={order.paymentStatus} />
                </div>
              </div>
              <div className="mt-3 flex items-center gap-2 overflow-hidden">
                {order.items.slice(0, 5).map((item) => (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img key={item.id} src={item.image} alt={item.name} className="h-12 w-12 shrink-0 rounded-lg object-cover" />
                ))}
                {order.items.length > 5 && (
                  <span className="text-xs text-navy-900/45">+{order.items.length - 5}</span>
                )}
              </div>
              <div className="mt-3 flex items-center justify-between border-t border-navy-900/8 pt-3">
                <span className="text-sm text-navy-900/55">{order.items.length} товара</span>
                <span className="font-display font-semibold text-navy-900">{formatSum(order.total)}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
