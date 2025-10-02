"use client";

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { fetchProductsByCategoryId } from '@/services/getCategoryById.service';
import ProductCard from '@/components/landing/ProductCard';
import Image from 'next/image';

const CategoryPage = () => {
  const params = useParams();
  const { categoryId } = params;

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (categoryId) {
      const getProducts = async () => {
        setLoading(true);
        const fetchedProducts = await fetchProductsByCategoryId(categoryId);
        setProducts(fetchedProducts);
        setLoading(false);
      };
      getProducts();
    }
  }, [categoryId]);

  return (
    <div className="w-full mx-auto py-8 px-4 md:px-8">
      
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
          <p className="text-gray-500">No products found in this category.</p>
        </div>
      )}
    </div>
  );  
};

export default CategoryPage;