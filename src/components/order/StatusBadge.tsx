const ORDER_TONE: Record<string, string> = {
  NEW: "bg-navy-900/10 text-navy-900",
  CONFIRMED: "bg-blue-100 text-blue-700",
  PREPARING: "bg-amber-100 text-amber-700",
  READY: "bg-amber-100 text-amber-700",
  OUT_FOR_DELIVERY: "bg-indigo-100 text-indigo-700",
  READY_FOR_PICKUP: "bg-indigo-100 text-indigo-700",
  DELIVERED: "bg-emerald-100 text-emerald-700",
  PICKED_UP: "bg-emerald-100 text-emerald-700",
  CANCELLED: "bg-red-100 text-red-700",
};

const PAYMENT_TONE: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-700",
  PAID: "bg-emerald-100 text-emerald-700",
  FAILED: "bg-red-100 text-red-700",
  REFUND_PENDING: "bg-amber-100 text-amber-700",
  REFUNDED: "bg-navy-900/10 text-navy-900",
  CANCELLED: "bg-red-100 text-red-700",
};

const ORDER_LABELS: Record<string, string> = {
  NEW: "Yangi",
  CONFIRMED: "Qabul qilindi",
  PREPARING: "Tayyorlanmoqda",
  READY: "Tayyor",
  OUT_FOR_DELIVERY: "Yetkazilmoqda",
  READY_FOR_PICKUP: "Olib ketishga tayyor",
  DELIVERED: "Yetkazildi",
  PICKED_UP: "Olib ketildi",
  CANCELLED: "Bekor qilindi",
};

const PAYMENT_LABELS: Record<string, string> = {
  PENDING: "Kutilmoqda",
  PAID: "To‘langan",
  FAILED: "Muvaffaqiyatsiz",
  REFUND_PENDING: "Qaytarish kutilmoqda",
  REFUNDED: "Qaytarildi",
  CANCELLED: "Bekor qilindi",
};

export function OrderStatusBadge({ status }: { status: string }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${ORDER_TONE[status] ?? "bg-navy-900/10 text-navy-900"}`}>
      {ORDER_LABELS[status] ?? status}
    </span>
  );
}

export function PaymentStatusBadge({ status }: { status: string }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${PAYMENT_TONE[status] ?? "bg-navy-900/10 text-navy-900"}`}>
      {PAYMENT_LABELS[status] ?? status}
    </span>
  );
}
