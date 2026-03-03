'use client';

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ProductGrid } from "@/components/shop/ProductGrid";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import type { Product } from "@/lib/db/schema";
import { ArrowRight, Star, Leaf, Package, MessageCircle } from "lucide-react";

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await fetch("/api/products/featured");
        if (!res.ok) throw new Error(`API error ${res.status}`);
        const data = await res.json();
        setFeaturedProducts(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to fetch featured products:", error);
        setFeaturedProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">

      {/* ── Hero ── */}
      <section className="relative bg-[#F7F5F1] overflow-hidden min-h-[88vh] flex flex-col justify-center">

        {/* Subtle grid texture */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg,transparent,transparent 28px,#1B5C32 28px,#1B5C32 29px),repeating-linear-gradient(90deg,transparent,transparent 28px,#1B5C32 28px,#1B5C32 29px)",
          }}
        />

        {/* Decorative circle — right, clipped */}
        <div
          aria-hidden
          className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/3 w-[560px] h-[560px] rounded-full border border-primary/10"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-[400px] h-[400px] rounded-full border border-primary/8"
        />

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-2xl">

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-primary/60 uppercase tracking-[0.25em] text-xs font-medium mb-6"
            >
              Slow Luxury · Handcrafted in Belgium
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="font-serif text-5xl sm:text-6xl md:text-7xl text-primary leading-[1.05] mb-8"
            >
              The Art of <br />
              <em className="not-italic text-primary-light">the Stitch.</em>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-foreground/60 text-base sm:text-lg leading-relaxed mb-10 max-w-lg"
            >
              Each piece carries the warmth of hands, the patience of craft,
              and the intention of love. No mass production — just pure, slow luxury.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap gap-4 items-center"
            >
              <Link href="/shop">
                <Button
                  size="lg"
                  className="rounded-full px-8 bg-primary text-white hover:bg-primary-dark shadow-sm transition-colors cursor-pointer"
                >
                  Shop Collection
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              <Link href="/custom">
                <Button
                  variant="ghost"
                  size="lg"
                  className="rounded-full px-8 text-primary hover:bg-primary/8 transition-colors cursor-pointer"
                >
                  Custom Order
                </Button>
              </Link>
            </motion.div>

            {/* Social proof */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex items-center gap-5 mt-14"
            >
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-9 h-9 rounded-full bg-accent-cream border-2 border-[#F7F5F1] flex items-center justify-center text-primary text-xs font-bold"
                  >
                    {i}
                  </div>
                ))}
              </div>
              <div>
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className="w-3.5 h-3.5 fill-accent-gold text-accent-gold" />
                  ))}
                </div>
                <p className="text-xs text-foreground/50 mt-0.5">Loved by 200+ happy customers</p>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ── Trust bar ── */}
      <section className="bg-primary text-white py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-14 text-sm">
            {[
              { icon: Leaf, text: "Ethically sourced yarn" },
              { icon: Package, text: "Handpacked with care" },
              { icon: MessageCircle, text: "Custom orders welcome" },
              { icon: Star, text: "5-star rated pieces" },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-2 opacity-90">
                <Icon className="w-4 h-4 text-accent-gold shrink-0" />
                <span className="tracking-wide text-sm">{text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Products ── */}
      <section className="py-20 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
            <div>
              <p className="text-primary/50 uppercase tracking-[0.2em] text-xs mb-3">
                Curated Selection
              </p>
              <h2 className="font-serif text-3xl md:text-4xl text-primary">Featured Pieces</h2>
            </div>
            <Link
              href="/shop"
              className="text-primary/60 hover:text-primary text-sm font-medium flex items-center gap-1 transition-colors cursor-pointer"
            >
              View all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-square bg-muted rounded-2xl mb-4" />
                  <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                  <div className="h-3 bg-muted rounded w-1/3" />
                </div>
              ))}
            </div>
          ) : (
            <ProductGrid products={featuredProducts} />
          )}

          <div className="text-center mt-14">
            <Link href="/shop">
              <Button
                variant="outline"
                size="lg"
                className="rounded-full px-10 border-primary text-primary hover:bg-primary hover:text-white transition-all duration-200 cursor-pointer"
              >
                Explore Full Collection
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Brand Story ── */}
      <section className="py-20 sm:py-24 bg-[#F7F5F1]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

            {/* Logo card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <div className="bg-accent-cream/60 rounded-3xl p-10 sm:p-14 flex items-center justify-center">
                <Image
                  src="/images/logo-landscape.png"
                  alt="Crochetty — handcrafted crochet boutique"
                  width={480}
                  height={224}
                  className="object-contain w-full max-w-[400px] drop-shadow-lg"
                />
              </div>
            </motion.div>

            {/* Copy */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1 }}
            >
              <p className="text-primary/50 uppercase tracking-[0.25em] text-xs mb-4">Our Story</p>
              <h2 className="font-serif text-3xl md:text-5xl text-primary mb-6 leading-tight">
                Sustainable &<br /> Soulful.
              </h2>
              <p className="text-foreground/60 leading-relaxed mb-5 text-base">
                We believe in the beauty of slowness. Every piece begins with
                ethically sourced yarn, shaped by patient hands, and finished
                with care that no machine can replicate.
              </p>
              <p className="text-foreground/60 leading-relaxed mb-10 text-base">
                No mass production. No shortcuts. Just pure intention and the
                timeless tradition of needlework — made for people who value
                the extraordinary in the everyday.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="/about">
                  <Button className="rounded-full px-8 bg-primary text-white hover:bg-primary-dark transition-colors cursor-pointer">
                    Read Our Story
                  </Button>
                </Link>
                <Link href="/custom">
                  <Button
                    variant="outline"
                    className="rounded-full px-8 border-primary/30 text-primary hover:bg-primary/5 transition-colors cursor-pointer"
                  >
                    Commission a Piece
                  </Button>
                </Link>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ── Newsletter CTA ── */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="bg-primary rounded-3xl px-8 py-14 sm:px-16 text-white text-center max-w-2xl mx-auto"
          >
            <p className="text-white/50 uppercase tracking-[0.2em] text-xs mb-4">Stay Connected</p>
            <h2 className="font-serif text-3xl md:text-4xl mb-4">Join the Crochetty Family</h2>
            <p className="text-white/70 mb-8 leading-relaxed text-sm sm:text-base">
              New arrivals, exclusive offers, and behind-the-scenes stories —
              straight to your inbox.
            </p>
            <form
              className="flex flex-col sm:flex-row gap-3 max-w-sm mx-auto"
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                type="email"
                placeholder="Your email address"
                aria-label="Email for newsletter"
                className="flex-1 px-5 py-3 rounded-full bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-accent-gold/60 text-sm"
              />
              <Button
                type="submit"
                className="rounded-full px-7 bg-accent-gold text-foreground font-medium hover:bg-[#b8912a] transition-colors shrink-0 cursor-pointer"
              >
                Subscribe
              </Button>
            </form>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
