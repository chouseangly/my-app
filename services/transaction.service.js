// src/services/transaction.service.js

import { format, parseISO, isValid } from 'date-fns';
import { getSession } from "next-auth/react";

// The base URL of your Spring Boot backend API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api/v1';

/**
 * This helper function transforms the detailed data from your backend
 * into the simpler structure that your frontend components expect.
 */
const structureTransactionData = (backendTransaction) => {
    // The main product to display on the card is the first item in the transaction
    const primaryItem = backendTransaction.items?.[0];
    const product = primaryItem?.product;

    return {
        id: backendTransaction.id,
        orderType: 'Standard Shipping', // This can be added to your backend model later if needed
        // ✅ FIX: Changed `product?.gallery` to `product?.variants` to match the backend response
        productImage: product?.variants?.[0]?.images?.[0] || '/images/placeholder.png',
        productName: product?.name || 'Product Not Found',
        additionalProducts: backendTransaction.items.length - 1,
        price: backendTransaction.totalAmount,
        status: backendTransaction.status,
        orderDate: backendTransaction.orderDate ? format(parseISO(backendTransaction.orderDate), 'yyyy-MM-dd') : null,
        customerName: backendTransaction.user?.userName || 'N/A', // Uses the user object from the backend
        paymentMethod: backendTransaction.paymentMethod,
    };
};

/**
 * Fetches all transactions from your backend and applies client-side filtering.
 */
export async function fetchTransactions(filters = {}) {
    const session = await getSession();

    if (!session?.user?.token) {
        console.error("Authentication token not found.");
        return []; // Return empty if not authenticated
    }

    try {
        // Note: Your backend doesn't have filtering yet, so we fetch all and filter on the client.
        const response = await fetch(`${API_BASE_URL}/transactions`, {
            headers: {
                'Authorization': `Bearer ${session.user.token}`
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const apiResponse = await response.json();
        const backendTransactions = apiResponse.payload || [];

        // 1. Map the backend data to the structure your frontend components expect
        const structuredData = backendTransactions.map(structureTransactionData);
        
        // 2. Apply filtering on the client-side
        let filtered = structuredData;
        if (filters.search) {
             const searchTerm = filters.search.toLowerCase();
             filtered = filtered.filter(t => 
                t.productName.toLowerCase().includes(searchTerm) || 
                t.customerName.toLowerCase().includes(searchTerm) ||
                String(t.id).includes(searchTerm)
             );
        }
        if (filters.status && filters.status !== 'All Status') {
            filtered = filtered.filter(t => t.status === filters.status);
        }
        if (filters.dateRange?.from) {
            const fromDate = format(filters.dateRange.from, 'yyyy-MM-dd');
            filtered = filtered.filter(t => t.orderDate && t.orderDate >= fromDate);
        }

        return filtered;

    } catch (error) {
        console.error("Failed to fetch transactions:", error);
        return []; // Return an empty array on error
    }
}

/**
 * Fetches all transactions and calculates the count for each status tab.
 */
export async function fetchTransactionStatusCounts() {
    const session = await getSession();
    if (!session?.user?.token) return { 'All Status': 0 };

     try {
        const response = await fetch(`${API_BASE_URL}/transactions`, {
            headers: {
                'Authorization': `Bearer ${session.user.token}`
            }
        });
        if (!response.ok) throw new Error('Failed to fetch for counts');
        
        const apiResponse = await response.json();
        const transactions = apiResponse.payload || [];
        
        const counts = transactions.reduce((acc, t) => {
            acc[t.status] = (acc[t.status] || 0) + 1;
            return acc;
        }, {});
        
        counts['All Status'] = transactions.length;
        return counts;

    } catch (error) {
        console.error("Failed to fetch transaction counts:", error);
        return { 'All Status': 0 };
    }
}

export async function updateTransactionStatus(transactionId, status) {
    const session = await getSession();
    if (!session?.user?.token) {
        console.error("Authentication token not found.");
        return null;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/transactions/${transactionId}/status`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session.user.token}`
            },
            body: status
        });

        if (!response.ok) {
            throw new Error('Failed to update transaction status');
        }

        const apiResponse = await response.json();
        return apiResponse.payload;

    } catch (error) {
        console.error(`Failed to update status for transaction ${transactionId}:`, error);
        return null;
    }
}