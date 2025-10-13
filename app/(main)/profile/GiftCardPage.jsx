// chouseangly/my-app/my-app-main/app/(main)/profile/GiftCardPage.jsx
"use client";

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { translations } from '@/lib/translations';
import { Gift, CreditCard, Plus } from 'lucide-react';
import Image from 'next/image';

const GiftCardPage = () => {
    const { language } = useLanguage();
    const t = translations[language];

    // Mock data for existing gift cards
    const mockGiftCards = [
        { id: 1, lastFour: '1234', balance: 50.00, expiry: '12/2026' },
        { id: 2, lastFour: '5678', balance: 25.00, expiry: '06/2025' },
    ];

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border dark:border-gray-700">
            <h3 className="text-xl font-bold mb-6 flex items-center">
                <Gift className="w-5 h-5 mr-2" />
                {t.giftCard}
            </h3>

            {/* Existing Gift Cards / Balances */}
            <div className="space-y-4 mb-8">
                <h4 className="font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2 border-b pb-2 dark:border-gray-700">
                    <CreditCard size={18} /> My Balances ({mockGiftCards.length})
                </h4>
                {mockGiftCards.map(card => (
                    <div key={card.id} className="flex justify-between items-center bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
                        <div>
                            <p className="font-bold text-gray-800 dark:text-gray-100">Gift Card ending in {card.lastFour}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Expires: {card.expiry}</p>
                        </div>
                        <div className="text-right">
                            <span className="text-xl font-extrabold text-green-600">${card.balance.toFixed(2)}</span>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Remaining Balance</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Redeem New Gift Card Section */}
            <div className="space-y-4 pt-4 border-t dark:border-gray-700">
                <h4 className="font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <Plus size={18} /> Redeem New Gift Card
                </h4>
                <div className="flex flex-col sm:flex-row gap-4">
                    <input
                        type="text"
                        placeholder="Enter 16-digit gift card code"
                        className="flex-1 p-3 border rounded-md bg-gray-50 dark:bg-gray-700 dark:border-gray-600 text-gray-800 dark:text-gray-200 focus:ring-black focus:border-black"
                        maxLength={16}
                    />
                    <button className="px-6 py-3 bg-black text-white rounded-md font-semibold hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 transition">
                        Redeem
                    </button>
                </div>
            </div>

            {/* Gift Card Promotion Placeholder */}
             <div className="mt-8 pt-6 border-t dark:border-gray-700 text-center">
                 <h4 className="font-semibold text-gray-800 dark:text-gray-100 mb-4">
                     Looking for the perfect gift?
                 </h4>
                {/* Reusing existing image as a placeholder for a gift card banner */}
                <div className='relative w-full h-40 rounded-lg overflow-hidden mx-auto'>
                    <Image 
                        src="/ban3.jpg" 
                        alt="Gift Promotion" 
                        layout="fill" 
                        objectFit="cover" 
                        className="opacity-70"
                    />
                     <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                        <span className='text-white text-xl font-bold'>Buy a Digital Gift Card</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GiftCardPage;