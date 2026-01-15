"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Instagram, Mail, Heart } from "lucide-react";

export const Footer = () => {
    const currentYear = new Date().getFullYear();

    const footerLinks = {
        shop: [
            { name: "All Products", href: "/shop" },
            { name: "New Arrivals", href: "/shop?filter=new" },
            { name: "Best Sellers", href: "/shop?filter=bestsellers" },
            { name: "Custom Orders", href: "/custom" }
        ],
        about: [
            { name: "Our Story", href: "/about" },
            { name: "Sustainability", href: "/sustainability" },
            { name: "Care Guide", href: "/care" },
            { name: "Blog", href: "/blog" }
        ],
        support: [
            { name: "Contact Us", href: "/contact" },
            { name: "Shipping Info", href: "/shipping" },
            { name: "Returns", href: "/returns" },
            { name: "FAQ", href: "/faq" }
        ]
    };

    const socialLinks = [
        { name: "Instagram", icon: Instagram, href: "https://instagram.com", color: "hover:text-[#1B7A6E]" },
        { name: "Email", icon: Mail, href: "mailto:hello@crochetty.com", color: "hover:text-[#2A9D8F]" }
    ];

    return (
        <footer className="bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 border-t border-gray-200 dark:border-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Main Footer Content */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
                    {/* Brand Section */}
                    <div className="space-y-4">
                        <h3 className="text-2xl font-bold text-[#1B7A6E] dark:text-[#2A9D8F]">
                            Crochetty
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                            Handcrafted with love, one stitch at a time. Sustainable, unique, and made just for you.
                        </p>
                        {/* Social Links */}
                        <div className="flex gap-4">
                            {socialLinks.map((social) => (
                                <motion.a
                                    key={social.name}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`text-gray-600 dark:text-gray-400 transition-colors ${social.color}`}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.95 }}
                                    aria-label={social.name}
                                >
                                    <social.icon className="w-6 h-6" />
                                </motion.a>
                            ))}
                        </div>
                    </div>

                    {/* Shop Links */}
                    <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Shop</h4>
                        <ul className="space-y-2">
                            {footerLinks.shop.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="text-gray-600 dark:text-gray-400 hover:text-[#1B7A6E] dark:hover:text-[#2A9D8F] transition-colors text-sm"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* About Links */}
                    <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-4">About</h4>
                        <ul className="space-y-2">
                            {footerLinks.about.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="text-gray-600 dark:text-gray-400 hover:text-[#1B7A6E] dark:hover:text-[#2A9D8F] transition-colors text-sm"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Support Links */}
                    <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Support</h4>
                        <ul className="space-y-2">
                            {footerLinks.support.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="text-gray-600 dark:text-gray-400 hover:text-[#1B7A6E] dark:hover:text-[#2A9D8F] transition-colors text-sm"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Newsletter Section */}
                <div className="border-t border-gray-200 dark:border-gray-800 pt-8 mb-8">
                    <div className="max-w-md mx-auto text-center">
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                            Join Our Community
                        </h4>
                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                            Get updates on new arrivals, exclusive offers, and crochet tips!
                        </p>
                        <div className="flex gap-2">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1B7A6E]"
                            />
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-6 py-2 bg-gradient-to-r from-[#1B7A6E] to-[#2A9D8F] text-white rounded-lg font-medium"
                            >
                                Subscribe
                            </motion.button>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-gray-200 dark:border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-gray-600 dark:text-gray-400 text-sm flex items-center gap-1">
                        © {currentYear} Crochetty. Made with <Heart className="w-4 h-4 text-[#1B7A6E] fill-[#1B7A6E]" /> by hand.
                    </p>
                    <div className="flex gap-6 text-sm">
                        <Link href="/privacy" className="text-gray-600 dark:text-gray-400 hover:text-[#1B7A6E] transition-colors">
                            Privacy Policy
                        </Link>
                        <Link href="/terms" className="text-gray-600 dark:text-gray-400 hover:text-pink-500 transition-colors">
                            Terms of Service
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};
