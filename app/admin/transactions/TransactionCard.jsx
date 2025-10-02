import React from 'react';
import { format, parseISO } from 'date-fns';

const statusOptions = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Picked Up'];

const getStatusColor = (status) => {
    switch (status) {
        case 'Delivered': return "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300";
        case 'Processing': return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300";
        case 'Shipped': return "bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300";
        case 'Cancelled': return "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300";
        case 'Pending': return "bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300";
        case 'Picked Up': return "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300";
        default: return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
    }
};

const TransactionCard = ({ transaction, onStatusChange }) => {
    const orderDate = transaction.orderDate ? format(parseISO(transaction.orderDate), 'dd MMMM yyyy') : 'N/A';
    const statusColorClasses = getStatusColor(transaction.status);

    return (
        <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col justify-between">
            <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                    <input type="checkbox" className="form-checkbox text-blue-600 rounded bg-gray-200 dark:bg-gray-600 border-gray-300 dark:border-gray-500" />
                    <span className="font-semibold text-gray-700 dark:text-gray-200">#{transaction.id}</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">{transaction.orderType}</span>
                </div>
                <div className="relative">
                    <select
                        value={transaction.status}
                        onChange={(e) => onStatusChange(transaction.id, e.target.value)}
                        className={`appearance-none cursor-pointer pl-3 pr-8 py-1 text-xs font-semibold rounded-full border-0 focus:ring-2 focus:ring-blue-500 ${statusColorClasses}`}
                    >
                        {statusOptions.map(option => (
                            <option key={option} value={option}>{option}</option>
                        ))}
                    </select>
                     <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-4 mb-3">
                <img 
                    src={transaction.productImage || 'https://placehold.co/40x40'} 
                    alt={transaction.productName} 
                    className="w-12 h-12 object-cover rounded-md" 
                />
                <div>
                    <h3 className="text-md font-semibold text-gray-800 dark:text-gray-100">{transaction.productName}</h3>
                    {transaction.additionalProducts > 0 && (
                        <p className="text-sm text-gray-500 dark:text-gray-400">+{transaction.additionalProducts} Other Product</p>
                    )}
                </div>
                <div className="ml-auto text-lg font-bold text-gray-900 dark:text-white">${transaction.price?.toFixed(2)}</div>
            </div>

            <div className="grid grid-cols-2 gap-y-2 text-sm text-gray-600 dark:text-gray-400 border-t pt-3 border-gray-100 dark:border-gray-700">
                <div>Order Date</div>
                <div className="text-right font-medium text-gray-700 dark:text-gray-200">{orderDate}</div>
                <div>Customer</div>
                <div className="text-right font-medium text-gray-700 dark:text-gray-200">{transaction.customerName}</div>
                <div>Payment</div>
                <div className="text-right font-medium text-gray-700 dark:text-gray-200">{transaction.paymentMethod}</div>
            </div>
        </div>
    );
};

export default TransactionCard;