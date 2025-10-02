"use client";

import React from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext'; 
import toast from 'react-hot-toast';
import { useSession } from 'next-auth/react';

const HeartIcon = ({ isFavorite }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" 
    viewBox="0 0 24 24" 
    fill={isFavorite ? "currentColor" : "none"} 
    stroke="currentColor" 
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" 
    className={`transition-colors duration-300 ${isFavorite ? 'text-red-500' : 'text-gray-400 group-hover:text-red-500'}`}>
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
  </svg>
);

const ProductCard = ({ product }) => {
  const { favorites, addFavorite, removeFavorite } = useCart();
  const { data: session } = useSession();
  const isFavorite = favorites.some(fav => fav.productId === product.id);
  const imageUrl = product.gallery?.[0]?.images?.[0] || "https://placehold.co/400x500/cccccc/ffffff?text=No+Image";

  const handleFavoriteClick = (e) => {
    e.preventDefault(); 
    if (!session) {
        toast.error("Please log in to manage your wishlist.");
        return;
    }
    if (isFavorite) {
      removeFavorite(product.id);
    } else {
      addFavorite(product.id);
    }
  };

  return (
    <Link href={`/product/${product.id}`} passHref>
      <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 group cursor-pointer">
        <div className="relative">
         <img
            src={imageUrl}
            alt={product.name}
            width={400}
            height={500}
            className="w-full h-auto object-cover aspect-[4/5]"
            onError={(e) => {
                e.currentTarget.src = "https://placehold.co/400x500/cccccc/ffffff?text=Error";
            }}
          />
          {product.discount > 0 && (
            <div className="absolute top-3 left-3 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-br-lg">
              -{product.discount}%
            </div>
          )}
        </div>
        <div className="p-3 md:p-4">
          <div className="flex justify-between items-start">
            <h3 className="font-semibold text-gray-700 dark:text-gray-200 text-sm md:text-base mb-1 pr-2">{product.name}</h3>
            <button onClick={handleFavoriteClick} className="flex-shrink-0 z-10 p-0">
              <HeartIcon size={24} isFavorite={isFavorite} />
            </button>
          </div>
          <div className="flex items-baseline">
            <p className="font-bold text-gray-800 dark:text-gray-100 text-sm md:text-base">${product.price.toFixed(2)}</p>
            {product.originalPrice && (
              <p className="text-xs text-gray-500 dark:text-gray-400 line-through ml-2">${product.originalPrice.toFixed(2)}</p>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;