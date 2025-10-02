import React from 'react';

const OrderTotals = ({ subtotal, totalSave, deliveryFee, amountToPay }) => {
    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border dark:border-gray-700 mt-6 space-y-3 text-sm">
            <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">Total</span>
                <span>${subtotal.toFixed(2)}</span>
            </div>
            {totalSave > 0 && (
                <div className="flex justify-between text-green-600">
                    <span >Save</span>
                    <span>-${totalSave.toFixed(2)}</span>
                </div>
            )}
            <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">Delivery fee (ZANDO Bikers)</span>
                <span>${deliveryFee.toFixed(2)}</span>
            </div>
            <div className="border-t border-dashed dark:border-gray-600 my-2"></div>
            <div className="flex justify-between font-bold text-lg">
                <span>Amount to pay</span>
                <span>${amountToPay.toFixed(2)}</span>
            </div>
        </div>
    );
};

export default OrderTotals;