'use client';

import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { ProductGrid } from "@/components/shop/ProductGrid";
import Link from "next/link";

import { useEffect, useState } from "react";
import { getFeaturedProducts, Product } from "@/lib/api";

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const data = await getFeaturedProducts();
        setFeaturedProducts(data);
      } catch (error) {
        console.error("Failed to fetch featured products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center bg-[#F4F1EA] overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20">
          {/* Texture overlay or background image could go here */}
          <div className="w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')]"></div>
        </div>

        <div className="container relative z-10 px-6 text-center">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-primary/80 uppercase tracking-[0.2em] mb-4 text-sm font-medium"
          >
            Slow Luxury · Handcrafted
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-serif text-5xl md:text-7xl lg:text-8xl text-primary mb-8 leading-tight"
          >
            The Art of <br /> the Stitch.
          </motion.h1>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Link href="/shop">
              <Button size="lg" className="rounded-full px-10">
                Shop Collection
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl md:text-4xl text-primary mb-4">Curated Collection</h2>
            <p className="text-gray-500 max-w-lg mx-auto">
              Timeless pieces designed for elegance and comfort. Each item is unique, reflecting the dedication of our artisans.
            </p>
          </div>
          <ProductGrid products={featuredProducts} />

          <div className="text-center mt-16">
            <Link href="/shop">
              <Button variant="outline" size="lg" className="rounded-full px-10">
                View All Products
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Brand Story / Values Teaser */}
      <section className="py-24 bg-primary text-white relative overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-serif text-3xl md:text-5xl mb-6">Sustainable & <br /> Soulful.</h2>
              <p className="text-white/80 leading-relaxed mb-8 max-w-md">
                We believe in the beauty of slowness. Our materials are ethically sourced, and our process honors the tradition of needlework. No mass production, just pure intention.
              </p>
              <Link href="/about">
                <Button variant="secondary" className="rounded-full">
                  Read Our Story
                </Button>
              </Link>
            </div>
            <div className="relative h-[500px] w-full bg-white/5 rounded-lg overflow-hidden">
              {/* Abstract image or video placeholder */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
