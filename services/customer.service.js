// chouseangly/zandoapp/zandoApp-main/src/services/customer.service.js
import { getSession } from "next-auth/react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api/v1';

/**
 * Fetches all users from the backend.
 * Requires admin authentication.
 */
export const fetchAllCustomers = async () => {
  const session = await getSession();
  if (!session?.user?.token) {
    console.error("Authentication token not found.");
    return [];
  }

  try {
    const response = await fetch(`${API_BASE_URL}/auths`, {
      headers: {
        'Authorization': `Bearer ${session.user.token}`
      }
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const apiResponse = await response.json();
    return apiResponse.payload;

  } catch (error) {
    console.error("Failed to fetch customers:", error);
    return [];
  }
};

/**
 * Fetches a single user's detailed profile.
 * Requires admin authentication.
 * @param {number} userId - The ID of the user to fetch.
 */
export const fetchCustomerProfile = async (userId) => {
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

/**
 * Fetches all transactions to display as a customer activity log.
 * Requires admin authentication.
 */
export const fetchAllTransactionsForCustomerView = async () => {
  const session = await getSession();
  if (!session?.user?.token) {
    console.error("Authentication token not found.");
    return [];
  }

  try {
    const response = await fetch(`${API_BASE_URL}/transactions`, {
      headers: {
        'Authorization': `Bearer ${session.user.token}`
      }
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`Network response was not ok: ${errorBody}`);
    }

    const apiResponse = await response.json();
    return apiResponse.payload || []; // Ensure we return an array

  } catch (error) {
    console.error("Failed to fetch transactions:", error);
    return [];
  }
};

export const fetchAllUserProfiles = async () => {
  const session = await getSession();
  if (!session?.user?.token) {
    console.error("Authentication token not found.");
    return [];
  }

  try {
    const response = await fetch(`${API_BASE_URL}/profile`, {
      headers: {
        'Authorization': `Bearer ${session.user.token}`
      }
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const apiResponse = await response.json();
    return apiResponse.payload;

  } catch (error) {
    console.error("Failed to fetch user profiles:", error);
    return [];
  }
};