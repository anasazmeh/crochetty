'use client';

import React, { createContext, useContext, useState } from 'react';

type CartItem = {
    id: string;
    name: string;
    price: number;
    image: string;
    quantity: number;
};

interface CartContextType {
    cartOpen: boolean;
    openCart: () => void;
    closeCart: () => void;
    items: CartItem[];
    addItem: (item: CartItem) => void;
    removeItem: (id: string) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [cartOpen, setCartOpen] = useState(false);
    const [items, setItems] = useState<CartItem[]>([]);

    const openCart = () => setCartOpen(true);
    const closeCart = () => setCartOpen(false);

    const addItem = (newItem: CartItem) => {
        setItems(prev => {
            const existing = prev.find(item => item.id === newItem.id);
            if (existing) {
                return prev.map(item => item.id === newItem.id ? { ...item, quantity: item.quantity + 1 } : item);
            }
            return [...prev, newItem];
        });
        openCart();
    };

    const removeItem = (id: string) => {
        setItems(prev => prev.filter(item => item.id !== id));
    };

    return (
        <CartContext.Provider value={{ cartOpen, openCart, closeCart, items, addItem, removeItem }}>
            {children}
        </CartContext.Provider>
    );
}

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) throw new Error("useCart must be used within a CartProvider");
    return context;
};
