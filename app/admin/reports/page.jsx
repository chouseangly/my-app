"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { DollarSign, ListOrdered, Users, ArrowUp, ArrowDown } from 'lucide-react';
import { fetchDashboardStats, fetchAdminProducts } from '@/services/dashboard.service';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { format, subMonths } from 'date-fns';

// --- Reusable Components ---

const StatCard = ({ title, value, change, changeType, icon: Icon }) => (
  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md flex-1">
    <div className="flex justify-between items-center">
      <div className="flex flex-col">
        <span className="text-sm text-gray-500 dark:text-gray-400">{title}</span>
        <span className="text-2xl font-bold text-gray-800 dark:text-gray-100 mt-1">{value}</span>
      </div>
      <Icon className="w-8 h-8 text-gray-400 dark:text-gray-500" />
    </div>
    <div className={`flex items-center text-sm mt-2 ${changeType === 'increase' ? 'text-green-500' : 'text-red-500'}`}>
      {changeType === 'increase' ? <ArrowUp size={16} className="mr-1" /> : <ArrowDown size={16} className="mr-1" />}
      <span>{change}</span>
    </div>
  </div>
);

const RevenueChart = ({ totalEarning }) => {
    // Dynamically generate chart data for the last 6 months for a realistic look
    const dynamicChartData = useMemo(() => {
        const data = [];
        const today = new Date();
        for (let i = 5; i >= 0; i--) {
            const month = subMonths(today, i);
            data.push({
                name: format(month, 'MMM'),
                current: Math.floor(Math.random() * (4500 - 2000 + 1) + 2000),
                previous: Math.floor(Math.random() * (3500 - 1500 + 1) + 1500),
            });
        }
        return data;
    }, []);

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md col-span-2">
            <div className="flex justify-between items-center">
                 <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">Revenue</h3>
                 <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">${totalEarning.toLocaleString()}</p>
            </div>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={dynamicChartData}>
                    <XAxis dataKey="name" fontSize={12} stroke="#6b7280" />
                    <YAxis fontSize={12} stroke="#6b7280" />
                    <Tooltip contentStyle={{ backgroundColor: '#374151', border: 'none' }} itemStyle={{ color: '#d1d5db' }} />
                    <Legend wrapperStyle={{ fontSize: "14px", color: "#9ca3af" }} />
                    <Line type="monotone" dataKey="current" name="Current Period" stroke="#8884d8" strokeWidth={2} activeDot={{ r: 8 }} />
                    <Line type="monotone" dataKey="previous" name="Previous Period" stroke="#82ca9d" strokeWidth={2} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

const SalesLocationChart = () => {
    // Mock data for sales locations
    const locations = [
        { name: 'New York', x: '25%', y: '35%', sales: '$2.5K' },
        { name: 'London', x: '48%', y: '25%', sales: '$1.8K' },
        { name: 'Phnom Penh', x: '73%', y: '55%', sales: '$1.2K' },
        { name: 'Sydney', x: '85%', y: '75%', sales: '$950' },
    ];

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4">Sales By Location</h3>
            <div className="relative">
                <svg viewBox="0 0 500 250" className="w-full h-auto">
                    {/* Simplified world map path */}
                    <path d="M499.5,143.2 L499.5,143.2 L493.4,141.4 L485.4,144.3 L479.2,142 L474.3,138.3 L469.3,138.8 L465,142.1 L462.1,142.2 L460.6,138.8 L457.2,137.9 L454.2,138.4 L450.5,142 L450,142 L440.6,139.4 L435.5,138.2 L431.1,137.1 L427.5,134 L422.5,130.8 L417,128.5 L412.3,125.7 L409.8,122.3 L404.9,118.8 L400.8,118.2 L396.9,119.5 L394.1,118.2 L392,114.7 L388.5,112.2 L385.5,112.4 L380.2,110.1 L376.5,106.8 L374.2,102.1 L374.2,102.1 L373.2,101.4 L370.8,103.1 L365.2,104 L360.5,102.3 L357.7,100 L355.7,96.3 L351.4,94.9 L348,95.5 L345.2,97.7 L343,99.9 L340.5,100.2 L337.8,99.9 L335.7,98.6 L332.2,97.3 L327.9,97.6 L324,98.6 L320.1,100 L315.7,100.9 L310.2,100.6 L305.5,98.1 L300.9,94.2 L297.8,90.4 L295.5,85.2 L294.5,80.1 L293.4,75.4 L292.5,70.1 L291.6,65.2 L290,60 L288,55.5 L285,50.2 L280,45.1 L275.5,40.4 L270,35.2 L265.4,32.2 L260.8,30 L255.4,28.6 L250.2,28 L245.5,28.4 L240.2,30.3 L235.6,33.8 L230.1,38.2 L225.5,42.1 L220.3,46.5 L215.5,50 L210.2,54.5 L205.8,59.9 L200.4,65.5 L195,70.1 L190.5,74.4 L185.3,78.8 L180.2,82.4 L175.5,85.5 L170.8,88.2 L165.4,90.9 L160.8,92.6 L155.2,94.5 L150,96.1 L145.4,97.7 L140.8,99.1 L135.2,100.3 L130.3,101.5 L125.5,102.6 L120.3,103.2 L115.8,103.4 L110.1,103.2 L105,103.5 L100.2,104.2 L95.8,105.5 L90,107.8 L85.5,109.9 L80.1,112.5 L75.3,115.1 L70.8,117.8 L65.3,120.2 L60.2,122.5 L55.8,124.7 L50.3,126.8 L45.2,128.5 L40.3,129.9 L35.5,130.9 L30.2,131.5 L25.5,131.7 L20.8,131.5 L15.3,131.1 L10.2,130.2 L5.5,129.1 L0.5,127.8 L0.5,127.8" fill="#e5e7eb" className="dark:fill-gray-700"/>
                </svg>
                {locations.map(loc => (
                    <div key={loc.name} className="absolute" style={{ left: loc.x, top: loc.y }}>
                        <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                        <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-white dark:bg-gray-900 px-2 py-1 rounded-md shadow-lg text-xs whitespace-nowrap text-gray-700 dark:text-gray-200">
                            <span className="font-bold">{loc.name}:</span> {loc.sales}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const TopProductsTable = ({ products }) => (
  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mt-6">
    <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">Top Selling Products</h3>
        <button className="text-sm text-blue-500 hover:underline">See All</button>
    </div>
    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead>
          <tr className="border-b dark:border-gray-700">
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-500 dark:text-gray-400">Product Name</th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-500 dark:text-gray-400">Price</th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-500 dark:text-gray-400">Category</th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-500 dark:text-gray-400">Units Sold</th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-500 dark:text-gray-400">Total Earning</th>
          </tr>
        </thead>
        <tbody>
          {products.slice(0, 5).map(product => (
            <tr key={product.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <td className="py-3 px-4 flex items-center">
                    <img src={product.gallery?.[0]?.images?.[0] || 'https://placehold.co/40x40'} alt={product.name} className="w-10 h-10 rounded-md object-cover mr-4" />
                    <span className="font-medium text-gray-800 dark:text-gray-100">{product.name}</span>
                </td>
                <td className="py-3 px-4 text-gray-600 dark:text-gray-300">${product.price.toFixed(2)}</td>
                <td className="py-3 px-4 text-gray-600 dark:text-gray-300">{product.categories?.[0]?.name || 'N/A'}</td>
                <td className="py-3 px-4 text-gray-600 dark:text-gray-300">{product.sell}</td>
                <td className="py-3 px-4 font-semibold text-gray-800 dark:text-gray-100">${product.earning.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

// --- Main Report Page Component ---

const ReportsPage = () => {
    const { status } = useSession();
    const router = useRouter();
    const [stats, setStats] = useState({ salesToday: 0, totalEarning: 0, totalOrders: 0, visitorToday: 0 });
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
        } else if (status === 'authenticated') {
            const loadData = async () => {
                setLoading(true);
                const [fetchedStats, fetchedProducts] = await Promise.all([
                    fetchDashboardStats(),
                    fetchAdminProducts()
                ]);
                if (fetchedStats) setStats(fetchedStats);
                if (fetchedProducts) setProducts(fetchedProducts);
                setLoading(false);
            };
            loadData();
        }
    }, [status, router]);

    if (loading || status === 'loading') {
        return <div className="flex justify-center items-center h-screen bg-gray-100 dark:bg-gray-900 dark:text-gray-300">Loading Reports...</div>
    }

    return (
        <div className="p-8 min-h-screen">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">Reports</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <StatCard title="Total Sales" value={`$${stats.totalEarning.toLocaleString()}`} change="14% in the last month" changeType="increase" icon={DollarSign} />
                <StatCard title="Total Orders" value={stats.totalOrders.toLocaleString()} change="17% in the last month" changeType="decrease" icon={ListOrdered} />
                <StatCard title="Sales Today" value={`$${stats.salesToday.toLocaleString()}`} change="14% in the last month" changeType="increase" icon={DollarSign} />
                <StatCard title="Total Customers" value={stats.visitorToday.toLocaleString()} change="11% in the last month" changeType="decrease" icon={Users} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <RevenueChart totalEarning={stats.totalEarning} />
                <SalesLocationChart />
            </div>

            <TopProductsTable products={products} />
        </div>
    );
};

export default ReportsPage;