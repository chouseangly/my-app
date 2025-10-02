// This function fetches a single product by its ID from your backend API
export const fetchProductById = async (productId) => {
  try {
    // ✅ FIX: Corrected the endpoint URL to match the backend controller
    const response = await fetch(`http://localhost:8080/api/v1/products/${productId}`);

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    // The product data is inside the 'payload' property of the response
    const apiResponse = await response.json();
    return apiResponse.payload;

  } catch (error) {
    console.error(`Failed to fetch product with ID ${productId}:`, error);
    return null; // Return null on error
  }
};

// This function fetches all products from your backend API
export const fetchAllProducts = async () => {
  try {
    const response = await fetch('http://localhost:8080/api/v1/products');

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const apiResponse = await response.json();
    return apiResponse.payload;

  } catch (error) {
    console.error("Failed to fetch products:", error);
    return []; // Return an empty array on error
  }

};

export const trackProductView = async (productId) => {
  try {
    // This sends a request to your new backend endpoint.
    // We don't need to do anything with the response.
    await fetch(`http://localhost:8080/api/v1/products/${productId}/view`, {
      method: 'POST',
    });
  } catch (error) {
    // It's okay if this fails, so we just log the error.
    console.error("Failed to track product view:", error);
  }
};