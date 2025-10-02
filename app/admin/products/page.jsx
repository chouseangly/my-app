"use client";

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import ProductClient from '../dashboard/ProductClient';

function ProductsPageClient() {
    const searchParams = useSearchParams();
    const selectedCategory = searchParams.get('categoryId');
    // ✅ FIX: Read the search query 'q' from the URL
    const searchQuery = searchParams.get('q');

    return (
        <ProductClient 
            searchQuery={searchQuery} 
            selectedCategory={selectedCategory} 
        />
    );
}

// ✅ FIX: The page no longer receives any props from the layout
const ProductsPage = () => {
    return (
        <div>
            <Suspense fallback={<div className="text-center py-10">Loading Products...</div>}>
                <ProductsPageClient />
            </Suspense>
        </div>
    );
};

export default ProductsPage;