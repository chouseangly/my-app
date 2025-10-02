"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, ChevronDown, Filter, Upload } from 'lucide-react';
import { format, parseISO, isValid } from 'date-fns';
import { fetchTransactions, fetchTransactionStatusCounts, updateTransactionStatus } from '@/services/transaction.service';
import DatePicker from '@/components/ui/DatePicker';
import TransactionCard from './transactionCard';

const statusOptions = ['All Status', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Pending', 'Picked Up'];

const TransactionClient = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statusCounts, setStatusCounts] = useState({});
    
    const [searchInputValue, setSearchInputValue] = useState('');
    const [selectedDate, setSelectedDate] = useState(null);

    const currentStatusFilter = searchParams.get('status') || 'All Status';
    const currentSearchQuery = searchParams.get('q') || '';
    const currentDateFrom = searchParams.get('dateFrom');
    const currentDateTo = searchParams.get('dateTo');

    const handleStatusChange = async (transactionId, newStatus) => {
        const originalTransactions = [...transactions];
        
        setTransactions(prev =>
            prev.map(t => (t.id === transactionId ? { ...t, status: newStatus } : t))
        );

        const updatedTransaction = await updateTransactionStatus(transactionId, newStatus);

        if (!updatedTransaction) {
            setTransactions(originalTransactions);
            // You can add an error toast here if you like
        } else {
            // Re-fetch counts to update the tabs
            const fetchedCounts = await fetchTransactionStatusCounts();
            setStatusCounts(fetchedCounts);
        }
    };

    useEffect(() => {
        setSearchInputValue(currentSearchQuery);
        if (currentDateFrom && isValid(parseISO(currentDateFrom))) {
            setSelectedDate(parseISO(currentDateFrom));
        } else {
            setSelectedDate(null);
        }
    }, [currentSearchQuery, currentDateFrom]);

    const updateSearchParams = useCallback((key, value) => {
        const newParams = new URLSearchParams(searchParams.toString());
        if (value) {
            newParams.set(key, value);
        } else {
            newParams.delete(key);
        }
        router.push(`?${newParams.toString()}`);
    }, [router, searchParams]);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        updateSearchParams('q', searchInputValue.trim());
    };

    const handleStatusFilter = (status) => {
        updateSearchParams('status', status === 'All Status' ? null : status);
    };

    const handleDateSelect = (date) => {
        setSelectedDate(date);
        if (date) {
            const formattedDate = format(date, 'yyyy-MM-dd');
            updateSearchParams('dateFrom', formattedDate);
            updateSearchParams('dateTo', formattedDate);
        } else {
            updateSearchParams('dateFrom', null);
            updateSearchParams('dateTo', null);
        }
    };

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            
            const filters = {
                search: currentSearchQuery,
                status: currentStatusFilter,
                dateRange: (currentDateFrom && currentDateTo) ? { 
                    from: parseISO(currentDateFrom), 
                    to: parseISO(currentDateTo) 
                } : null,
            };

            const [fetchedTransactions, fetchedCounts] = await Promise.all([
                fetchTransactions(filters),
                fetchTransactionStatusCounts(),
            ]);
            
            setTransactions(fetchedTransactions);
            setStatusCounts(fetchedCounts);
            setLoading(false);
        };

        loadData();
    }, [currentStatusFilter, currentSearchQuery, currentDateFrom, currentDateTo]);

    return (
        <div className="px-4 py-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Transaction</h1>
                    <div className="flex items-center text-sm breadcrumbs text-gray-600 dark:text-gray-400">
                        <ul>
                            <li>Dashboard</li>
                            <li>Transaction</li>
                        </ul>
                    </div>
                    <button className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-lg flex items-center gap-2 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                        <Upload size={18} /> Export All Transaction
                    </button>
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md mb-8">
                    <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
                        <form onSubmit={handleSearchSubmit} className="relative flex-grow max-w-sm">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Search orders..."
                                value={searchInputValue}
                                onChange={(e) => setSearchInputValue(e.target.value)}
                                className="w-full bg-gray-100 dark:bg-gray-700 py-2 pl-10 pr-4 rounded-lg border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </form>
                        <div className="flex items-center gap-4 flex-wrap">
                            <DatePicker 
                                selectedDate={selectedDate}
                                onSelectDate={handleDateSelect}
                                placeholder="Select Date"
                            />
                            <button className="flex items-center gap-2 text-gray-600 dark:text-gray-300 text-sm font-medium border rounded-md px-3 py-1.5 hover:bg-gray-50 dark:hover:bg-gray-700">
                                <Filter size={16} /> Filters <ChevronDown size={16} />
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {statusOptions.map(status => (
                            <button
                                key={status}
                                onClick={() => handleStatusFilter(status)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                    currentStatusFilter === status
                                        ? 'bg-black dark:bg-white text-white dark:text-black'
                                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
                                }`}
                            >
                                {status} ({statusCounts[status] || 0})
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {loading ? (
                        Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 animate-pulse h-60">
                                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
                                <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
                                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                            </div>
                        ))
                    ) : transactions.length > 0 ? (
                        transactions.map(transaction => (
                            <TransactionCard
                                key={transaction.id}
                                transaction={transaction}
                                onStatusChange={handleStatusChange}
                            />
                        ))
                    ) : (
                        <div className="col-span-full text-center py-10 text-gray-600 dark:text-gray-400">No transactions found for the current filters.</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TransactionClient;