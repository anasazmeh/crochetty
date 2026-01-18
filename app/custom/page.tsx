"use client";

import React from "react";
import { motion } from "framer-motion";
import { Hammer, Palette, Clock, Send, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function CustomOrdersPage() {
    return (
        <div className="min-h-screen bg-[#FDFCFB] pt-24 pb-16">
            <div className="container mx-auto px-6">
                {/* Header */}
                <div className="max-w-3xl mx-auto text-center mb-20">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-2 bg-[#1B7A6E]/10 text-[#1B7A6E] px-4 py-1 rounded-full text-sm font-semibold mb-6"
                    >
                        <Sparkles className="w-4 h-4" />
                        Bespoke Creations
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="font-serif text-5xl md:text-6xl text-primary mb-8"
                    >
                        Your Vision, <br /> Our Craft.
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-gray-600 text-lg leading-relaxed"
                    >
                        Whether it's a specific colorway, a unique size, or a completely new creation,
                        we love bringing bespoke ideas to life. Let's create something timeless together.
                    </motion.p>
                </div>

                {/* Process Steps */}
                <div className="grid md:grid-cols-3 gap-12 mb-24">
                    {[
                        {
                            icon: Palette,
                            title: "1. Consultation",
                            desc: "Share your ideas, color preferences, and measurements with us."
                        },
                        {
                            icon: Hammer,
                            title: "2. Creation",
                            desc: "We meticulously hand-crochet your piece using premium, sustainable fibers."
                        },
                        {
                            icon: Clock,
                            title: "3. Delivery",
                            desc: "Once perfected, your custom piece is carefully packed and shipped to its new home."
                        }
                    ].map((step, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className="bg-white p-10 rounded-2xl shadow-sm border border-gray-100 text-center"
                        >
                            <div className="w-16 h-16 bg-[#1B7A6E]/5 rounded-full flex items-center justify-center mx-auto mb-6">
                                <step.icon className="w-8 h-8 text-[#1B7A6E]" />
                            </div>
                            <h3 className="font-serif text-2xl text-primary mb-4">{step.title}</h3>
                            <p className="text-gray-500 leading-relaxed">{step.desc}</p>
                        </motion.div>
                    ))}
                </div>

                {/* Inquiry Form Teaser */}
                <section className="max-w-4xl mx-auto">
                    <div className="bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row border border-gray-100">
                        <div className="md:w-1/3 bg-primary p-12 text-white flex flex-col justify-center">
                            <h2 className="font-serif text-3xl mb-6">Send an Inquiry</h2>
                            <p className="text-white/70 mb-8 leading-relaxed">
                                Please allow 48 hours for us to respond with a quote and timeframe.
                            </p>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 text-sm">
                                    <div className="w-2 h-2 rounded-full bg-green-400"></div>
                                    Currently accepting orders
                                </div>
                            </div>
                        </div>
                        <div className="md:w-2/3 p-12">
                            <form className="space-y-6">
                                <div className="grid sm:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-primary">Full Name</label>
                                        <input type="text" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-[#1B7A6E]" placeholder="Jane Doe" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-primary">Email Address</label>
                                        <input type="email" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-[#1B7A6E]" placeholder="jane@example.com" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-primary">What are you looking for?</label>
                                    <textarea rows={4} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-[#1B7A6E]" placeholder="Describe your dream piece..."></textarea>
                                </div>
                                <Button className="w-full rounded-lg h-14 text-lg">
                                    <Send className="w-5 h-5 mr-2" />
                                    Submit Inquiry
                                </Button>
                            </form>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
