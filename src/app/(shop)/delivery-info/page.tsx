import { SimplePage } from "@/components/layout/SimplePage";
import { getSettings, getDeliveryZones } from "@/lib/data";
import { formatSum } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function DeliveryInfoPage() {
  const [settings, zones] = await Promise.all([getSettings(), getDeliveryZones()]);

  return (
    <SimplePage title="Yetkazib berish va to‘lov">
      <h2 className="font-display text-lg font-semibold text-navy-900">Yetkazib berish usullari</h2>
      <ul className="list-disc space-y-2 pl-5">
        <li>Standart yetkazib berish — {formatSum(settings.standardDeliveryFee)}, {settings.standardEtaMin}–{settings.standardEtaMax} daqiqa</li>
        <li>Tezkor yetkazib berish — {formatSum(settings.expressDeliveryFee)}, {settings.expressEtaMin}–{settings.expressEtaMax} daqiqa</li>
        <li>Do‘kondan olib ketish — bepul</li>
      </ul>
      <p>
        {formatSum(settings.freeDeliveryThreshold)} dan yuqori buyurtmalarda standart yetkazib berish bepul.
        Minimal buyurtma summasi — {formatSum(settings.minOrderAmount)}.
      </p>

      <h2 className="mt-6 font-display text-lg font-semibold text-navy-900">Yetkazib berish hududlari</h2>
      <ul className="list-disc space-y-2 pl-5">
        {zones.map((z) => (
          <li key={z.id}>
            {z.name} ({z.minKm}–{z.maxKm} km) — {formatSum(z.fee)}
          </li>
        ))}
      </ul>

      <h2 id="payment" className="mt-6 font-display text-lg font-semibold text-navy-900">
        To‘lov usullari
      </h2>
      <p>Naqd pul, Bank karta, Click, Payme va Uzum Bank orqali to‘lov qilishingiz mumkin.</p>
    </SimplePage>
  );
}
