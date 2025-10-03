"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { searchProducts } from '@/services/allProduct.service';
import ProductCard from '@/components/landing/ProductCard';
import Image from 'next/image';

function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get('query');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (query) {
      const getProducts = async () => {
        setLoading(true);
        const fetchedProducts = await searchProducts(query);
        setProducts(fetchedProducts);
        setLoading(false);
      };
      getProducts();
    } else {
      setLoading(false);
      setProducts([]);
    }
  }, [query]);

  return (
    <div className="w-full mx-auto py-8 px-4 md:px-8">
      <h1 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-gray-200 mb-8">
        Search Results for "{query}"
      </h1>
      {loading ? (
        <p className="text-center text-gray-500">Loading products...</p>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center text-center">
          <Image
            src="/no-listings-fav.jpg"
            width={500}
            height={300}
            className='object-cover mb-4'
            alt="No products found"
          />
          <p className="text-gray-500">No products found for "{query}".</p>
        </div>
      )}
    </div>
  );
};

export default function SearchPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchResults />
    </Suspense>
  );
}