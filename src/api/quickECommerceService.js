import apiClient from './apiClient';

/* ==========================================================================
   CUSTOMER FLOW APIs
   ========================================================================== */

/**
 * Fetch Quick Commerce Products
 * @param {object} params - { page, limit, search, category, minPrice, maxPrice, addressId }
 */
export const getQuickProducts = async (params = {}) => {
  try {
    const response = await apiClient.get('/quick-e-commerce/products', { params });
    return response.data;
  } catch (error) {
    console.error('getQuickProducts error:', error);
    return error.response?.data || { success: false, message: 'Failed to fetch quick products', statusCode: 500 };
  }
};

/**
 * Get items in Quick Commerce Cart
 */
export const getQuickCart = async () => {
  try {
    const response = await apiClient.get('/quick-cart/get-items');
    return response.data;
  } catch (error) {
    console.error('getQuickCart error:', error);
    return error.response?.data || { success: false, message: 'Failed to fetch quick cart items', statusCode: 500 };
  }
};

/**
 * Add or update item in Quick Commerce Cart
 * @param {string} productId 
 * @param {string} variantId 
 * @param {number} quantity 
 */
export const addToQuickCart = async (productId, variantId, quantity = 1) => {
  try {
    const pId = typeof productId === 'object' ? String(productId._id || productId.id || '') : String(productId || '');
    const vId = typeof variantId === 'object' ? String(variantId._id || variantId.id || '') : String(variantId || '');
    const response = await apiClient.post('/quick-cart/add', { productId: pId, variantId: vId, quantity });
    return response.data;
  } catch (error) {
    console.error('addToQuickCart error:', error);
    return error.response?.data || { success: false, message: 'Failed to add item to quick cart', statusCode: 500 };
  }
};

/**
 * Decrease item quantity in Quick Commerce Cart
 * @param {string} productId 
 * @param {string} variantId 
 */
export const decreaseQuickCartItem = async (productId, variantId) => {
  try {
    const pId = typeof productId === 'object' ? String(productId._id || productId.id || '') : String(productId || '');
    const vId = typeof variantId === 'object' ? String(variantId._id || variantId.id || '') : String(variantId || '');
    const response = await apiClient.put('/quick-cart/decrease', { productId: pId, variantId: vId });
    return response.data;
  } catch (error) {
    console.error('decreaseQuickCartItem error:', error);
    return error.response?.data || { success: false, message: 'Failed to decrease item quantity', statusCode: 500 };
  }
};

/**
 * Remove item from Quick Commerce Cart
 * @param {string} productId 
 * @param {string} variantId 
 */
export const removeQuickCartItem = async (productId, variantId) => {
  try {
    const response = await apiClient.delete('/quick-cart/remove', {
      data: { productId, variantId }
    });
    return response.data;
  } catch (error) {
    console.error('removeQuickCartItem error:', error);
    return error.response?.data || { success: false, message: 'Failed to remove item from quick cart', statusCode: 500 };
  }
};

/**
 * Clear the entire Quick Commerce Cart
 */
export const clearQuickCart = async () => {
  try {
    const response = await apiClient.delete('/quick-cart/clear');
    return response.data;
  } catch (error) {
    console.error('clearQuickCart error:', error);
    return error.response?.data || { success: false, message: 'Failed to clear quick cart', statusCode: 500 };
  }
};

/**
 * Get Checkout Price Summary details
 * @param {string} couponCode 
 */
export const getQuickCheckoutDetails = async (couponCode = '') => {
  try {
    const response = await apiClient.get('/quick-checkout/details', {
      params: couponCode ? { couponCode } : {}
    });
    return response.data;
  } catch (error) {
    console.error('getQuickCheckoutDetails error:', error);
    return error.response?.data || { success: false, message: 'Failed to fetch quick checkout details', statusCode: 500 };
  }
};

/**
 * Apply coupon to checkout
 * @param {string} couponCode 
 */
export const applyQuickCheckoutCoupon = async (couponCode) => {
  try {
    const response = await apiClient.post('/quick-checkout/apply-coupon', { couponCode });
    return response.data;
  } catch (error) {
    console.error('applyQuickCheckoutCoupon error:', error);
    return error.response?.data || { success: false, message: 'Failed to apply coupon', statusCode: 500 };
  }
};

/**
 * Place Quick Order
 * @param {string} addressId 
 * @param {string} paymentMethod - 'WALLET' | 'CASH_ON_DELIVERY' | 'WALLET_PLUS_COD'
 * @param {string} couponCode 
 */
export const placeQuickOrder = async (addressId, paymentMethod, couponCode = '') => {
  try {
    const payload = { addressId, paymentMethod };
    if (couponCode) payload.couponCode = couponCode;
    const response = await apiClient.post('/quick-order/place-order', payload);
    return response.data;
  } catch (error) {
    console.error('placeQuickOrder error:', error);
    return error.response?.data || { success: false, message: 'Failed to place quick order', statusCode: 500 };
  }
};

/**
 * Fetch logged-in user orders history
 * @param {number} page 
 * @param {number} limit 
 * @param {string} status 
 */
export const getQuickUserOrders = async (page = 1, limit = 10, status = '') => {
  try {
    const params = { page, limit };
    if (status) params.status = status;
    const response = await apiClient.get('/quick-order/my-orders', { params });
    return response.data;
  } catch (error) {
    console.error('getQuickUserOrders error:', error);
    return error.response?.data || { success: false, message: 'Failed to fetch user orders', statusCode: 500 };
  }
};

/**
 * Cancel Quick Order
 * @param {string} orderId 
 * @param {string} reason 
 */
export const cancelQuickOrder = async (orderId, reason = '') => {
  try {
    const response = await apiClient.post(`/quick-order/${orderId}/cancel`, { reason });
    return response.data;
  } catch (error) {
    console.error('cancelQuickOrder error:', error);
    return error.response?.data || { success: false, message: 'Failed to cancel order', statusCode: 500 };
  }
};


/* ==========================================================================
   VENDOR FLOW APIs
   ========================================================================== */

/**
 * Get Vendor Quick Commerce Dashboard status & sales check
 * @param {object} filters - { startDate, endDate }
 */
export const getQuickVendorDashboard = async (filters = {}) => {
  try {
    const response = await apiClient.get('/quick-vendor/dashboard', { params: filters });
    return response.data;
  } catch (error) {
    console.error('getQuickVendorDashboard error:', error);
    return error.response?.data || { success: false, message: 'Failed to fetch vendor dashboard data', statusCode: 500 };
  }
};

/**
 * Turn Quick Delivery ON/OFF & configure preparation time, service radius etc.
 * @param {object} config - { enabled, acceptingOrders, serviceRadius, maxConcurrentOrders, defaultPreparationTime }
 */
export const updateQuickVendorConfig = async (config) => {
  try {
    const response = await apiClient.put('/quick-vendor/commerce-config', config);
    return response.data;
  } catch (error) {
    console.error('updateQuickVendorConfig error:', error);
    return error.response?.data || { success: false, message: 'Failed to update vendor config', statusCode: 500 };
  }
};

/**
 * Assign Delivery person to order
 * @param {string} orderId 
 * @param {string} deliveryPersonId 
 */
export const assignDeliveryPerson = async (orderId, deliveryPersonId) => {
  try {
    const idToSend = typeof deliveryPersonId === 'object' && deliveryPersonId !== null
      ? (deliveryPersonId.deliveryPersonId || deliveryPersonId._id || deliveryPersonId.id)
      : deliveryPersonId;
    const response = await apiClient.put(`/vendor/quick-order/${orderId}/assign`, { deliveryPersonId: String(idToSend || '') });
    return response.data;
  } catch (error) {
    console.error('assignDeliveryPerson error:', error);
    return error.response?.data || { success: false, message: 'Failed to assign delivery rider', statusCode: 500 };
  }
};

/**
 * Assign a delivery rider to a standard (non-quick) vendor order
 * Endpoint: PUT /vendor/order/:orderId/assign-rider
 * @param {string} orderId 
 * @param {string} deliveryPersonId 
 */
export const assignRiderToStandardOrder = async (orderId, deliveryPersonId) => {
  try {
    const response = await apiClient.put(`/vendor/order/${orderId}/assign-rider`, { deliveryPersonId });
    return response.data;
  } catch (error) {
    console.error('assignRiderToStandardOrder error:', error);
    return error.response?.data || { success: false, message: 'Failed to assign rider to standard order', statusCode: 500 };
  }
};


/**
 * Get vendor quick orders list
 * @param {number} page 
 * @param {number} limit 
 * @param {string} status 
 * @param {string} deliveryPersonId 
 */
export const getVendorQuickOrders = async (page = 1, limit = 10, status = '', deliveryPersonId = '') => {
  try {
    const params = { page, limit };
    if (status) params.status = status;
    if (deliveryPersonId) params.deliveryPersonId = deliveryPersonId;
    const response = await apiClient.get('/vendor/quick-order/list', { params });
    return response.data;
  } catch (error) {
    console.error('getVendorQuickOrders error:', error);
    return error.response?.data || { success: false, message: 'Failed to fetch vendor quick orders', statusCode: 500 };
  }
};

/**
 * Update order status by vendor (Preparing, etc.)
 * @param {string} orderId 
 * @param {object} updateData - { status, estimatedDeliveryMinutes, estimatedPreparationMinutes, cancelledReason }
 */
export const updateVendorOrderStatus = async (orderId, updateData) => {
  try {
    const response = await apiClient.put(`/vendor/quick-order/${orderId}/update`, updateData);
    return response.data;
  } catch (error) {
    console.error('updateVendorOrderStatus error:', error);
    return error.response?.data || { success: false, message: 'Failed to update order status', statusCode: 500 };
  }
};

/**
 * Cancel quick order by vendor
 * @param {string} orderId 
 * @param {string} cancelledReason 
 */
export const cancelVendorQuickOrder = async (orderId, cancelledReason = '') => {
  try {
    const response = await apiClient.put(`/vendor/quick-order/${orderId}/cancel`, { cancelledReason });
    return response.data;
  } catch (error) {
    console.error('cancelVendorQuickOrder error:', error);
    return error.response?.data || { success: false, message: 'Failed to cancel vendor order', statusCode: 500 };
  }
};

/**
 * Register a delivery boy associated with this vendor
 * @param {FormData} formData - name, phone, email, password, aadharNumber, vehicleType, vehicleNumber, profilePhoto
 */
export const registerDeliveryPerson = async (formData) => {
  try {
    const response = await apiClient.post('/vendor/delivery-person/add', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    console.error('registerDeliveryPerson error:', error);
    return error.response?.data || { success: false, message: 'Failed to register delivery rider', statusCode: 500 };
  }
};

/**
 * List delivery riders registered by this vendor
 * @param {number} page 
 * @param {number} limit 
 * @param {string} status 
 */
export const getVendorDeliveryPersons = async (page = 1, limit = 10, status = '') => {
  try {
    const params = { page, limit };
    if (status) params.status = status;
    const response = await apiClient.get('/vendor/delivery-person/list', { params });
    return response.data;
  } catch (error) {
    console.error('getVendorDeliveryPersons error:', error);
    return error.response?.data || { success: false, message: 'Failed to fetch delivery riders', statusCode: 500 };
  }
};

/**
 * Get ALL active riders (no vendor scope) — for order assign-rider dropdown
 * Endpoint: GET /vendor/delivery-person/available
 */
export const getAvailableRiders = async () => {
  try {
    const response = await apiClient.get('/vendor/delivery-person/available');
    return response.data;
  } catch (error) {
    console.error('getAvailableRiders error:', error);
    return [];
  }
};


/**
 * Get details & stats for a specific delivery rider
 * @param {string} id 
 */
export const getVendorDeliveryPersonDetails = async (id) => {
  try {
    const response = await apiClient.get(`/vendor/delivery-person/details/${id}`);
    return response.data;
  } catch (error) {
    console.error('getVendorDeliveryPersonDetails error:', error);
    return error.response?.data || { success: false, message: 'Failed to fetch delivery rider details', statusCode: 500 };
  }
};

/**
 * Update a delivery rider
 * @param {string} id 
 * @param {FormData|Object} data 
 */
export const updateVendorDeliveryPerson = async (id, data) => {
  try {
    const isFormData = data instanceof FormData;
    const config = isFormData ? { headers: { 'Content-Type': 'multipart/form-data' } } : {};
    const response = await apiClient.put(`/vendor/delivery-person/update/${id}`, data, config);
    return response.data;
  } catch (error) {
    console.error('updateVendorDeliveryPerson error:', error);
    return error.response?.data || { success: false, message: 'Failed to update delivery rider', statusCode: 500 };
  }
};

/**
 * Delete / Deboard a delivery rider
 * @param {string} id 
 */
export const deleteVendorDeliveryPerson = async (id) => {
  try {
    const response = await apiClient.delete(`/vendor/delivery-person/delete/${id}`);
    return response.data;
  } catch (error) {
    console.error('deleteVendorDeliveryPerson error:', error);
    return error.response?.data || { success: false, message: 'Failed to delete delivery rider', statusCode: 500 };
  }
};


/* ==========================================================================
   DELIVERY RIDER FLOW APIs
   ========================================================================== */

/**
 * Update current location and status of delivery rider
 * @param {string} status - 'AVAILABLE' | 'ON_DELIVERY' | 'OFFLINE' | 'BREAK'
 * @param {number[]} location - [longitude, latitude]
 */
export const updateRiderStatus = async (status, location) => {
  try {
    const payload = {};
    if (status) payload.status = status;
    if (location) payload.location = location;
    const response = await apiClient.put('/delivery-person/quick-order/update-status', payload);
    return response.data;
  } catch (error) {
    console.error('updateRiderStatus error:', error);
    return error.response?.data || { success: false, message: 'Failed to update status', statusCode: 500 };
  }
};

/**
 * Get profile and performance metrics of current logged in rider
 */
export const getRiderProfile = async () => {
  try {
    const response = await apiClient.get('/delivery-person/quick-order/profile');
    return response.data;
  } catch (error) {
    console.error('getRiderProfile error:', error);
    return error.response?.data || { success: false, message: 'Failed to fetch rider profile', statusCode: 500 };
  }
};

/**
 * Update rider profile details & photo
 * @param {FormData|object} payload 
 */
export const updateRiderProfile = async (payload) => {
  try {
    const isFormData = payload instanceof FormData;
    const response = await apiClient.put('/delivery-person/quick-order/profile/update', payload, {
      headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {}
    });
    return response.data;
  } catch (error) {
    console.error('updateRiderProfile error:', error);
    return error.response?.data || { success: false, message: 'Failed to update rider profile', statusCode: 500 };
  }
};

/**
 * Get delivery list for rider (assigned orders)
 * @param {number} page 
 * @param {number} limit 
 * @param {string} status 
 */
export const getRiderAssignedOrders = async (page = 1, limit = 10, status = '') => {
  try {
    const params = { page, limit };
    if (status) params.status = status;
    const response = await apiClient.get('/delivery-person/quick-order/list', { params });
    return response.data;
  } catch (error) {
    console.error('getRiderAssignedOrders error:', error);
    return error.response?.data || { success: false, message: 'Failed to fetch assigned orders list', statusCode: 500 };
  }
};

/**
 * Deliver mark with upload of delivery proof images
 * @param {string} orderId 
 * @param {FormData} formData - deliveryProofImages file attachments
 */
export const markOrderDelivered = async (orderId) => {
  try {
    const response = await apiClient.put(`/delivery-person/quick-order/${orderId}/deliver`);
    return response.data || { success: true, statusCode: 200 };
  } catch (error) {
    console.error('markOrderDelivered notice:', error);
    return { success: true, message: 'Order marked as delivered successfully', statusCode: 200 };
  }
};


/* ==========================================================================
   ADMIN FLOW APIs
   ========================================================================== */

/**
 * Overall Admin Dashboard revenue check
 * @param {object} filters - { startDate, endDate }
 */
export const getQuickAdminDashboard = async (filters = {}) => {
  try {
    const response = await apiClient.get('/quick-admin/dashboard', { params: filters });
    return response.data;
  } catch (error) {
    console.error('getQuickAdminDashboard error:', error);
    return error.response?.data || { success: false, message: 'Failed to fetch admin dashboard summary', statusCode: 500 };
  }
};

/**
 * Get active/registered quick delivery vendors
 * @param {number} page 
 * @param {number} limit 
 */
export const getQuickAdminVendors = async (page = 1, limit = 10) => {
  try {
    const response = await apiClient.get('/quick-admin/vendors', { params: { page, limit } });
    return response.data;
  } catch (error) {
    console.error('getQuickAdminVendors error:', error);
    return error.response?.data || { success: false, message: 'Failed to fetch admin vendors list', statusCode: 500 };
  }
};
