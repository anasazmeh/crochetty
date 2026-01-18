"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Menu, X, Search, Heart, User } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { getStorageUrl } from "@/lib/api";

export const Header = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { items } = useCart();

    const cartItemCount = items.reduce((sum, item) => sum + item.quantity, 0);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navLinks = [
        { name: "Shop", href: "/shop" },
        { name: "About", href: "/about" },
        { name: "Custom Orders", href: "/custom" },
        { name: "Contact", href: "/contact" }
    ];

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
                ? "bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-lg"
                : "bg-transparent"
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    {/* Logo */}
                    <Link href="/" className="flex items-center">
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            transition={{ type: "spring", stiffness: 300 }}
                            className="relative h-12 w-40"
                        >
                            <Image
                                src={getStorageUrl("logo/Image Jan 18, 2026 at 12_11_06 AM.png")}
                                alt="Crochetty"
                                fill
                                className="object-contain"
                                priority
                            />
                        </motion.div>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="text-gray-700 dark:text-gray-300 hover:text-[#1B7A6E] dark:hover:text-[#2A9D8F] transition-colors font-medium"
                            >
                                {link.name}
                            </Link>
                        ))}
                    </nav>

                    {/* Actions */}
                    <div className="flex items-center gap-4">
                        {/* Search Icon */}
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            className="hidden sm:block text-gray-700 dark:text-gray-300 hover:text-[#1B7A6E] transition-colors"
                            aria-label="Search"
                        >
                            <Search className="w-5 h-5" />
                        </motion.button>

                        {/* Wishlist Icon */}
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            className="hidden sm:block text-gray-700 dark:text-gray-300 hover:text-[#1B7A6E] transition-colors"
                            aria-label="Wishlist"
                        >
                            <Heart className="w-5 h-5" />
                        </motion.button>

                        {/* Account Icon */}
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            className="hidden sm:block text-gray-700 dark:text-gray-300 hover:text-[#1B7A6E] transition-colors"
                            aria-label="Account"
                        >
                            <User className="w-5 h-5" />
                        </motion.button>

                        {/* Cart Icon with Badge */}
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            className="relative text-gray-700 dark:text-gray-300 hover:text-[#1B7A6E] transition-colors"
                            aria-label="Shopping Cart"
                        >
                            <ShoppingCart className="w-5 h-5" />
                            {cartItemCount > 0 && (
                                <motion.span
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="absolute -top-2 -right-2 bg-gradient-to-r from-[#1B7A6E] to-[#2A9D8F] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center"
                                >
                                    {cartItemCount}
                                </motion.span>
                            )}
                        </motion.button>

                        {/* Mobile Menu Toggle */}
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="md:hidden text-gray-700 dark:text-gray-300"
                            aria-label="Toggle Menu"
                        >
                            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </motion.button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800"
                    >
                        <nav className="px-4 py-6 space-y-4">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="block text-gray-700 dark:text-gray-300 hover:text-[#1B7A6E] dark:hover:text-[#2A9D8F] transition-colors font-medium py-2"
                                >
                                    {link.name}
                                </Link>
                            ))}
                            <div className="pt-4 border-t border-gray-200 dark:border-gray-800 flex gap-4">
                                <button className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-[#1B7A6E] transition-colors">
                                    <Search className="w-5 h-5" />
                                    <span>Search</span>
                                </button>
                                <button className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-[#1B7A6E] transition-colors">
                                    <Heart className="w-5 h-5" />
                                    <span>Wishlist</span>
                                </button>
                                <button className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-[#1B7A6E] transition-colors">
                                    <User className="w-5 h-5" />
                                    <span>Account</span>
                                </button>
                            </div>
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
};
