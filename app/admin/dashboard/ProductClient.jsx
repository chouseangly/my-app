// chouseangly/zandoapp/zandoApp-main/src/app/admin/dashboard/ProductClient.jsx

"use client"

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Plus, Edit, Trash2, ChevronDown } from 'lucide-react';
import AddProductModal from './AddProductModal';
import EditProductModal from './EditProductModal';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import { fetchAdminProducts } from '@/services/dashboard.service';
import { fetchProductsByCategoryId } from '@/services/getCategoryById.service';

const StatusBadge = ({ isAvailable }) => {
    const baseClasses = "px-3 py-1 text-xs font-semibold rounded-full inline-block";
    const statusText = isAvailable ? "Available" : "Out of stock";
    const statusStyle = isAvailable ? "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300" : "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300";
    
    return <span className={`${baseClasses} ${statusStyle}`}>{statusText}</span>;
};

const ProductClient = ({ searchQuery, selectedCategory }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAddModalOpen, setAddModalOpen] = useState(false);
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    const loadProducts = useCallback(async () => {
        setLoading(true);
        let fetchedProducts = [];
        if (selectedCategory) {
            fetchedProducts = await fetchProductsByCategoryId(selectedCategory);
        } else {
            fetchedProducts = await fetchAdminProducts();
        }
        setProducts(fetchedProducts);
        setLoading(false);
    }, [selectedCategory]);

    useEffect(() => {
        loadProducts();
    }, [loadProducts]);
    
    const filteredProducts = useMemo(() => {
        if (!searchQuery) {
            return products;
        }
        return products.filter(product =>
            product.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [products, searchQuery]);

    const handleEdit = (product) => {
        setSelectedProduct(product);
        setEditModalOpen(true);
    };

    const handleDelete = (product) => {
        setSelectedProduct(product);
        setDeleteModalOpen(true);
    };

    if (loading) {
        return <div className="text-center py-10">Loading Products...</div>;
    }

    return (
        <>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
                <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">Products</h2>
                    <div className="flex items-center gap-4">
                        <button className="flex items-center gap-2 text-gray-600 dark:text-gray-300 text-sm font-medium border rounded-md px-3 py-1.5 hover:bg-gray-50 dark:hover:bg-gray-700">
                            Most Sell <ChevronDown size={16} />
                        </button>
                        <button onClick={() => setAddModalOpen(true)} className="bg-black dark:bg-white text-white dark:text-black px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors">
                            <Plus size={18} /> Add Product
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead>
                            <tr className="border-b border-gray-200 dark:border-gray-700">
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">No</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Image</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Product Name</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Price</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Sell</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">View</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Earning</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800">
                            {filteredProducts.map((product, index) => (
                                <tr key={product.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                    <td className="px-6 py-4 text-sm font-medium text-gray-500 dark:text-gray-400">{index + 1}</td>
                                    <td className="px-6 py-4">
                                        <img src={product.gallery?.[0]?.images?.[0] || 'https://placehold.co/40x40'} alt={product.name} className="w-10 h-10 rounded-md object-cover" />
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-800 dark:text-gray-100 font-semibold">{product.name}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">${product.price?.toFixed(2)}</td>
                                    <td className="px-6 py-4 text-sm"><StatusBadge isAvailable={product.isAvailable} /></td>
                                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{product.sell}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{product.view?.toLocaleString()}</td>
                                    <td className="px-6 py-4 text-sm font-semibold text-gray-800 dark:text-gray-100">${product.earning?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                    <td className="px-6 py-4 text-sm font-medium">
                                        <div className="flex items-center gap-4">
                                            <button onClick={() => handleEdit(product)} className="text-gray-400 hover:text-blue-600"><Edit size={18} /></button>
                                            <button onClick={() => handleDelete(product)} className="text-gray-400 hover:text-red-600"><Trash2 size={18} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <AddProductModal 
                isOpen={isAddModalOpen} 
                onClose={() => setAddModalOpen(false)}
                onProductAdded={loadProducts}
            />
            {selectedProduct && <EditProductModal 
                isOpen={isEditModalOpen} 
                onClose={() => setEditModalOpen(false)} 
                product={selectedProduct} 
                onProductUpdated={loadProducts}
            />}
            {selectedProduct && <DeleteConfirmationModal 
                isOpen={isDeleteModalOpen} 
                onClose={() => setDeleteModalOpen(false)} 
                product={selectedProduct} 
                onProductDeleted={loadProducts}
            />}
        </>
    );
};

export default ProductClient;