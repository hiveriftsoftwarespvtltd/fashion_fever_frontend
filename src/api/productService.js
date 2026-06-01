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
