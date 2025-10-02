"use client";

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { fetchProductById, trackProductView } from '@/services/getProductById.service';
import ProductInfo from '@/components/product/ProductInfo';
import { useCart } from '@/context/CartContext';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';

// --- Helper Icons ---
const ShareIcon = (props) => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" /><polyline points="16 6 12 2 8 6" /><line x1="12" x2="12" y1="2" y2="15" /></svg>);
const HeartIcon = (props) => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>);

const ProductDetailPage = () => {
    const params = useParams();
    const { productId } = params;
    const { addToCart } = useCart();
    const { data: session } = useSession();

    const [product, setProduct] = useState(null);
    const [selectedColor, setSelectedColor] = useState(null);
    const [mainImage, setMainImage] = useState(null);
    const [selectedSize, setSelectedSize] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [allPossibleSizes, setAllPossibleSizes] = useState([]);

    useEffect(() => {
        if (productId) {
            const getProduct = async () => {
                const data = await fetchProductById(productId);
                if (data) {
                    setProduct(data);

                    const initialColor = data.gallery[0];
                    setSelectedColor(initialColor);
                    setMainImage(initialColor.images[0]);

                    const uniqueSizes = data.gallery.flatMap(variant => variant.sizes)
                        .filter((size, index, self) =>
                            index === self.findIndex((s) => (
                                s.sizeId === size.sizeId
                            ))
                        );
                    setAllPossibleSizes(uniqueSizes);

                    if (initialColor.sizes && initialColor.sizes.length > 0) {
                      setSelectedSize(initialColor.sizes[0].name);
                    }
                }
            };
            getProduct();
            trackProductView(productId);
        }
    }, [productId]);

    const handleAddToCartClick = () => {
        if (!session) {
            toast.error("Please log in to add items to your cart.");
            return;
        }

        const sizeObject = allPossibleSizes.find(size => size.name === selectedSize);

        if (!sizeObject) {
            toast.error("Please select a size.");
            return;
        }

        const item = {
            userId: session.user.id,
            productId: parseInt(productId),
            variantId: selectedColor.variantId,
            sizeId: sizeObject.sizeId,
            quantity,
        };
        addToCart(item);
    };

    const handleColorSelect = (colorOption) => {
        setSelectedColor(colorOption);
        setMainImage(colorOption.images[0]);
        if (!colorOption.sizes.some(s => s.name === selectedSize)) {
            setSelectedSize(colorOption.sizes[0]?.name || '');
        }
    };

    if (!product) {
        return <div className="flex justify-center items-center h-screen">Loading product details...</div>;
    }

    return (
        <main className="bg-white dark:bg-gray-900 min-h-screen font-sans flex items-center justify-center py-8 px-4">
            <div className="w-full mx-auto px-[5%]">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    <div className="flex flex-col-reverse md:flex-row gap-4">
                        <div className="flex md:flex-col gap-3 justify-center md:justify-start">
                            {selectedColor.images.map((img, index) => (
                                <img key={index} src={img} alt={`Thumbnail ${index + 1}`} className={`w-26 h-30 object-cover rounded-md cursor-pointer border-2 transition-all ${mainImage === img ? 'border-gray-500 dark:border-gray-400' : 'border-transparent hover:border-gray-300 dark:hover:border-gray-600'}`} onMouseEnter={() => setMainImage(img)} />
                            ))}
                        </div>
                        <div className="flex-1 relative">
                            <img src={mainImage} alt={product.name} className="w-full h-auto object-cover rounded-lg aspect-[4/5]" onError={(e) => { e.currentTarget.src = "https://placehold.co/600x750/cccccc/ffffff?text=Error"; }} />
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <div className="flex justify-between items-center mb-2">
                            <div className="flex items-baseline gap-3 text-xl">
                                <span className="font-semibold text-gray-800 dark:text-gray-200">US ${product.price.toFixed(2)}</span>
                                {product.discount > 0 && <span className="text-red-500 font-semibold">-{product.discount}%</span>}
                                {product.originalPrice && <span className="text-gray-400 dark:text-gray-500 line-through">US ${product.originalPrice.toFixed(2)}</span>}
                            </div>
                            <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"><ShareIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" /></button>
                        </div>
                        <h1 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-4">{product.name}</h1>
                        <div className="mb-6">
                            <h3 className="text-md font-bold text-gray-800 dark:text-gray-200 mb-2">{product.gallery.length} Colors Available</h3>
                            <div className="flex gap-2">
                                {product.gallery.map(colorOption => (
                                    <button key={colorOption.color} onClick={() => handleColorSelect(colorOption)}>
                                        <img src={colorOption.images[0]} alt={colorOption.color} className={`w-26 h-30 object-cover rounded-md border-2 transition ${selectedColor.color === colorOption.color ? 'border-gray-800 dark:border-gray-200' : 'border-gray-300 dark:border-gray-600 hover:border-gray-500 dark:hover:border-gray-400'}`} />
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="mb-6">
                            <h3 className="text-md font-bold text-gray-800 dark:text-gray-200 mb-2">Size</h3>
                            <div className="flex flex-wrap gap-2">
                                {allPossibleSizes.map(size => {
                                    const isAvailable = selectedColor.sizes.some(s => s.name === size.name);
                                    return (
                                        <button key={size.name} onClick={() => isAvailable && setSelectedSize(size.name)} disabled={!isAvailable} className={`px-4 py-2 rounded-md border text-sm font-medium transition relative ${isAvailable ? (selectedSize === size.name ? 'bg-gray-900 dark:bg-white text-white dark:text-black border-gray-900 dark:border-white' : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600') : 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 border-gray-200 dark:border-gray-700 cursor-not-allowed'}`}>
                                            {size.name}
                                            {!isAvailable && <div className="absolute inset-0 flex items-center justify-center"><div className="w-full h-px bg-gray-400 transform -rotate-12"></div></div>}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                          <h3 className="text-md font-bold text-gray-800 dark:text-gray-200 mb-2">Quantity</h3>
                        <div className="flex items-center gap-4 mb-6">

                            <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-md">
                                <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="px-3 py-2 text-xl font-light text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-l-md">-</button>
                                <span className="px-5 py-2 text-md font-medium text-gray-800 dark:text-gray-200">{quantity}</span>
                                <button onClick={() => setQuantity(q => q + 1)} className="px-3 py-2 text-xl font-light text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-r-md">+</button>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <button onClick={handleAddToCartClick} className="flex-1 bg-black dark:bg-white text-white dark:text-black font-semibold py-3 px-6 rounded-md hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors duration-300">Add to bag</button>
                            <button className="p-3 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"><HeartIcon className="w-6 h-6 text-gray-500 dark:text-gray-400" /></button>
                        </div>
                        <ProductInfo />
                    </div>
                </div>
            </div>
        </main>
    );
};

export default ProductDetailPage;
