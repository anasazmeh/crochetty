'use client';

import { ProductGrid } from "@/components/shop/ProductGrid";
import { Button } from "@/components/ui/Button";

import { useEffect, useState } from "react";
import { getProducts, Product } from "@/lib/api";

export default function ShopPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await getProducts();
                setProducts(data);
            } catch (error) {
                console.error("Failed to fetch products:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background pb-24">
            <section className="pt-32 pb-12 text-center px-6 bg-white">
                <h1 className="font-serif text-5xl text-primary mb-6">Shop Collection</h1>
                <div className="flex justify-center flex-wrap gap-4 text-sm font-medium tracking-widest uppercase">
                    <button className="text-primary border-b-2 border-primary pb-1">All</button>
                    <button className="text-gray-400 hover:text-primary transition-colors pb-1">Apparel</button>
                    <button className="text-gray-400 hover:text-primary transition-colors pb-1">Accessories</button>
                    <button className="text-gray-400 hover:text-primary transition-colors pb-1">Home</button>
                </div>
            </section>

            <div className="container mx-auto px-6 pt-12">
                <div className="mb-8 flex justify-end">
                    {/* Sort filter placeholder */}
                    <span className="text-sm text-gray-500">Showing {products.length} results</span>
                </div>
                <ProductGrid products={products} />
            </div>
        </div>
    );
}
