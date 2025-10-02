"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession, signOut } from "next-auth/react";
import { User, ChevronRight, FileText, Gift, LogOut, LayoutDashboard } from "lucide-react";
import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from "next-themes";
import { translations } from '@/lib/translations';
import { fetchUserProfile } from '@/services/profile.service';
import Image from 'next/image';

const ProfileMenu = ({ onClose }) => {
  const { data: session } = useSession();
  const { language, setLanguage } = useLanguage();
  const { theme, setTheme } = useTheme();
  const t = translations[language];
  const [profile, setProfile] = useState(null);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  useEffect(() => {
    if (session?.user?.id) {
      const loadProfile = async () => {
        const userProfile = await fetchUserProfile(session.user.id);
        setProfile(userProfile);
      };
      loadProfile();
    }
  }, [session]);

  if (!session) return null;

  return (
    <div
      className="absolute top-full right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="p-4 border-b dark:border-gray-600">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center overflow-hidden">
            {profile?.profileImage ? (
              <Image
                src={profile.profileImage}
                alt="Profile"
                width={48}
                height={48}
                className="object-cover"
              />
            ) : (
              <User className="w-6 h-6 text-gray-500 dark:text-gray-300" />
            )}
          </div>
          <div>
            <p className="font-semibold text-gray-800 dark:text-gray-100">{session.user.name}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{session.user.email}</p>
          </div>
        </div>
      </div>

      <div className="py-2">
        {session.user.role === 'USER' && (
          <>
            <Link href="/profile" onClick={onClose} className="flex items-center justify-between px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
              <div className="flex items-center gap-3"><User className="w-5 h-5" /><span>{t.profile}</span></div><ChevronRight className="w-4 h-4" />
            </Link>
            <Link href="/orders" onClick={onClose} className="flex items-center justify-between px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
              <div className="flex items-center gap-3"><FileText className="w-5 h-5" /><span>{t.myOrders}</span></div><ChevronRight className="w-4 h-4" />
            </Link>
            <Link href="/gift-cards" onClick={onClose} className="flex items-center justify-between px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
              <div className="flex items-center gap-3"><Gift className="w-5 h-5" /><span>{t.giftCard}</span></div><ChevronRight className="w-4 h-4" />
            </Link>
          </>
        )}
        {session.user.role === 'ADMIN' && (
          <>
          <Link href="/profile" onClick={onClose} className="flex items-center justify-between px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
              <div className="flex items-center gap-3"><User className="w-5 h-5" /><span>{t.profile}</span></div><ChevronRight className="w-4 h-4" />
            </Link>
          <Link href="/admin/dashboard" onClick={onClose} className="flex items-center justify-between px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
            <div className="flex items-center gap-3"><LayoutDashboard className="w-5 h-5" /><span>{t.dashboard}</span></div><ChevronRight className="w-4 h-4" />
          </Link>
          </>
        )}
      </div>

      <div className="p-4 border-t dark:border-gray-600 space-y-4">
        <div>
          <h4 className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400 mb-2">{t.languages}</h4>
          <div className="flex items-center justify-around bg-gray-100 dark:bg-gray-700 rounded-md p-1">
            <button onClick={() => setLanguage('en')} className={`px-4 py-1 text-sm rounded-md transition-colors ${language === 'en' ? 'bg-white dark:bg-gray-900 shadow' : 'text-gray-600 dark:text-gray-300'}`}>{t.english}</button>
            <button onClick={() => setLanguage('km')} className={`px-4 py-1 text-sm rounded-md transition-colors ${language === 'km' ? 'bg-white dark:bg-gray-900 shadow' : 'text-gray-600 dark:text-gray-300'}`}>{t.khmer}</button>
          </div>
        </div>

        <div>
           <h4 className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400 mb-2">{t.settings}</h4>
            <div className="flex items-center justify-between p-1">
                <span className="text-sm text-gray-700 dark:text-gray-300">{t.darkMode}</span>
                <button onClick={toggleTheme} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${theme === 'dark' ? 'bg-green-500' : 'bg-gray-300'}`}>
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${theme === 'dark' ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
            </div>
        </div>
      </div>

      <div className="p-2 border-t dark:border-gray-600">
        <button onClick={() => signOut({ callbackUrl: '/' })} className="w-full flex items-center gap-3 px-4 py-2 text-left text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-md">
          <LogOut className="w-5 h-5" /><span>{t.logOut}</span>
        </button>
      </div>
    </div>
  );
};

export default ProfileMenu;