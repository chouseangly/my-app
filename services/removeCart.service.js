import { getSession } from "next-auth/react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api/v1';

export const addToCart = async (item) => {
    const session = await getSession();
    if (!session?.user?.token) return null;

    try {
        const response = await fetch(`${API_BASE_URL}/cart`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session.user.token}`
            },
            body: JSON.stringify(item)
        });
        if (!response.ok) throw new Error('Failed to add to cart');
        const apiResponse = await response.json();
        return apiResponse.payload;
    } catch (error) {
        console.error("Error adding to cart:", error);
        return null;
    }
};

export const fetchCart = async (userId) => {
    const session = await getSession();
    if (!session?.user?.token) return null;

    try {
        const response = await fetch(`${API_BASE_URL}/cart/${userId}`, {
            headers: { 'Authorization': `Bearer ${session.user.token}` }
        });
        if (!response.ok) throw new Error('Failed to fetch cart');
        const apiResponse = await response.json();
        return apiResponse.payload;
    } catch (error) {
        console.error("Error fetching cart:", error);
        return null;
    }
};

export const removeFromCart = async (cartItemId) => {
    const session = await getSession();
    if (!session?.user?.token) return false;

    try {
        const response = await fetch(`${API_BASE_URL}/cart/item/${cartItemId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${session.user.token}` }
        });
        return response.ok;
    } catch (error) {
        console.error("Error removing from cart:", error);
        return false;
    }
};