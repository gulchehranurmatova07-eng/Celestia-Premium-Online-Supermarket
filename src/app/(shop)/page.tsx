import { db } from "@/lib/db";
import { Hero } from "@/components/home/Hero";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { ProductSection } from "@/components/home/ProductSection";
import type { ProductCardData } from "@/types";

export const dynamic = "force-dynamic";

function toCard(p: {
  id: string;
  name: string;
  brand: string;
  weight: string;
  price: number;
  oldPrice: number | null;
  discount: number;
  rating: number;
  ratingCount: number;
  image: string;
  stock: number;
  isAvailable: boolean;
}): ProductCardData {
  return { ...p };
}

export default async function HomePage() {
  const [categories, popular, newArrivals, offers] = await Promise.all([
    db.category.findMany({ where: { visible: true }, orderBy: { sortOrder: "asc" }, include: { _count: { select: { products: true } } } }),
    db.product.findMany({ where: { isFeatured: true }, take: 8, orderBy: { ratingCount: "desc" } }),
    db.product.findMany({ orderBy: { createdAt: "desc" }, take: 8 }),
    db.product.findMany({ where: { discount: { gt: 0 } }, orderBy: { discount: "desc" }, take: 8 }),
  ]);

  const cats = categories.map((c) => ({ slug: c.slug, name: c.name, icon: c.icon, count: c._count.products }));

  return (
    <>
      <Hero />
      <CategoryGrid categories={cats} />
      <ProductSection titleKey="section.popular" products={popular.map(toCard)} viewAllHref="/search?sort=popular" />
      <ProductSection titleKey="section.offers" products={offers.map(toCard)} viewAllHref="/search?discount=1" tint />
      <ProductSection titleKey="section.newArrivals" products={newArrivals.map(toCard)} viewAllHref="/search?sort=newest" />
    </>
  );
}
