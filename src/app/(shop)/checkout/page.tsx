"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cart";
import { useCartProducts } from "@/store/useCartProducts";
import { useSettings } from "@/store/useSettings";
import { computeDeliveryFee, meetsMinOrder, type DeliveryMethod } from "@/lib/delivery";
import { formatSum } from "@/lib/format";
import { useLocale } from "@/i18n/LocaleProvider";
import { useToast } from "@/components/ui/Toast";

type PaymentMethod = "CASH" | "CARD" | "CLICK" | "PAYME" | "UZUM";

const PAYMENT_OPTIONS: { value: PaymentMethod; labelKey: string; icon: string }[] = [
  { value: "CASH", labelKey: "checkout.cash", icon: "💵" },
  { value: "CARD", labelKey: "checkout.card", icon: "💳" },
  { value: "CLICK", labelKey: "checkout.click", icon: "📱" },
  { value: "PAYME", labelKey: "checkout.payme", icon: "🟢" },
  { value: "UZUM", labelKey: "checkout.uzum", icon: "🟣" },
];

export default function CheckoutPage() {
  const { t } = useLocale();
  const { show } = useToast();
  const router = useRouter();
  const { lines, subtotal, loading } = useCartProducts();
  const clearCart = useCartStore((s) => s.clear);
  const { settings, zones, pickupLocations } = useSettings();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [district, setDistrict] = useState("");
  const [street, setStreet] = useState("");
  const [house, setHouse] = useState("");
  const [apartment, setApartment] = useState("");
  const [entrance, setEntrance] = useState("");
  const [floor, setFloor] = useState("");
  const [comment, setComment] = useState("");
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>("STANDARD");
  const [zoneId, setZoneId] = useState("");
  const [pickupLocationId, setPickupLocationId] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("CASH");
  const [promoInput, setPromoInput] = useState("");
  const [promo, setPromo] = useState<{ code: string; discount: number } | null>(null);
  const [promoError, setPromoError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const selectedZone = zones.find((z) => z.id === zoneId) ?? null;

  const deliveryFee = useMemo(() => {
    if (!settings) return 0;
    return computeDeliveryFee({
      method: deliveryMethod,
      subtotal,
      zoneFee: selectedZone?.fee ?? null,
      settings,
    });
  }, [settings, deliveryMethod, subtotal, selectedZone]);

  const discount = promo?.discount ?? 0;
  const total = Math.max(0, subtotal - discount + deliveryFee);
  const belowMin = settings ? !meetsMinOrder(subtotal, settings) : false;

  async function applyPromo() {
    setPromoError("");
    if (!promoInput.trim()) return;
    const res = await fetch("/api/checkout/promo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: promoInput.trim(), subtotal }),
    });
    const data = await res.json();
    if (data.ok) {
      setPromo({ code: data.code, discount: data.discount });
      show(t("toast.promoApplied"));
    } else {
      setPromo(null);
      setPromoError(t("toast.promoInvalid"));
    }
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setFormError("");

    if (deliveryMethod === "STANDARD" && !zoneId) {
      setFormError(t("checkout.zoneUnavailable"));
      return;
    }
    if (deliveryMethod === "PICKUP" && !pickupLocationId) {
      setFormError("Iltimos, do‘kon filialini tanlang.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: name,
          phone,
          city: "Toshkent",
          district,
          street,
          house,
          apartment,
          entrance,
          floor,
          comment,
          deliveryMethod,
          zoneId: deliveryMethod === "STANDARD" ? zoneId : undefined,
          pickupLocationId: deliveryMethod === "PICKUP" ? pickupLocationId : undefined,
          paymentMethod,
          promoCode: promo?.code,
          items: lines.map((l) => ({ productId: l.product.id, quantity: l.quantity })),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setFormError(data.error === "below_min_order" ? t("cart.minOrder").replace("{amount}", formatSum(data.minOrder)) : "Buyurtmani rasmiylashtirishda xatolik yuz berdi.");
        setSubmitting(false);
        return;
      }
      clearCart();
      show(t("toast.orderPlaced"));
      router.push(`/checkout/success/${data.order.orderNumber}`);
    } catch {
      setFormError("Tarmoq xatoligi. Qaytadan urinib ko‘ring.");
      setSubmitting(false);
    }
  }

  if (loading) return <div className="mx-auto max-w-4xl px-4 py-16 text-center text-navy-900/50">Yuklanmoqda...</div>;

  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center">
        <p className="text-navy-900/60">{t("cart.empty")}</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <h1 className="mb-6 font-display text-2xl font-semibold text-navy-900 sm:text-3xl">{t("checkout.title")}</h1>

      <div className="flex flex-col gap-8 lg:flex-row">
        <div className="flex-1 space-y-6">
          <Section title={t("checkout.contact")}>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label={t("checkout.name")} value={name} onChange={setName} required />
              <Field label={t("checkout.phone")} value={phone} onChange={setPhone} required placeholder="+998 90 123 45 67" />
            </div>
          </Section>

          <Section title={t("checkout.deliveryMethod")}>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <DeliveryOption
                active={deliveryMethod === "STANDARD"}
                onClick={() => setDeliveryMethod("STANDARD")}
                title={t("checkout.standard")}
                sub={settings ? `${settings.standardEtaMin}-${settings.standardEtaMax} daqiqa` : ""}
                price={settings ? formatSum(settings.standardDeliveryFee) : ""}
              />
              <DeliveryOption
                active={deliveryMethod === "EXPRESS"}
                onClick={() => setDeliveryMethod("EXPRESS")}
                title={t("checkout.express")}
                sub={settings ? `${settings.expressEtaMin}-${settings.expressEtaMax} daqiqa` : ""}
                price={settings ? formatSum(settings.expressDeliveryFee) : ""}
              />
              <DeliveryOption
                active={deliveryMethod === "PICKUP"}
                onClick={() => setDeliveryMethod("PICKUP")}
                title={t("checkout.pickup")}
                sub="Do‘kondan"
                price={t("cart.freeDelivery")}
              />
            </div>
          </Section>

          {deliveryMethod !== "PICKUP" ? (
            <Section title={t("checkout.deliveryAddress")}>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="mb-1.5 block text-sm font-medium text-navy-900/70">Hudud (yetkazib berish zonasi)</label>
                  <select
                    value={zoneId}
                    onChange={(e) => setZoneId(e.target.value)}
                    required
                    className="w-full rounded-xl border border-navy-900/15 px-3.5 py-2.5 text-sm outline-none focus:border-gold-500"
                  >
                    <option value="">Tanlang...</option>
                    {zones.map((z) => (
                      <option key={z.id} value={z.id}>
                        {z.name} ({z.minKm}–{z.maxKm} km) — {formatSum(z.fee)}
                      </option>
                    ))}
                  </select>
                </div>
                <Field label={t("checkout.district")} value={district} onChange={setDistrict} required />
                <Field label={t("checkout.street")} value={street} onChange={setStreet} required />
                <Field label={t("checkout.house")} value={house} onChange={setHouse} required />
                <Field label={t("checkout.apartment")} value={apartment} onChange={setApartment} />
                <Field label={t("checkout.entrance")} value={entrance} onChange={setEntrance} />
                <Field label={t("checkout.floor")} value={floor} onChange={setFloor} />
              </div>
            </Section>
          ) : (
            <Section title={t("checkout.pickup")}>
              <div className="flex flex-col gap-3">
                {pickupLocations.map((loc) => (
                  <label
                    key={loc.id}
                    className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition ${
                      pickupLocationId === loc.id ? "border-gold-500 bg-gold-400/5" : "border-navy-900/12"
                    }`}
                  >
                    <input
                      type="radio"
                      name="pickup"
                      checked={pickupLocationId === loc.id}
                      onChange={() => setPickupLocationId(loc.id)}
                      className="mt-1 accent-navy-900"
                    />
                    <div>
                      <div className="font-medium text-navy-900">{loc.name}</div>
                      <div className="text-sm text-navy-900/55">{loc.address}</div>
                      <div className="mt-0.5 text-xs text-navy-900/45">Ish vaqti: {loc.openHours}</div>
                    </div>
                  </label>
                ))}
              </div>
            </Section>
          )}

          <Section title={t("checkout.comment")}>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
              placeholder="Qo‘shimcha izoh..."
              className="w-full rounded-xl border border-navy-900/15 px-3.5 py-2.5 text-sm outline-none focus:border-gold-500"
            />
          </Section>

          <Section title={t("checkout.payment")}>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
              {PAYMENT_OPTIONS.map((opt) => (
                <button
                  type="button"
                  key={opt.value}
                  onClick={() => setPaymentMethod(opt.value)}
                  className={`flex flex-col items-center gap-1.5 rounded-xl border p-3.5 text-center transition ${
                    paymentMethod === opt.value ? "border-gold-500 bg-gold-400/5" : "border-navy-900/12"
                  }`}
                >
                  <span className="text-xl">{opt.icon}</span>
                  <span className="text-xs font-medium text-navy-900">{t(opt.labelKey)}</span>
                </button>
              ))}
            </div>
            {paymentMethod !== "CASH" && (
              <p className="mt-3 rounded-lg bg-navy-900/5 px-3 py-2 text-xs text-navy-900/60">
                ⚠️ {t("checkout.testMode")} — bu demo muhitda haqiqiy to‘lov amalga oshirilmaydi.
              </p>
            )}
          </Section>
        </div>

        <div className="w-full shrink-0 lg:w-80">
          <div className="sticky top-24 rounded-2xl border border-navy-900/8 bg-white p-5">
            <h3 className="font-display text-lg font-semibold text-navy-900">{t("checkout.orderSummary")}</h3>

            <div className="mt-4 max-h-48 space-y-3 overflow-y-auto">
              {lines.map((l) => (
                <div key={l.product.id} className="flex items-center gap-3 text-sm">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={l.product.image} alt={l.product.name} className="h-10 w-10 rounded-lg object-cover" />
                  <div className="min-w-0 flex-1">
                    <div className="line-clamp-1 text-navy-900">{l.product.name}</div>
                    <div className="text-xs text-navy-900/45">× {l.quantity}</div>
                  </div>
                  <div className="shrink-0 font-medium text-navy-900">{formatSum(l.product.price * l.quantity)}</div>
                </div>
              ))}
            </div>

            <div className="mt-4 flex gap-2 border-t border-navy-900/8 pt-4">
              <input
                value={promoInput}
                onChange={(e) => setPromoInput(e.target.value)}
                placeholder={t("checkout.promo")}
                className="min-w-0 flex-1 rounded-lg border border-navy-900/15 px-3 py-2 text-sm outline-none focus:border-gold-500"
              />
              <button type="button" onClick={applyPromo} className="shrink-0 rounded-lg bg-navy-900 px-3 py-2 text-xs font-semibold text-white">
                {t("checkout.promoApply")}
              </button>
            </div>
            {promoError && <p className="mt-1.5 text-xs text-red-600">{promoError}</p>}
            {promo && <p className="mt-1.5 text-xs text-emerald-600">{t("toast.promoApplied")}: {promo.code}</p>}

            <div className="mt-4 space-y-2 border-t border-navy-900/8 pt-4 text-sm">
              <div className="flex justify-between text-navy-900/70">
                <span>{t("cart.subtotal")}</span>
                <span className="font-medium text-navy-900">{formatSum(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>{t("cart.discount")}</span>
                  <span className="font-medium">−{formatSum(discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-navy-900/70">
                <span>{t("cart.delivery")}</span>
                <span className="font-medium text-navy-900">{deliveryFee === 0 ? t("cart.freeDelivery") : formatSum(deliveryFee)}</span>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-navy-900/8 pt-4">
              <span className="font-medium text-navy-900">{t("cart.total")}</span>
              <span className="font-display text-xl font-semibold text-navy-900">{formatSum(total)}</span>
            </div>

            {belowMin && settings && (
              <p className="mt-3 text-xs font-medium text-red-600">{t("cart.minOrder").replace("{amount}", formatSum(settings.minOrderAmount))}</p>
            )}
            {formError && <p className="mt-3 text-xs font-medium text-red-600">{formError}</p>}

            <button
              type="submit"
              disabled={submitting || belowMin}
              className="mt-5 w-full rounded-full bg-navy-900 py-3.5 text-sm font-semibold text-white transition hover:bg-navy-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {submitting ? "..." : t("checkout.placeOrder")}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-navy-900/8 bg-white p-5">
      <h3 className="mb-4 font-display text-lg font-semibold text-navy-900">{title}</h3>
      {children}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  required,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-navy-900/70">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        placeholder={placeholder}
        className="w-full rounded-xl border border-navy-900/15 px-3.5 py-2.5 text-sm outline-none focus:border-gold-500"
      />
    </div>
  );
}

function DeliveryOption({
  active,
  onClick,
  title,
  sub,
  price,
}: {
  active: boolean;
  onClick: () => void;
  title: string;
  sub: string;
  price: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-col items-start gap-1 rounded-xl border p-4 text-left transition ${
        active ? "border-gold-500 bg-gold-400/5" : "border-navy-900/12"
      }`}
    >
      <span className="text-sm font-semibold text-navy-900">{title}</span>
      <span className="text-xs text-navy-900/50">{sub}</span>
      <span className="mt-1 text-sm font-medium text-gold-600">{price}</span>
    </button>
  );
}
