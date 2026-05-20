import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const CartContext = createContext(null);

export function CartProvider({ children }) {
    const [cartCount, setCartCount] = useState(0);
    const [cartItems, setCartItems] = useState([]);
    const [cartTotal, setCartTotal] = useState(0);
    const [drawerOpen, setDrawerOpen] = useState(false);

    const fetchCart = useCallback(async () => {
        try {
            const res = await axios.get('/api/cart/count');
            setCartCount(res.data.count ?? 0);
        } catch {
            // silent
        }
    }, []);

    useEffect(() => {
        fetchCart();
    }, [fetchCart]);

    const addToCart = useCallback(async (item) => {
        const res = await axios.post('/api/cart/add', item);
        const cart = res.data.cart;
        setCartCount(cart.items?.reduce((s, i) => s + i.quantity, 0) ?? 0);
        setCartItems(cart.items ?? []);
        setCartTotal(cart.items?.reduce((s, i) => s + i.unit_price * i.quantity, 0) ?? 0);
        return res.data;
    }, []);

    const removeItem = useCallback(async (id) => {
        await axios.delete(`/api/cart/items/${id}`);
        setCartItems(prev => prev.filter(i => i.id !== id));
        setCartCount(prev => Math.max(0, prev - 1));
    }, []);

    const updateQty = useCallback(async (id, quantity) => {
        await axios.patch(`/api/cart/items/${id}`, { quantity });
        setCartItems(prev => prev.map(i => i.id === id ? { ...i, quantity } : i));
    }, []);

    return (
        <CartContext.Provider value={{
            cartCount, cartItems, cartTotal,
            addToCart, removeItem, updateQty,
            drawerOpen, setDrawerOpen,
            fetchCart,
        }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const ctx = useContext(CartContext);
    if (!ctx) throw new Error('useCart must be used inside CartProvider');
    return ctx;
}
