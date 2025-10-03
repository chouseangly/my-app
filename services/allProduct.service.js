// This function fetches all products from your backend API
export const fetchAllProducts = async () => {
  try {
    // ✅ FIX: Corrected the endpoint URL to match the backend controller
    const response = await fetch('http://localhost:8080/api/v1/products');

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    // The actual product list is inside the 'payload' property of the response
    const apiResponse = await response.json();
    return apiResponse.payload;

  } catch (error) {
    console.error("Failed to fetch products:", error);
    return []; // Return an empty array on error to prevent crashes
  }
};

export const searchProducts = async (name, categoryId) => {
  try {
    let url = `http://localhost:8080/api/v1/products?name=${encodeURIComponent(name)}`;
    if (categoryId) {
        url += `&categoryId=${categoryId}`;
    }
    const response = await fetch(url);


    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const apiResponse = await response.json();
    return apiResponse.payload;

  } catch (error) {
    console.error(`Failed to search for products with name ${name}:`, error);
    return [];
  }
};