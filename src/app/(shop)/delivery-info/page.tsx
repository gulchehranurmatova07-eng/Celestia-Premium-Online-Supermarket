import { SimplePage } from "@/components/layout/SimplePage";
import { getSettings, getDeliveryZones } from "@/lib/data";
import { formatSum } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function DeliveryInfoPage() {
  const [settings, zones] = await Promise.all([getSettings(), getDeliveryZones()]);

  return (
    <SimplePage title="Доставка и оплата">
      <h2 className="font-display text-lg font-semibold text-navy-900">Способы доставки</h2>
      <ul className="list-disc space-y-2 pl-5">
        <li>Стандартная доставка — {formatSum(settings.standardDeliveryFee)}, {settings.standardEtaMin}–{settings.standardEtaMax} минут</li>
        <li>Экспресс-доставка — {formatSum(settings.expressDeliveryFee)}, {settings.expressEtaMin}–{settings.expressEtaMax} минут</li>
        <li>Самовывоз из магазина — бесплатно</li>
      </ul>
      <p>
        При заказе от {formatSum(settings.freeDeliveryThreshold)} стандартная доставка бесплатна.
        Минимальная сумма заказа — {formatSum(settings.minOrderAmount)}.
      </p>

      <h2 className="mt-6 font-display text-lg font-semibold text-navy-900">Зоны доставки</h2>
      <ul className="list-disc space-y-2 pl-5">
        {zones.map((z) => (
          <li key={z.id}>
            {z.name} ({z.minKm}–{z.maxKm} км) — {formatSum(z.fee)}
          </li>
        ))}
      </ul>

      <h2 id="payment" className="mt-6 font-display text-lg font-semibold text-navy-900">
        Способы оплаты
      </h2>
      <p>Вы можете оплатить наличными, банковской картой, а также через Click, Payme и Uzum Bank.</p>
    </SimplePage>
  );
}
