// chouseangly/my-app/my-app-main/services/order.service.js

import { format, parseISO } from 'date-fns';
import { getSession } from "next-auth/react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api/v1';

/**
 * Helper function to structure a single transaction for the frontend.
 * Reuses logic similar to transaction.service but adapted for user view.
 */
const structureTransactionForUser = (backendTransaction) => {
    const primaryItem = backendTransaction.items?.[0];
    const product = primaryItem?.product;

    return {
        id: backendTransaction.id,
        // Assuming backend returns cart items with product details nested
        items: backendTransaction.items.map(item => ({
            id: item.id, // cart item id
            productName: item.product.name,
            // Assuming variant structure for image
            productImage: item.product.variants?.[0]?.images?.[0] || '/images/placeholder.png', 
            price: item.product.price,
            quantity: item.quantity,
            color: item.product.variants?.[0]?.color || 'N/A',
            size: item.size?.name || 'N/A',
        })),
        totalAmount: backendTransaction.totalAmount,
        status: backendTransaction.status,
        orderDate: backendTransaction.orderDate ? format(parseISO(backendTransaction.orderDate), 'dd MMM yyyy') : 'N/A',
        paymentMethod: backendTransaction.paymentMethod,
        shippingAddress: backendTransaction.shippingAddress,
    };
};

/**
 * Fetches transactions for the authenticated user.
 */
export async function fetchUserOrders() {
    const session = await getSession();

    if (!session?.user?.token || !session?.user?.id) {
        console.error("Authentication token not found.");
        return [];
    }
    
    // Assuming the /transactions endpoint implicitly filters by the user associated with the token.
    try {
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

        // Filter and map transactions to the desired structure for display, and sort by date
        return backendTransactions
               .filter(t => t.user?.userId === session.user.id) // Explicit client-side filter fallback
               .map(structureTransactionForUser)
               .sort((a, b) => parseISO(b.orderDate) - parseISO(a.orderDate));


    } catch (error) {
        console.error("Failed to fetch user orders:", error);
        return [];
    }
}