"use client";

import React, { useState, useEffect } from 'react';
import { useCart } from "@/context/CartContext";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast from 'react-hot-toast';
import DeliveryAddress from './DeliveryAddress';
import ShoppingBagSummary from './ShoppingBagSummary.jsx';
import PaymentOptions from './PaymentOptions';
import OrderTotals from './OrderTotals';
import { fetchUserProfile } from '@/services/profile.service';
import QRCodeModal from './QRCodeModal'; // Import the new modal component

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api/v1';

const CheckoutClient = () => {
    const { cartItems, products } = useCart();
    const { data: session, status } = useSession();
    const router = useRouter();

    const [userProfile, setUserProfile] = useState(null);
    const [deliveryAddress, setDeliveryAddress] = useState({
        address: '',
        phoneNumber: ''
    });
    const [selectedPayment, setSelectedPayment] = useState('ABA PAY');
    const [contactMethod, setContactMethod] = useState('Phone call');
    const [isLoading, setIsLoading] = useState(false);
    const [isModalOpen, setModalOpen] = useState(false); // State to control modal visibility

    useEffect(() => {
        if (status === 'authenticated' && session?.user?.id) {
            const loadUserProfile = async () => {
                const profile = await fetchUserProfile(session.user.id);
                if (profile) {
                    setUserProfile(profile);
                    setDeliveryAddress({
                        address: profile.address || 'Phnom Penh',
                        phoneNumber: profile.phoneNumber || '0884979443'
                    });
                }
            };
            loadUserProfile();
        }
    }, [status, session]);

    const cartProducts = cartItems
        .map(item => {
            const product = products.find(p => p.id === item.productId);
            return product ? { ...item, product } : null;
        })
        .filter(Boolean);

    const subtotal = cartProducts.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
    const totalSave = cartProducts.reduce((acc, item) => {
        const original = item.product.originalPrice || item.product.price;
        return acc + (original - item.product.price) * item.quantity;
    }, 0);
    const deliveryFee = 1.0;
    const amountToPay = subtotal + deliveryFee;

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
        }
        if (status === 'authenticated' && cartProducts.length === 0) {
            router.push('/cart');
        }
    }, [status, cartProducts, router]);

    const handleConfirmPayment = async () => {
        setIsLoading(true);
        const toastId = toast.loading('Placing your order...');

        const transactionData = {
            userId: session.user.id,
            shippingAddress: `${session.user.name}, ${deliveryAddress.address}, ${deliveryAddress.phoneNumber}`,
            paymentMethod: selectedPayment,
            items: cartItems.map(item => ({
                productId: item.productId,
                quantity: item.quantity
            }))
        };

        try {
            const response = await fetch(`${API_BASE_URL}/transactions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session.user.token}`
                },
                body: JSON.stringify(transactionData)
            });

            if (!response.ok) {
                throw new Error('Failed to create transaction');
            }

            toast.success('Order placed successfully!', { id: toastId });
            setModalOpen(false); // Close modal on success
            router.push('/profile');
            
        } catch (error) {
            console.error("Checkout error:", error);
            toast.error('Could not place your order. Please try again.', { id: toastId });
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleCheckoutClick = () => {
        // For non-QR methods, process payment directly. For QR methods, open modal.
        if (selectedPayment === 'Cash On Delivery' || selectedPayment === 'Credit/Debit Card') {
            handleConfirmPayment();
        } else {
            setModalOpen(true);
        }
    };


    if (status === 'loading' || !session || !userProfile) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    return (
        <>
            <div className="container mx-auto px-4 py-10 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
                    {/* Left Column */}
                    <div>
                        <DeliveryAddress
                            user={session.user}
                            address={deliveryAddress}
                            setAddress={setDeliveryAddress}
                        />
                        <ShoppingBagSummary items={cartProducts} />
                    </div>

                    {/* Right Column */}
                    <div>
                        <PaymentOptions selected={selectedPayment} onSelect={setSelectedPayment} />
                        
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border dark:border-gray-700 mt-6">
                            <h3 className="font-semibold text-lg mb-4">Preferred contact method</h3>
                            <div className="flex items-center gap-2 mb-4">
                                {['Phone call', 'Telegram', 'WhatsApp'].map(method => (
                                    <button key={method} onClick={() => setContactMethod(method)} className={`flex-1 py-2 px-3 text-sm rounded-md border transition-colors ${contactMethod === method ? 'bg-black text-white border-black' : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 hover:bg-gray-50'}`}>
                                        {method}
                                    </button>
                                ))}
                            </div>
                            <input type="text" value={deliveryAddress.phoneNumber} onChange={(e) => setDeliveryAddress(prev => ({ ...prev, phoneNumber: e.target.value }))} className="w-full p-2 border rounded-md bg-gray-50 dark:bg-gray-700 dark:border-gray-600" />
                        </div>
                        
                        <OrderTotals 
                            subtotal={subtotal} 
                            totalSave={totalSave} 
                            deliveryFee={deliveryFee} 
                            amountToPay={amountToPay}
                        />
                        <button 
                            onClick={handleCheckoutClick}
                            disabled={isLoading}
                            className="w-full mt-6 bg-black text-white py-3.5 rounded-xl font-semibold hover:bg-gray-800 transition-transform transform hover:scale-105 disabled:bg-gray-400"
                        >
                            {isLoading ? 'Processing...' : 'Check out'}
                        </button>
                    </div>
                </div>
            </div>

            <QRCodeModal
                isOpen={isModalOpen}
                onClose={() => !isLoading && setModalOpen(false)}
                onConfirm={handleConfirmPayment}
                paymentMethod={selectedPayment}
                amountToPay={amountToPay}
                isLoading={isLoading}
            />
        </>
    );
};

export default CheckoutClient;