import { SimplePage } from "@/components/layout/SimplePage";

const FAQS = [
  { q: "Как отменить заказ?", a: "Если заказ находится в статусе «Новый», «Подтверждён» или «Готовится», вы можете отменить его в разделе «Мои заказы»." },
  { q: "Как вернуть деньги за оплату?", a: "Для отменённых и предоплаченных заказов средства возвращаются через соответствующую платёжную систему." },
  { q: "Сколько времени занимает доставка?", a: "Стандартная доставка занимает 30–90 минут, экспресс-доставка — 15–30 минут." },
  { q: "Что делать, если я недоволен качеством товара?", a: "Обратитесь в службу поддержки клиентов в течение 24 часов с момента доставки заказа." },
];

export default function FaqPage() {
  return (
    <SimplePage title="Вопросы и ответы">
      <div id="returns" className="space-y-5">
        {FAQS.map((f) => (
          <div key={f.q} className="rounded-2xl border border-navy-900/8 bg-white p-5">
            <h3 className="font-medium text-navy-900">{f.q}</h3>
            <p className="mt-1.5 text-sm text-navy-900/60">{f.a}</p>
          </div>
        ))}
      </div>
    </SimplePage>
  );
}
