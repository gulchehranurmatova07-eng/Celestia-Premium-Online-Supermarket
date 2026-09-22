export type ProductCardData = {
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
  categorySlug?: string;
  categoryName?: string;
};
