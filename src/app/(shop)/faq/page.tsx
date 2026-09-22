import { SimplePage } from "@/components/layout/SimplePage";

const FAQS = [
  { q: "Buyurtmani qanday bekor qilaman?", a: "Buyurtma \"Yangi\", \"Qabul qilindi\" yoki \"Tayyorlanmoqda\" holatida bo‘lsa, \"Buyurtmalarim\" bo‘limidan bekor qilishingiz mumkin." },
  { q: "To‘lovni qanday qaytarib olaman?", a: "Bekor qilingan va oldindan to‘langan buyurtmalar uchun mablag‘ tegishli to‘lov tizimi orqali qaytariladi." },
  { q: "Yetkazib berish qancha vaqt oladi?", a: "Standart yetkazib berish 30–90 daqiqa, tezkor yetkazib berish 15–30 daqiqa ichida amalga oshiriladi." },
  { q: "Mahsulot sifatidan norozi bo‘lsam nima qilaman?", a: "Buyurtma yetkazilgan kundan boshlab 24 soat ichida mijozlarga xizmat ko‘rsatish bo‘limiga murojaat qiling." },
];

export default function FaqPage() {
  return (
    <SimplePage title="Savol-javob">
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
