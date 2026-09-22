import { db } from "@/lib/db";

export async function getCategories() {
  return db.category.findMany({
    where: { visible: true },
    orderBy: { sortOrder: "asc" },
    include: { _count: { select: { products: true } } },
  });
}

export async function getSettings() {
  const settings = await db.settings.findUnique({ where: { id: "settings" } });
  if (settings) return settings;
  return db.settings.create({ data: { id: "settings" } });
}

export async function getDeliveryZones() {
  return db.deliveryZone.findMany({ orderBy: { sortOrder: "asc" } });
}

export async function getPickupLocations() {
  return db.pickupLocation.findMany({ where: { isActive: true } });
}

export function stockBadge(stock: number): { label: string; tone: "in" | "low" | "out" } {
  if (stock <= 0) return { label: "out", tone: "out" };
  if (stock <= 5) return { label: "low", tone: "low" };
  return { label: "in", tone: "in" };
}

export type ProductSort = "popular" | "cheapest" | "expensive" | "rating" | "newest" | "discount";

export type ProductQuery = {
  q?: string;
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  discount?: boolean;
  minRating?: number;
  availableOnly?: boolean;
  sort?: ProductSort;
  page?: number;
  perPage?: number;
};

const SORT_MAP = {
  popular: { ratingCount: "desc" },
  cheapest: { price: "asc" },
  expensive: { price: "desc" },
  rating: { rating: "desc" },
  newest: { createdAt: "desc" },
  discount: { discount: "desc" },
} satisfies Record<ProductSort, Record<string, "asc" | "desc">>;

export async function searchProducts(query: ProductQuery) {
  const page = Math.max(1, query.page ?? 1);
  const perPage = query.perPage ?? 12;

  const where: NonNullable<Parameters<typeof db.product.findMany>[0]>["where"] = {
    AND: [
      query.q
        ? {
            OR: [
              { name: { contains: query.q } },
              { brand: { contains: query.q } },
              { description: { contains: query.q } },
            ],
          }
        : {},
      query.category ? { category: { slug: query.category } } : {},
      query.brand ? { brand: query.brand } : {},
      query.minPrice != null ? { price: { gte: query.minPrice } } : {},
      query.maxPrice != null ? { price: { lte: query.maxPrice } } : {},
      query.discount ? { discount: { gt: 0 } } : {},
      query.minRating != null ? { rating: { gte: query.minRating } } : {},
      query.availableOnly ? { isAvailable: true, stock: { gt: 0 } } : {},
    ],
  };

  const [products, total, brandsRaw, priceAgg] = await Promise.all([
    db.product.findMany({
      where,
      orderBy: SORT_MAP[query.sort ?? "popular"],
      skip: (page - 1) * perPage,
      take: perPage,
      include: { category: true },
    }),
    db.product.count({ where }),
    db.product.findMany({
      where: query.category ? { category: { slug: query.category } } : {},
      select: { brand: true },
      distinct: ["brand"],
    }),
    db.product.aggregate({ _max: { price: true }, _min: { price: true } }),
  ]);

  return {
    products,
    total,
    page,
    perPage,
    pageCount: Math.max(1, Math.ceil(total / perPage)),
    brands: brandsRaw.map((b) => b.brand).sort(),
    priceRange: { min: priceAgg._min.price ?? 0, max: priceAgg._max.price ?? 200000 },
  };
}
