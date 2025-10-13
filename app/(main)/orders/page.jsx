"use client";

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { fetchTransactionsByUserId } from '@/services/transaction.service';
import { format } from 'date-fns';
import { motion } from "framer-motion";
import { ShoppingCart, Package, Truck, CheckCircle, XCircle } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const getStatusIcon = (status) => {
    switch (status) {
        case 'Processing': return <Package className="w-5 h-5 text-yellow-500" />;
        case 'Shipped': return <Truck className="w-5 h-5 text-blue-500" />;
        case 'Delivered': return <CheckCircle className="w-5 h-5 text-green-500" />;
        case 'Cancelled': return <XCircle className="w-5 h-5 text-red-500" />;
        default: return <ShoppingCart className="w-5 h-5 text-gray-500" />;
    }
};

const StatusTimeline = ({ history }) => (
    <div className="px-5 pt-5">
        <ol className="relative border-l border-gray-200 dark:border-gray-700">
            {history.map((event, index) => (
                <li key={index} className="mb-6 ml-6">
                    <span className="absolute flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full -left-3 ring-8 ring-white dark:ring-gray-900 dark:bg-blue-900">
                        {getStatusIcon(event.status)}
                    </span>
                    <h3 className="flex items-center mb-1 text-lg font-semibold text-gray-900 dark:text-white">{event.status}</h3>
                    <time className="block mb-2 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">{format(new Date(event.statusDate), 'MMMM dd, yyyy, h:mm a')}</time>
                </li>
            ))}
        </ol>
    </div>
);


const OrderItem = ({ item }) => (
    <div className="flex items-center gap-4 py-4">
        <Image
            src={item.product?.variants?.[0]?.images?.[0] || '/no-listings-fav.jpg'}
            alt={item.product?.name}
            width={100}
            height={100}
            className="w-30 h-30 object-cover rounded-lg border"
        />
        <div className="flex-grow mb-8">
            <p className="font-semibold text-gray-800 dark:text-gray-100 text-2xl">{item.product?.name}</p>
            <p className="font-semibold text-gray-800 dark:text-gray-100 text-lg">{item.product?.description}</p>
            <p className="text-lg text-gray-500 dark:text-gray-400 ">Qty: {item.quantity}</p>
        </div>
        <p className="font-semibold text-gray-800 dark:text-gray-100 text-lg">${item.priceAtPurchase.toFixed(2)}</p>
    </div>
);

const OrderCard = ({ order, index }) => {
    const [showTimeline, setShowTimeline] = useState(true);
    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                delay: index * 0.1,
                duration: 0.5,
                ease: "easeOut"
            }
        }
    };

    return (
        <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border dark:border-gray-700 overflow-hidden"
        >
            <div className="p-5 border-b dark:border-gray-700 flex justify-between items-center">
                <div>
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white">Order #{order.id}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        {format(new Date(order.orderDate), 'MMMM dd, yyyy')}
                    </p>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium bg-gray-100 dark:bg-gray-700">
                    {getStatusIcon(order.status)}
                    <span className="dark:text-gray-200">{order.status}</span>
                </div>
            </div>
            <div className="p-5 divide-y dark:divide-gray-700">
                {order.items.map(item => (
                    <OrderItem key={item.id} item={item} />
                ))}
            </div>
            <div className="p-5 bg-gray-50 dark:bg-gray-800/50 flex justify-between items-center gap-4">
                <button
                    onClick={() => setShowTimeline(!showTimeline)}
                    className="text-sm text-blue-500 hover:underline"
                >
                    {showTimeline ? 'Hide' : 'Show'} Timeline
                </button>
                <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-600 dark:text-gray-300">Total:</span>
                    <span className="font-bold text-xl text-gray-900 dark:text-white">${order.totalAmount.toFixed(2)}</span>
                </div>
            </div>
            {showTimeline && <StatusTimeline history={order.statusHistory} />}
        </motion.div>
    );
};


export default function OrdersPage() {
    const { data: session, status } = useSession();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (status === 'authenticated' && session?.user?.id) {
            const loadOrders = async () => {
                setLoading(true);
                const userOrders = await fetchTransactionsByUserId(session.user.id);
                setOrders(userOrders || []);
                setLoading(false);
            };
            loadOrders();
        } else if (status === 'unauthenticated') {
            // Redirect or show login message
        }
    }, [status, session]);

    if (loading || status === 'loading') {
        return <div className="text-center py-20 dark:text-gray-300">Loading your orders...</div>;
    }

    return (
        <section className="bg-gray-50 dark:bg-gray-900 w-full min-h-screen py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl  mx-auto">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-8">My Orders</h1>
                {orders.length > 0 ? (
                    <div className="space-y-6">
                        {orders.map((order, index) => (
                            <OrderCard key={order.id} order={order} index={index} />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                        <ShoppingCart className="h-20 w-20 text-gray-300 dark:text-gray-600 mb-4" />
                        <h2 className="font-semibold text-2xl mb-2 dark:text-gray-100">No Orders Yet</h2>
                        <p className="text-gray-600 dark:text-gray-400 max-w-sm mb-6">
                            You haven't placed any orders yet. When you do, they'll show up here!
                        </p>
                        <Link href="/" className="px-6 py-3 bg-black text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors">
                            Start Shopping
                        </Link>
                    </div>
                )}
            </div>
        </section>
    );
}