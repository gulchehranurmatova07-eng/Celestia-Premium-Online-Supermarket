"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/Toast";

const ORDER_STATUSES = [
  { value: "NEW", label: "Yangi" },
  { value: "CONFIRMED", label: "Qabul qilindi" },
  { value: "PREPARING", label: "Tayyorlanmoqda" },
  { value: "READY", label: "Tayyor" },
  { value: "OUT_FOR_DELIVERY", label: "Yetkazilmoqda" },
  { value: "READY_FOR_PICKUP", label: "Olib ketishga tayyor" },
  { value: "DELIVERED", label: "Yetkazildi" },
  { value: "PICKED_UP", label: "Olib ketildi" },
  { value: "CANCELLED", label: "Bekor qilindi" },
];

const PAYMENT_STATUSES = [
  { value: "PENDING", label: "Kutilmoqda" },
  { value: "PAID", label: "To‘langan" },
  { value: "FAILED", label: "Muvaffaqiyatsiz" },
  { value: "REFUND_PENDING", label: "Qaytarish kutilmoqda" },
  { value: "REFUNDED", label: "Qaytarildi" },
  { value: "CANCELLED", label: "Bekor qilindi" },
];

function StatusSelect({
  orderId,
  field,
  value,
  options,
}: {
  orderId: string;
  field: "orderStatus" | "paymentStatus";
  value: string;
  options: { value: string; label: string }[];
}) {
  const router = useRouter();
  const { show } = useToast();
  const [current, setCurrent] = useState(value);
  const [saving, setSaving] = useState(false);

  async function change(next: string) {
    setCurrent(next);
    setSaving(true);
    const res = await fetch(`/api/admin/orders/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ [field]: next }),
    });
    setSaving(false);
    if (res.ok) {
      show("Holat yangilandi.");
      router.refresh();
    }
  }

  return (
    <select
      value={current}
      onChange={(e) => change(e.target.value)}
      disabled={saving}
      onClick={(e) => e.stopPropagation()}
      className="rounded-full border border-navy-900/15 bg-white px-2.5 py-1.5 text-xs font-medium text-navy-900 outline-none focus:border-gold-500 disabled:opacity-50"
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

export function OrderStatusSelect({ orderId, value }: { orderId: string; value: string }) {
  return <StatusSelect orderId={orderId} field="orderStatus" value={value} options={ORDER_STATUSES} />;
}

export function PaymentStatusSelect({ orderId, value }: { orderId: string; value: string }) {
  return <StatusSelect orderId={orderId} field="paymentStatus" value={value} options={PAYMENT_STATUSES} />;
}
