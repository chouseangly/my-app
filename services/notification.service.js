import { getSession } from "next-auth/react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api/v1';

export const fetchNotifications = async (userId) => {
    const session = await getSession();
    if (!session?.user?.token) return [];

    try {
        const response = await fetch(`${API_BASE_URL}/notifications/${userId}`, {
            headers: { 'Authorization': `Bearer ${session.user.token}` }
        });
        if (!response.ok) throw new Error('Failed to fetch notifications');
        const apiResponse = await response.json();
        return apiResponse.payload || [];
    } catch (error) {
        console.error("Error fetching notifications:", error);
        return [];
    }
};

export const markNotificationAsRead = async (id, userId) => {
    const session = await getSession();
    if (!session?.user?.token) return false;

    try {
        const response = await fetch(`${API_BASE_URL}/notifications/${id}/read?userId=${userId}`, {
            method: 'PUT',
            headers: { 'Authorization': `Bearer ${session.user.token}` }
        });
        return response.ok;
    } catch (error) {
        console.error("Error marking notification as read:", error);
        return false;
    }
};