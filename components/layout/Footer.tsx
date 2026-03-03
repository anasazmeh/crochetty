"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Instagram, Mail, Heart } from "lucide-react";

export const Footer = () => {
    const currentYear = new Date().getFullYear();

    const footerLinks = {
        shop: [
            { name: "All Products", href: "/shop" },
            { name: "New Arrivals", href: "/shop?filter=new" },
            { name: "Best Sellers", href: "/shop?filter=bestsellers" },
            { name: "Custom Orders", href: "/custom" },
        ],
        about: [
            { name: "Our Story", href: "/about" },
            { name: "Sustainability", href: "/about#sustainability" },
            { name: "Care Guide", href: "/about#care" },
            { name: "Journal", href: "/journal" },
        ],
        support: [
            { name: "Contact Us", href: "/contact" },
            { name: "Shipping Info", href: "/contact#shipping" },
            { name: "Returns", href: "/contact#returns" },
            { name: "FAQ", href: "/contact#faq" },
        ],
    };

    const socialLinks = [
        { name: "Instagram", icon: Instagram, href: "https://instagram.com" },
        { name: "Email", icon: Mail, href: "mailto:hello@crochetty.com" },
    ];

    return (
        <footer className="bg-[#1B5C32] text-white">
            {/* Main footer */}
            <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
                    {/* Brand — spans 2 cols */}
                    <div className="lg:col-span-2 space-y-5">
                        <Link href="/" className="inline-flex items-center gap-3 cursor-pointer">
                            <div className="relative w-12 h-12">
                                <Image
                                    src="/images/logo-badge.png"
                                    alt="Crochetty"
                                    fill
                                    className="object-contain"
                                />
                            </div>
                            <span className="font-serif text-xl text-white tracking-wide">
                                Crochetty
                            </span>
                        </Link>
                        <p className="text-white/60 text-sm leading-relaxed max-w-xs">
                            Handcrafted with love, one stitch at a time.
                            Sustainable, unique, and made just for you.
                        </p>
                        <div className="flex gap-3">
                            {socialLinks.map((social) => (
                                <motion.a
                                    key={social.name}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={social.name}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/70 hover:text-white transition-colors duration-200 cursor-pointer"
                                >
                                    <social.icon className="w-4 h-4" />
                                </motion.a>
                            ))}
                        </div>
                    </div>

                    {/* Links */}
                    {[
                        { title: "Shop", links: footerLinks.shop },
                        { title: "About", links: footerLinks.about },
                        { title: "Support", links: footerLinks.support },
                    ].map(({ title, links }) => (
                        <div key={title}>
                            <h4 className="text-white/90 font-semibold text-sm uppercase tracking-widest mb-5">
                                {title}
                            </h4>
                            <ul className="space-y-3">
                                {links.map((link) => (
                                    <li key={link.name}>
                                        <Link
                                            href={link.href}
                                            className="text-white/50 hover:text-white transition-colors duration-200 text-sm cursor-pointer"
                                        >
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Newsletter */}
                <div className="border-t border-white/10 pt-10 mb-10">
                    <div className="max-w-md">
                        <h4 className="font-serif text-lg text-white mb-2">
                            Get early access to new drops
                        </h4>
                        <p className="text-white/50 text-sm mb-4">
                            No spam. Just beautiful things.
                        </p>
                        <form
                            className="flex gap-2"
                            onSubmit={(e) => e.preventDefault()}
                        >
                            <input
                                type="email"
                                placeholder="your@email.com"
                                aria-label="Email for newsletter"
                                className="flex-1 px-4 py-2.5 rounded-full bg-white/10 border border-white/15 text-white placeholder:text-white/30 text-sm focus:outline-none focus:ring-2 focus:ring-accent-gold/60"
                            />
                            <motion.button
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                                type="submit"
                                className="px-6 py-2.5 bg-accent-gold text-foreground font-medium rounded-full text-sm hover:bg-[#b8912a] transition-colors cursor-pointer shrink-0"
                            >
                                Join
                            </motion.button>
                        </form>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-white/40">
                    <p className="flex items-center gap-1.5">
                        © {currentYear} Crochetty. Made with{" "}
                        <Heart className="w-3 h-3 text-white/60 fill-white/60 inline" />{" "}
                        by hand.
                    </p>
                    <div className="flex gap-6">
                        <Link href="/privacy" className="hover:text-white/70 transition-colors cursor-pointer">
                            Privacy Policy
                        </Link>
                        <Link href="/terms" className="hover:text-white/70 transition-colors cursor-pointer">
                            Terms of Service
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};
