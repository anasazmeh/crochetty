export const dynamic = "force-dynamic";

import { getProducts } from "@/lib/products";
import { ProductGrid } from "@/components/shop/ProductGrid";

export const metadata = {
  title: "Shop — Crochetty",
  description: "Browse our handcrafted crochet collection.",
};

export default async function ShopPage() {
  const productList = await getProducts();

  return (
    <div className="min-h-screen bg-background pt-32 pb-24">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h1 className="font-serif text-4xl md:text-5xl text-primary mb-4">The Collection</h1>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Each piece is handcrafted with ethically sourced yarn and slow intention.
          </p>
        </div>
        <ProductGrid products={productList} />
      </div>
    </div>
  );
}
