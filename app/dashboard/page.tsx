'use client';

import { Button } from "@/components/ui/Button";

// Mock Order Data
const orders = [
    {
        id: "ORD-7382-XJ",
        date: "October 10, 2023",
        status: "Delivered",
        total: 185.00,
        items: ["Heritage Cardigan"]
    },
    {
        id: "ORD-9921-MC",
        date: "September 22, 2023",
        status: "Delivered",
        total: 55.00,
        items: ["Lunar Scallop Bralette"]
    }
];

export default function DashboardPage() {
    return (
        <div className="min-h-screen bg-background pt-32 pb-24">
            <div className="container mx-auto px-6 max-w-4xl">
                <div className="flex items-center justify-between mb-12">
                    <h1 className="font-serif text-4xl text-primary">My Account</h1>
                    <Button variant="outline" size="sm">Log Out</Button>
                </div>

                <div className="grid md:grid-cols-3 gap-12">
                    <div className="md:col-span-1 space-y-8">
                        <div>
                            <h2 className="font-bold text-lg mb-4">Profile</h2>
                            <p className="text-gray-600">Jane Doe</p>
                            <p className="text-gray-600">jane.doe@example.com</p>
                        </div>
                        <div>
                            <h2 className="font-bold text-lg mb-4">Default Address</h2>
                            <p className="text-gray-600">123 Artisan Way</p>
                            <p className="text-gray-600">Brooklyn, NY 11211</p>
                            <p className="text-gray-600">United States</p>
                        </div>
                    </div>

                    <div className="md:col-span-2">
                        <h2 className="font-serif text-2xl mb-6">Order History</h2>
                        <div className="space-y-4">
                            {orders.map((order) => (
                                <div key={order.id} className="bg-white p-6 border border-gray-100 shadow-sm flex flex-col md:flex-row justify-between md:items-center gap-4">
                                    <div>
                                        <p className="font-bold text-primary mb-1">Order #{order.id}</p>
                                        <p className="text-sm text-gray-500 mb-2">{order.date}</p>
                                        <p className="text-sm text-gray-600">{order.items.join(", ")}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-medium text-primary mb-1">${order.total.toFixed(2)}</p>
                                        <span className="inline-block px-3 py-1 rounded-full bg-green-100 text-green-800 text-xs font-medium uppercase tracking-wide">
                                            {order.status}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
