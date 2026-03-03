'use client';

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ProductGrid } from "@/components/shop/ProductGrid";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import type { Product } from "@/lib/db/schema";
import { ArrowRight, Star, Leaf, Package, MessageCircle } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.15, ease: "easeOut" as const },
  }),
};

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
      <section className="relative min-h-[90vh] flex items-center bg-[#F7F5F1] overflow-hidden">
        {/* Subtle linen texture */}
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `repeating-linear-gradient(
              0deg, transparent, transparent 2px, #1B5C32 2px, #1B5C32 3px
            ), repeating-linear-gradient(
              90deg, transparent, transparent 8px, #1B5C32 8px, #1B5C32 9px
            )`,
          }}
        />

        {/* Decorative circle accent */}
        <div
          aria-hidden
          className="absolute -right-32 top-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-primary/10"
        />
        <div
          aria-hidden
          className="absolute -right-20 top-1/2 -translate-y-1/2 w-[440px] h-[440px] rounded-full border border-primary/8"
        />

        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 w-full">
          <div className="max-w-3xl">
            <motion.p
              custom={0}
              initial="hidden"
              animate="show"
              variants={fadeUp}
              className="text-primary/60 uppercase tracking-[0.25em] text-xs font-medium mb-6"
            >
              Slow Luxury · Handcrafted in Belgium
            </motion.p>

            <motion.h1
              custom={1}
              initial="hidden"
              animate="show"
              variants={fadeUp}
              className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-primary leading-[1.05] mb-8"
            >
              The Art of <br />
              <em className="not-italic text-primary-light">the Stitch.</em>
            </motion.h1>

            <motion.p
              custom={2}
              initial="hidden"
              animate="show"
              variants={fadeUp}
              className="text-foreground/60 text-lg leading-relaxed mb-10 max-w-xl"
            >
              Each piece carries the warmth of hands, the patience of craft, and
              the intention of love. No mass production — just pure, slow luxury.
            </motion.p>

            <motion.div
              custom={3}
              initial="hidden"
              animate="show"
              variants={fadeUp}
              className="flex flex-wrap gap-4 items-center"
            >
              <Link href="/shop">
                <Button
                  size="lg"
                  className="rounded-full px-8 bg-primary text-white hover:bg-primary-dark transition-colors duration-200 shadow-md hover:shadow-lg cursor-pointer"
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

            {/* Social proof strip */}
            <motion.div
              custom={4}
              initial="hidden"
              animate="show"
              variants={fadeUp}
              className="flex items-center gap-6 mt-14"
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
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className="w-3.5 h-3.5 fill-accent-gold text-accent-gold" />
                  ))}
                </div>
                <p className="text-xs text-foreground/50 mt-0.5">
                  Loved by 200+ happy customers
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Trust bar ── */}
      <section className="bg-primary text-white py-5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-16 text-sm">
            {[
              { icon: Leaf, text: "Ethically sourced yarn" },
              { icon: Package, text: "Handpacked with care" },
              { icon: MessageCircle, text: "Custom orders welcome" },
              { icon: Star, text: "5-star rated pieces" },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-2 opacity-90">
                <Icon className="w-4 h-4 text-accent-gold flex-shrink-0" />
                <span className="tracking-wide">{text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Products ── */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-14 gap-4">
            <div>
              <p className="text-primary/50 uppercase tracking-[0.2em] text-xs mb-3">
                Curated Selection
              </p>
              <h2 className="font-serif text-3xl md:text-4xl text-primary">
                Featured Pieces
              </h2>
            </div>
            <Link href="/shop" className="text-primary/60 hover:text-primary text-sm font-medium flex items-center gap-1 transition-colors cursor-pointer">
              View all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-square bg-muted rounded-xl mb-4" />
                  <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                  <div className="h-3 bg-muted rounded w-1/3" />
                </div>
              ))}
            </div>
          ) : (
            <ProductGrid products={featuredProducts} />
          )}

          <div className="text-center mt-16">
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
      <section className="py-24 bg-[#F7F5F1]">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Logo / visual */}
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="relative"
            >
              <div className="bg-accent-cream/60 rounded-3xl p-10 sm:p-14 flex items-center justify-center">
                <Image
                  src="/images/logo-landscape.png"
                  alt="Crochetty — handcrafted crochet boutique"
                  width={480}
                  height={224}
                  className="object-contain w-full max-w-[420px] drop-shadow-lg"
                />
              </div>
              {/* Decorative blob */}
              <div
                aria-hidden
                className="absolute -bottom-6 -right-6 w-28 h-28 rounded-full bg-accent-gold/20 -z-10"
              />
            </motion.div>

            {/* Copy */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="text-primary/50 uppercase tracking-[0.25em] text-xs mb-4">
                Our Story
              </p>
              <h2 className="font-serif text-3xl md:text-5xl text-primary mb-6 leading-tight">
                Sustainable &<br /> Soulful.
              </h2>
              <p className="text-foreground/60 leading-relaxed mb-6 text-base">
                We believe in the beauty of slowness. Every piece begins with
                ethically sourced yarn, shaped by patient hands, and finished
                with care that no machine can replicate.
              </p>
              <p className="text-foreground/60 leading-relaxed mb-10 text-base">
                No mass production. No shortcuts. Just pure intention and the
                timeless tradition of needlework — made for people who value
                the extraordinary in the everyday.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/about">
                  <Button
                    className="rounded-full px-8 bg-primary text-white hover:bg-primary-dark transition-colors cursor-pointer"
                  >
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
      <section className="py-20 bg-primary text-white">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <p className="text-white/50 uppercase tracking-[0.2em] text-xs mb-4">
              Stay Connected
            </p>
            <h2 className="font-serif text-3xl md:text-4xl mb-4">
              Join the Crochetty Family
            </h2>
            <p className="text-white/70 mb-8 leading-relaxed">
              New arrivals, exclusive offers, and behind-the-scenes stories —
              straight to your inbox.
            </p>
            <form
              className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
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
                className="rounded-full px-7 bg-accent-gold text-foreground font-medium hover:bg-accent-gold/90 transition-colors shrink-0 cursor-pointer"
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
