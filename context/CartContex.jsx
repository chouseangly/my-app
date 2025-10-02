"use client";

import React, { createContext, useState, useEffect, useContext } from 'react';
import { useSession } from 'next-auth/react';
import { fetchFavoritesByUserId, addFavorite, removeFavorite } from '@/services/favorite.service';
import { fetchAllProducts } from '@/services/allProduct.service';
import toast from 'react-hot-toast';
import { fetchNotifications } from '@/services/notification.service';
import { fetchCart, addToCart, removeFromCart } from '@/services/cart.service';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const { data: session, status } = useSession();
    const [favorites, setFavorites] = useState([]);
    const [cartItems, setCartItems] = useState([]);
    const [products, setProducts] = useState([]);
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        const getProducts = async () => {
            const fetchedProducts = await fetchAllProducts();
            setProducts(fetchedProducts);
        };
        getProducts();
    }, []);

    useEffect(() => {
        if (status === 'authenticated' && session?.user?.id) {
            const loadUserData = async () => {
                const [favs, notifs, cart] = await Promise.all([
                    fetchFavoritesByUserId(session.user.id),
                    fetchNotifications(session.user.id),
                    fetchCart(session.user.id)
                ]);
                setFavorites(favs || []);
                setNotifications(notifs || []);
                if (cart) {
                    setCartItems(cart.items || []);
                }
            };
            loadUserData();
        } else if (status === 'unauthenticated') {
            setFavorites([]);
            setCartItems([]);
            setNotifications([]);
        }
    }, [status, session]);

    const handleAddFavorite = async (productId) => {
        if (!session?.user?.id) {
            toast.error("Please log in to add items to your wishlist.");
            return;
        }

        const isAlreadyFavorite = favorites.some(fav => fav.productId === productId);
        if (isAlreadyFavorite) {
            toast("This item is already in your wishlist!", { icon: '❤️' });
            return;
        }

        const newFavorite = await addFavorite(session.user.id, productId);
        if (newFavorite) {
            setFavorites(prev => [...prev, newFavorite]);
            toast.success("Added to wishlist!");
        } else {
            toast.error("Failed to add to wishlist.");
        }
    };

    const handleRemoveFavorite = async (productId) => {
        if (!session?.user?.id) return;
        
        const success = await removeFavorite(session.user.id, productId);
        if (success) {
            setFavorites(prev => prev.filter(fav => fav.productId !== productId));
            toast.success("Removed from wishlist.");
        } else {
            toast.error("Failed to remove from wishlist.");
        }
    };

    const handleAddToCart = async (item) => {
        if (!session?.user?.id) {
            toast.error("Please log in to add items to your cart.");
            return;
        }
        const updatedCart = await addToCart(item);
        if (updatedCart) {
            setCartItems(updatedCart.items);
            toast.success("Added to cart!");
        } else {
            toast.error("Failed to add to cart.");
        }
    };

    const handleRemoveFromCart = async (cartItemId) => {
        if (!session?.user?.id) return;
        const success = await removeFromCart(cartItemId);
        if (success) {
            setCartItems(prev => prev.filter(item => item.cartItemId !== cartItemId));
            toast.success("Removed from cart.");
        } else {
            toast.error("Failed to remove from cart.");
        }
    };

    const value = {
        favorites,
        cartItems,
        products,
        notifications,
        setNotifications,
        addFavorite: handleAddFavorite,
        removeFavorite: handleRemoveFavorite,
        addToCart: handleAddToCart,
        removeFromCart: handleRemoveFromCart,
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);