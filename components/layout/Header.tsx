"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Menu, X, Search, User } from "lucide-react";
import { useCart } from "@/context/CartContext";

export const Header = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { totalItems: cartItemCount } = useCart();

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
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled
                ? "bg-[#F7F5F1]/95 backdrop-blur-md shadow-sm border-b border-border"
                : "bg-[#F7F5F1]/80 backdrop-blur-sm"
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    {/* Logo */}
                    <Link href="/" className="flex items-center cursor-pointer">
                        <motion.div
                            whileHover={{ scale: 1.04 }}
                            transition={{ type: "spring", stiffness: 400, damping: 20 }}
                            className="relative h-14 w-14"
                        >
                            <Image
                                src="/images/logo-badge.png"
                                alt="Crochetty"
                                fill
                                className="object-contain"
                                priority
                            />
                        </motion.div>
                        <motion.span
                            initial={{ opacity: 0, x: -4 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                            className="ml-3 font-serif text-xl text-primary hidden sm:block tracking-wide"
                        >
                            Crochetty
                        </motion.span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="text-foreground/70 hover:text-primary transition-colors duration-200 text-sm font-medium tracking-wide"
                            >
                                {link.name}
                            </Link>
                        ))}
                    </nav>

                    {/* Actions */}
                    <div className="flex items-center gap-3">
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            className="hidden sm:flex w-9 h-9 items-center justify-center rounded-full text-foreground/60 hover:text-primary hover:bg-muted transition-colors duration-200 cursor-pointer"
                            aria-label="Search"
                        >
                            <Search className="w-4 h-4" />
                        </motion.button>

                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            className="hidden sm:flex w-9 h-9 items-center justify-center rounded-full text-foreground/60 hover:text-primary hover:bg-muted transition-colors duration-200 cursor-pointer"
                            aria-label="Account"
                        >
                            <User className="w-4 h-4" />
                        </motion.button>

                        {/* Cart */}
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="relative flex items-center gap-2 bg-primary text-white rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200 hover:bg-primary-dark cursor-pointer"
                            aria-label="Shopping Cart"
                        >
                            <ShoppingCart className="w-4 h-4" />
                            <span className="hidden sm:inline">Bag</span>
                            {cartItemCount > 0 && (
                                <motion.span
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="absolute -top-1.5 -right-1.5 bg-accent-gold text-foreground text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center"
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
                            className="md:hidden w-9 h-9 flex items-center justify-center rounded-full text-foreground/70 hover:bg-muted transition-colors cursor-pointer"
                            aria-label="Toggle Menu"
                        >
                            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
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
                        className="md:hidden bg-[#F7F5F1] border-t border-border"
                    >
                        <nav className="px-6 py-6 space-y-1">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="block text-foreground/70 hover:text-primary transition-colors font-medium py-3 border-b border-border/50 last:border-0"
                                >
                                    {link.name}
                                </Link>
                            ))}
                            <div className="pt-4 flex gap-4">
                                <button className="flex items-center gap-2 text-foreground/60 hover:text-primary transition-colors text-sm cursor-pointer">
                                    <Search className="w-4 h-4" />
                                    <span>Search</span>
                                </button>
                                <button className="flex items-center gap-2 text-foreground/60 hover:text-primary transition-colors text-sm cursor-pointer">
                                    <User className="w-4 h-4" />
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
