"use client";

import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { useCart } from "@/context/CartContext";
import { markNotificationAsRead } from "@/services/notification.service";
import { formatDistanceToNow } from "date-fns";
import { motion } from "framer-motion";
import { Bell, BellOff, Clock, ShoppingCart, Info, User } from "lucide-react";

// --- Helper Functions & Components ---

// Categorizes notifications into time-based groups
const categorizeByTime = (notifications) => {
    const now = new Date();
    const today = [], lastWeek = [], older = [];

    notifications.forEach((notification) => {
        const notificationDate = new Date(notification.createdAt);
        const diffInDays = Math.floor((now - notificationDate) / (1000 * 60 * 60 * 24));
        if (diffInDays < 1) today.push(notification);
        else if (diffInDays < 7) lastWeek.push(notification);
        else older.push(notification);
    });
    return { today, lastWeek, older };
};

// Returns an icon based on the notification title
const getNotificationIcon = (title) => {
    const lowerCaseTitle = title.toLowerCase();
    if (lowerCaseTitle.includes('order')) return <ShoppingCart className="w-5 h-5 text-blue-500" />;
    if (lowerCaseTitle.includes('welcome')) return <Info className="w-5 h-5 text-green-500" />;
    if (lowerCaseTitle.includes('update profile')) return <User className="w-5 h-5 text-purple-500" />;
    return <Bell className="w-5 h-5 text-gray-500" />;
};


// --- UI Components ---

const NotificationTabs = ({ activeTab, setActiveTab, allCount, unreadCount }) => (
    <div className="flex items-center gap-2 rounded-full bg-gray-100 dark:bg-gray-800 p-1.5">
        {["all", "unread"].map((tab) => {
            const isActive = activeTab === tab;
            const count = tab === "all" ? allCount : unreadCount;
            return (
                <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`relative w-full rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                        isActive ? "text-white" : "text-gray-600 dark:text-gray-300 hover:bg-gray-200/70 dark:hover:bg-gray-700/60"
                    }`}
                >
                    {isActive && (
                        <motion.span
                            layoutId="active_pill"
                            className="absolute inset-0 z-0 rounded-full bg-black dark:bg-gray-700"
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                    )}
                    <span className="relative z-10 flex items-center justify-center gap-2">
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        <span className={`min-w-[24px] rounded-full px-1.5 py-0.5 text-xs ${isActive ? 'bg-white/20' : 'bg-gray-200 dark:bg-gray-600 text-gray-500 dark:text-gray-200'}`}>{count}</span>
                    </span>
                </button>
            );
        })}
    </div>
);

const NotificationItem = ({ item, onNotificationClick }) => (
    <div
        onClick={() => onNotificationClick(item.id)}
        className={`group relative flex cursor-pointer items-start gap-4 rounded-2xl p-4 transition-all duration-200 ${
            !item.isRead ? "bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100/60 dark:hover:bg-blue-900/30" : "bg-white dark:bg-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-700/50"
        }`}
    >
        {!item.isRead && <div className="absolute left-1.5 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-blue-500"></div>}
        
        <div className="flex-shrink-0 w-11 h-11 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
            {getNotificationIcon(item.title)}
        </div>

        <div className="flex-1">
            <div className="flex items-start justify-between">
                <h3 className="pr-4 font-semibold text-gray-800 dark:text-gray-100">{item.title}</h3>
                <span className="flex-shrink-0 text-xs text-gray-400 dark:text-gray-500">{formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}</span>
            </div>
            <p className="mt-1 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                {item.content}
            </p>
        </div>
    </div>
);

const NotificationSection = ({ title, data, onNotificationClick }) => {
    if (!data || data.length === 0) return null;
    return (
        <div className="mb-6">
            <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-500 dark:text-gray-400">
                <Clock className="h-4 w-4" />
                {title}
            </h2>
            <div className="space-y-2">
                {data.map((item) => <NotificationItem key={item.id} item={item} onNotificationClick={onNotificationClick} />)}
            </div>
        </div>
    );
};

const NoNotificationsMessage = ({ activeTab }) => (
    <div className="flex flex-col items-center justify-center py-16 text-center">
        <BellOff className="h-16 w-16 text-gray-300 dark:text-gray-600" />
        <h3 className="mt-4 text-lg font-semibold text-gray-800 dark:text-gray-100">No notifications yet</h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            You have no {activeTab === 'unread' && 'unread'} notifications at the moment.
        </p>
    </div>
);


// --- Main Notifications Page Component ---

export default function NotificationsPage() {
    const { data: session } = useSession();
    const { notifications, setNotifications } = useCart();
    const [activeTab, setActiveTab] = useState("all");
    
    const handleNotificationClick = async (notificationId) => {
        const notification = notifications.find((n) => n.id === notificationId);
        // ✅ FIX: Changed property to 'isRead'
        if (!notification || notification.isRead) return;

        const originalNotifications = [...notifications];
        // ✅ FIX: Changed property to 'isRead' for optimistic update
        setNotifications(prev =>
            prev.map(n => (n.id === notificationId ? { ...n, isRead: true } : n))
        );
        
        try {
            if (!session?.user?.id) throw new Error("User not authenticated");
            await markNotificationAsRead(notificationId, session.user.id);
        } catch (error) {
            console.error("Failed to mark notification as read:", error);
            setNotifications(originalNotifications);
        }
    };
    
    const sortedNotifications = [...notifications].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    // ✅ FIX: Changed property to 'isRead'
    const unreadCount = sortedNotifications.filter(n => !n.isRead).length;

    // ✅ FIX: Changed property to 'isRead'
    const filteredNotifications = sortedNotifications.filter(n =>
        activeTab === "all" ? true : !n.isRead
    );

    const { today, lastWeek, older } = categorizeByTime(filteredNotifications);

    return (
        <section className="bg-gray-50 dark:bg-gray-900 w-full px-4 sm:px-6 lg:px-8 min-h-screen py-8 sm:py-12">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white dark:bg-gray-800/50 border border-gray-200/80 dark:border-gray-700/60 rounded-3xl p-4 sm:p-8 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100">
                            Notifications
                        </h1>
                    </div>

                    <NotificationTabs
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                        allCount={notifications.length}
                        unreadCount={unreadCount}
                    />

                    <div className="mt-8">
                         {filteredNotifications.length === 0 ? (
                            <NoNotificationsMessage activeTab={activeTab} />
                        ) : (
                            <>
                                <NotificationSection title="Today" data={today} onNotificationClick={handleNotificationClick} />
                                <NotificationSection title="Last Week" data={lastWeek} onNotificationClick={handleNotificationClick} />
                                <NotificationSection title="Earlier" data={older} onNotificationClick={handleNotificationClick} />
                            </>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}