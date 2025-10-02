"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { Plus, Search, MoreHorizontal, Download, Upload, Users, ListOrdered, FileText, DollarSign } from 'lucide-react';
import { fetchAllCustomers, fetchAllTransactionsForCustomerView, fetchAllUserProfiles } from '@/services/customer.service';
import { fetchDashboardStats } from '@/services/dashboard.service';
import UserProfileModal from './UserProfileModal';
import { format } from 'date-fns';
import DatePicker from '@/components/ui/DatePicker';

// Progress bar component for the table
const ProgressBar = ({ percentage }) => {
    let bgColor = 'bg-green-500';
    if (percentage < 70) bgColor = 'bg-yellow-500';
    if (percentage < 40) bgColor = 'bg-red-500';

    return (
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div className={`${bgColor} h-2 rounded-full`} style={{ width: `${percentage}%` }}></div>
        </div>
    );
};

// Status badge component for the table
const StatusBadge = ({ status }) => {
    const lowerCaseStatus = status.toLowerCase();
    let styles = 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'; // Default
    if (lowerCaseStatus === 'paid' || lowerCaseStatus === 'delivered') {
        styles = 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300';
    } else if (lowerCaseStatus === 'unpaid' || lowerCaseStatus === 'pending') {
        styles = 'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300';
    } else if (lowerCaseStatus === 'cancelled') {
        styles = 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300';
    }
    return (
        <span className={`px-3 py-1 text-xs font-semibold rounded-md ${styles}`}>
            {status}
        </span>
    );
};

// Stat card component for the top section
const StatCard = ({ title, value, percentage, icon: Icon, children }) => (
    <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-md flex items-start justify-between">
        <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
            <p className="text-2xl font-bold text-gray-800 dark:text-gray-100 mt-1">{value}</p>
            <div className="flex items-center text-xs mt-2">
                {children}
                <span className="text-green-500 font-semibold ml-2">{percentage}</span>
            </div>
        </div>
        <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
            <Icon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        </div>
    </div>
);

const CustomerClient = () => {
    const [transactionData, setTransactionData] = useState([]);
    const [customerCount, setCustomerCount] = useState(0);
    const [stats, setStats] = useState({ totalOrders: 0, totalEarning: 0 });
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [isProfileModalOpen, setProfileModalOpen] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            const [fetchedTransactions, fetchedCustomers, fetchedStats, fetchedProfiles] = await Promise.all([
                fetchAllTransactionsForCustomerView(),
                fetchAllCustomers(),
                fetchDashboardStats(),
                fetchAllUserProfiles()
            ]);
            
            const profilesMap = new Map(fetchedProfiles.map(p => [p.userId, p]));

            const enhancedTransactions = fetchedTransactions.map(t => {
              const userProfile = t.user ? profilesMap.get(t.user.userId) : null;
              return {
                  ...t,
                  user: {
                      ...t.user,
                      profileImage: userProfile?.profileImage
                  },
                  amountDue: (t.totalAmount * (Math.random() * 0.5)).toFixed(2),
                  shopRate: Math.floor(Math.random() * 100),
              }
            });

            setTransactionData(enhancedTransactions);
            setCustomerCount(fetchedCustomers.length);
            setStats(fetchedStats);
            setLoading(false);
        };
        loadData();
    }, []);

    const filteredData = useMemo(() => {
        if (!searchQuery) return transactionData;
        return transactionData.filter(t =>
            (t.user && `${t.user.firstName} ${t.user.lastName}`.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (t.user && t.user.email.toLowerCase().includes(searchQuery.toLowerCase()))
        );
    }, [transactionData, searchQuery]);

    const handleViewProfile = (transaction) => {
        setSelectedCustomer(transaction.user);
        setProfileModalOpen(true);
    };
    
    const handleDateSelect = (date) => {
        setSelectedDate(date);
    };

    if (loading) {
        return <div className="text-center py-10 dark:text-gray-400">Loading Customers...</div>;
    }

    return (
        <>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Customers</h1>
                <div className="flex items-center gap-3">
                    <button className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-600 text-sm font-medium">
                        <Upload size={16} /> Export
                    </button>
                    <button className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-600 text-sm font-medium">
                        <Download size={16} /> Import
                    </button>
                    <button className="bg-black dark:bg-white text-white dark:text-black px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-800 dark:hover:bg-gray-200 text-sm font-medium">
                        <Plus size={18} /> Add User
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <StatCard title="All Customers" value={`${customerCount.toLocaleString()}+`} percentage="+20.9%" icon={Users}>
                    <div className="flex -space-x-2">
                         {transactionData.slice(0, 4).map(t => t.user && <img key={t.id} className="w-6 h-6 rounded-full border-2 border-white" src={t.user.profileImage || `https://ui-avatars.com/api/?name=${t.user.firstName}+${t.user.lastName}&background=random`} alt={t.user.userName} />)}
                    </div>
                </StatCard>
                <StatCard title="Orders" value={stats.totalOrders.toLocaleString()} percentage="+5.9%" icon={ListOrdered} />
                <StatCard title="Service Requests" value="900" percentage="+20.9%" icon={FileText} />
                <StatCard title="Invoices & Payments" value={`$${stats.totalEarning.toLocaleString()}`} percentage="+60.2%" icon={DollarSign} />
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
                <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
                     <div className="relative w-full max-w-sm">
                       <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                       <input
                           type="text"
                           placeholder="Search by name or email..."
                           value={searchQuery}
                           onChange={(e) => setSearchQuery(e.target.value)}
                           className="w-full bg-gray-50 dark:bg-gray-700 py-2 pl-10 pr-4 rounded-lg border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 dark:text-gray-200"
                       />
                    </div>
                    <div className="flex items-center gap-4">
                        <DatePicker 
                            selectedDate={selectedDate}
                            onSelectDate={handleDateSelect}
                            placeholder="1/1/2023 - 12/31/2023" 
                        />
                        <button className="text-gray-600 dark:text-gray-300 font-medium text-sm">More Filters</button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead>
                            <tr className="border-b-2 border-gray-100 dark:border-gray-700">
                                <th className="px-4 py-3"><input type="checkbox" className="rounded"/></th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Customer</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Invoice</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Status</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Total Amount</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Amount Due</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Shop Rate</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Due Date</th>
                                <th className="px-4 py-3"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredData.map((transaction) => (
                                <tr key={transaction.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                    <td className="px-4 py-2"><input type="checkbox" className="rounded"/></td>
                                    <td className="px-4 py-2">
                                        {transaction.user ? (
                                            <div className="flex items-center gap-3">
                                                <img src={transaction.user.profileImage || `https://ui-avatars.com/api/?name=${transaction.user.firstName}+${transaction.user.lastName}&background=random`} alt={transaction.user.userName} className="w-8 h-8 rounded-full object-cover" />
                                                <span className="font-medium text-gray-800 dark:text-gray-100">{transaction.user.firstName} {transaction.user.lastName}</span>
                                            </div>
                                        ) : (
                                            <span className="text-sm text-gray-500 dark:text-gray-400">N/A</span>
                                        )}
                                    </td>
                                    <td className="px-4 py-2 text-sm text-gray-600 dark:text-gray-300">F-{transaction.id}</td>
                                    <td className="px-4 py-2"><StatusBadge status={transaction.status} /></td>
                                    <td className="px-4 py-2 text-sm text-gray-600 dark:text-gray-300">${parseFloat(transaction.totalAmount).toFixed(2)}</td>
                                    <td className="px-4 py-2 text-sm text-gray-600 dark:text-gray-300">${transaction.amountDue}</td>
                                    <td className="px-4 py-2"><ProgressBar percentage={transaction.shopRate} /></td>
                                    <td className="px-4 py-2 text-sm text-gray-600 dark:text-gray-300">{format(new Date(transaction.orderDate), 'dd MMM yyyy')}</td>
                                    <td className="px-4 py-2">
                                        <button onClick={() => handleViewProfile(transaction)} className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
                                            <MoreHorizontal size={20} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            
            <UserProfileModal 
                isOpen={isProfileModalOpen} 
                onClose={() => setProfileModalOpen(false)} 
                customer={selectedCustomer} 
            />
        </>
    );
};

export default CustomerClient;