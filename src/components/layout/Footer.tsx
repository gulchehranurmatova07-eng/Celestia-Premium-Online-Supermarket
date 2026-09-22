import Link from "next/link";
import { Logo } from "@/components/brand/Logo";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-navy-900/8 bg-navy-900 text-white/80">
      <div className="mx-auto max-w-7xl px-6 py-14">
        <div className="grid grid-cols-2 gap-10 sm:grid-cols-2 lg:grid-cols-5">
          <div className="col-span-2">
            <Logo markClassName="h-9 w-9" showTagline className="[&_span]:text-white [&_span:last-child]:text-gold-400" />
            <p className="mt-4 max-w-xs text-sm text-white/60">Нужные продукты каждый день — в одном месте.</p>
            <div className="mt-5 flex items-center gap-3">
              {["Instagram", "Telegram", "Facebook"].map((s) => (
                <a
                  key={s}
                  href="#"
                  aria-label={s}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-xs font-semibold text-white/70 transition hover:border-gold-400 hover:text-gold-400"
                >
                  {s[0]}
                </a>
              ))}
            </div>
          </div>

          <FooterCol
            title="Компания"
            links={[
              { label: "О нас", href: "/about" },
              { label: "Контакты", href: "/contact" },
              { label: "Карьера", href: "/careers" },
            ]}
          />
          <FooterCol
            title="Клиентам"
            links={[
              { label: "Доставка", href: "/delivery-info" },
              { label: "Оплата", href: "/delivery-info#payment" },
              { label: "Вопросы и ответы", href: "/faq" },
              { label: "Возврат", href: "/faq#returns" },
            ]}
          />
          <FooterCol
            title="Категории"
            links={[
              { label: "Бакалея", href: "/category/oziq-ovqat" },
              { label: "Напитки", href: "/category/ichimliklar" },
              { label: "Молочные продукты", href: "/category/sut-mahsulotlari" },
              { label: "Хозтовары", href: "/category/maishiy" },
            ]}
          />
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-white/10 pt-6 text-sm text-white/50 sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} Celestia. Все права защищены.</span>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <span>+998 71 200 00 00</span>
            <span>hello@celestia.uz</span>
            <span>Ташкент, Юнусабадский район, ул. Амира Темура, 108</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <h4 className="text-sm font-semibold uppercase tracking-wide text-gold-400">{title}</h4>
      <ul className="mt-4 flex flex-col gap-2.5 text-sm">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="text-white/65 transition hover:text-white">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
