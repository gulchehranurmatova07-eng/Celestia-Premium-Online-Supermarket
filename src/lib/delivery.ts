export type DeliveryMethod = "STANDARD" | "EXPRESS" | "PICKUP";

export type SettingsLike = {
  standardDeliveryFee: number;
  expressDeliveryFee: number;
  freeDeliveryThreshold: number;
  freeDeliveryEnabled: boolean;
  minOrderAmount: number;
  minOrderEnabled: boolean;
};

export function computeDeliveryFee({
  method,
  subtotal,
  zoneFee,
  settings,
}: {
  method: DeliveryMethod;
  subtotal: number;
  zoneFee: number | null;
  settings: SettingsLike;
}): number {
  if (method === "PICKUP") return 0;

  if (method === "STANDARD") {
    if (settings.freeDeliveryEnabled && subtotal >= settings.freeDeliveryThreshold) return 0;
    return zoneFee ?? settings.standardDeliveryFee;
  }

  // EXPRESS — a paid premium service, not covered by the free-delivery threshold.
  return settings.expressDeliveryFee;
}

export function meetsMinOrder(subtotal: number, settings: SettingsLike): boolean {
  if (!settings.minOrderEnabled) return true;
  return subtotal >= settings.minOrderAmount;
}
