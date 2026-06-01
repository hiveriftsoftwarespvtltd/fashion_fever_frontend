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

/**
 * Fetch detailed cart information with shipping calculations and coupon summaries by cart ID
 * Method: GET
 * URL: /cart/cart-details/:cartId
 * @param {string} cartId
 */
export const getCartDetails = async (cartId) => {
  try {
    const response = await apiClient.get(`/cart/cart-details/${cartId}`);
    return response.data;
  } catch (error) {
    console.error('Fetch cart details error:', error);
    return error.response?.data || {
      success: false,
      message: 'Failed to fetch cart details.',
      statusCode: 500
    };
  }
};

/** Fetch available coupons for checkout */
export const getCoupons = async () => {
  try {
    const response = await apiClient.get('/cart/coupons');
    return response.data;
  } catch (error) {
    console.error('Fetch coupons error:', error);
    return error.response?.data || { success: false, message: 'Failed to fetch coupons', statusCode: 500 };
  }
};

/**
 * Validate a coupon code via backend
 * Method: POST
 * URL: /cart/validate-coupon
 * @param {string} couponCode
 */
export const validateCoupon = async (couponCode) => {
  try {
    const response = await apiClient.post('/cart/validate-coupon', { couponCode });
    return response.data;
  } catch (error) {
    console.error('Validate coupon error:', error);
    return error.response?.data || { success: false, message: 'Failed to validate coupon', statusCode: 500 };
  }
};

/**
 * Place a new order
 * Method: POST
 * URL: /orders/place-order
 * @param {object} orderData
 */
export const placeOrder = async (orderData) => {
  try {
    const response = await apiClient.post('/orders/place-order', orderData);
    return response.data;
  } catch (error) {
    console.error('Place order error:', error);
    return error.response?.data || { success: false, message: 'Failed to place order', statusCode: 500 };
  }
};


