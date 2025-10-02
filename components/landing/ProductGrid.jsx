"use client";

import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import { fetchAllProducts } from '@/services/allProduct.service';
import { useLanguage } from '@/context/LanguageContext';
import { translations } from '@/lib/translations';

const ProductGrid = () => {
  const [products, setProducts] = useState([]);
  const { language } = useLanguage();
  const t = translations[language];

  useEffect(() => {
    const getProducts = async () => {
      const fetchedProducts = await fetchAllProducts();
      setProducts(fetchedProducts);
    };
    getProducts();
  }, []);

  return (
    <div className="w-full mx-auto py-8 px-4 md:px-8">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-200 mb-8 ">{t.exploreCollection}</h1>
      {products.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 dark:text-gray-400">Loading products...</p>
      )}
    </div>
  );
};

export default ProductGrid;