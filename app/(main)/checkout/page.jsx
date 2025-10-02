import React from 'react';
import CheckoutClient from './CheckoutClient';

export const metadata = {
  title: 'Checkout - Zando',
};

const CheckoutPage = () => {
  return (
    <div className="bg-gray-50 dark:bg-gray-900">
      <CheckoutClient />
    </div>
  );
};

export default CheckoutPage;