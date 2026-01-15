'use client';

import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, ShoppingBag } from "lucide-react";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/Button";

export function CartSidebar() {
    const { cartOpen, closeCart, items, removeItem } = useCart();

    const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

    return (
        <AnimatePresence>
            {cartOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={closeCart}
                        className="fixed inset-0 bg-black/50 z-[60]"
                    />
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="fixed top-0 right-0 h-full w-full max-w-md bg-white z-[70] shadow-2xl flex flex-col"
                    >
                        <div className="p-6 flex items-center justify-between border-b">
                            <h2 className="text-xl font-serif">Shopping Cart</h2>
                            <button onClick={closeCart} className="text-gray-500 hover:text-primary">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            {items.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-gray-400">
                                    <ShoppingBag className="w-16 h-16 mb-4 opacity-20" />
                                    <p>Your bag is empty.</p>
                                </div>
                            ) : (
                                items.map((item) => (
                                    <div key={item.id} className="flex gap-4">
                                        <div className="relative w-20 h-24 bg-gray-100 flex-shrink-0">
                                            <Image src={item.image} alt={item.name} fill className="object-cover" />
                                        </div>
                                        <div className="flex-1 flex flex-col justify-between">
                                            <div>
                                                <h3 className="font-serif text-sm text-primary">{item.name}</h3>
                                                <p className="text-sm text-gray-500">${item.price.toFixed(2)}</p>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3 border rounded-md px-2 py-1">
                                                    <button className="text-gray-400 hover:text-primary"><Minus className="w-3 h-3" /></button>
                                                    <span className="text-sm">{item.quantity}</span>
                                                    <button className="text-gray-400 hover:text-primary"><Plus className="w-3 h-3" /></button>
                                                </div>
                                                <button onClick={() => removeItem(item.id)} className="text-xs text-red-400 hover:text-red-600 underline">Remove</button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        <div className="p-6 border-t bg-gray-50">
                            <div className="flex justify-between mb-4 text-primary font-medium">
                                <span>Subtotal</span>
                                <span>${total.toFixed(2)}</span>
                            </div>
                            <Button className="w-full" size="lg" disabled={items.length === 0}>
                                Checkout
                            </Button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
