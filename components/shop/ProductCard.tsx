"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { getProductImageUrl } from "@/lib/storage";
import type { Product } from "@/lib/db/schema";
import { ShoppingCart, Heart } from "lucide-react";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const imageUrl = getProductImageUrl(product.images?.[0] ?? "");

  return (
    <Link href={`/shop/${product.id}`} className="group block cursor-pointer">
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-muted mb-4">
        <Image
          src={imageUrl}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-[1.07]"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />

        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors duration-300" />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.featured && (
            <span className="bg-accent-gold text-foreground text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full">
              Featured
            </span>
          )}
        </div>

        {/* Quick actions */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-300">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={(e) => e.preventDefault()}
            aria-label="Add to wishlist"
            className="w-9 h-9 bg-white/90 rounded-full flex items-center justify-center text-foreground/60 hover:text-primary shadow-sm cursor-pointer transition-colors"
          >
            <Heart className="w-4 h-4" />
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={(e) => e.preventDefault()}
            aria-label="Quick add to bag"
            className="w-9 h-9 bg-primary rounded-full flex items-center justify-center text-white shadow-sm hover:bg-primary-dark cursor-pointer transition-colors"
          >
            <ShoppingCart className="w-4 h-4" />
          </motion.button>
        </div>
      </div>

      {/* Info */}
      <div>
        <h3 className="font-serif text-base text-primary group-hover:text-primary-light transition-colors duration-200 leading-snug">
          {product.name}
        </h3>
        <div className="flex items-center justify-between mt-1.5">
          <p className="text-foreground/80 font-medium text-sm">
            €{Number(product.price).toFixed(2)}
          </p>
          {product.stock != null && product.stock <= 3 && product.stock > 0 && (
            <span className="text-[10px] text-amber-600 font-medium uppercase tracking-wide">
              Only {product.stock} left
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
