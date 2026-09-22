import type { Metadata } from "next";
import { Inter, Fraunces } from "next/font/google";
import { cookies } from "next/headers";
import "./globals.css";
import { LocaleProvider } from "@/i18n/LocaleProvider";
import { CartProvider } from "@/store/cart-provider";
import { ToastProvider } from "@/components/ui/Toast";
import type { Locale } from "@/i18n/dictionaries";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "cyrillic"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["opsz"],
});

export const metadata: Metadata = {
  title: "Celestia — Premium Online Supermarket",
  description: "Нужные продукты каждый день — в одном месте. Качественные продукты, удобные цены и быстрая доставка.",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const cookieStore = await cookies();
  const locale = (cookieStore.get("celestia_locale")?.value as Locale) || "ru";

  return (
    <html lang={locale} className={`${inter.variable} ${fraunces.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-cream-100 text-navy-900">
        <LocaleProvider initialLocale={locale}>
          <CartProvider>
            <ToastProvider>{children}</ToastProvider>
          </CartProvider>
        </LocaleProvider>
      </body>
    </html>
  );
}
