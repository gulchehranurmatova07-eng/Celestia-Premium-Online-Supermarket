import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { searchProducts, type ProductSort } from "@/lib/data";
import { SearchResults } from "../../search/SearchResults";

export const dynamic = "force-dynamic";

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { slug } = await params;
  const sp = await searchParams;
  const get = (k: string) => (Array.isArray(sp[k]) ? sp[k]?.[0] : sp[k]);

  const category = await db.category.findUnique({ where: { slug } });
  if (!category) notFound();

  const sort = (get("sort") as ProductSort) ?? "popular";
  const page = Number(get("page") ?? "1") || 1;

  const result = await searchProducts({
    category: slug,
    brand: get("brand") || undefined,
    minPrice: get("minPrice") ? Number(get("minPrice")) : undefined,
    maxPrice: get("maxPrice") ? Number(get("maxPrice")) : undefined,
    discount: get("discount") === "1",
    minRating: get("minRating") ? Number(get("minRating")) : undefined,
    availableOnly: get("available") === "1",
    sort,
    page,
  });

  const currentParams: Record<string, string> = {};
  for (const [k, v] of Object.entries(sp)) {
    if (v && k !== "page") currentParams[k] = Array.isArray(v) ? v[0] : v;
  }

  return (
    <SearchResults
      products={result.products}
      total={result.total}
      page={result.page}
      pageCount={result.pageCount}
      brands={result.brands}
      priceRange={result.priceRange}
      heading={`${category.icon} ${category.name}`}
      basePath={`/category/${slug}`}
      currentParams={currentParams}
    />
  );
}
