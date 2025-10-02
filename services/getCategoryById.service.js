export const fetchProductsByCategoryId = async (categoryId) => {
  try {
    // ✅ FIX: Corrected the API endpoint URL
    const response = await fetch(`http://localhost:8080/api/v1/products/category/${categoryId}`);

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const apiResponse = await response.json();
    return apiResponse.payload;

  } catch (error) {
    console.error(`Failed to fetch products for category ${categoryId}:`, error);
    return [];
  }
};