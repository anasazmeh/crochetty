"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Heart, ShoppingCart } from "lucide-react";
import { getStorageUrl } from "@/lib/api";

interface Product {
    id: string;
    name: string;
    price: number;
    category: string;
    images: string[];
    slug?: string;
}

interface ProductGridProps {
    products: Product[];
}

export const ProductGrid: React.FC<ProductGridProps> = ({ products }) => {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5
            }
        }
    };

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
        >
            {products.map((product) => (
                <motion.div
                    key={product.id}
                    variants={itemVariants}
                    className="group relative"
                >
                    <Link href={`/shop/${product.id}`} className="block">
                        {/* Product Image Container */}
                        <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800 mb-4">
                            <Image
                                src={getStorageUrl(`Products/${product.images?.[0]?.replace('/images/', '') || ''}`)}
                                alt={product.name}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-110"
                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                            />

                            {/* Overlay on Hover */}
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />

                            {/* Quick Action Buttons */}
                            <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="p-2 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:bg-[#1B7A6E]/10 dark:hover:bg-[#1B7A6E]/20 transition-colors"
                                    aria-label="Add to wishlist"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        // Add to wishlist logic
                                    }}
                                >
                                    <Heart className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="p-2 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:bg-[#1B7A6E]/10 dark:hover:bg-[#1B7A6E]/20 transition-colors"
                                    aria-label="Add to cart"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        // Add to cart logic
                                    }}
                                >
                                    <ShoppingCart className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                                </motion.button>
                            </div>

                            {/* Category Badge */}
                            <div className="absolute bottom-4 left-4">
                                <span className="px-3 py-1 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full text-xs font-medium text-gray-700 dark:text-gray-300">
                                    {product.category}
                                </span>
                            </div>
                        </div>

                        {/* Product Info */}
                        <div className="space-y-2">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-[#1B7A6E] dark:group-hover:text-[#2A9D8F] transition-colors">
                                {product.name}
                            </h3>
                            <p className="text-xl font-bold text-[#1B7A6E] dark:text-[#2A9D8F]">
                                ${product.price.toFixed(2)}
                            </p>
                        </div>
                    </Link>
                </motion.div>
            ))}
        </motion.div>
    );
};
