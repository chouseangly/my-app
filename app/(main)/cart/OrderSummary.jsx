import React from 'react';
import Link from 'next/link';

const OrderSummary = ({ subtotal }) => {
    const shipping = 5.00;
    const total = subtotal + shipping;

    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200/80 dark:border-gray-700/80 p-6 sticky top-28">
            <h2 className="text-xl font-bold mb-6 text-gray-800 dark:text-gray-100">Order Summary</h2>
            <div className="space-y-4">
                <div className="flex justify-between text-gray-600 dark:text-gray-300">
                    <span>Subtotal</span>
                    <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-300">
                    <span>Shipping</span>
                    <span className="font-medium">${shipping.toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-600 my-4"></div>
                <div className="flex justify-between font-bold text-xl text-gray-900 dark:text-white">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                </div>
            </div>
            {/* MODIFICATION: Changed button to a Link */}
            <Link href="/checkout" className="block text-center w-full mt-8 bg-black text-white py-3.5 rounded-xl font-semibold hover:bg-gray-800 transition-transform transform hover:scale-105">
                Proceed to Checkout
            </Link>
        </div>
    );
};

export default OrderSummary;