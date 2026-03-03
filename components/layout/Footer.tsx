"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Instagram, Mail, Heart } from "lucide-react";

export const Footer = () => {
    const currentYear = new Date().getFullYear();

    const cols = [
        {
            title: "Shop",
            links: [
                { name: "All Products", href: "/shop" },
                { name: "New Arrivals", href: "/shop?filter=new" },
                { name: "Best Sellers", href: "/shop?filter=bestsellers" },
                { name: "Custom Orders", href: "/custom" },
            ],
        },
        {
            title: "About",
            links: [
                { name: "Our Story", href: "/about" },
                { name: "Sustainability", href: "/about#sustainability" },
                { name: "Care Guide", href: "/about#care" },
                { name: "Journal", href: "/journal" },
            ],
        },
        {
            title: "Support",
            links: [
                { name: "Contact Us", href: "/contact" },
                { name: "Shipping Info", href: "/contact#shipping" },
                { name: "Returns", href: "/contact#returns" },
                { name: "FAQ", href: "/contact#faq" },
            ],
        },
    ];

    return (
        <footer className="bg-[#1B5C32] text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">

                {/* Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">

                    {/* Brand */}
                    <div className="col-span-2 md:col-span-1 space-y-5">
                        <Link href="/" className="inline-flex items-center gap-3 cursor-pointer">
                            <div className="relative w-11 h-11 shrink-0">
                                <Image
                                    src="/images/logo-badge.png"
                                    alt="Crochetty"
                                    fill
                                    className="object-contain"
                                />
                            </div>
                            <span className="font-serif text-lg text-white tracking-wide">Crochetty</span>
                        </Link>
                        <p className="text-white/55 text-sm leading-relaxed">
                            Handcrafted with love, one stitch at a time.
                            Sustainable, unique, and made just for you.
                        </p>
                        <div className="flex gap-3">
                            {[
                                { icon: Instagram, href: "https://instagram.com", label: "Instagram" },
                                { icon: Mail, href: "mailto:hello@crochetty.com", label: "Email" },
                            ].map(({ icon: Icon, href, label }) => (
                                <a
                                    key={label}
                                    href={href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={label}
                                    className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/70 hover:text-white transition-colors duration-200 cursor-pointer"
                                >
                                    <Icon className="w-4 h-4" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Link columns */}
                    {cols.map(({ title, links }) => (
                        <div key={title}>
                            <h4 className="text-white/80 font-semibold text-xs uppercase tracking-widest mb-5">
                                {title}
                            </h4>
                            <ul className="space-y-3">
                                {links.map((link) => (
                                    <li key={link.name}>
                                        <Link
                                            href={link.href}
                                            className="text-white/50 hover:text-white/90 transition-colors duration-200 text-sm cursor-pointer"
                                        >
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Bottom bar */}
                <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-white/35">
                    <p className="flex items-center gap-1.5">
                        © {currentYear} Crochetty. Made with{" "}
                        <Heart className="w-3 h-3 text-white/50 fill-white/50 inline" />{" "}
                        by hand.
                    </p>
                    <div className="flex gap-6">
                        <Link href="/privacy" className="hover:text-white/60 transition-colors cursor-pointer">
                            Privacy Policy
                        </Link>
                        <Link href="/terms" className="hover:text-white/60 transition-colors cursor-pointer">
                            Terms of Service
                        </Link>
                    </div>
                </div>

            </div>
        </footer>
    );
};
