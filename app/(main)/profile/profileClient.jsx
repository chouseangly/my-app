"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { ChevronRight } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/lib/translations";
import { fetchUserProfile, updateUserProfile } from "@/services/profile.service";
import toast from 'react-hot-toast';
import { useTheme } from "next-themes";

const ProfileClient = () => {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('profile');
  const { language, setLanguage } = useLanguage();
  const t = translations[language];

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    mobileNumber: '',
    dob: '',
    gender: ''
  });
  const [profileImage, setProfileImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
    if (status === "authenticated" && session) {
      const loadProfile = async () => {
        const profile = await fetchUserProfile(session.user.id);
        if (profile) {
          setFormData({
            firstName: profile.firstName || session.user.firstName || '',
            lastName: profile.lastName || session.user.lastName || '',
            email: session.user.email || '',
            mobileNumber: profile.phoneNumber || '',
            dob: profile.birthday ? new Date(profile.birthday).toISOString().split('T')[0] : '',
            gender: profile.gender || ''
          });
          setPreviewImage(profile.profileImage || session.user.image);
        }
      };
      loadProfile();
    }
  }, [status, session, router]);

  const handleInputChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    const toastId = toast.loading('Updating profile...');
    const data = new FormData();
    data.append('userId', session.user.id);
    data.append('firstName', formData.firstName);
    data.append('lastName', formData.lastName);
    data.append('userName', `${formData.firstName} ${formData.lastName}`);
    data.append('phoneNumber', formData.mobileNumber);
    if (formData.dob) {
      data.append('birthday', formData.dob);
    }
    data.append('gender', formData.gender);
    if (profileImage) {
      data.append('profileImage', profileImage);
    }

    const result = await updateUserProfile(session.user.id, data);

    if (result) {
      toast.success('Profile updated successfully!', { id: toastId });
      // Update the session
      await update({
        ...session,
        user: {
          ...session.user,
          name: `${result.firstName} ${result.lastName}`,
          firstName: result.firstName,
          lastName: result.lastName,
          image: result.profileImage,
        },
      });
    } else {
      toast.error('Failed to update profile.', { id: toastId });
    }
  };

  if (status === "loading" || !session) return <div className="text-center py-20">Loading...</div>;

  const SidebarLink = ({ name, tabName }) => (
    <button onClick={() => setActiveTab(tabName)} className={`w-full text-left px-4 py-2 rounded-md flex justify-between items-center ${activeTab === tabName ? 'bg-gray-100 dark:bg-gray-700 font-semibold' : 'hover:bg-gray-50 dark:hover:bg-gray-800'}`}>
      {name} <ChevronRight size={16} className="text-gray-400" />
    </button>
  );

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col md:flex-row gap-10 lg:gap-16">
        <aside className="w-full md:w-1/4 lg:w-1/5">
          <div className="space-y-4">
            <div>
              <h3 className="font-bold text-lg mb-2">{t.loyaltyMember}</h3>
              <SidebarLink name={t.membershipBenefits} tabName="membership" />
            </div>
            <div>
              <h3 className="font-bold text-lg mb-2">{t.me}</h3>
              <SidebarLink name={t.profile} tabName="profile" />
              <SidebarLink name={t.myOrders} tabName="orders" />
              <SidebarLink name={t.giftCard} tabName="giftcard" />
              <SidebarLink name={t.addressBook} tabName="address" />
              <SidebarLink name={t.changePassword} tabName="password" />
            </div>
            <div>
              <h3 className="font-bold text-lg mb-2">{t.languages}</h3>
              <div className="pl-4 space-y-2">
                <label className="flex items-center cursor-pointer">
                  <input type="radio" name="language" value="en" checked={language === 'en'} onChange={() => setLanguage('en')} className="h-4 w-4 text-black border-gray-300 focus:ring-black" />
                  <span className="ml-2">{t.english}</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input type="radio" name="language" value="km" checked={language === 'km'} onChange={() => setLanguage('km')} className="h-4 w-4 text-black border-gray-300 focus:ring-black" />
                  <span className="ml-2">{t.khmer}</span>
                </label>
              </div>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-2">{t.settings}</h3>
              <div className="pl-4 flex items-center justify-between">
                <span>{t.darkMode}</span>
                <button onClick={toggleTheme} className={`w-12 h-6 rounded-full p-1 flex items-center transition-colors ${theme === 'dark' ? 'bg-green-500 justify-end' : 'bg-gray-300 justify-start'}`}>
                  <span className="w-4 h-4 bg-white rounded-full shadow-md"></span>
                </button>
              </div>
            </div>
            <div className="pt-4">
              <button onClick={() => signOut({ callbackUrl: '/' })} className="w-full text-center px-4 py-3 rounded-md bg-black text-white font-semibold hover:bg-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600">{t.logOut}</button>
            </div>
          </div>
        </aside>

        <main className="w-full md:w-3/4 lg:w-4/5">
          {activeTab === 'profile' && (
            <div>
              <h2 className="text-2xl font-bold mb-6">{t.profile}</h2>
              <form onSubmit={handleUpdateProfile} className="space-y-6 max-w-2xl bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow">
                <div className="flex items-center gap-4">
                  <img
                    src={previewImage || `https://ui-avatars.com/api/?name=${formData.firstName}+${formData.lastName}&background=random`}
                    alt="Profile"
                    className="w-24 h-24 rounded-full object-cover"
                  />
                  <label className="cursor-pointer bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600">
                    Change Photo
                    <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                  </label>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">{t.gender}</label>
                  <div className="flex items-center gap-6">
                    <label className="flex items-center"><input type="radio" name="gender" value="Male" checked={formData.gender === 'Male'} onChange={handleInputChange} className="h-4 w-4" /> <span className="ml-2">{t.male}</span></label>
                    <label className="flex items-center"><input type="radio" name="gender" value="Female" checked={formData.gender === 'Female'} onChange={handleInputChange} className="h-4 w-4" /> <span className="ml-2">{t.female}</span></label>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium">{t.firstName}</label>
                    <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 bg-white dark:bg-gray-700 dark:border-gray-600" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium">{t.lastName}</label>
                    <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 bg-white dark:bg-gray-700 dark:border-gray-600" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium">{t.email}</label>
                  <input type="email" name="email" value={formData.email} disabled className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 bg-gray-200 dark:bg-gray-600 cursor-not-allowed" />
                </div>
                <div>
                  <label className="block text-sm font-medium">{t.mobileNumber}</label>
                  <input type="tel" name="mobileNumber" value={formData.mobileNumber} onChange={handleInputChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 bg-white dark:bg-gray-700 dark:border-gray-600" />
                </div>
                <div>
                  <label className="block text-sm font-medium">{t.dob}</label>
                  <input type="date" name="dob" value={formData.dob} onChange={handleInputChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 bg-white dark:bg-gray-700 dark:border-gray-600" />
                  <p className="mt-2 text-sm text-green-600">{t.dobReward}</p>
                </div>
                <button type="submit" className="w-full sm:w-auto px-10 py-3 bg-black text-white font-semibold rounded-md hover:bg-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600">{t.update}</button>
              </form>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ProfileClient;