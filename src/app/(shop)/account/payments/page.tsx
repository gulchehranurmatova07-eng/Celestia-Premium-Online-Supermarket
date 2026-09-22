const METHODS = [
  { icon: "💵", name: "Наличные", desc: "Оплата курьеру при доставке заказа" },
  { icon: "💳", name: "Банковская карта", desc: "Безопасная онлайн-оплата — данные карты не сохраняются" },
  { icon: "📱", name: "Click", desc: "Быстрая оплата через приложение Click" },
  { icon: "🟢", name: "Payme", desc: "Быстрая оплата через приложение Payme" },
  { icon: "🟣", name: "Uzum Bank", desc: "Оплата через Uzum Bank" },
];

export default function PaymentsPage() {
  return (
    <div>
      <h1 className="mb-5 font-display text-2xl font-semibold text-navy-900">Способы оплаты</h1>
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
        Celestia никогда не хранит номер карты, CVV или PIN-код. Все онлайн-платежи выполняются безопасно
        через официальные API соответствующих платёжных систем.
      </p>
    </div>
  );
}
