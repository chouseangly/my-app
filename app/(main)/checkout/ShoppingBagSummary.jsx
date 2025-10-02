import React from 'react';

const ShoppingBagSummary = ({ items }) => {
    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border dark:border-gray-700">
            <h3 className="font-semibold text-lg mb-4">My Shopping bag ({items.length})</h3>
            <div className="space-y-4 max-h-80 overflow-y-auto">
                {items.map(item => (
                    <div key={item.product.id} className="flex gap-4">
                        <img 
                            src={item.product.gallery?.[0]?.images?.[0] || "https://placehold.co/80x100"} 
                            alt={item.product.name}
                            className="w-20 h-24 object-cover rounded-md"
                        />
                        <div className="flex-grow text-sm">
                            <p className="font-semibold text-gray-800 dark:text-gray-100">{item.product.name}</p>
                            <p className="text-gray-500 dark:text-gray-400">Code: 21255031246</p>
                            <p className="text-gray-500 dark:text-gray-400">Size: S</p>
                             <p className="text-gray-500 dark:text-gray-400">Quantity x {item.quantity}</p>
                        </div>
                        <div className="text-sm text-right">
                            <p className="font-semibold text-gray-800 dark:text-gray-100">US ${item.product.price.toFixed(2)}</p>
                            {item.product.discount > 0 && (
                                <>
                                    <p className="text-gray-400 line-through">US ${item.product.originalPrice.toFixed(2)}</p>
                                    <p className="text-red-500">({item.product.discount}% off)</p>
                                </>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ShoppingBagSummary;