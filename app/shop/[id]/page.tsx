"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import { ShoppingCart, Heart, ArrowLeft, Star, ShieldCheck, Truck } from "lucide-react";
import { getProductById, getStorageUrl, Product } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { useCart } from "@/context/CartContext";

export default function ProductDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const { dispatch } = useCart();

    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeImage, setActiveImage] = useState(0);

    useEffect(() => {
        const fetchProduct = async () => {
            if (!id) return;
            try {
                const data = await getProductById(id as string);
                setProduct(data);
            } catch (error) {
                console.error("Failed to fetch product:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-background px-6 text-center">
                <h2 className="text-3xl font-serif text-primary mb-4">Product Not Found</h2>
                <p className="text-gray-500 mb-8">The product you are looking for does not exist or has been removed.</p>
                <Button onClick={() => router.push("/shop")} variant="outline" className="rounded-full">
                    Back to Shop
                </Button>
            </div>
        );
    }

    const handleAddToCart = () => {
        dispatch({
            type: "ADD_ITEM",
            payload: {
                id: product.id,
                name: product.name,
                price: product.price,
                image: getStorageUrl(`Products/${product.images?.[0]?.replace('/images/', '') || ''}`),
                quantity: 1
            }
        });
    };

    return (
        <div className="min-h-screen bg-[#FDFCFB] pt-24 pb-16">
            <div className="container mx-auto px-6">
                {/* Back Button */}
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-gray-500 hover:text-primary transition-colors mb-12 group"
                >
                    <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                    <span className="text-sm font-medium tracking-wide">BACK TO COLLECTION</span>
                </button>

                <div className="grid lg:grid-cols-2 gap-16">
                    {/* Image Gallery */}
                    <div className="space-y-6">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100 shadow-sm"
                        >
                            <Image
                                src={getStorageUrl(`Products/${product.images?.[activeImage]?.replace('/images/', '') || ''}`)}
                                alt={product.name}
                                fill
                                className="object-cover"
                                priority
                            />
                        </motion.div>

                        {product.images.length > 1 && (
                            <div className="grid grid-cols-4 gap-4">
                                {product.images.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setActiveImage(idx)}
                                        className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${activeImage === idx ? "border-primary" : "border-transparent opacity-60 hover:opacity-100"
                                            }`}
                                    >
                                        <Image
                                            src={getStorageUrl(`Products/${img.replace('/images/', '')}`)}
                                            alt={`${product.name} ${idx + 1}`}
                                            fill
                                            className="object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Product Details */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="flex flex-col"
                    >
                        <div className="mb-2">
                            <span className="text-sm font-medium text-[#1B7A6E] bg-[#1B7A6E]/10 px-3 py-1 rounded-full">
                                {product.category}
                            </span>
                        </div>

                        <h1 className="font-serif text-4xl md:text-5xl text-primary mb-4 leading-tight">
                            {product.name}
                        </h1>

                        <div className="flex items-center gap-4 mb-8">
                            <p className="text-3xl font-bold text-primary">
                                ${product.price.toFixed(2)}
                            </p>
                            <div className="flex items-center gap-1 bg-yellow-400/10 px-2 py-0.5 rounded">
                                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                <span className="text-xs font-semibold text-yellow-700">HANDMADE</span>
                            </div>
                        </div>

                        <div className="prose prose-stone mb-10">
                            <p className="text-gray-600 leading-relaxed text-lg italic">
                                "{product.description || "A beautifully handcrafted piece, made with soul and intention."}"
                            </p>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row gap-4 mb-12">
                            <Button
                                onClick={handleAddToCart}
                                size="lg"
                                className="flex-1 rounded-full h-14 text-lg shadow-lg hover:shadow-xl transition-all"
                            >
                                <ShoppingCart className="w-5 h-5 mr-2" />
                                Add to Cart
                            </Button>
                            <Button
                                variant="outline"
                                size="lg"
                                className="rounded-full h-14 w-14 p-0 border-gray-200"
                            >
                                <Heart className="w-5 h-5 text-gray-400" />
                            </Button>
                        </div>

                        {/* Features/Info Tags */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-10 border-t border-gray-100">
                            <div className="flex gap-4">
                                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#1B7A6E]/5 flex items-center justify-center">
                                    <ShieldCheck className="w-5 h-5 text-[#1B7A6E]" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-primary mb-1">Authentic Quality</h4>
                                    <p className="text-xs text-gray-500">Premium materials, sustainably sourced.</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#1B7A6E]/5 flex items-center justify-center">
                                    <Truck className="w-5 h-5 text-[#1B7A6E]" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-primary mb-1">Mindful Shipping</h4>
                                    <p className="text-xs text-gray-500">Eco-conscious packaging on every order.</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
