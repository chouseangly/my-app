import React from 'react';
import CartClient from './CartClient';

export const metadata = {
  title: 'Your Cart - Zando',
};

const CartPage = () => {
  return (
    <div>
      <CartClient />
    </div>
  );
};

export default CartPage;