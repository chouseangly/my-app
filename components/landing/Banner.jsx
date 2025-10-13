// chouseangly/my-app/my-app-main/components/landing/Banner.jsx

"use client";

import React from 'react';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';
import { translations } from '@/lib/translations';

const Banner = () => {
  const { language } = useLanguage();
  const t = translations[language];

  return (
    // FIX: Adjusted height for better responsiveness on smaller screens
    <div className='relative w-full h-[50vh] sm:h-[70vh] lg:h-[90vh] mx-auto mt-2 rounded-lg overflow-hidden'>
      <Image src="/Whisper-of-Purity.jpg" alt='banner' layout='fill' objectFit='cover' quality={100} />
      {/* FIX: Adjusted padding and button sizes for responsiveness */}
      <div className='absolute inset-0 flex items-end justify-center p-6 sm:p-12'>
        <div className="flex space-x-2 sm:space-x-4">
          <button className="border border-white bg-transparent text-white px-4 py-2 text-xs sm:text-sm font-semibold hover:bg-white hover:text-black transition-colors duration-300">
            {t.shopMen}
          </button>
          <button className="border border-white bg-transparent text-white px-4 py-2 text-xs sm:text-sm font-semibold hover:bg-white hover:text-black transition-colors duration-300">
            {t.shopWomen}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Banner;