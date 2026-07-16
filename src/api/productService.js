import apiClient from './apiClient';

/**
 * Fetch products for users (Customer-facing)
 * @param {Object} params - Query parameters (limit, page, category, etc.)
 */
export const getProducts = async (params = {}) => {
  try {
    const response = await apiClient.get('/public-user/products', { params });
    return response.data;
  } catch (error) {
    console.error('Fetch products error:', error);
    return error.response?.data || {
      success: false,
      message: 'Failed to fetch products.',
      statusCode: 500
    };
  }
};

/**
 * Fetch a single product by ID
 */
export const getProductDetail = async (id) => {
  try {
    const response = await apiClient.get(`/user/product/${id}`);
    return response.data;
  } catch (error) {
    console.error('Fetch product detail error:', error);
    return error.response?.data || {
      success: false,
      message: 'Failed to fetch product details.',
      statusCode: 500
    };
  }
};

/**
 * Fetch public categories
 */
export const getPublicCategories = async () => {
  try {
    const response = await apiClient.get('/admin-public/categories');
    return response.data;
  } catch (error) {
    console.error('Fetch public categories error:', error);
    return error.response?.data || {
      success: false,
      message: 'Failed to fetch categories.',
      statusCode: 500
    };
  }
};

/**
 * Fetch public brands
 */
export const getPublicBrands = async () => {
  try {
    const response = await apiClient.get('/public-user/brands');
    return response.data;
  } catch (error) {
    console.error('Fetch public brands error:', error);
    return error.response?.data || {
      success: false,
      message: 'Failed to fetch brands.',
      statusCode: 500
    };
  }
};

/**
 * Fetch top selling products
 */
export const getTopSellingProducts = async () => {
  try {
    const response = await apiClient.get('/public-user/top-selling-products');
    return response.data;
  } catch (error) {
    console.error('Fetch top selling products error:', error);
    return error.response?.data || {
      success: false,
      message: 'Failed to fetch top selling products.',
      statusCode: 500
    };
  }
};

/**
 * Fetch trending products
 */
export const getTrendingProducts = async () => {
  try {
    const response = await apiClient.get('/public-user/trending-products');
    return response.data;
  } catch (error) {
    console.error('Fetch trending products error:', error);
    return error.response?.data || {
      success: false,
      message: 'Failed to fetch trending products.',
      statusCode: 500
    };
  }
};

/**
 * Add a user review for a product
 * @param {FormData} reviewData - Multipart Form Data holding review fields and images
 */
export const addProductReview = async (reviewData) => {
  try {
    const response = await apiClient.post('/user-reviews/add', reviewData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Add product review error:', error);
    return error.response?.data || {
      success: false,
      message: 'Failed to post review.',
      statusCode: 500
    };
  }
};

/**
 * Update a user review
 * @param {string} reviewId - The ID of the review to update
 * @param {Object} reviewData - Object containing rating, title, review, productId
 */
export const updateProductReview = async (reviewId, reviewData) => {
  try {
    const response = await apiClient.put(`/user-reviews/update/${reviewId}`, reviewData);
    return response.data;
  } catch (error) {
    console.error('Update product review error:', error);
    return error.response?.data || {
      success: false,
      message: 'Failed to update review.',
      statusCode: 500
    };
  }
};

/**
 * Fetch reviews for a specific product
 * @param {string} productId - Product ID
 */
export const getProductReviews = async (productId) => {
  try {
    const response = await apiClient.get(`/user-reviews/product-reviews/${productId}`);
    return response.data;
  } catch (error) {
    console.error('Fetch product reviews error:', error);
    return error.response?.data || {
      success: false,
      message: 'Failed to fetch product reviews.',
      statusCode: 500
    };
  }
};

/**
 * Delete a user review
 * @param {string} reviewId - The ID of the review to delete
 */
export const deleteProductReview = async (reviewId) => {
  try {
    const response = await apiClient.delete(`/user-reviews/delete/${reviewId}`);
    return response.data;
  } catch (error) {
    console.error('Delete product review error:', error);
    return error.response?.data || {
      success: false,
      message: 'Failed to delete review.',
      statusCode: 500
    };
  }
};






