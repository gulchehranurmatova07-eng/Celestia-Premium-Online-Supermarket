"use client";

import { useEffect, useState } from "react";

export type PublicSettings = {
  standardDeliveryFee: number;
  standardEtaMin: number;
  standardEtaMax: number;
  standardEnabled: boolean;
  expressDeliveryFee: number;
  expressEtaMin: number;
  expressEtaMax: number;
  expressEnabled: boolean;
  pickupEnabled: boolean;
  freeDeliveryThreshold: number;
  freeDeliveryEnabled: boolean;
  minOrderAmount: number;
  minOrderEnabled: boolean;
};

export type DeliveryZone = { id: string; name: string; minKm: number; maxKm: number; fee: number };
export type PickupLocation = { id: string; name: string; address: string; openHours: string };

export function useSettings() {
  const [settings, setSettings] = useState<PublicSettings | null>(null);
  const [zones, setZones] = useState<DeliveryZone[]>([]);
  const [pickupLocations, setPickupLocations] = useState<PickupLocation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data) => {
        setSettings(data.settings);
        setZones(data.zones);
        setPickupLocations(data.pickupLocations);
      })
      .finally(() => setLoading(false));
  }, []);

  return { settings, zones, pickupLocations, loading };
}
