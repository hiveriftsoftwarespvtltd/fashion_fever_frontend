import apiClient from './apiClient';

/**
 * Add a product to the wishlist
 * @param {string} productId 
 * @param {string} variantId
 */
export const addToWishlist = async (productId, variantId) => {
  try {
    const response = await apiClient.post(`/wishlist/add/${variantId}`, { productId });
    return response.data;
  } catch (error) {
    console.error('Add to wishlist error:', error);
    return error.response?.data || {
      success: false,
      message: 'Failed to add to wishlist.',
      statusCode: 500
    };
  }
};

/**
 * Remove a product from the wishlist
 * @param {string} variantId 
 */
export const removeFromWishlist = async (variantId) => {
  try {
    const response = await apiClient.delete(`/wishlist/remove/${variantId}`);
    return response.data;
  } catch (error) {
    console.error('Remove from wishlist error:', error);
    return error.response?.data || {
      success: false,
      message: 'Failed to remove from wishlist.',
      statusCode: 500
    };
  }
};

/**
 * Fetch the user's wishlist
 */
export const getWishlist = async () => {
  try {
    const response = await apiClient.get('/wishlist/fetch');
    return response.data;
  } catch (error) {
    console.error('Fetch wishlist error:', error);
    return error.response?.data || {
      success: false,
      message: 'Failed to fetch wishlist.',
      statusCode: 500
    };
  }
};

/**
 * Clear the entire wishlist
 */
export const clearWishlist = async () => {
  try {
    const response = await apiClient.delete('/wishlist/clear');
    return response.data;
  } catch (error) {
    console.error('Clear wishlist error:', error);
    return error.response?.data || {
      success: false,
      message: 'Failed to clear wishlist.',
      statusCode: 500
    };
  }
};
