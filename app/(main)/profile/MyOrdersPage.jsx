// chouseangly/my-app/my-app-main/app/(main)/profile/MyOrdersPage.jsx
"use client";

import React, { useState, useEffect } from 'react';
import { fetchUserOrders } from '@/services/order.service';
import { useLanguage } from '@/context/LanguageContext';
import { translations } from '@/lib/translations';
import Image from 'next/image';
import { Package, Truck, XCircle, CheckCircle } from 'lucide-react';

const getStatusIcon = (status) => {
    switch (status) {
        case 'Delivered': return <CheckCircle className="w-5 h-5 text-green-500" />;
        case 'Shipped': return <Truck className="w-5 h-5 text-blue-500" />;
        case 'Cancelled': return <XCircle className="w-5 h-5 text-red-500" />;
        case 'Processing':
        case 'Pending':
        default: return <Package className="w-5 h-5 text-yellow-500" />;
    }
};

const getStatusColor = (status) => {
    switch (status) {
        case 'Delivered': return "text-green-600 dark:text-green-400";
        case 'Shipped': return "text-blue-600 dark:text-blue-400";
        case 'Cancelled': return "text-red-600 dark:text-red-400";
        default: return "text-yellow-600 dark:text-yellow-400";
    }
};


const OrderItemCard = ({ item }) => (
    <div className="flex items-start py-3 border-b border-gray-100 dark:border-gray-700/50">
        <Image 
            src={item.productImage || '/images/placeholder.png'} 
            alt={item.productName} 
            width={80} 
            height={100} 
            className="w-16 h-16 object-cover rounded-lg mr-4 flex-shrink-0" 
        />
        <div className="flex-grow">
            <p className="font-medium text-gray-800 dark:text-gray-100 text-sm line-clamp-2">{item.productName}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Color: {item.color} | Size: {item.size}</p>
        </div>
        <div className="text-right flex-shrink-0">
            <p className="font-semibold text-gray-800 dark:text-gray-100 text-sm">${(item.price * item.quantity).toFixed(2)}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Qty: {item.quantity}</p>
        </div>
    </div>
);


export default function MyOrdersPage() {
    const { language } = useLanguage();
    const t = translations[language];
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadOrders = async () => {
            setLoading(true);
            const fetchedOrders = await fetchUserOrders();
            setOrders(fetchedOrders);
            setLoading(false);
        };
        loadOrders();
    }, []);

    if (loading) return <div className="text-center py-10">{t.loading}...</div>;

    if (orders.length === 0) {
        return (
            <div className="text-center py-20">
                <Package className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto" />
                <h3 className="text-xl font-semibold mt-4 text-gray-800 dark:text-gray-100">No Orders Found</h3>
                <p className="text-gray-500 dark:text-gray-400 mt-2">Start shopping to see your purchase history here.</p>
            </div>
        );
    }
    
    return (
        <div className="space-y-6">
            {orders.map((order) => (
                <div key={order.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                    <div className="p-4 border-b dark:border-gray-700/50 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                        <div className="flex items-center space-x-3 mb-2 sm:mb-0">
                            {getStatusIcon(order.status)}
                            <span className={`font-semibold ${getStatusColor(order.status)}`}>{order.status}</span>
                        </div>
                        <div className="text-right text-sm">
                            <p className="font-medium text-gray-800 dark:text-gray-100">Order ID: #{order.id}</p>
                            <p className="text-gray-500 dark:text-gray-400">Placed on: {order.orderDate}</p>
                        </div>
                    </div>
                    
                    <div className="p-4">
                        <div className="max-h-60 overflow-y-auto pr-2 mb-4">
                            {order.items.map((item, index) => (
                                <OrderItemCard key={index} item={item} />
                            ))}
                        </div>

                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pt-2">
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2 sm:mb-0">
                                Total: <span className="text-lg font-bold text-gray-800 dark:text-gray-100 ml-1">${order.totalAmount.toFixed(2)}</span>
                            </p>
                            <button className="text-sm font-semibold text-black dark:text-white hover:underline">View Details</button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}