import { getCategories } from "@/lib/data";
import { getCustomerSession } from "@/lib/auth";
import { HeaderClient } from "./HeaderClient";

export async function Header() {
  const [categories, session] = await Promise.all([getCategories(), getCustomerSession()]);

  const cats = categories.map((c) => ({ slug: c.slug, name: c.name, icon: c.icon }));

  return <HeaderClient categories={cats} customerName={session?.name ?? null} />;
}
