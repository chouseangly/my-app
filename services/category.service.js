// This function fetches the category tree from your backend API
export const fetchCategories = async () => {
  try {
    const response = await fetch('http://localhost:8080/api/v1/categories');

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    return []; // Return an empty array on error
  }
};