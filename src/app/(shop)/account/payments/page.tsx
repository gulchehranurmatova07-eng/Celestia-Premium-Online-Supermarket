const METHODS = [
  { icon: "💵", name: "Naqd pul", desc: "Kuryerga buyurtma yetkazilganda naqd to‘lov" },
  { icon: "💳", name: "Bank karta", desc: "Xavfsiz onlayn to‘lov — karta ma’lumotlari saqlanmaydi" },
  { icon: "📱", name: "Click", desc: "Click ilovasi orqali tezkor to‘lov" },
  { icon: "🟢", name: "Payme", desc: "Payme ilovasi orqali tezkor to‘lov" },
  { icon: "🟣", name: "Uzum Bank", desc: "Uzum Bank orqali to‘lov" },
];

export default function PaymentsPage() {
  return (
    <div>
      <h1 className="mb-5 font-display text-2xl font-semibold text-navy-900">To‘lov usullari</h1>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {METHODS.map((m) => (
          <div key={m.name} className="flex items-start gap-3 rounded-2xl border border-navy-900/8 bg-white p-5">
            <span className="text-2xl">{m.icon}</span>
            <div>
              <div className="font-medium text-navy-900">{m.name}</div>
              <div className="mt-0.5 text-sm text-navy-900/55">{m.desc}</div>
            </div>
          </div>
        ))}
      </div>
      <p className="mt-5 rounded-xl bg-cream-200 px-4 py-3 text-xs text-navy-900/50">
        Celestia karta raqami, CVV yoki PIN kodini hech qachon saqlamaydi. Barcha onlayn to‘lovlar tegishli
        to‘lov tizimlarining rasmiy API’lari orqali xavfsiz amalga oshiriladi.
      </p>
    </div>
  );
}
