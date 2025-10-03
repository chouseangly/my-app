"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X, Clock, LoaderCircle } from 'lucide-react';
import { searchProducts } from '@/services/allProduct.service';
import Link from 'next/link';
import Image from 'next/image';

const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

const SearchModal = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const inputRef = useRef(null);

  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    const storedSearches = localStorage.getItem('recentSearches');
    if (storedSearches) {
      setRecentSearches(JSON.parse(storedSearches));
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      // Focus the input when the modal opens
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    const fetchResults = async () => {
      if (debouncedQuery.trim().length > 1) {
        setLoading(true);
        const products = await searchProducts(debouncedQuery);
        setResults(products);
        setLoading(false);
      } else {
        setResults([]);
      }
    };
    fetchResults();
  }, [debouncedQuery]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const searchTerm = query.trim();
    if (searchTerm) {
      const updatedSearches = [searchTerm, ...recentSearches.filter(s => s !== searchTerm)].slice(0, 5);
      setRecentSearches(updatedSearches);
      localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));
      router.push(`/search?query=${encodeURIComponent(searchTerm)}`);
      onClose();
    }
  };

  const handleRecentSearchClick = (term) => {
    router.push(`/search?query=${encodeURIComponent(term)}`);
    onClose();
  };
  
  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex justify-center pt-16 md:pt-24" onClick={onClose}>
      <div className="relative w-full max-w-2xl bg-white dark:bg-gray-800 rounded-lg shadow-2xl mx-4 h-fit" onClick={(e) => e.stopPropagation()}>
        <div className="p-4 border-b dark:border-gray-700">
          <form onSubmit={handleSearchSubmit} className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="What are you searching for?"
              className="w-full bg-transparent pl-12 pr-10 py-3 text-lg outline-none text-gray-800 dark:text-gray-200"
            />
            <button type="button" onClick={onClose} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-800">
              <X size={24} />
            </button>
          </form>
        </div>
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {query.length > 1 ? (
            // Live search results view
            <div>
              {loading && <div className="flex justify-center items-center py-4"><LoaderCircle className="animate-spin text-gray-500" /></div>}
              {!loading && results.length > 0 && (
                <ul className="space-y-3">
                  {results.slice(0, 6).map(product => (
                    <li key={product.id}>
                      <Link href={`/product/${product.id}`} onClick={onClose} className="flex items-center gap-4 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">
                        <Image src={product.gallery?.[0]?.images?.[0] || '/logo.png'} alt={product.name} width={48} height={48} className="w-12 h-12 object-cover rounded"/>
                        <span className="font-medium text-gray-800 dark:text-gray-200">{product.name}</span>
                        <span className="ml-auto font-semibold text-gray-900 dark:text-gray-100">${product.price.toFixed(2)}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
              {!loading && results.length === 0 && (
                <p className="text-center text-gray-500 py-4">No products found for "{query}"</p>
              )}
            </div>
          ) : (
            // Recent searches view
            <div>
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400">Recent Searches</h3>
                {recentSearches.length > 0 && <button onClick={clearRecentSearches} className="text-sm text-gray-500 hover:underline">Clear All</button>}
              </div>
              {recentSearches.length > 0 ? (
                <ul className="space-y-2">
                  {recentSearches.map((term, index) => (
                    <li key={index}>
                      <button onClick={() => handleRecentSearchClick(term)} className="flex items-center gap-3 w-full text-left p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">
                        <Clock size={16} className="text-gray-400" />
                        <span className="text-gray-700 dark:text-gray-300">{term}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-center text-gray-400 text-sm py-4">No recent searches</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchModal;