const DELIVERY_STEPS = ["NEW", "CONFIRMED", "PREPARING", "READY", "OUT_FOR_DELIVERY", "DELIVERED"];
const PICKUP_STEPS = ["NEW", "CONFIRMED", "PREPARING", "READY_FOR_PICKUP", "PICKED_UP"];

const LABELS: Record<string, string> = {
  NEW: "Buyurtma qabul qilindi",
  CONFIRMED: "Tasdiqlandi",
  PREPARING: "Tayyorlanmoqda",
  READY: "Tayyor",
  OUT_FOR_DELIVERY: "Yetkazilmoqda",
  DELIVERED: "Yetkazildi",
  READY_FOR_PICKUP: "Olib ketishga tayyor",
  PICKED_UP: "Olib ketildi",
};

export function OrderTracker({ status, isPickup }: { status: string; isPickup: boolean }) {
  if (status === "CANCELLED") {
    return (
      <div className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600">Buyurtma bekor qilindi</div>
    );
  }

  const steps = isPickup ? PICKUP_STEPS : DELIVERY_STEPS;
  const currentIndex = Math.max(0, steps.indexOf(status));

  return (
    <div className="flex items-center overflow-x-auto pb-2">
      {steps.map((step, i) => (
        <div key={step} className="flex shrink-0 items-center">
          <div className="flex flex-col items-center gap-1.5">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
                i <= currentIndex ? "bg-navy-900 text-gold-400" : "bg-navy-900/10 text-navy-900/30"
              }`}
            >
              {i <= currentIndex ? "✓" : i + 1}
            </div>
            <span className={`w-20 text-center text-[11px] leading-tight ${i <= currentIndex ? "text-navy-900" : "text-navy-900/40"}`}>
              {LABELS[step]}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div className={`h-0.5 w-8 sm:w-14 ${i < currentIndex ? "bg-navy-900" : "bg-navy-900/10"}`} />
          )}
        </div>
      ))}
    </div>
  );
}
