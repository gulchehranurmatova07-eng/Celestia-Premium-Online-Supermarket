import { db } from "@/lib/db";
import { CategoryManager } from "@/components/admin/CategoryManager";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  const categories = await db.category.findMany({
    orderBy: { sortOrder: "asc" },
    include: { _count: { select: { products: true } } },
  });

  const data = categories.map((c) => ({
    id: c.id,
    slug: c.slug,
    name: c.name,
    icon: c.icon,
    image: c.image,
    sortOrder: c.sortOrder,
    visible: c.visible,
    productCount: c._count.products,
  }));

  return (
    <div>
      <h1 className="mb-1 font-display text-2xl font-semibold text-navy-900">Kategoriyalar</h1>
      <p className="mb-6 text-sm text-navy-900/50">{categories.length} ta kategoriya</p>
      <CategoryManager initial={data} />
    </div>
  );
}
