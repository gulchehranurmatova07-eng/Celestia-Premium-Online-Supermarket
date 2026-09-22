import { db } from "@/lib/db";
import { ProductForm } from "@/components/admin/ProductForm";

export default async function NewProductPage() {
  const categories = await db.category.findMany({ orderBy: { sortOrder: "asc" } });

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-semibold text-navy-900">Yangi mahsulot qo‘shish</h1>
      <ProductForm categories={categories} />
    </div>
  );
}
