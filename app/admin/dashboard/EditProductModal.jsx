"use client";

import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, UploadCloud } from 'lucide-react';
import { fetchCategories } from '@/services/category.service';
import { useSession } from "next-auth/react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const EditProductModal = ({ isOpen, onClose, product, onProductUpdated }) => {
    const { data: session } = useSession();
    const [formData, setFormData] = useState(null);
    const [allCategories, setAllCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const loadCategories = async () => {
            const categories = await fetchCategories();
            setAllCategories(categories);
        };
        if (isOpen) {
            loadCategories();
        }
    }, [isOpen]);

    useEffect(() => {
        if (product) {
            setFormData({
                name: product.name || '',
                description: product.description || '',
                basePrice: product.originalPrice || '',
                discountPercent: product.discount || 0,
                isAvailable: product.isAvailable,
                categoryIds: product.categories.map(c => c.id),
                variants: product.gallery.map(g => ({
                    ...g,
                    sizes: Array.isArray(g.sizes) ? g.sizes.join(',') : g.sizes,
                    quantity: g.quantity || 0,
                    files: [],
                    previews: g.images
                })) || []
            });
        }
    }, [product]);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleCategoryChange = (categoryId) => {
        setFormData(prev => {
            const newCategoryIds = prev.categoryIds.includes(categoryId)
                ? prev.categoryIds.filter(id => id !== categoryId)
                : [...prev.categoryIds, categoryId];
            return { ...prev, categoryIds: newCategoryIds };
        });
    };

    const handleVariantChange = (index, field, value) => {
        const newVariants = [...formData.variants];
        newVariants[index][field] = value;
        setFormData(prev => ({ ...prev, variants: newVariants }));
    };

    const handleFileChange = (index, e) => {
        const files = Array.from(e.target.files).slice(0, 6);
        const newVariants = [...formData.variants];
        newVariants[index].files = files;
        newVariants[index].imageCount = files.length;
        newVariants[index].previews = files.map(file => URL.createObjectURL(file));
        setFormData(prev => ({ ...prev, variants: newVariants }));
    };

    const addVariant = () => {
        setFormData(prev => ({
            ...prev,
            variants: [...prev.variants, { color: '', sizes: '', quantity: 0, files: [], previews: [] }]
        }));
    };

    const removeVariant = (index) => {
        const newVariants = formData.variants.filter((_, i) => i !== index);
        setFormData(prev => ({ ...prev, variants: newVariants }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const formPayload = new FormData();
        formPayload.append('name', formData.name);
        formPayload.append('description', formData.description);
        formPayload.append('basePrice', formData.basePrice || 0);
        formPayload.append('discountPercent', formData.discountPercent || 0);
        formPayload.append('isAvailable', String(formData.isAvailable));

        const variantsForApi = formData.variants.map(v => ({
            color: v.color,
            quantity: v.quantity || 0, // ✅ FIX: Send quantity to backend
            sizes: Array.isArray(v.sizes) ? v.sizes : (v.sizes ? v.sizes.split(',').map(s => s.trim()).filter(s => s) : []),
            imageCount: v.files?.length || 0, // Use new files length
            images: v.previews, 
        }));

        formPayload.append('variants', JSON.stringify(variantsForApi));
        formData.categoryIds.forEach(id => formPayload.append('categoryIds', id));
        formData.variants.forEach(variant => {
            if (variant.files) {
                variant.files.forEach(file => {
                    formPayload.append('images', file);
                });
            }
        });

        try {
            if (!session?.user?.token) {
                console.error("Authentication token not found.");
                return;
            }

            const response = await fetch(`${API_BASE_URL}/products/admin/${product.id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${session.user.token}`
                },
                body: formPayload
            });

            if (response.ok) {
                onProductUpdated();
                onClose();
            } else {
                const errorText = await response.text();
                console.error("Failed to update product", errorText);
            }
        } catch (error) {
            console.error("Error updating product:", error);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen || !formData) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-4xl text-gray-800 dark:text-gray-200">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold">Edit Product</h2>
                    <button onClick={onClose}><X size={24} /></button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4 max-h-[85vh] overflow-y-auto pr-4">
                    <input name="name" value={formData.name} onChange={handleInputChange} placeholder="Product Name" className="w-full p-2 border rounded bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600" />
                    <textarea name="description" value={formData.description} onChange={handleInputChange} placeholder="Description" className="w-full p-2 border rounded bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600" />
                    <div className="grid grid-cols-2 gap-4">
                        <input name="basePrice" type="number" value={formData.basePrice} onChange={handleInputChange} placeholder="Price" className="w-full p-2 border rounded bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600" />
                        <input name="discountPercent" type="number" value={formData.discountPercent} onChange={handleInputChange} placeholder="Discount %" className="w-full p-2 border rounded bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600" />
                    </div>
                    <div className="flex items-center gap-4">
                        <label className="font-medium">Status:</label>
                        <span className={`${!formData.isAvailable ? 'text-red-500' : 'text-gray-400'}`}>Out of Stock</span>
                        <button type="button" onClick={() => setFormData(p => ({ ...p, isAvailable: !p.isAvailable }))} className={`relative inline-flex h-6 w-11 items-center rounded-full ${formData.isAvailable ? 'bg-green-500' : 'bg-gray-300'}`}>
                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${formData.isAvailable ? 'translate-x-6' : 'translate-x-1'}`} />
                        </button>
                        <span className={`${formData.isAvailable ? 'text-green-500' : 'text-gray-400'}`}>Available</span>
                    </div>

                    <div>
                        <label className="block font-medium mb-2">Categories</label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 border p-4 rounded-md max-h-60 overflow-y-auto bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600">
                           {allCategories.map(mainCat => (
                                <div key={mainCat.id}>
                                    <h4 className="font-bold text-lg text-gray-800 dark:text-gray-200 mb-3">{mainCat.name}</h4>
                                    {mainCat.children.map(subCat => (
                                        <div key={subCat.id} className="mb-3">
                                            <h5 className="font-semibold text-red-600 uppercase text-sm tracking-wider mb-2">{subCat.name}</h5>
                                            <div className="space-y-2 pl-2">
                                                {subCat.children.map(childCat => (
                                                    <label key={childCat.id} className="flex items-center text-sm">
                                                        <input
                                                            type="checkbox"
                                                            value={childCat.id}
                                                            checked={formData.categoryIds.includes(childCat.id)}
                                                            onChange={() => handleCategoryChange(childCat.id)}
                                                            className="h-4 w-4 rounded border-gray-300 text-black focus:ring-black"
                                                        />
                                                        <span className="ml-2 text-gray-600 dark:text-gray-300">{childCat.name}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <div className="flex justify-between items-center mt-4 mb-2">
                            <h3 className="font-bold">Variants</h3>
                            <button type="button" onClick={addVariant} className="flex items-center gap-1 text-sm bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600">
                                <Plus size={16} /> Add Variant
                            </button>
                        </div>
                        {formData.variants.map((variant, index) => (
                            <div key={index} className="p-3 border rounded mb-2 bg-gray-50 dark:bg-gray-700/50 relative border-gray-300 dark:border-gray-600">
                                <button type="button" onClick={() => removeVariant(index)} className="absolute top-2 right-2 text-red-500 hover:text-red-700">
                                    <Trash2 size={18} />
                                </button>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <input value={variant.color} onChange={e => handleVariantChange(index, 'color', e.target.value)} placeholder="Color (e.g., Blue)" className="w-full p-2 border rounded mb-2 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600" />
                                        <input type="number" value={variant.quantity} onChange={e => handleVariantChange(index, 'quantity', e.target.value)} placeholder="Quantity" className="w-full p-2 border rounded mb-2 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600" />
                                        <input value={variant.sizes} onChange={e => handleVariantChange(index, 'sizes', e.target.value)} placeholder="Sizes (comma-separated, e.g., S,M,L)" className="w-full p-2 border rounded bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600" />
                                    </div>
                                    <div>
                                        <label className="w-full flex flex-col items-center justify-center p-4 border-2 border-dashed rounded-md cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 border-gray-300 dark:border-gray-600">
                                            <UploadCloud size={24} className="text-gray-400" />
                                            <span className="text-sm text-gray-500 dark:text-gray-400 mt-2">Upload up to 6 images</span>
                                            <input type="file" multiple accept="image/*" onChange={e => handleFileChange(index, e)} className="hidden" />
                                        </label>
                                    </div>
                                </div>
                                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mt-2">
                                    {variant.previews.map((preview, i) => (
                                        <img key={i} src={preview} alt="preview" className="w-full h-20 object-cover rounded" />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 dark:bg-gray-600 rounded-md">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-black text-white dark:text-black dark:bg-white rounded-md" disabled={isLoading}>
                            {isLoading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditProductModal;