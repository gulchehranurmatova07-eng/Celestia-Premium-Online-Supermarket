import { db } from "@/lib/db";

export type PromoResult =
  | { ok: true; code: string; discount: number }
  | { ok: false; reason: string };

export async function validatePromo(code: string, subtotal: number): Promise<PromoResult> {
  const promo = await db.promoCode.findUnique({ where: { code: code.trim().toUpperCase() } });
  if (!promo || !promo.active) return { ok: false, reason: "invalid" };
  if (promo.expiresAt && promo.expiresAt < new Date()) return { ok: false, reason: "expired" };
  if (promo.usageLimit != null && promo.usedCount >= promo.usageLimit) return { ok: false, reason: "limit" };
  if (subtotal < promo.minOrder) return { ok: false, reason: "minOrder" };

  let discount =
    promo.type === "PERCENT" ? Math.round((subtotal * promo.value) / 100) : promo.value;
  if (promo.maxDiscount != null) discount = Math.min(discount, promo.maxDiscount);
  discount = Math.min(discount, subtotal);

  return { ok: true, code: promo.code, discount };
}
