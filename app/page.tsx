'use client';

import { motion } from "framer-motion";
import { ProductGrid } from "@/components/shop/ProductGrid";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import type { Product } from "@/lib/db/schema";
import { ArrowRight, Star, Leaf, Package, MessageCircleHeart, Sparkles } from "lucide-react";
import { WordRotate } from "@/components/magicui/word-rotate";
import { NumberTicker } from "@/components/magicui/number-ticker";
import { ShimmerButton } from "@/components/magicui/shimmer-button";

/* ─── shared wrapper ─────────────────────────────────────────────── */
function Container({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`w-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 ${className}`}>
      {children}
    </div>
  );
}

/* ─── section label ──────────────────────────────────────────────── */
function Label({ children }: { children: React.ReactNode }) {
  return (
    <p className="uppercase tracking-[0.3em] text-[10px] font-semibold text-primary/40 mb-4">
      {children}
    </p>
  );
}

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
      } catch {
        setFeaturedProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <div>

      {/* ══════════════════════════════════════════════════════════
          HERO
      ══════════════════════════════════════════════════════════ */}
      <section className="relative bg-[#F7F5F1] min-h-[calc(100vh-5rem)]">

        {/* Dot pattern background */}
        <svg
          aria-hidden
          className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.18]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern id="dots" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
              <circle cx="1.5" cy="1.5" r="1.5" fill="#1B5C32" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dots)" />
        </svg>

        {/* Warm radial glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background: "radial-gradient(ellipse 70% 60% at 30% 50%, rgba(240,232,208,0.55) 0%, transparent 70%)",
          }}
        />

        {/* Content — table layout for perfect vertical centering */}
        <div className="relative z-10 flex min-h-[calc(100vh-5rem)] flex-col justify-center">
          <Container className="py-28 lg:py-36">
            <div className="max-w-[680px] mx-auto text-center">

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
              >
                <Label>Slow Luxury · Handcrafted in Belgium</Label>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="font-serif text-[clamp(3rem,7vw,6rem)] text-primary leading-[1.04] tracking-tight mb-6"
              >
                The Art of
                <br />
                <span className="text-primary-light italic">
                  <WordRotate
                    words={["the Stitch.", "the Hook.", "the Craft.", "the Gift."]}
                    duration={3000}
                    className="inline-block"
                  />
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.25 }}
                className="text-foreground/55 text-lg sm:text-xl leading-[1.75] mb-12 max-w-[520px] mx-auto"
              >
                Each piece carries the warmth of hands, the patience of craft, and the intention of love.
                No mass production — just pure, slow luxury.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="flex flex-wrap items-center justify-center gap-4"
              >
                <Link href="/shop">
                  <ShimmerButton
                    background="var(--color-primary)"
                    className="text-sm font-medium tracking-wide h-[52px] px-9 gap-2.5"
                  >
                    Shop Collection <ArrowRight className="w-4 h-4" />
                  </ShimmerButton>
                </Link>

                <Link href="/custom">
                  <button className="h-[52px] px-9 rounded-full border border-primary/25 text-primary text-sm font-medium tracking-wide hover:bg-primary/6 hover:border-primary/40 transition-all duration-300 cursor-pointer">
                    Commission a Piece
                  </button>
                </Link>
              </motion.div>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.65 }}
                className="mt-16 flex items-center justify-center gap-10 border-t border-primary/10 pt-10"
              >
                <div>
                  <p className="font-serif text-3xl text-primary leading-none">
                    <NumberTicker value={200} className="text-primary" />+
                  </p>
                  <p className="text-xs text-foreground/45 mt-1.5 tracking-wide">Happy customers</p>
                </div>
                <div className="w-px h-8 bg-primary/15" />
                <div>
                  <div className="flex items-center gap-1">
                    {[1,2,3,4,5].map(s => (
                      <Star key={s} className="w-4 h-4 fill-accent-gold text-accent-gold" />
                    ))}
                  </div>
                  <p className="text-xs text-foreground/45 mt-1.5 tracking-wide">5-star rated</p>
                </div>
                <div className="w-px h-8 bg-primary/15" />
                <div>
                  <p className="font-serif text-3xl text-primary leading-none">
                    <NumberTicker value={100} className="text-primary" />%
                  </p>
                  <p className="text-xs text-foreground/45 mt-1.5 tracking-wide">Handmade</p>
                </div>
              </motion.div>

            </div>
          </Container>
        </div>

        {/* Decorative circles — purely decorative */}
        <div aria-hidden className="pointer-events-none absolute right-[5%] top-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full border border-primary/8 hidden lg:block" />
        <div aria-hidden className="pointer-events-none absolute right-[10%] top-1/2 -translate-y-1/2 w-[340px] h-[340px] rounded-full border border-primary/12 hidden lg:block" />
      </section>

      {/* ══════════════════════════════════════════════════════════
          TRUST BAR
      ══════════════════════════════════════════════════════════ */}
      <section className="bg-primary">
        <Container className="py-5">
          <div className="flex flex-wrap items-center justify-between gap-y-3">
            {[
              { icon: Leaf, text: "Ethically sourced yarn" },
              { icon: Package, text: "Handpacked with care" },
              { icon: MessageCircleHeart, text: "Custom orders welcome" },
              { icon: Sparkles, text: "5-star rated pieces" },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-2.5 text-white/80">
                <Icon className="w-4 h-4 text-accent-gold shrink-0" />
                <span className="text-sm tracking-wide">{text}</span>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ══════════════════════════════════════════════════════════
          FEATURED PRODUCTS
      ══════════════════════════════════════════════════════════ */}
      <section className="bg-white">
        <Container className="py-28 lg:py-36">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-16">
            <div>
              <Label>Curated Selection</Label>
              <h2 className="font-serif text-4xl md:text-5xl text-primary">Featured Pieces</h2>
            </div>
            <Link
              href="/shop"
              className="group inline-flex items-center gap-2 text-sm text-primary/50 hover:text-primary transition-colors duration-200 tracking-wide cursor-pointer"
            >
              View all collection
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-[3/4] bg-muted rounded-2xl mb-5" />
                  <div className="h-4 bg-muted rounded-full w-3/4 mb-2.5" />
                  <div className="h-3 bg-muted rounded-full w-1/3" />
                </div>
              ))}
            </div>
          ) : (
            <ProductGrid products={featuredProducts} />
          )}

          <div className="flex justify-center mt-16">
            <Link href="/shop">
              <button className="h-[52px] px-10 rounded-full border border-primary text-primary text-sm font-medium tracking-wide hover:bg-primary hover:text-white transition-all duration-300 cursor-pointer">
                Explore Full Collection
              </button>
            </Link>
          </div>
        </Container>
      </section>

      {/* ══════════════════════════════════════════════════════════
          BRAND STORY
      ══════════════════════════════════════════════════════════ */}
      <section className="bg-[#F7F5F1]">
        <Container className="py-28 lg:py-36">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">

            {/* Logo visual */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <div className="relative">
                <div className="bg-accent-cream/70 rounded-[2rem] p-12 sm:p-16 flex items-center justify-center">
                  <Image
                    src="/images/logo-landscape.png"
                    alt="Crochetty — handcrafted crochet boutique"
                    width={480}
                    height={224}
                    className="object-contain w-full max-w-[380px] drop-shadow-xl"
                  />
                </div>
                {/* Floating gold accent */}
                <div
                  aria-hidden
                  className="absolute -bottom-5 -right-5 w-24 h-24 rounded-full bg-accent-gold/15 blur-xl"
                />
              </div>
            </motion.div>

            {/* Copy */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
            >
              <Label>Our Story</Label>
              <h2 className="font-serif text-4xl md:text-[3.25rem] text-primary leading-[1.08] mb-8">
                Sustainable &amp;<br /> Soulful.
              </h2>
              <p className="text-foreground/55 text-lg leading-[1.8] mb-6">
                We believe in the beauty of slowness. Every piece begins with ethically sourced yarn,
                shaped by patient hands, and finished with care that no machine can replicate.
              </p>
              <p className="text-foreground/55 text-lg leading-[1.8] mb-12">
                No mass production. No shortcuts. Just pure intention and the timeless tradition
                of needlework — made for people who value the extraordinary in the everyday.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link href="/about">
                  <ShimmerButton
                    background="var(--color-primary)"
                    className="text-sm font-medium tracking-wide h-[52px] px-9"
                  >
                    Read Our Story
                  </ShimmerButton>
                </Link>
                <Link href="/custom">
                  <button className="h-[52px] px-9 rounded-full border border-primary/25 text-primary text-sm font-medium tracking-wide hover:bg-primary/6 hover:border-primary/40 transition-all duration-300 cursor-pointer">
                    Commission a Piece
                  </button>
                </Link>
              </div>
            </motion.div>

          </div>
        </Container>
      </section>

      {/* ══════════════════════════════════════════════════════════
          NEWSLETTER
      ══════════════════════════════════════════════════════════ */}
      <section className="bg-white py-24 lg:py-32">
        <Container className="">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative overflow-hidden bg-primary rounded-[2rem] px-10 py-16 sm:px-20 sm:py-20 text-center"
          >
            {/* Subtle dot texture on the card */}
            <svg aria-hidden className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.07]" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="dots2" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                  <circle cx="1" cy="1" r="1" fill="white" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#dots2)" />
            </svg>

            <div className="relative z-10">
              <Label>Stay Connected</Label>
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-white mb-5">
                Join the Crochetty Family
              </h2>
              <p className="text-white/60 text-lg leading-relaxed mb-10 max-w-md mx-auto">
                New arrivals, exclusive offers, and behind-the-scenes stories — straight to your inbox.
              </p>
              <form
                className="flex flex-col sm:flex-row gap-3 max-w-sm mx-auto"
                onSubmit={(e) => e.preventDefault()}
              >
                <input
                  type="email"
                  placeholder="your@email.com"
                  aria-label="Email for newsletter"
                  className="flex-1 h-[52px] px-6 rounded-full bg-white/10 border border-white/20 text-white placeholder:text-white/35 focus:outline-none focus:ring-2 focus:ring-accent-gold/50 text-sm"
                />
                <button
                  type="submit"
                  className="h-[52px] px-8 rounded-full bg-accent-gold text-foreground font-semibold text-sm tracking-wide hover:bg-[#b8912a] transition-colors cursor-pointer shrink-0"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </motion.div>
        </Container>
      </section>

    </div>
  );
}
