'use client';

import { ProductGrid } from "@/components/shop/ProductGrid";
import { Button } from "@/components/ui/Button";

// Expanded Mock Data
const products = [
    {
        id: "1",
        name: "Heritage Cardigan",
        price: 185.00,
        category: "Apparel",
        image: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=800&auto=format&fit=crop",
        slug: "heritage-cardigan"
    },
    {
        id: "2",
        name: "Sienna Bucket Bag",
        price: 75.00,
        category: "Accessories",
        image: "https://images.unsplash.com/photo-1590874103328-3165b6f3c4ec?q=80&w=800&auto=format&fit=crop",
        slug: "sienna-bucket-bag"
    },
    {
        id: "3",
        name: "Lunar Scallop Bralette",
        price: 55.00,
        category: "Apparel",
        image: "https://images.unsplash.com/photo-1608235677677-9477e347494a?q=80&w=800&auto=format&fit=crop",
        slug: "lunar-scallop-bralette"
    },
    {
        id: "4",
        name: "\"Slow Morning\" Throw",
        price: 240.00,
        category: "Home",
        image: "https://images.unsplash.com/photo-1596483253245-c4b37014605e?q=80&w=800&auto=format&fit=crop",
        slug: "slow-morning-throw"
    },
    // Extra mock items
    {
        id: "5",
        name: "Oatmeal Knit Beanie",
        price: 45.00,
        category: "Accessories",
        image: "https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?q=80&w=800&auto=format&fit=crop",
        slug: "oatmeal-knit-beanie"
    },
    {
        id: "6",
        name: "Cotton Mesh Market Bag",
        price: 35.00,
        category: "Accessories",
        image: "https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=800&auto=format&fit=crop",
        slug: "cotton-mesh-market-bag"
    }
];

export default function ShopPage() {
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
