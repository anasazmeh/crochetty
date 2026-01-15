'use client';

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

// Mock Data for Journal
const journalEntries = [
    {
        id: 1,
        title: "The Patience of Wool",
        excerpt: "Why slow fashion matters in a fast-paced world. Exploring the tactile benefits of natural fibers.",
        image: "https://images.unsplash.com/photo-1605218427368-35b8612185d9?q=80&w=800&auto=format&fit=crop",
        date: "October 12, 2023",
        slug: "patience-of-wool"
    },
    {
        id: 2,
        title: "Sourcing Sustainably",
        excerpt: "Our journey to the Peruvian highlands to find the perfect alpaca yarn.",
        image: "https://images.unsplash.com/photo-1574637731773-670560dc4d84?q=80&w=800&auto=format&fit=crop",
        date: "September 28, 2023",
        slug: "sourcing-sustainably"
    },
    {
        id: 3,
        title: "Care & Keeping",
        excerpt: "How to wash and store your heirloom pieces to ensure they last a lifetime.",
        image: "https://images.unsplash.com/photo-1549643276-fbc2bd5f1f56?q=80&w=800&auto=format&fit=crop",
        date: "September 15, 2023",
        slug: "care-and-keeping"
    },
    {
        id: 4,
        title: "Studio Visit",
        excerpt: "A look inside the sun-drenched studio where every stitch is made.",
        image: "https://images.unsplash.com/photo-1582236894042-32b0f34fb44a?q=80&w=800&auto=format&fit=crop",
        date: "August 30, 2023",
        slug: "studio-visit"
    }
];

export default function JournalPage() {
    return (
        <div className="min-h-screen bg-background pb-24">
            <section className="pt-32 pb-16 text-center px-6">
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="font-serif text-5xl md:text-6xl text-primary mb-6"
                >
                    Journal
                </motion.h1>
                <p className="text-gray-500 max-w-xl mx-auto uppercase tracking-widest text-sm">
                    Reflections on craft, slow living, and the art of making.
                </p>
            </section>

            <div className="container mx-auto px-6">
                <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
                    {journalEntries.map((entry, index) => (
                        <motion.article
                            key={entry.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="group cursor-pointer"
                        >
                            <div className="relative aspect-[4/3] overflow-hidden mb-6 bg-gray-100">
                                <Image
                                    src={entry.image}
                                    alt={entry.title}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                            </div>
                            <div className="max-w-md">
                                <p className="text-xs text-accent uppercase tracking-widest mb-2">{entry.date}</p>
                                <h2 className="font-serif text-2xl text-primary mb-3 group-hover:text-accent transition-colors">
                                    {entry.title}
                                </h2>
                                <p className="text-gray-500 mb-4 text-sm leading-relaxed">
                                    {entry.excerpt}
                                </p>
                                <Link href="#" className="inline-flex items-center text-primary uppercase text-xs tracking-widest font-medium hover:text-accent transition-colors">
                                    Read Article <ArrowRight className="w-3 h-3 ml-2" />
                                </Link>
                            </div>
                        </motion.article>
                    ))}
                </div>
            </div>
        </div>
    );
}
