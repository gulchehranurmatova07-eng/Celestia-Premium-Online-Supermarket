"use client";

import { useEffect } from "react";
import { useCartStore } from "./cart";
import { useWishlistStore } from "./wishlist";

export function CartProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    useCartStore.persist.rehydrate();
    useWishlistStore.persist.rehydrate();
  }, []);

  return <>{children}</>;
}
