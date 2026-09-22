import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { ProductForm } from "@/components/admin/ProductForm";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [product, categories] = await Promise.all([
    db.product.findUnique({ where: { id } }),
    db.category.findMany({ orderBy: { sortOrder: "asc" } }),
  ]);
  if (!product) notFound();

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-semibold text-navy-900">Mahsulotni tahrirlash</h1>
      <ProductForm
        categories={categories}
        initial={{
          id: product.id,
          sku: product.sku,
          name: product.name,
          brand: product.brand,
          categoryId: product.categoryId,
          description: product.description,
          ingredients: product.ingredients,
          nutrition: product.nutrition,
          weight: product.weight,
          price: product.price,
          oldPrice: product.oldPrice,
          stock: product.stock,
          rating: product.rating,
          isAvailable: product.isAvailable,
          isFeatured: product.isFeatured,
          image: product.image,
        }}
      />
    </div>
  );
}
