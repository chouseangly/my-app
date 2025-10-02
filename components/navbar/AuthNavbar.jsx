"use client";
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, Bell, Heart, ShoppingBag, User } from "lucide-react";
import { useSession } from "next-auth/react";
import { fetchCategories } from '@/services/category.service';
import MegaMenu from './MegaMenu';
import ProfileMenu from './ProfileMenu';
import { useLanguage } from '@/context/LanguageContext';
import { translations } from '@/lib/translations';
import { useCart } from '@/context/CartContext';

const AuthNavbar = () => {
  const [categories, setCategories] = useState([]);
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [isProfileMenuOpen, setProfileMenuOpen] = useState(false);
  const { data: session, status } = useSession();
  const profileMenuRef = useRef(null);
  const { language } = useLanguage();
  const t = translations[language];
  const { favorites, cartItems, notifications } = useCart();

  const unreadCount = notifications ? notifications.filter(n => !n.isRead).length : 0;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setProfileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const getCategories = async () => {
      const fetchedCategories = await fetchCategories();
      setCategories(fetchedCategories);
    };
    getCategories();
  }, []);

  return (
    <div
      className="w-full sticky top-0 z-50 bg-white dark:bg-gray-800 shadow-sm isolate border-b border-gray-200 dark:border-gray-700 transition-colors duration-300"
      onMouseLeave={() => setHoveredCategory(null)}
    >
      <div className="relative px-4 sm:px-6 lg:px-10">
        <div className="flex items-center justify-between py-3">
          <nav className="hidden md:flex items-center space-x-4 lg:space-x-10">
            {categories.map((cat) => (
              <div key={cat.id} onMouseEnter={() => setHoveredCategory(cat)} className="py-4">
                <Link href={`/category/${cat.id}`} className="text-lg font-bold text-gray-800 dark:text-gray-200 transition-colors">
                  {cat.name}
                </Link>
              </div>
            ))}
          </nav>

          <div className="flex-shrink-0 md:absolute md:left-1/2 md:-translate-x-1/2">
            <Link href="/" className="flex items-center">
              <Image src="/logo.png" alt="Zando Logo" width={120} height={60} className="h-6 sm:h-8 w-auto" />
            </Link>
          </div>

          <div className="flex items-center space-x-10">
            <div className="hidden sm:flex items-center w-[120px] md:w-[100px] lg:w-[130px] border border-gray-300 dark:border-gray-600 rounded-md px-2 py-1">
              <Search className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              <input type="text" placeholder={t.search} className="w-full bg-transparent px-2 text-sm outline-none text-gray-800 dark:text-gray-200 placeholder:text-gray-500 dark:placeholder:text-gray-400" />
            </div>

            <div className="flex items-center space-x-5">
              <Link href="/notifications" className="relative">
                  <Bell className="h-5 w-5 text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white cursor-pointer" />
                  {unreadCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">{unreadCount}</span>
                  )}
              </Link>

              <Link href="/favorites" className="relative cursor-pointer">
                <Heart className="h-5 w-5 text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white" />
                {favorites && favorites.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">{favorites.length}</span>
                )}
              </Link>
              <Link href="/cart" className="relative">
                <ShoppingBag className="h-5 w-5 text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white" />
                {cartItems && cartItems.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">{cartItems.length}</span>
                )}
              </Link>
            </div>

            <div className="hidden sm:flex items-center space-x-5 font-bold">
              {status === "authenticated" ? (
                <div className="relative" ref={profileMenuRef}>
                  <button onClick={() => setProfileMenuOpen(prev => !prev)} className="flex items-center gap-2 text-gray-800 dark:text-gray-200 hover:text-black dark:hover:text-white">
                     <User className="h-5 w-5" />
                     {session.user.name || t.profile}
                  </button>
                  {isProfileMenuOpen && <ProfileMenu onClose={() => setProfileMenuOpen(false)} />}
                </div>
              ) : (
                <>
                  <Link href="/login" className="text-gray-800 dark:text-gray-200 hover:text-black dark:hover:text-white">{t.login}</Link>
                  <Link href="/register" className="text-gray-800 dark:text-gray-200 hover:text-black dark:hover:text-white">{t.register}</Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {hoveredCategory && <MegaMenu category={hoveredCategory} onClose={() => setHoveredCategory(null)} />}
    </div>
  );
}

export default AuthNavbar;
