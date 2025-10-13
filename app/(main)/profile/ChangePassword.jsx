// chouseangly/my-app/my-app-main/app/(main)/profile/ChangePassword.jsx
"use client";

import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import { updateUserPassword } from '@/services/profile.service';
import Input from '@/components/ui/Input'; // Reusing existing Input component
import { Lock, Eye, EyeOff } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { translations } from '@/lib/translations';

export default function ChangePassword() {
    const { data: session } = useSession();
    const { language } = useLanguage();
    const t = translations[language];
    const [form, setForm] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [showPasswords, setShowPasswords] = useState({
        old: false,
        new: false,
        confirm: false,
    });

    const togglePasswordVisibility = (field) => {
        setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setErrors({}); // Clear errors on change
    };

    const validate = () => {
        let newErrors = {};
        if (form.newPassword.length < 6) {
            newErrors.newPassword = "Password must be at least 6 characters.";
        }
        if (form.newPassword !== form.confirmPassword) {
            newErrors.confirmPassword = "New passwords do not match.";
        }
        if (!form.oldPassword) newErrors.oldPassword = "Old password is required.";
        if (!form.newPassword) newErrors.newPassword = "New password is required.";
        if (!form.confirmPassword) newErrors.confirmPassword = "Confirm password is required.";
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        
        setLoading(true);
        const toastId = toast.loading('Changing password...');

        const success = await updateUserPassword(
            session.user.id,
            form.oldPassword,
            form.newPassword,
            form.confirmPassword
        );

        if (success) {
            toast.success('Password changed successfully!', { id: toastId });
            setForm({ oldPassword: '', newPassword: '', confirmPassword: '' }); // Clear form
        } else {
            toast.error('Failed to change password. Check your old password.', { id: toastId });
        }

        setLoading(false);
    };

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border dark:border-gray-700 max-w-full lg:max-w-2xl">
            <h3 className="text-xl font-bold mb-6 flex items-center">
                <Lock className="w-5 h-5 mr-2" />
                {t.changePassword}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="relative">
                    <Input
                        label="Old Password"
                        name="oldPassword"
                        type={showPasswords.old ? "text" : "password"}
                        value={form.oldPassword}
                        onChange={handleChange}
                        placeholder="••••••••"
                        error={errors.oldPassword}
                        required
                    />
                    <button
                        type="button"
                        onClick={() => togglePasswordVisibility('old')}
                        className="absolute right-3 top-9 text-gray-500 dark:text-gray-400"
                    >
                        {showPasswords.old ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                </div>
                
                <div className="relative">
                    <Input
                        label="New Password"
                        name="newPassword"
                        type={showPasswords.new ? "text" : "password"}
                        value={form.newPassword}
                        onChange={handleChange}
                        placeholder="••••••••"
                        error={errors.newPassword}
                        required
                    />
                    <button
                        type="button"
                        onClick={() => togglePasswordVisibility('new')}
                        className="absolute right-3 top-9 text-gray-500 dark:text-gray-400"
                    >
                        {showPasswords.new ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                </div>

                <div className="relative">
                    <Input
                        label="Confirm New Password"
                        name="confirmPassword"
                        type={showPasswords.confirm ? "text" : "password"}
                        value={form.confirmPassword}
                        onChange={handleChange}
                        placeholder="••••••••"
                        error={errors.confirmPassword}
                        required
                    />
                    <button
                        type="button"
                        onClick={() => togglePasswordVisibility('confirm')}
                        className="absolute right-3 top-9 text-gray-500 dark:text-gray-400"
                    >
                        {showPasswords.confirm ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-black text-white dark:bg-white dark:text-black rounded-md font-semibold hover:bg-gray-800 dark:hover:bg-gray-200 transition disabled:bg-gray-400"
                >
                    {loading ? "Updating..." : t.update}
                </button>
            </form>
        </div>
    );
}