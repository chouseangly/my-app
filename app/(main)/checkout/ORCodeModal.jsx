"use client";

import React from 'react';
import { X } from 'lucide-react';
import Image from 'next/image';

const paymentMethodDetails = {
    'ABA PAY': {
        qr: '/qrcodes/aba_qr.jpg',
        logo: '/aba-pay-web.png',
        name: 'ABA PAY'
    },
    'Wing Bank': {
        qr: '/qrcodes/wing_qr.png',
        logo: '/Wing.png',
        name: 'Wing Bank'
    },
    'ACLEDA PAY': {
        qr: '/qrcodes/acleda_qr.png',
        logo: '/xpay.png',
        name: 'ACLEDA Bank'
    },
    'CHIP MONG BANK': {
        qr: '/qrcodes/chipmong_qr.png',
        logo: '/chip-mong-bank.png',
        name: 'CHIP MONG Bank'
    },
};

const QRCodeModal = ({ isOpen, onClose, onConfirm, paymentMethod, amountToPay, isLoading }) => {
    if (!isOpen) return null;

    const details = paymentMethodDetails[paymentMethod];

    if (!details) {
      onConfirm();
      return null;
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4 transition-opacity duration-300">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl w-full max-w-sm transform transition-transform duration-300 scale-95 animate-scale-in">
                <div className="flex justify-between items-center mb-4">
                    <Image src={details.logo} alt={details.name} width={100} height={32} />
                    <button onClick={onClose} disabled={isLoading} className="text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 disabled:opacity-50">
                        <X size={24} />
                    </button>
                </div>
                
                <div className="flex flex-col items-center">
                    <p className="text-gray-600 dark:text-gray-300 mb-2">Total Amount:</p>
                    <p className="text-4xl font-extrabold text-black dark:text-white mb-4">${amountToPay.toFixed(2)}</p>
                    
                    <div className="p-2 bg-white rounded-lg border">
                         <Image src={details.qr} alt={`${details.name} QR Code`} width={224} height={224} className="w-56 h-56 object-contain" />
                    </div>

                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-4 text-center">
                        Please scan the QR code with your mobile banking app to complete the payment.
                    </p>
                </div>

                <div className="mt-6 flex flex-col gap-3">
                    <button
                        onClick={onConfirm}
                        disabled={isLoading}
                        className="w-full py-3 bg-black text-white rounded-xl font-semibold hover:bg-gray-800 transition-transform transform hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Processing...' : 'I Have Paid'}
                    </button>
                    <button
                        onClick={onClose}
                        disabled={isLoading}
                        className="w-full py-3 bg-gray-200 text-gray-800 rounded-xl font-semibold hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 transition disabled:opacity-50"
                    >
                        Cancel
                    </button>
                </div>
            </div>
            <style jsx>{`
                @keyframes scale-in {
                    from { transform: scale(0.95); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                }
                .animate-scale-in {
                    animation: scale-in 0.2s ease-out forwards;
                }
            `}</style>
        </div>
    );
};

export default QRCodeModal;