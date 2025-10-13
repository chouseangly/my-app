"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, Bell, Heart, ShoppingBag, User, Menu, X } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { fetchCategories } from "@/services/category.service";
import MegaMenu from "./MegaMenu";
import ProfileMenu from "./ProfileMenu";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/lib/translations";
import { useCart } from "@/context/CartContext";
import SearchModal from "@/app/(main)/search/SearchModal";

const AuthNavbar = () => {
  const [categories, setCategories] = useState([]);
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [isProfileMenuOpen, setProfileMenuOpen] = useState(false);
  const [isSearchModalOpen, setSearchModalOpen] = useState(false);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { data: session, status } = useSession();
  const profileMenuRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const { language } = useLanguage();
  const t = translations[language];
  const { favorites, cartItems, notifications } = useCart();

  const unreadCount = notifications ? notifications.filter(n => !n.isRead).length : 0;
  const totalItemsInCart = cartItems ? cartItems.reduce((acc, item) => acc + item.quantity, 0) : 0;

  // Handle click outside for Profile Menu
  useEffect(() => {
    const handleClickOutsideProfile = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setProfileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutsideProfile);
    return () => document.removeEventListener("mousedown", handleClickOutsideProfile);
  }, []);

  // Handle click outside for Mobile Menu
  useEffect(() => {
    const handleClickOutsideMobileMenu = (event) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutsideMobileMenu);
    return () => document.removeEventListener("mousedown", handleClickOutsideMobileMenu);
  }, []);

  // Fetch categories
  useEffect(() => {
    const getCategories = async () => {
      const fetchedCategories = await fetchCategories();
      setCategories(fetchedCategories);
    };
    getCategories();
  }, []);

  // Handle Escape key
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setSearchModalOpen(false);
        setProfileMenuOpen(false);
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      <div
        className="w-full sticky top-0 z-40 bg-white dark:bg-gray-800 shadow-sm isolate border-b border-gray-200 dark:border-gray-700 transition-colors duration-300"
        onMouseLeave={() => setHoveredCategory(null)}
      >
        <div className="relative px-4 sm:px-6 lg:px-10">
          {/* ✅ Use grid layout for better responsive alignment */}
          <div className="grid grid-cols-3 items-center py-3">
            {/* --- LEFT SECTION --- */}
            <div className="flex items-center space-x-3 sm:space-x-5 md:space-x-8">
              {/* Mobile Menu Button */}
              <button
                className="md:hidden text-gray-800 dark:text-gray-200"
                onClick={() => setMobileMenuOpen((prev) => !prev)}
                aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>

              {/* Desktop Categories */}
              <nav className="hidden md:flex items-center space-x-4 lg:space-x-8">
                {categories.map((cat) => (
                  <div key={cat.id} onMouseEnter={() => setHoveredCategory(cat)} className="py-4">
                    <Link
                      href={`/category/${cat.id}`}
                      className="text-base lg:text-lg font-bold text-gray-800 dark:text-gray-200 transition-colors hover:text-black dark:hover:text-white"
                    >
                      {cat.name}
                    </Link>
                  </div>
                ))}
              </nav>
            </div>

            {/* --- CENTER SECTION (Logo) --- */}
            {/* ✅ Logo now scales nicely on tablet and mobile */}
            <div className="flex justify-center items-center">
              <Link href="/" className="flex items-center">
                <Image
                  src="/logo.png"
                  alt="Zando Logo"
                  width={140}
                  height={60}
                  className="h-7 sm:h-8 md:h-9 w-auto object-contain"
                  priority
                />
              </Link>
            </div>

            {/* --- RIGHT SECTION --- */}
            <div className="flex justify-end items-center space-x-3 sm:space-x-5 lg:space-x-8">
              {/* Search Button */}
              <button
                onClick={() => setSearchModalOpen(true)}
                className="sm:hidden text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white p-1"
                aria-label="Open search"
              >
                <Search className="h-5 w-5" />
              </button>

              {/* ✅ Make search bar responsive and flexible */}
              <button
                onClick={() => setSearchModalOpen(true)}
                className="hidden sm:flex items-center min-w-[120px] sm:w-[140px] md:w-[160px] lg:w-[180px] border border-gray-300 dark:border-gray-600 rounded-md px-2 py-1 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
              >
                <Search className="h-4 w-4 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                <span className="w-full bg-transparent px-2 text-sm text-gray-500 dark:text-gray-400 truncate">
                  {t.search}
                </span>
              </button>

              {/* Icons */}
              <div className="flex items-center space-x-3 sm:space-x-4">
                {/* Notifications */}
                <Link href="/notifications" className="relative" aria-label="Notifications">
                  <Bell className="h-5 w-5 text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white cursor-pointer" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-medium w-4 h-4 flex items-center justify-center rounded-full leading-none">
                      {unreadCount}
                    </span>
                  )}
                </Link>

                {/* Favorites */}
                <Link href="/favorites" className="relative hidden sm:block" aria-label="Favorites">
                  <Heart className="h-5 w-5 text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white" />
                  {favorites && favorites.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-medium w-4 h-4 flex items-center justify-center rounded-full leading-none">
                      {favorites.length}
                    </span>
                  )}
                </Link>

                {/* Cart */}
                <Link href="/cart" className="relative" aria-label={`Shopping Cart with ${totalItemsInCart} items`}>
                  <ShoppingBag className="h-5 w-5 text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white" />
                  {totalItemsInCart > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-medium w-4 h-4 flex items-center justify-center rounded-full leading-none">
                      {totalItemsInCart > 99 ? "99+" : totalItemsInCart}
                    </span>
                  )}
                </Link>
              </div>

              {/* Profile / Auth Links */}
              <div className="hidden sm:flex items-center space-x-4 font-bold">
                {status === "authenticated" ? (
                  <div className="relative" ref={profileMenuRef}>
                    <button
                      onClick={() => setProfileMenuOpen((prev) => !prev)}
                      className="flex items-center gap-2 text-gray-800 dark:text-gray-200 hover:text-black dark:hover:text-white transition-colors"
                    >
                      <User className="h-5 w-5" />
                     
                    </button>
                    {isProfileMenuOpen && <ProfileMenu onClose={() => setProfileMenuOpen(false)} />}
                  </div>
                ) : (
                  <>
                    <Link href="/login" className="text-gray-800 dark:text-gray-200 hover:text-black dark:hover:text-white">
                      {t.login}
                    </Link>
                    <Link href="/register" className="text-gray-800 dark:text-gray-200 hover:text-black dark:hover:text-white">
                      {t.register}
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* MEGA MENU */}
        <div className="hidden md:block">
          {hoveredCategory && <MegaMenu category={hoveredCategory} onClose={() => setHoveredCategory(null)} />}
        </div>

        {/* MOBILE MENU */}
        {isMobileMenuOpen && (
          <div
            ref={mobileMenuRef}
            className="md:hidden absolute top-full left-0 w-full bg-white dark:bg-gray-800 shadow-lg border-t border-gray-200 dark:border-gray-700 pb-4 max-h-[80vh] overflow-y-auto"
          >
            <div className="flex flex-col space-y-2 px-4 py-4">
              {/* Auth/Profile Links for Mobile */}
              <div className="flex flex-col space-y-2 pb-4 border-b border-gray-100 dark:border-gray-700">
                {status === "authenticated" ? (
                  <>
                    <Link
                      href="/admin/dashboard"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-2 p-2 text-lg font-semibold text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                    >
                      <User className="h-5 w-5" />
                      Dashboard
                    </Link>
                    <Link
                      href="/profile"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-2 p-2 text-lg font-semibold text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                    >
                      <User className="h-5 w-5" />
                      {session.user.name || t.profile}
                    </Link>
                    <button
                      onClick={() => {
                        signOut();
                        setMobileMenuOpen(false);
                      }}
                      className="p-2 text-lg font-semibold text-left text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="p-2 text-lg font-semibold text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                    >
                      {t.login}
                    </Link>
                    <Link
                      href="/register"
                      onClick={() => setMobileMenuOpen(false)}
                      className="p-2 text-lg font-semibold text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                    >
                      {t.register}
                    </Link>
                  </>
                )}
              </div>

              {/* Category Links */}
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/category/${cat.id}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 text-lg font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* SEARCH MODAL */}
      <SearchModal isOpen={isSearchModalOpen} onClose={() => setSearchModalOpen(false)} />
    </>
  );
};

export default AuthNavbar;
