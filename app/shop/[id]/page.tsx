import { notFound } from "next/navigation";
import Image from "next/image";
import { ArrowLeft, ShieldCheck, Truck } from "lucide-react";
import Link from "next/link";
import { getProductById } from "@/lib/products";
import { getProductImageUrl } from "@/lib/storage";
import { AddToCartButton } from "@/components/shop/AddToCartButton";
import { Badge } from "@/components/ui/badge";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const product = await getProductById(id);
  if (!product) return {};
  return {
    title: `${product.name} — Crochetty`,
    description: product.description ?? undefined,
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { id } = await params;
  const product = await getProductById(id);
  if (!product) notFound();

  const images = product.images ?? [];
  const primaryImage = getProductImageUrl(images[0] ?? "");

  return (
    <div className="min-h-screen bg-background pt-32 pb-24">
      <div className="container mx-auto px-6">
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-12 text-sm font-medium group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          BACK TO COLLECTION
        </Link>

        <div className="grid lg:grid-cols-2 gap-16">
          {/* Images */}
          <div className="space-y-4">
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-muted shadow-sm">
              <Image
                src={primaryImage}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
            </div>
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {images.map((img, i) => (
                  <div
                    key={i}
                    className="relative aspect-square rounded-lg overflow-hidden bg-muted"
                  >
                    <Image
                      src={getProductImageUrl(img)}
                      alt={`${product.name} ${i + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="flex flex-col">
            <Badge className="w-fit mb-4 bg-primary/10 text-primary border-0">
              Handcrafted
            </Badge>
            <h1 className="font-serif text-4xl md:text-5xl text-primary mb-4 leading-tight">
              {product.name}
            </h1>
            <p className="text-3xl font-bold text-primary mb-6">
              €{Number(product.price).toFixed(2)}
            </p>
            {product.description && (
              <p className="text-muted-foreground leading-relaxed mb-8 text-lg italic">
                &ldquo;{product.description}&rdquo;
              </p>
            )}

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <AddToCartButton product={product} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-8 border-t border-border">
              <div className="flex gap-3">
                <ShieldCheck className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-primary">Authentic Quality</p>
                  <p className="text-xs text-muted-foreground">Premium, sustainably sourced yarn</p>
                </div>
              </div>
              <div className="flex gap-3">
                <Truck className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-primary">Mindful Shipping</p>
                  <p className="text-xs text-muted-foreground">Eco-conscious packaging</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
