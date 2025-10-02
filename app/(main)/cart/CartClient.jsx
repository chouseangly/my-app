"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { useSession } from 'next-auth/react';
import CartItem from './CartItem';
import OrderSummary from './OrderSummary';

const CartClient = () => {
  const { cartItems, products } = useCart();
  const { status } = useSession();

  if (status === 'loading') {
    return <div className="text-center py-20 dark:text-gray-300">Loading Cart...</div>;
  }

  // Match cart items with full product details
  const cartProducts = cartItems
    .map(item => {
      const product = products.find(p => p.id === item.productId);
      return product ? { ...item, product } : null;
    })
    .filter(Boolean); // Remove any items where the product wasn't found

  const subtotal = cartProducts.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  // Handle the empty cart case
  if (cartProducts.length === 0) {
    return (
      <div className="container mx-auto px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center text-center bg-white dark:bg-gray-800 rounded-2xl border border-gray-200/80 dark:border-gray-700/80 min-h-[60vh] p-8">
          <Image
            src="/no-listings-fav.jpg" // Re-using an existing image
            alt="Empty Cart"
            width={300}
            height={300}
            className="w-full max-w-xs h-auto mb-6 rounded-lg"
          />
          <h2 className="font-semibold text-xl mb-2 dark:text-gray-100">Your cart is empty</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 max-w-md mb-6">
            Looks like you haven’t added anything to your cart yet. Start shopping to fill it up!
          </p>
          <Link href="/" className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  // Display the cart items and summary
  return (
    <div className="bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-10 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-8 text-gray-800 dark:text-gray-200">Shopping Cart</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            <div className="lg:col-span-2 space-y-4">
            {cartProducts.map(item => (
                <CartItem key={item.cartItemId} item={item} />
            ))}
            </div>
            <div className="lg:col-span-1">
            <OrderSummary subtotal={subtotal} />
            </div>
        </div>
        </div>
    </div>
  );
};

export default CartClient;