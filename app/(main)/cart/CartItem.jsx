"use client";

import React from "react";
import { X } from "lucide-react";
import { useCart } from "@/context/CartContext";

const CartItem = ({ item }) => {
  const { removeFromCart } = useCart();

  if (!item || !item.product) return null;

  const handleRemoveItem = () => {
    removeFromCart(item.cartItemId);
  };

  const color =
    item.product.gallery?.find((g) => g.color)?.color || "N/A";
  const size =
    item.product.gallery
      ?.flatMap((g) => g.sizes)
      .find((s) => s)?.name || "N/A";

  const imageUrl =
    item.product.gallery?.[0]?.images?.[0] ||
    "https://placehold.co/120x150/cccccc/ffffff?text=No+Image";

  return (
    <div className="flex items-center gap-5 p-4 border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow bg-white">
      {/* Product Image */}
      <div className="relative">
        <img
          src={imageUrl}
          alt={item.product.name}
          className="w-32 h-32 object-cover rounded-xl border border-gray-100"
        />
      </div>

      {/* Product Details */}
      <div className="flex flex-col flex-grow justify-between">
        <div>
          <h3 className="font-semibold text-gray-800 text-lg mb-1 line-clamp-1">
            {item.product.name}
          </h3>
          <p className="text-sm text-gray-500">{item.product.description}</p>
          
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 text-sm text-gray-500">
            <p>Color: <span className="text-gray-700 font-medium">{color}</span></p>
            <span className="hidden sm:inline-block mx-2">•</span>
            <p>Size: <span className="text-gray-700 font-medium">{size}</span></p>
          </div>
        </div>

        <div className="mt-3 flex items-center gap-3">
          <span className="text-base font-semibold text-gray-900">
            ${item.product.price.toFixed(2)}
          </span>
          <span className="text-sm text-gray-500">× {item.quantity}</span>
        </div>
      </div>

      {/* Remove + Total */}
      <div className="flex flex-col items-end justify-between h-full ml-4">
        <button
          onClick={handleRemoveItem}
          className="text-gray-400 hover:text-red-500 transition-colors"
        >
          <X size={20} />
        </button>
        <span className="text-lg font-bold text-gray-900">
          ${(item.product.price * item.quantity).toFixed(2)}
        </span>
      </div>
    </div>
  );
};

export default CartItem;
