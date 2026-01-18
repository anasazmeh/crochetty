"use client";

import React from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Instagram, Facebook } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function ContactPage() {
    return (
        <div className="min-h-screen bg-[#FDFCFB] pt-24 pb-16">
            <div className="container mx-auto px-6">
                <div className="max-w-5xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-16">
                        {/* Contact Information */}
                        <div className="space-y-12">
                            <div>
                                <motion.h1
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="font-serif text-5xl text-primary mb-6"
                                >
                                    Let's Connect.
                                </motion.h1>
                                <motion.p
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 }}
                                    className="text-gray-600 text-lg leading-relaxed"
                                >
                                    Have a question about an order, or just want to say hello?
                                    We're here to help you find the perfect handcrafted piece.
                                </motion.p>
                            </div>

                            <div className="space-y-8">
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="flex items-start gap-6"
                                >
                                    <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center flex-shrink-0">
                                        <Mail className="w-6 h-6 text-[#1B7A6E]" />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-bold text-primary mb-1 uppercase tracking-wider">Email Us</h3>
                                        <p className="text-gray-600">hello@crochetty.com</p>
                                    </div>
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className="flex items-start gap-6"
                                >
                                    <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center flex-shrink-0">
                                        <MapPin className="w-6 h-6 text-[#1B7A6E]" />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-bold text-primary mb-1 uppercase tracking-wider">Studio</h3>
                                        <p className="text-gray-600">123 Artisan Way, <br />San Francisco, CA 94103</p>
                                    </div>
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.4 }}
                                    className="flex items-start gap-6"
                                >
                                    <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center flex-shrink-0">
                                        <Instagram className="w-6 h-6 text-[#1B7A6E]" />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-bold text-primary mb-1 uppercase tracking-wider">Follow Us</h3>
                                        <div className="flex gap-4 mt-2">
                                            <a href="#" className="text-gray-400 hover:text-[#1B7A6E] transition-colors"><Instagram className="w-5 h-5" /></a>
                                            <a href="#" className="text-gray-400 hover:text-[#1B7A6E] transition-colors"><Facebook className="w-5 h-5" /></a>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2 }}
                            className="bg-white p-12 rounded-3xl shadow-xl border border-gray-100"
                        >
                            <form className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-primary">Your Name</label>
                                    <input type="text" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-4 focus:outline-none focus:border-[#1B7A6E] transition-colors" placeholder="Name" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-primary">Email Address</label>
                                    <input type="email" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-4 focus:outline-none focus:border-[#1B7A6E] transition-colors" placeholder="email@example.com" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-primary">Subject</label>
                                    <select className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-4 focus:outline-none focus:border-[#1B7A6E] transition-colors appearance-none">
                                        <option>General Inquiry</option>
                                        <option>Order Support</option>
                                        <option>Wholesale</option>
                                        <option>Other</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-primary">Message</label>
                                    <textarea rows={5} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-4 focus:outline-none focus:border-[#1B7A6E] transition-colors" placeholder="How can we help you?"></textarea>
                                </div>
                                <Button className="w-full rounded-xl h-14 text-lg">
                                    Send Message
                                </Button>
                            </form>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}
