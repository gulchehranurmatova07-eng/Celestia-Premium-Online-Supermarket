import { notFound } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/db";
import { Price } from "@/components/ui/Price";
import { Stars } from "@/components/ui/Stars";
import { ProductActions } from "@/components/product/ProductActions";
import { ProductTabs } from "@/components/product/ProductTabs";
import { ProductCard } from "@/components/product/ProductCard";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

async function getProduct(id: string) {
  return db.product.findUnique({ where: { id }, include: { category: true } });
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const product = await getProduct(id);
  if (!product) return {};
  return { title: `${product.name} — Celestia`, description: product.description };
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getProduct(id);
  if (!product) notFound();

  const related = await db.product.findMany({
    where: { categoryId: product.categoryId, id: { not: product.id } },
    take: 4,
    orderBy: { ratingCount: "desc" },
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <nav className="mb-6 flex items-center gap-1.5 text-sm text-navy-900/50">
        <Link href="/" className="hover:text-navy-900">
          Главная
        </Link>
        <span>/</span>
        <Link href={`/category/${product.category.slug}`} className="hover:text-navy-900">
          {product.category.name}
        </Link>
        <span>/</span>
        <span className="text-navy-900">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        <div className="overflow-hidden rounded-3xl bg-cream-200">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={product.image} alt={product.name} className="aspect-square w-full object-cover" />
        </div>

        <div>
          <span className="text-xs font-semibold uppercase tracking-wide text-navy-900/45">{product.brand}</span>
          <h1 className="mt-1 font-display text-3xl font-semibold text-navy-900">{product.name}</h1>

          <div className="mt-3 flex items-center gap-3">
            <Stars rating={product.rating} size={16} />
            <span className="text-sm text-navy-900/55">
              {product.rating.toFixed(1)} · {product.ratingCount} {"отзывов"}
            </span>
          </div>

          <div className="mt-5 flex items-center gap-3">
            <Price price={product.price} oldPrice={product.oldPrice} size="lg" />
            {product.discount > 0 && (
              <span className="rounded-full bg-navy-900 px-2.5 py-1 text-xs font-semibold text-gold-400">
                −{product.discount}%
              </span>
            )}
          </div>

          <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-3 border-y border-navy-900/8 py-5 text-sm">
            <div>
              <dt className="text-navy-900/45">Вес</dt>
              <dd className="mt-0.5 font-medium text-navy-900">{product.weight}</dd>
            </div>
            <div>
              <dt className="text-navy-900/45">Категория</dt>
              <dd className="mt-0.5 font-medium text-navy-900">{product.category.name}</dd>
            </div>
            <div>
              <dt className="text-navy-900/45">Наличие</dt>
              <dd className="mt-0.5 font-medium">
                {product.stock <= 0 ? (
                  <span className="text-red-600">🔴 Нет в наличии</span>
                ) : product.stock <= 5 ? (
                  <span className="text-amber-600">🟡 Осталось {product.stock} шт</span>
                ) : (
                  <span className="text-emerald-600">🟢 В наличии</span>
                )}
              </dd>
            </div>
            <div>
              <dt className="text-navy-900/45">SKU</dt>
              <dd className="mt-0.5 font-medium text-navy-900">{product.sku}</dd>
            </div>
          </dl>

          <div className="mt-6">
            <ProductActions productId={product.id} stock={product.stock} isAvailable={product.isAvailable} />
          </div>

          <div className="mt-8">
            <ProductTabs description={product.description} ingredients={product.ingredients} nutrition={product.nutrition} />
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="mb-5 font-display text-2xl font-semibold text-navy-900">Похожие товары</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
