"use client";

import React, { useState, useEffect } from 'react';
import { X, Mail, Phone, Calendar, User, MapPin } from 'lucide-react';
import { fetchCustomerProfile } from '@/services/customer.service';
import { format } from 'date-fns';

const UserProfileModal = ({ isOpen, onClose, customer }) => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isOpen && customer) {
            const loadProfile = async () => {
                setLoading(true);
                const detailedProfile = await fetchCustomerProfile(customer.userId);
                setProfile(detailedProfile);
                setLoading(false);
            };
            loadProfile();
        }
    }, [isOpen, customer]);

    if (!isOpen || !customer) return null;

    const profileImage = profile?.profileImage || `https://ui-avatars.com/api/?name=${customer.firstName}+${customer.lastName}&background=random`;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-2xl transform transition-all text-gray-800 dark:text-gray-200">
                <div className="flex justify-between items-center mb-6 border-b dark:border-gray-700 pb-4">
                    <h2 className="text-2xl font-bold">Customer Profile</h2>
                    <button onClick={onClose} className="text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"><X size={24} /></button>
                </div>
                {loading ? (
                    <div className="text-center py-10">Loading profile...</div>
                ) : (
                    <div className="flex flex-col md:flex-row gap-8">
                        <div className="flex-shrink-0 text-center">
                            <img src={profileImage} alt="Profile" className="w-32 h-32 rounded-full mx-auto object-cover border-4 border-gray-200 dark:border-gray-600" />
                            <h3 className="text-xl font-bold mt-4">{customer.firstName} {customer.lastName}</h3>
                            <p className="text-gray-500 dark:text-gray-400">{customer.userName}</p>
                            <span className="mt-2 inline-block bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300 text-xs font-semibold px-2.5 py-0.5 rounded-full">{customer.role}</span>
                        </div>
                        <div className="flex-1 space-y-4">
                            <div className="flex items-center gap-4">
                                <Mail size={18} className="text-gray-400" />
                                <span className="text-gray-700 dark:text-gray-300">{customer.email}</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <Phone size={18} className="text-gray-400" />
                                <span className="text-gray-700 dark:text-gray-300">{profile?.phoneNumber || 'Not provided'}</span>
                            </div>
                             <div className="flex items-center gap-4">
                                <User size={18} className="text-gray-400" />
                                <span className="text-gray-700 dark:text-gray-300 capitalize">{profile?.gender || 'Not provided'}</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <Calendar size={18} className="text-gray-400" />
                                <span className="text-gray-700 dark:text-gray-300">
                                    {profile?.birthday ? format(new Date(profile.birthday), 'MMMM dd, yyyy') : 'Not provided'}
                                </span>
                            </div>
                             <div className="flex items-start gap-4">
                                <MapPin size={18} className="text-gray-400 mt-1" />
                                <span className="text-gray-700 dark:text-gray-300">{profile?.address || 'Not provided'}</span>
                            </div>
                            <div className="text-sm text-gray-400 pt-4 border-t dark:border-gray-700 mt-4">
                                Member since {format(new Date(customer.createdAt), 'MMMM dd, yyyy')}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserProfileModal;