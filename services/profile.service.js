// chouseangly/my-app/my-app-main/services/profile.service.js
import { getSession } from "next-auth/react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api/v1';

export const fetchUserProfile = async (userId) => {
    const session = await getSession();
    if (!session?.user?.token) {
        console.error("Authentication token not found.");
        return null;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/profile/${userId}`, {
            headers: {
                'Authorization': `Bearer ${session.user.token}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch user profile');
        }

        const apiResponse = await response.json();
        return apiResponse.payload;
    } catch (error) {
        console.error(`Failed to fetch profile for user ${userId}:`, error);
        return null;
    }
};

export const updateUserProfile = async (userId, profileData) => {
    const session = await getSession();
    if (!session?.user?.token) {
        console.error("Authentication token not found.");
        return null;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/profile/edit`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${session.user.token}`
            },
            body: profileData // FormData will be passed here
        });

        if (!response.ok) {
            throw new Error('Failed to update user profile');
        }

        const apiResponse = await response.json();
        return apiResponse.payload;
    } catch (error) {
        console.error("Error updating user profile:", error);
        return null;
    }
};

// **NEW FUNCTION**
export const updateUserPassword = async (userId, oldPassword, newPassword, confirmPassword) => {
    const session = await getSession();
    if (!session?.user?.token) {
        console.error("Authentication token not found.");
        return null;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/auths/change-password`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session.user.token}`
            },
            body: JSON.stringify({ userId, oldPassword, newPassword, confirmPassword })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to update password.');
        }

        return true;
    } catch (error) {
        console.error("Error updating password:", error);
        return null;
    }
};