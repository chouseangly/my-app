import { getSession } from "next-auth/react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api/v1';

/**
 * Fetches all favorite items for a given user.
 * @param {number} userId - The ID of the user.
 */
export const fetchFavoritesByUserId = async (userId) => {
    const session = await getSession();
    if (!session?.user?.token) return [];

    try {
        const response = await fetch(`${API_BASE_URL}/favorites/${userId}`, {
            headers: { 'Authorization': `Bearer ${session.user.token}` }
        });
        if (!response.ok) throw new Error('Failed to fetch favorites');
        const apiResponse = await response.json();
        return apiResponse.payload || [];
    } catch (error) {
        console.error("Error fetching favorites:", error);
        return [];
    }
};

/**
 * Adds a product to the user's favorites.
 * @param {number} userId - The ID of the user.
 * @param {number} productId - The ID of the product.
 */
export const addFavorite = async (userId, productId) => {
    const session = await getSession();
    if (!session?.user?.token) return null;

    try {
        const response = await fetch(`${API_BASE_URL}/favorites`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session.user.token}`
            },
            body: JSON.stringify({ userId, productId })
        });
        if (!response.ok) throw new Error('Failed to add favorite');
        const apiResponse = await response.json();
        return apiResponse.payload;
    } catch (error) {
        console.error("Error adding favorite:", error);
        return null;
    }
};

/**
 * Removes a product from the user's favorites.
 * @param {number} userId - The ID of the user.
 * @param {number} productId - The ID of the product.
 */
export const removeFavorite = async (userId, productId) => {
    const session = await getSession();
    if (!session?.user?.token) return false;

    try {
        const response = await fetch(`${API_BASE_URL}/favorites/${productId}?userId=${userId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${session.user.token}` }
        });
        return response.ok;
    } catch (error) {
        console.error("Error removing favorite:", error);
        return false;
    }
};