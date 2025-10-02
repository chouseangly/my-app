"use client";

import React from 'react';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';
import { 
  Heart, 
  ShieldCheck, 
  HelpCircle, 
  MapPin, 
  Mail, 
  Phone, 
  Send 
} from 'lucide-react';

// NOTE: In a real application, you would move these translations to your `src/lib/translations.js` file.
const translations = {
  en: {
    // Existing keys
    aboutUs: "About Us",
    contact: "Contact",
    careers: "Careers",
    // New keys for the footer
    zandoApp: "ZANDO APP",
    loyalty: "LOYALTY",
    membershipBenefits: "Membership & Benefits",
    followUs: "FOLLOW US",
    facebook: "Facebook",
    instagram: "Instagram",
    tiktok: "TikTok",
    youtube: "Youtube",
    customerService: "CUSTOMER SERVICES",
    onlineExchangePolicy: "Online Exchange Policy",
    privacyPolicy: "Privacy Policy",
    faqsGuides: "FAQs & Guides",
    findAStore: "Find a store",
    contactUs: "CONTACT US",
    telegram: "Telegram",
    weAccept: "WE ACCEPT",
  },
  km: {
    // Existing keys
    aboutUs: "អំពី​ពួក​យើង",
    contact: "ទំនាក់ទំនង",
    careers: "អាជីព",
    // New keys for the footer
    zandoApp: "កម្មវិធី ZANDO",
    loyalty: "ភាពស្មោះត្រង់",
    membershipBenefits: "សមាជិកភាព និងអត្ថប្រយោជន៍",
    followUs: "តាមដានពួកយើង",
    facebook: "Facebook",
    instagram: "Instagram",
    tiktok: "TikTok",
    youtube: "Youtube",
    customerService: "សេវាកម្ម​អតិថិជន",
    onlineExchangePolicy: "គោលការណ៍ប្តូរទំនិញអនឡាញ",
    privacyPolicy: "គោលការណ៍​ភាព​ឯកជន",
    faqsGuides: "សំណួរគេសួរញឹកញាប់ & ការណែនាំ",
    findAStore: "ស្វែងរកហាង",
    contactUs: "ទាក់ទង​មក​ពួក​យើង",
    telegram: "Telegram",
    weAccept: "យើងទទួលយក",
  }
};

// Reusable component for footer links with icons
const FooterLink = ({ href = "#", icon: Icon, text }) => (
  <a href={href} className="flex items-center space-x-3 text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors duration-200 text-sm">
    {Icon && <Icon className="w-4 h-4 flex-shrink-0" />}
    <span>{text}</span>
  </a>
);

// Simple SVG components for social media icons
const FacebookIcon = (props) => <svg {...props} fill="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"></path></svg>;
const InstagramIcon = (props) => <svg {...props} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01"></path></svg>;
const TikTokIcon = (props) => <svg {...props} fill="currentColor" viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"></path></svg>;
const YoutubeIcon = (props) => <svg {...props} fill="currentColor" viewBox="0 0 24 24"><path d="M21.58 7.19c-.23-.86-.9-1.52-1.76-1.75C18.25 5 12 5 12 5s-6.25 0-7.82.44c-.86.23-1.52.89-1.75 1.75C2 8.76 2 12 2 12s0 3.24.43 4.81c.23.86.89 1.52 1.75 1.75C5.75 19 12 19 12 19s6.25 0 7.82-.44c.86-.23 1.52-.89 1.75-1.75C22 15.24 22 12 22 12s0-3.24-.42-4.81zM9.5 15.5V8.5l6.5 3.5-6.5 3.5z"></path></svg>;

const Footer = () => {
  const { language } = useLanguage();
  const t = translations[language];

  return (
    <footer className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-200 py-12 px-4 sm:px-6 lg:px-8  dark:border-gray-700">
      <div className="container mx-auto border-b border-gray-200 dark:border-gray-700 pb-5">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-x-4 gap-y-10 text-left">
          
          {/* ZANDO APP */}
          <div className="space-y-2 col-span-2 sm:col-span-1">
            <h3 className="font-bold tracking-wider text-sm ps-2">{t.zandoApp}</h3>
            <Image src="/qr-code.jpg" alt="Zando App QR Code" width={150} height={150} className="rounded-lg"/>
          </div>

          {/* LOYALTY */}
          <div className="space-y-4">
            <h3 className="font-bold tracking-wider text-sm">{t.loyalty}</h3>
            <FooterLink icon={Heart} text={t.membershipBenefits} />
          </div>

          {/* FOLLOW US */}
          <div className="space-y-4">
            <h3 className="font-bold tracking-wider text-sm">{t.followUs}</h3>
            <FooterLink icon={FacebookIcon} text={t.facebook} />
            <FooterLink icon={InstagramIcon} text={t.instagram} />
            <FooterLink icon={TikTokIcon} text={t.tiktok} />
            <FooterLink icon={YoutubeIcon} text={t.youtube} />
          </div>

          {/* CUSTOMER SERVICES */}
          <div className="space-y-4">
            <h3 className="font-bold tracking-wider text-sm">{t.customerService}</h3>
            <FooterLink icon={HelpCircle} text={t.onlineExchangePolicy} />
            <FooterLink icon={ShieldCheck} text={t.privacyPolicy} />
            <FooterLink icon={HelpCircle} text={t.faqsGuides} />
            <FooterLink icon={MapPin} text={t.findAStore} />
          </div>

          {/* CONTACT US */}
          <div className="space-y-4 col-span-2 sm:col-span-1">
            <h3 className="font-bold tracking-wider text-sm">{t.contactUs}</h3>
            <FooterLink icon={Mail} text="customer.care@zandokh.com" />
            <FooterLink icon={Phone} text="(+855) 081 999 716" />
            <FooterLink icon={Phone} text="(+855) 061 330 330" />
            <FooterLink icon={Send} text={t.telegram} />
          </div>

          <div>
            <h3 className="font-bold tracking-wider text-sm mb-4">{t.weAccept}</h3>
          <div className="flex flex-wrap items-center gap-2">
            <Image src="/aba-pay-web.png" alt="ABA Pay" width={80} height={25} className="h-8 w-auto object-contain" />
            <Image src="/credit-debit-card.png" alt="Credit/Debit Card" width={120} height={25} className="h-8 w-auto object-contain" />
            <Image src="/xpay.png" alt="ACELDA Pay" width={80} height={25} className="h-8 w-auto object-contain" />
          </div>
          <div className="flex flex-wrap items-center gap-2 mt-2">
            <Image src="/Wing.png" alt="Wing Bank" width={80} height={25} className="h-8 w-auto object-contain" />
            <Image src="/chip-mong-bank.png" alt="Chip Mong Bank" width={100} height={25} className="h-8 w-auto object-contain" />
            <Image src="/cod-kh-en.png" alt="Cash on delivery" width={80} height={25} className="h-8 w-auto object-contain" />
          </div>
          </div>
        </div>

      </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 text-end mt-5">© 2024 Zando. All rights reserved.</p>
    </footer>
  );
}

export default Footer;
