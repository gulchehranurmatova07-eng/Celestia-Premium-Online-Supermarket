import { getSettings, getDeliveryZones, getPickupLocations } from "@/lib/data";
import { db } from "@/lib/db";
import { DeliveryManager } from "@/components/admin/DeliveryManager";

export const dynamic = "force-dynamic";

export default async function AdminDeliveryPage() {
  const [settings, zones, pickupLocations, promoCodes] = await Promise.all([
    getSettings(),
    getDeliveryZones(),
    getPickupLocations(),
    db.promoCode.findMany({ orderBy: { createdAt: "desc" } }),
  ]);

  return (
    <div>
      <h1 className="mb-1 font-display text-2xl font-semibold text-navy-900">Yetkazib berish sozlamalari</h1>
      <p className="mb-6 text-sm text-navy-900/50">Yetkazib berish narxlari, hududlar va promo kodlarni boshqaring</p>
      <DeliveryManager
        initialSettings={settings}
        initialZones={zones}
        initialPickupLocations={pickupLocations}
        initialPromoCodes={promoCodes.map((p) => ({ ...p, expiresAt: p.expiresAt ? p.expiresAt.toISOString() : null }))}
      />
    </div>
  );
}
