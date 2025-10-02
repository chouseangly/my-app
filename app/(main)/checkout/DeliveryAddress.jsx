import React, { useState } from 'react';
import { CheckCircle } from 'lucide-react';
import { updateUserProfile } from '@/services/profile.service';
import toast from 'react-hot-toast';

const DeliveryAddress = ({ user, address, setAddress }) => {
    const [isEditing, setIsEditing] = useState(false);

    const handleSave = async () => {
        const formData = new FormData();
        formData.append('userId', user.id);
        formData.append('address', address.address);
        formData.append('phoneNumber', address.phoneNumber);

        const toastId = toast.loading('Saving address...');
        const updatedProfile = await updateUserProfile(user.id, formData);

        if (updatedProfile) {
            toast.success('Address updated!', { id: toastId });
            setIsEditing(false);
        } else {
            toast.error('Failed to update address.', { id: toastId });
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border dark:border-gray-700 mb-6">
            <h3 className="font-semibold text-lg mb-4">Delivery address</h3>
            {isEditing ? (
                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div > 
                            <label className="block text-sm font-medium mb-1">First name</label>
                            <input type="text" value={user.firstName} onChange={(e) => setUserProfile(prev => ({ ...prev, firstName: e.target.value }))} className="w-full p-2 border rounded-md bg-gray-50 dark:bg-gray-700 dark:border-gray-600" /></div>
                        <div> 
                            <label className="block text-sm font-medium mb-1">Last name</label>
                            <input type="text" value={user.lastName} onChange={(e) => setUserProfile(prev => ({ ...prev, lastName: e.target.value }))} className="w-full p-2 border rounded-md bg-gray-50 dark:bg-gray-700 dark:border-gray-600" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Address</label>
                        <input
                            type="text"
                            value={address.address}
                            onChange={(e) => setAddress(prev => ({ ...prev, address: e.target.value }))}
                            className="w-full p-2 border rounded-md bg-gray-50 dark:bg-gray-700 dark:border-gray-600"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Phone Number</label>
                        <input
                            type="text"
                            value={address.phoneNumber}
                            onChange={(e) => setAddress(prev => ({ ...prev, phoneNumber: e.target.value }))}
                            className="w-full p-2 border rounded-md bg-gray-50 dark:bg-gray-700 dark:border-gray-600"
                        />
                    </div>
                    <div className="flex gap-2 justify-end">
                        <button onClick={() => setIsEditing(false)} className="text-sm px-4 py-2 rounded-md hover:bg-gray-100">Cancel</button>
                        <button onClick={handleSave} className="text-sm bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800">Save</button>
                    </div>
                </div>
            ) : (
                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                    <div className="flex items-center gap-2">
                        <CheckCircle size={18} className="text-green-500" />
                        <p className="font-semibold text-gray-800 dark:text-gray-100">{user.name}</p>
                    </div>
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="pl-7">{address.address}</p>
                            <p className="pl-7">{address.phoneNumber}</p>
                        </div>
                        <div>
                            <button onClick={() => setIsEditing(true)} className="text-sm hover:underline mt-0 pl-7">Change Address &gt;</button>
                        </div>
                    </div>
                </div>
            )}
            <div className="border-t dark:border-gray-700 mt-4 pt-4">
                <div className="flex items-center gap-4">
                    <img src="/logo.png" className='w-24 h-8 rounded-circle' alt="logo" />
                    <div>
                        <p className="font-semibold text-gray-800 dark:text-gray-100">Delivery: $1.0</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">ZANDO Bikers (Delivery within 1-3 days)</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeliveryAddress;