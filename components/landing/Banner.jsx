"use client";

import React from 'react';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';
import { translations } from '@/lib/translations';

const Banner = () => {
  const { language } = useLanguage();
  const t = translations[language];

  return (
    <div className='relative w-full h-[90vh] mx-auto mt-2'>
      <Image src="/Whisper-of-Purity.jpg" alt='banner' layout='fill' quality={100} />
      <div className='absolute inset-0 flex items-end justify-center p-12'>
        <div className="flex space-x-4">
          <button className="border border-white bg-transparent text-white px-8 py-2 text-sm font-semibold hover:bg-white hover:text-black transition-colors duration-300">
            {t.shopMen}
          </button>
          <button className="border border-white bg-transparent text-white px-8 py-2 text-sm font-semibold hover:bg-white hover:text-black transition-colors duration-300">
            {t.shopWomen}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Banner;