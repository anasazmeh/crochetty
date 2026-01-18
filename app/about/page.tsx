"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Button } from "@/components/ui/Button";

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-[#FDFCFB] pt-24 pb-16">
            <div className="container mx-auto px-6">
                {/* Hero Section */}
                <section className="mb-24">
                    <div className="max-w-4xl mx-auto text-center">
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-[#1B7A6E] uppercase tracking-[0.2em] mb-4 text-sm font-medium"
                        >
                            Our Heritage
                        </motion.p>
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="font-serif text-5xl md:text-7xl text-primary mb-8"
                        >
                            Slow Luxury, Made by Hand.
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="text-gray-600 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto italic"
                        >
                            "In a world of fast fashion, we choose the rhythm of the needle.
                            Each piece is a testament to the beauty of patience and the art of the stitch."
                        </motion.p>
                    </div>
                </section>

                {/* Values Section */}
                <section className="grid md:grid-cols-2 gap-16 items-center mb-24">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="relative h-[500px] rounded-2xl overflow-hidden shadow-xl"
                    >
                        <Image
                            src="https://images.unsplash.com/photo-1584992236310-6edddc08acff?q=80&w=1200"
                            alt="Artisanal Process"
                            fill
                            className="object-cover"
                        />
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="space-y-8"
                    >
                        <div>
                            <h2 className="font-serif text-3xl text-primary mb-4">Pure Intention</h2>
                            <p className="text-gray-600 leading-relaxed">
                                Crochetty was born from a desire to bring soul back into our wardrobes.
                                We don't believe in mass production. Instead, we focus on limited runs
                                and one-of-a-kind treasures that resonate with a sense of place and purpose.
                            </p>
                        </div>
                        <div>
                            <h2 className="font-serif text-3xl text-primary mb-4">Sustainable Threads</h2>
                            <p className="text-gray-600 leading-relaxed">
                                Every fiber we use is chosen for its quality and environmental footprint.
                                From organic cotton to ethically sourced wool, we ensure that our materials
                                respect the earth as much as the hands that craft them.
                            </p>
                        </div>
                    </motion.div>
                </section>

                {/* Meet the Founder / Artisan CTA */}
                <section className="bg-primary rounded-3xl p-12 md:p-24 text-center text-white relative overflow-hidden">
                    <div className="absolute inset-0 opacity-10 pointer-events-none">
                        <div className="w-full h-full bg-[url('https://www.transparenttextures.com/patterns/weave.png')]"></div>
                    </div>
                    <div className="relative z-10 max-w-2xl mx-auto">
                        <h2 className="font-serif text-4xl md:text-5xl mb-8">Crafting Your Story</h2>
                        <p className="text-white/80 text-lg mb-12">
                            Every stitch is a conversation. We are honored to be a part of your journey,
                            creating pieces that grow more meaningful with every wear.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button variant="secondary" size="lg" className="rounded-full px-10">
                                Explore Collection
                            </Button>
                            <Button variant="outline" size="lg" className="rounded-full px-10 border-white text-white hover:bg-white/10">
                                Custom Inquiries
                            </Button>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
