// chouseangly/my-app/my-app-main/app/(main)/profile/AddressBook.jsx
"use client";

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { MapPin, Phone, User, CheckCircle } from 'lucide-react';
import { fetchUserProfile, updateUserProfile } from '@/services/profile.service';
import toast from 'react-hot-toast';
import { useLanguage } from '@/context/LanguageContext';
import { translations } from '@/lib/translations';

export default function AddressBook() {
    const { data: session, update } = useSession();
    const { language } = useLanguage();
    const t = translations[language];
    const [profile, setProfile] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        firstName: session?.user?.firstName || '',
        lastName: session?.user?.lastName || '',
        address: '',
        phoneNumber: '',
    });

    useEffect(() => {
        if (session?.user?.id) {
            const loadProfile = async () => {
                setIsLoading(true);
                const fetchedProfile = await fetchUserProfile(session.user.id);
                if (fetchedProfile) {
                    setProfile(fetchedProfile);
                    setFormData(prev => ({
                        ...prev,
                        firstName: fetchedProfile.firstName || session?.user?.firstName || '',
                        lastName: fetchedProfile.lastName || session?.user?.lastName || '',
                        address: fetchedProfile.address || '',
                        phoneNumber: fetchedProfile.phoneNumber || '',
                    }));
                }
                setIsLoading(false);
            };
            loadProfile();
        }
    }, [session]);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = async (e) => {
        e.preventDefault();
        const toastId = toast.loading('Saving address...');
        setIsEditing(true);

        const data = new FormData();
        data.append('userId', session.user.id);
        data.append('firstName', formData.firstName);
        data.append('lastName', formData.lastName);
        data.append('userName', `${formData.firstName} ${formData.lastName}`);
        data.append('address', formData.address);
        data.append('phoneNumber', formData.phoneNumber);

        const result = await updateUserProfile(session.user.id, data);

        if (result) {
            toast.success('Address updated successfully!', { id: toastId });
            setProfile(result);
            setIsEditing(false);
            // Update session data for name changes
            await update({
                ...session,
                user: {
                    ...session.user,
                    name: `${result.firstName} ${result.lastName}`,
                    firstName: result.firstName,
                    lastName: result.lastName,
                },
            });
        } else {
            toast.error('Failed to update address.', { id: toastId });
        }
    };

    if (isLoading) return <div className="text-center py-10">{t.loading}...</div>;

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border dark:border-gray-700">
            <h3 className="text-xl font-bold mb-4 flex items-center">
                 <MapPin className="w-5 h-5 mr-2" />
                 {t.addressBook}
            </h3>
            
            {isEditing ? (
                <form onSubmit={handleSave} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1 dark:text-gray-300">{t.firstName}</label>
                            <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} className="w-full p-2 border rounded-md bg-gray-50 dark:bg-gray-700 dark:border-gray-600 text-gray-800 dark:text-gray-200" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1 dark:text-gray-300">{t.lastName}</label>
                            <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} className="w-full p-2 border rounded-md bg-gray-50 dark:bg-gray-700 dark:border-gray-600 text-gray-800 dark:text-gray-200" required />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1 dark:text-gray-300">Address</label>
                        <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded-md bg-gray-50 dark:bg-gray-700 dark:border-gray-600 text-gray-800 dark:text-gray-200"
                            placeholder="Enter your street address, district, city"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1 dark:text-gray-300">{t.mobileNumber}</label>
                        <input
                            type="tel"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded-md bg-gray-50 dark:bg-gray-700 dark:border-gray-600 text-gray-800 dark:text-gray-200"
                            placeholder="e.g., 088xxxxxxx"
                            required
                        />
                    </div>
                    <div className="flex gap-2 justify-end pt-2">
                        <button type="button" onClick={() => setIsEditing(false)} className="px-4 py-2 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">{t.cancel}</button>
                        <button type="submit" className="bg-black text-white dark:bg-white dark:text-black px-4 py-2 rounded-md font-semibold hover:bg-gray-800 dark:hover:bg-gray-200">{t.update}</button>
                    </div>
                </form>
            ) : (
                <div className="space-y-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-md">
                    <div className="flex justify-between items-start">
                        <h4 className="font-semibold text-lg text-gray-800 dark:text-gray-100 flex items-center">
                           <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                           {profile?.firstName} {profile?.lastName}
                        </h4>
                        <button onClick={() => setIsEditing(true)} className="text-sm font-medium text-black dark:text-white hover:underline">
                            {t.edit}
                        </button>
                    </div>

                    <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                         <p className="flex items-start">
                            <MapPin className="w-4 h-4 mr-3 mt-1 flex-shrink-0" />
                            <span className='break-words'>{profile?.address || 'No address set. Click Edit to add one.'}</span>
                        </p>
                        <p className="flex items-center">
                            <Phone className="w-4 h-4 mr-3 flex-shrink-0" />
                            {profile?.phoneNumber || 'No phone number set.'}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}