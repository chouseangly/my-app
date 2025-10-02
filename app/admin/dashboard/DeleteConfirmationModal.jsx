"use client";

import React from 'react';
import { X } from 'lucide-react';
import { useSession } from "next-auth/react"; // 1. Import useSession

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const DeleteConfirmationModal = ({ isOpen, onClose, product, onProductDeleted }) => {
    const { data: session } = useSession(); // 2. Get the session data

    const handleDelete = async () => {
        try {
            // ✅ **Authentication Fix**
            // Ensure you have a valid token before sending the request.
            if (!session?.user?.token) {
                console.error("Authentication token not found.");
                // Optionally, show a toast notification to the user here.
                return;
            }

            const response = await fetch(`${API_BASE_URL}/products/admin/${product.id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${session.user.token}`
                }
            });

            if (response.ok) {
                onProductDeleted();
                onClose();
            } else {
                const errorText = await response.text();
                console.error("Failed to delete product:", errorText);
            }
        } catch (error) {
            console.error("Error deleting product:", error);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-md text-gray-800 dark:text-gray-200">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold">Confirm Deletion</h2>
                    <button onClick={onClose}><X size={24} /></button>
                </div>
                <p>Are you sure you want to delete the product "{product.name}"?</p>
                <div className="flex justify-end mt-4">
                    <button type="button" onClick={onClose} className="mr-2 px-4 py-2 bg-gray-300 dark:bg-gray-600 rounded-md">Cancel</button>
                    <button onClick={handleDelete} className="px-4 py-2 bg-red-600 text-white rounded-md">Delete</button>
                </div>
            </div>
        </div>
    );
};

export default DeleteConfirmationModal;