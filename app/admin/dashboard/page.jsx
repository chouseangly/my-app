"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { DollarSign, ListOrdered, UserCheck } from 'lucide-react';
// ✅ FIX: Changed the import to use a namespace
import * as dashboardService from '@/services/dashboard.service';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
// Import necessary charting components from recharts
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format, subMonths } from 'date-fns';


const RevenueChart = ({ revenue }) => {
    // This component remains the same
    const dynamicChartData = useMemo(() => {
        const data = [];
        const today = new Date();
        for (let i = 5; i >= 0; i--) {
            const month = subMonths(today, i);
            data.push({
                name: format(month, 'MMM'), // e.g., "Jan", "Feb"
                current: Math.floor(Math.random() * (5000 - 1500 + 1) + 1500),
                previous: Math.floor(Math.random() * (4000 - 1000 + 1) + 1000),
            });
        }
        return data;
    }, []);

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md col-span-1 lg:col-span-2">
            <div className="flex justify-between items-center mb-4">
                <div>
                    <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">Revenue</h3>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                        ${revenue.toLocaleString()}
                        <span className="text-sm font-semibold text-green-500 ml-2">+8.26%</span>
                    </p>
                </div>
                <div className="flex gap-4 text-sm">
                    <p className="text-gray-500 dark:text-gray-400">Total Earn</p>
                    <p className="text-gray-500 dark:text-gray-400">Total Views</p>
                </div>
            </div>
            <div className="h-64 w-full">
                 <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={dynamicChartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                        <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} />
                        <YAxis stroke="#9ca3af" fontSize={12} />
                        <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none' }} />
                        <Legend wrapperStyle={{ fontSize: "14px" }} />
                        <Line type="monotone" dataKey="current" stroke="#fb923c" strokeWidth={2} activeDot={{ r: 8 }} name="Current Period" />
                        <Line type="monotone" dataKey="previous" stroke="#4ade80" strokeWidth={2} name="Previous Period" />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

const StatCard = ({ title, value, change, icon: Icon, iconBgColor }) => (
    // This component remains the same
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md flex-1">
        <div className="flex justify-between items-start">
            <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">{title}</p>
                <p className="text-2xl font-bold text-gray-800 dark:text-gray-100 mt-1">{value}</p>
            </div>
            <div className={`p-2 rounded-lg ${iconBgColor}`}>
                <Icon size={20} className="text-white" />
            </div>
        </div>
        {change && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                {change}
            </p>
        )}
    </div>
);

const DashboardPage = () => {
    const { status } = useSession();
    const router = useRouter();
    const [stats, setStats] = useState({ salesToday: 0, totalEarning: 0, totalOrders: 0, visitorToday: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
        }
        
        if (status === 'authenticated') {
            const loadDashboardData = async () => {
                setLoading(true);
                // ✅ FIX: Call the function from the imported module object
                const fetchedStats = await dashboardService.fetchDashboardStats();
                if (fetchedStats) {
                    setStats(fetchedStats);
                }
                setLoading(false);
            };
            loadDashboardData();
        }
    }, [status, router]);

    if (loading || status === 'loading') {
        return <div className="flex justify-center items-center py-20">Loading Dashboard Content...</div>;
    }

    return (
        <div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 my-8">
                <RevenueChart revenue={stats.totalEarning} />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6">
                    <StatCard
                        title="Sales Today"
                        value={`$${stats.salesToday.toLocaleString()}`}
                        change="Updated every order success"
                        icon={DollarSign}
                        iconBgColor="bg-orange-500"
                    />
                    <StatCard
                        title="Total Earning"
                        value={`$${stats.totalEarning.toLocaleString()}`}
                        change="+8.28% More earning than usual"
                        icon={DollarSign}
                        iconBgColor="bg-green-500"
                    />
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <StatCard
                    title="Total Orders"
                    value={stats.totalOrders.toLocaleString()}
                    change="+2.18% More orders than usual"
                    icon={ListOrdered}
                    iconBgColor="bg-blue-500"
                />
                <StatCard
                    title="Visitor Today"
                    value={stats.visitorToday.toLocaleString()}
                    change="+3.08% More visitors than usual"
                    icon={UserCheck}
                    iconBgColor="bg-indigo-500"
                />
            </div>
        </div>
    );
};

export default DashboardPage;