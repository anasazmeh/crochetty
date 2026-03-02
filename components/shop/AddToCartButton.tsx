"use client";

import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { getProductImageUrl } from "@/lib/storage";
import type { Product } from "@/lib/db/schema";

export function AddToCartButton({ product }: { product: Product }) {
  const { addItem } = useCart();

  const handleAdd = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: Number(product.price),
      image: getProductImageUrl(product.images?.[0] ?? ""),
      quantity: 1,
    });
  };

  return (
    <Button
      size="lg"
      className="rounded-full bg-primary hover:bg-primary-light text-white h-14 text-base w-full sm:w-auto px-10"
      onClick={handleAdd}
    >
      <ShoppingCart className="w-5 h-5 mr-2" />
      Add to Cart
    </Button>
  );
}
