import { SimplePage } from "@/components/layout/SimplePage";

export default function ContactPage() {
  return (
    <SimplePage title="Контакты">
      <p>Если у вас есть вопросы или предложения, свяжитесь с нами любым удобным способом:</p>
      <ul className="list-disc space-y-2 pl-5">
        <li>Телефон: +998 71 200 00 00</li>
        <li>Email: hello@celestia.uz</li>
        <li>Адрес: г. Ташкент, Юнусабадский район, ул. Амира Темура, 108</li>
        <li>Часы работы: ежедневно 08:00–23:00</li>
      </ul>
    </SimplePage>
  );
}
