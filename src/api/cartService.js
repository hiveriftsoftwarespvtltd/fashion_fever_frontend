import apiClient from './apiClient';

/**
 * Fetch the current user's cart
 */
export const getUserCart = async () => {
  try {
    const response = await apiClient.get('/cart/fetch-user-cart');
    return response.data;
  } catch (error) {
    console.error('Fetch cart error:', error);
    return error.response?.data || {
      success: false,
      message: 'Failed to fetch cart.',
      statusCode: 500
    };
  }
};

/**
 * Add an item to the cart
 * @param {string} productId
 * @param {string} variantId
 */
export const addToCart = async (productId, variantId) => {
  try {
    const response = await apiClient.post(`/cart/add-to-cart/${variantId}`, { productId });
    return response.data;
  } catch (error) {
    console.error('Add to cart error:', error);
    return error.response?.data || {
      success: false,
      message: 'Failed to add item to cart.',
      statusCode: 500
    };
  }
};

/**
 * Remove an item from the cart
 * @param {string} variantId - ID of the product variant to remove
 */
export const removeFromCart = async (variantId) => {
  try {
    const response = await apiClient.put(`/cart/remove-item-from-cart/${variantId}`);
    return response.data;
  } catch (error) {
    console.error('Remove from cart error:', error);
    return error.response?.data || {
      success: false,
      message: 'Failed to remove item from cart.',
      statusCode: 500
    };
  }
};

/**
 * Update (Increment) quantity of an item in the cart
 * @param {string} productId
 * @param {string} variantId 
 */
export const updateCartQuantity = async (productId, variantId) => {
  try {
    const response = await apiClient.post(`/cart/add-to-cart/${variantId}`, { productId });
    return response.data;
  } catch (error) {
    console.error('Update cart quantity error:', error);
    return error.response?.data || {
      success: false,
      message: 'Failed to update quantity.',
      statusCode: 500
    };
  }
};

/**
 * Decrement quantity of an item in the cart
 * @param {string} variantId 
 */
export const decrementCartQuantity = async (variantId) => {
  try {
    const response = await apiClient.put(`/cart/decrease-item-from-cart/${variantId}`);
    return response.data;
  } catch (error) {
    console.error('Decrement cart quantity error:', error);
    return error.response?.data || {
      success: false,
      message: 'Failed to decrease quantity.',
      statusCode: 500
    };
  }
};

/**
 * Clear the entire cart
 */
export const clearCart = async () => {
  try {
    const response = await apiClient.delete('/cart/clear-cart');
    return response.data;
  } catch (error) {
    console.error('Clear cart error:', error);
    return error.response?.data || {
      success: false,
      message: 'Failed to clear cart.',
      statusCode: 500
    };
  }
};
