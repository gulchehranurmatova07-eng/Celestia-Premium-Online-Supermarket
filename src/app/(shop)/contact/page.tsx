import { SimplePage } from "@/components/layout/SimplePage";

export default function ContactPage() {
  return (
    <SimplePage title="Aloqa">
      <p>Savol va takliflaringiz bo‘lsa, quyidagi aloqa vositalari orqali biz bilan bog‘laning:</p>
      <ul className="list-disc space-y-2 pl-5">
        <li>Telefon: +998 71 200 00 00</li>
        <li>Email: hello@celestia.uz</li>
        <li>Manzil: Toshkent shahri, Yunusobod tumani, Amir Temur ko‘chasi 108</li>
        <li>Ish vaqti: har kuni 08:00–23:00</li>
      </ul>
    </SimplePage>
  );
}
