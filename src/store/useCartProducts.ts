"use client";

import { useEffect, useState } from "react";
import { useCartStore } from "./cart";

export type CartProduct = {
  id: string;
  name: string;
  brand: string;
  weight: string;
  price: number;
  oldPrice: number | null;
  image: string;
  stock: number;
  isAvailable: boolean;
};

export type CartLineWithProduct = { product: CartProduct; quantity: number };

export function useCartProducts() {
  const items = useCartStore((s) => s.items);
  const hasHydrated = useCartStore((s) => s.hasHydrated);
  const [products, setProducts] = useState<Record<string, CartProduct>>({});
  const [fetchedIds, setFetchedIds] = useState("");

  const ids = items.map((i) => i.productId).sort().join(",");

  useEffect(() => {
    if (!hasHydrated || !ids) return;
    fetch(`/api/cart-products?ids=${encodeURIComponent(ids)}`)
      .then((r) => r.json())
      .then((data) => {
        const map: Record<string, CartProduct> = {};
        for (const p of data.products) map[p.id] = p;
        setProducts(map);
        setFetchedIds(ids);
      });
  }, [ids, hasHydrated]);

  const lines: CartLineWithProduct[] = items
    .filter((i) => products[i.productId])
    .map((i) => ({ product: products[i.productId], quantity: i.quantity }));

  const subtotal = lines.reduce((sum, l) => sum + l.product.price * l.quantity, 0);
  const loading = !hasHydrated || (ids !== "" && fetchedIds !== ids);

  return { lines, subtotal, loading, hasHydrated };
}
