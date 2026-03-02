import Image from "next/image";
import Link from "next/link";
import { getProductImageUrl } from "@/lib/storage";
import { Badge } from "@/components/ui/badge";
import type { Product } from "@/lib/db/schema";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const imageUrl = getProductImageUrl(product.images?.[0] ?? "");

  return (
    <Link href={`/shop/${product.id}`} className="group block">
      <div className="relative aspect-square overflow-hidden rounded-xl bg-muted mb-4">
        <Image
          src={imageUrl}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
        {product.featured && (
          <Badge className="absolute top-3 left-3 bg-accent-gold text-foreground border-0 text-xs">
            Featured
          </Badge>
        )}
      </div>
      <div>
        <h3 className="font-serif text-lg text-primary group-hover:text-primary-light transition-colors leading-tight">
          {product.name}
        </h3>
        <p className="text-muted-foreground text-sm mt-1">
          €{Number(product.price).toFixed(2)}
        </p>
      </div>
    </Link>
  );
}
