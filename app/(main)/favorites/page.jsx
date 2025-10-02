"use client";

import React from 'react';
import { useCart } from "@/context/CartContext";
import ProductCard from '@/components/landing/ProductCard';
import Image from "next/image";
import Link from 'next/link';

export default function FavoritePage() {
    const { favorites, products } = useCart(); // Assuming products are available in context or fetched elsewhere

    // Find the full product details for each favorite item
    const favoriteProducts = favorites
      .map(fav => products.find(p => p.id === fav.productId))
      .filter(p => p); // Filter out any undefined products

    return (
        <div className="container mx-auto px-4 py-10 sm:px-6 lg:px-8">
            <div className="p-4 md:p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200/80 dark:border-gray-700/80 min-h-[60vh]">
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-6">Favorites</h2>
                {favoriteProducts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                        <Image
                            src="/no-listings-fav.jpg" // Using an existing image as a placeholder
                            alt="No Favorites"
                            width={300}
                            height={300}
                            className="w-full max-w-xs h-auto mb-6 rounded-lg"
                        />
                        <h2 className="font-semibold text-xl mb-2 dark:text-gray-100">Your wishlist is empty</h2>
                        <p className="text-sm text-gray-600 dark:text-gray-400 max-w-md mb-6">
                            Looks like you haven’t added anything to your wishlist yet. Start exploring and add products you love!
                        </p>
                        <Link href="/" className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors">
                            Explore Products
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
                        {favoriteProducts.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}