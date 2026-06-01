import apiClient from './apiClient';

export const getAllUsers = async (params = {}) => {
  try {
    const response = await apiClient.get('/admin/users', { params });
    return response.data;
  } catch (error) {
    console.error('Fetch users error:', error);
    return error.response?.data || {
      success: false,
      message: 'Failed to fetch users.',
      statusCode: 500
    };
  }
};

export const deleteUser = async (userId) => {
  try {
    const response = await apiClient.delete(`/admin/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Delete user error:', error);
    return error.response?.data || {
      success: false,
      message: 'Failed to delete user.',
      statusCode: 500
    };
  }
};

export const getUserById = async (userId) => {
  try {
    const response = await apiClient.get(`/admin/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Fetch user detail error:', error);
    return error.response?.data || {
      success: false,
      message: 'Failed to fetch user details.',
      statusCode: 500
    };
  }
};

export const toggleUserStatus = async (userId) => {
  try {
    const response = await apiClient.patch(`/admin/users/toggle-active/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Toggle user status error:', error);
    return error.response?.data || {
      success: false,
      message: 'Failed to toggle user status.',
      statusCode: 500
    };
  }
};

export const getAllVendors = async (params = {}) => {
  try {
    const response = await apiClient.get('/admin/vendors', { params });
    return response.data;
  } catch (error) {
    console.error('Fetch vendors error:', error);
    return error.response?.data || {
      success: false,
      message: 'Failed to fetch vendors.',
      statusCode: 500
    };
  }
};

/**
 * Get pending vendors for approval
 */
export const getPendingVendors = async (params = {}) => {
  try {
    const response = await apiClient.get('/admin/pending-vendors', { params });
    return response.data;
  } catch (error) {
    console.error('Fetch pending vendors error:', error);
    return error.response?.data || {
      success: false,
      message: 'Failed to fetch pending vendors.',
      statusCode: 500
    };
  }
};

export const getVendorById = async (vendorId) => {
  try {
    const response = await apiClient.get(`/admin/vendors/${vendorId}`);
    return response.data;
  } catch (error) {
    console.error('Fetch vendor detail error:', error);
    return error.response?.data || {
      success: false,
      message: 'Failed to fetch vendor details.',
      statusCode: 500
    };
  }
};

export const deleteVendor = async (vendorId) => {
  try {
    const response = await apiClient.delete(`/admin/vendors/${vendorId}`);
    return response.data;
  } catch (error) {
    console.error('Delete vendor error:', error);
    return error.response?.data || {
      success: false,
      message: 'Failed to delete vendor.',
      statusCode: 500
    };
  }
};

/**
 * Accept/Approve a vendor
 * @param {string} vendorId - ID of the vendor to approve
 */
export const acceptVendor = async (vendorId) => {
  try {
    const response = await apiClient.patch(`/admin/accept-vendor/${vendorId}`);
    return response.data;
  } catch (error) {
    console.error('Accept vendor error:', error);
    return error.response?.data || {
      success: false,
      message: 'Failed to approve vendor.',
      statusCode: 500
    };
  }
};

/**
 * Reject a vendor
 * @param {string} vendorId - ID of the vendor to reject
 */
export const rejectVendor = async (vendorId) => {
  try {
    const response = await apiClient.patch(`/admin/reject-vendor/${vendorId}`);
    return response.data;
  } catch (error) {
    console.error('Reject vendor error:', error);
    return error.response?.data || {
      success: false,
      message: 'Failed to reject vendor.',
      statusCode: 500
    };
  }
};

/**
 * Toggle vendor active status (Activate/Deactivate)
 * @param {string} vendorId - ID of the vendor to toggle
 */
export const toggleVendorStatus = async (vendorId) => {
  try {
    const response = await apiClient.patch(`/admin/vendors/toggle-active/${vendorId}`);
    return response.data;
  } catch (error) {
    console.error('Toggle vendor status error:', error);
    return error.response?.data || {
      success: false,
      message: 'Failed to toggle vendor status.',
      statusCode: 500
    };
  }
};

/**
 * Onboard a new influencer
 * @param {Object} influencerData - Data for the influencer
 */
export const onboardInfluencer = async (influencerData) => {
  try {
    const response = await apiClient.post('/influencers/onboard-influencer', influencerData);
    return response.data;
  } catch (error) {
    console.error('Onboard influencer error:', error);
    return error.response?.data || {
      success: false,
      message: 'Failed to onboard influencer.',
      statusCode: 500
    };
  }
};

/**
 * Get all influencers
 */
export const getAllInfluencers = async (params = {}) => {
  try {
    const response = await apiClient.get('/influencers/all-influencers', { params });
    return response.data;
  } catch (error) {
    console.error('Fetch influencers error:', error);
    return error.response?.data || {
      success: false,
      message: 'Failed to fetch influencers.',
      statusCode: 500
    };
  }
};

/**
 * Update an existing influencer
 * @param {string} id - Influencer ID
 * @param {Object} data - Updated influencer data
 */
export const updateInfluencer = async (id, data) => {
  try {
    const response = await apiClient.put(`/influencers/update-influencer/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('Update influencer error:', error);
    return error.response?.data || {
      success: false,
      message: 'Failed to update influencer.',
      statusCode: 500
    };
  }
};
/**
 * Delete an influencer profile
 * @param {string} id - Influencer ID
 */
export const deleteInfluencer = async (id) => {
  try {
    const response = await apiClient.delete(`/influencers/delete-influencer/${id}`);
    return response.data;
  } catch (error) {
    console.error('Delete influencer error:', error);
    return error.response?.data || {
      success: false,
      message: 'Failed to delete influencer.',
      statusCode: 500
    };
  }
};

/**
 * Fetch detailed influencer profile
 * @param {string} id - Influencer ID
 */
export const getInfluencerById = async (id) => {
  try {
    const response = await apiClient.get(`/influencers/influencer-details/${id}`);
    return response.data;
  } catch (error) {
    console.error('Fetch influencer details error:', error);
    return error.response?.data || {
      success: false,
      message: 'Failed to fetch influencer details.',
      statusCode: 500
    };
  }
};

/**
 * Create a new coupon
 * @param {Object} data - Coupon data
 */
export const createCoupon = async (data) => {
  try {
    const response = await apiClient.post('/coupons/create-coupon', data);
    return response.data;
  } catch (error) {
    console.error('Create coupon error:', error);
    return error.response?.data || {
      success: false,
      message: 'Failed to create coupon.',
      statusCode: 500
    };
  }
};

/**
 * Update an existing coupon
 * @param {string} id - Coupon ID
 * @param {Object} data - Updated coupon data
 */
export const updateCoupon = async (id, data) => {
  try {
    const response = await apiClient.put(`/coupons/update-coupon/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('Update coupon error:', error);
    return error.response?.data || {
      success: false,
      message: 'Failed to update coupon.',
      statusCode: 500
    };
  }
};

/**
 * Delete a coupon
 * @param {string} id - Coupon ID
 */
export const deleteCoupon = async (id) => {
  try {
    const response = await apiClient.delete(`/coupons/delete-coupon/${id}`);
    return response.data;
  } catch (error) {
    console.error('Delete coupon error:', error);
    return error.response?.data || {
      success: false,
      message: 'Failed to delete coupon.',
      statusCode: 500
    };
  }
};

/**
 * Fetch detailed coupon info
 * @param {string} id - Coupon ID
 */
export const getCouponById = async (id) => {
  try {
    const response = await apiClient.get(`/coupons/coupon-detail/${id}`);
    return response.data;
  } catch (error) {
    console.error('Fetch coupon details error:', error);
    return error.response?.data || {
      success: false,
      message: 'Failed to fetch coupon details.',
      statusCode: 500
    };
  }
};

/**
 * Fetch all coupons with pagination and search
 * @param {Object} params - Query params
 */
export const getAllCoupons = async (params) => {
  try {
    const response = await apiClient.get('/coupons/all', { params });
    return response.data;
  } catch (error) {
    console.error('Fetch coupons error:', error);
    return error.response?.data || {
      success: false,
      message: 'Failed to fetch coupons.',
      statusCode: 500
    };
  }
};

/**
 * Fetch all categories for administrative controls
 */
export const fetchCategories = async (params = {}) => {
  try {
    const response = await apiClient.get('/admin/fetch-categories', { params });
    return response.data;
  } catch (error) {
    console.error('Fetch categories error:', error);
    return error.response?.data || {
      success: false,
      message: 'Failed to fetch categories.',
      statusCode: 500
    };
  }
};

/**
 * Create a new category with form-data (supporting image upload)
 */
export const createCategory = async (formData) => {
  try {
    const response = await apiClient.post('/admin/create-category', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Create category error:', error);
    return error.response?.data || {
      success: false,
      message: 'Failed to create category.',
      statusCode: 500
    };
  }
};

/**
 * Update an existing category with form-data (supporting image upload)
 * Method: PUT
 * URL: /admin/update-category/:id
 */
export const updateCategory = async (id, formData) => {
  try {
    const response = await apiClient.put(`/admin/update-category/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Update category error:', error);
    return error.response?.data || {
      success: false,
      message: 'Failed to update category.',
      statusCode: 500
    };
  }
};

/**
 * Delete an existing category by ID
 * Method: DELETE
 * URL: /admin/delete-category/:id
 */
export const deleteCategory = async (id) => {
  try {
    const response = await apiClient.delete(`/admin/delete-category/${id}`);
    return response.data;
  } catch (error) {
    console.error('Delete category error:', error);
    return error.response?.data || {
      success: false,
      message: 'Failed to delete category.',
      statusCode: 500
    };
  }
};

/**
 * Fetch detailed category information by ID
 * Method: GET
 * URL: /admin/fetch-catoegry/:id
 */
export const fetchCategoryById = async (id) => {
  try {
    const response = await apiClient.get(`/admin/fetch-catoegry/${id}`);
    return response.data;
  } catch (error) {
    console.error('Fetch category details error:', error);
    return error.response?.data || {
      success: false,
      message: 'Failed to fetch category details.',
      statusCode: 500
    };
  }
};

/**
 * Fetch all orders with pagination and search
 * Method: GET
 * URL: /admin/orders
 */
export const getAllOrders = async (params = {}) => {
  try {
    const response = await apiClient.get('/admin/orders', { params });
    return response.data;
  } catch (error) {
    console.error('Fetch all orders error:', error);
    return error.response?.data || {
      success: false,
      message: 'Failed to fetch orders.',
      statusCode: 500
    };
  }
};

/**
 * Fetch detailed order information by ID
 * Method: GET
 * URL: /admin/orderDetails/:orderId
 */
export const getOrderById = async (orderId) => {
  try {
    const response = await apiClient.get(`/admin/orderDetails/${orderId}`);
    return response.data;
  } catch (error) {
    console.error('Fetch order details error:', error);
    return error.response?.data || {
      success: false,
      message: 'Failed to fetch order details.',
      statusCode: 500
    };
  }
};

/**
 * Delete an order by ID
 * Method: DELETE
 * URL: /admin/order-delete/:orderId
 */
export const deleteOrder = async (orderId) => {
  try {
    const response = await apiClient.delete(`/admin/order-delete/${orderId}`);
    return response.data;
  } catch (error) {
    console.error('Delete order error:', error);
    return error.response?.data || {
      success: false,
      message: 'Failed to delete order.',
      statusCode: 500
    };
  }
};

/**
 * Fetch all products with pagination and search
 * Method: GET
 * URL: /admin/products
 */
export const getAllProducts = async (params = {}) => {
  try {
    const response = await apiClient.get('/admin/products', { params });
    return response.data;
  } catch (error) {
    console.error('Fetch all products error:', error);
    return error.response?.data || {
      success: false,
      message: 'Failed to fetch products.',
      statusCode: 500
    };
  }
};

/**
 * Delete a product by Vendor ID and Product ID
 * Method: DELETE
 * URL: /admin/delete-product/:vendorId/:productId
 */
export const deleteProduct = async (vendorId, productId) => {
  try {
    const response = await apiClient.delete(`/admin/delete-product/${vendorId}/${productId}`);
    return response.data;
  } catch (error) {
    console.error('Delete product error:', error);
    return error.response?.data || {
      success: false,
      message: 'Failed to delete product.',
      statusCode: 500
    };
  }
};

/**
 * Delete all products
 * Method: DELETE
 * URL: /admin/delete-all-products
 */
export const deleteAllProducts = async () => {
  try {
    const response = await apiClient.delete('/admin/delete-all-products');
    return response.data;
  } catch (error) {
    console.error('Delete all products error:', error);
    return error.response?.data || {
      success: false,
      message: 'Failed to delete all products.',
      statusCode: 500
    };
  }
};

/**
 * Fetch Administrative Overview Statistics
 * Method: GET
 * URL: /admin-dashboard/overview
 */
export const getDashboardOverview = async () => {
  try {
    const response = await apiClient.get('/admin-dashboard/overview');
    return response.data;
  } catch (error) {
    console.error('Fetch dashboard overview error:', error);
    return error.response?.data || {
      success: false,
      message: 'Failed to fetch dashboard overview.',
      statusCode: 500
    };
  }
};

/**
 * Fetch Administrative Revenue Trend
 * Method: GET
 * URL: /admin-dashboard/revenue-trend
 * @param {number} days - Number of days to fetch trend for (default 10)
 */
export const getRevenueTrend = async (days = 10) => {
  try {
    const response = await apiClient.get(`/admin-dashboard/revenue-trend?days=${days}`);
    return response.data;
  } catch (error) {
    console.error('Fetch revenue trend error:', error);
    return error.response?.data || {
      success: false,
      message: 'Failed to fetch revenue trend.',
      statusCode: 500
    };
  }
};

/**
 * Fetch Top Performing Categories
 * Method: GET
 * URL: /admin-dashboard/top-categories
 */
export const getTopCategories = async () => {
  try {
    const response = await apiClient.get('/admin-dashboard/top-categories');
    return response.data;
  } catch (error) {
    console.error('Fetch top categories error:', error);
    return error.response?.data || {
      success: false,
      message: 'Failed to fetch top categories.',
      statusCode: 500
    };
  }
};

/**
 * Fetch Order Status Analytics
 * Method: GET
 * URL: /admin-dashboard/order-status-analytics
 */
export const getOrderStatusAnalytics = async () => {
  try {
    const response = await apiClient.get('/admin-dashboard/order-status-analytics');
    return response.data;
  } catch (error) {
    console.error('Fetch order status analytics error:', error);
    return error.response?.data || {
      success: false,
      message: 'Failed to fetch order status analytics.',
      statusCode: 500
    };
  }
};

/**
 * Fetch Category Product Distribution
 * Method: GET
 * URL: /admin-dashboard/category-distribution
 */
export const getCategoryDistribution = async () => {
  try {
    const response = await apiClient.get('/admin-dashboard/category-distribution');
    return response.data;
  } catch (error) {
    console.error('Fetch category distribution error:', error);
    return error.response?.data || {
      success: false,
      message: 'Failed to fetch category distribution.',
      statusCode: 500
    };
  }
};

/**
 * Fetch Order Status Graph Data
 * Method: GET
 * URL: /admin-dashboard/order-status-graph
 */
export const getOrderStatusGraph = async () => {
  try {
    const response = await apiClient.get('/admin-dashboard/order-status-graph');
    return response.data;
  } catch (error) {
    console.error('Fetch order status graph error:', error);
    return error.response?.data || {
      success: false,
      message: 'Failed to fetch order status graph data.',
      statusCode: 500
    };
  }
};

/**
 * Fetch Monthly Analytics
 * Method: GET
 * URL: /admin-dashboard/monthly-analytics?year=:year
 */
export const getMonthlyAnalytics = async (year = 2026) => {
  try {
    const response = await apiClient.get(`/admin-dashboard/monthly-analytics?year=${year}`);
    return response.data;
  } catch (error) {
    console.error('Fetch monthly analytics error:', error);
    return error.response?.data || {
      success: false,
      message: 'Failed to fetch monthly analytics.',
      statusCode: 500
    };
  }
};

/**
 * Fetch Yearly Analytics
 * Method: GET
 * URL: /admin-dashboard/yearly-analytics
 */
export const getYearlyAnalytics = async () => {
  try {
    const response = await apiClient.get('/admin-dashboard/yearly-analytics');
    return response.data;
  } catch (error) {
    console.error('Fetch yearly analytics error:', error);
    return error.response?.data || {
      success: false,
      message: 'Failed to fetch yearly analytics.',
      statusCode: 500
    };
  }
};

/**
 * Fetch Comprehensive Analytics Graph Data
 * Method: GET
 * URL: /admin-dashboard/analytics-graph
 */
export const getAnalyticsGraph = async () => {
  try {
    const response = await apiClient.get('/admin-dashboard/analytics-graph');
    return response.data;
  } catch (error) {
    console.error('Fetch analytics graph error:', error);
    return error.response?.data || {
      success: false,
      message: 'Failed to fetch analytics graph data.',
      statusCode: 500
    };
  }
};

/**
 * Fetch Top Performing Vendors Graph Data
 * Method: GET
 * URL: /admin-dashboard/top-vendors-graph
 */
export const getTopVendorsGraph = async () => {
  try {
    const response = await apiClient.get('/admin-dashboard/top-vendors-graph');
    return response.data;
  } catch (error) {
    console.error('Fetch top vendors graph error:', error);
    return error.response?.data || {
      success: false,
      message: 'Failed to fetch top vendors graph data.',
      statusCode: 500
    };
  }
};


/**
 * Send invitation link to a potential influencer
 * Method: POST
 * URL: /admin/send-influencer-invitation-link
 * @param {{ email: string, name: string }} data
 */
export const sendInfluencerInvitationLink = async (data) => {
  try {
    const response = await apiClient.post('/admin/send-influencer-invitation-link', data);
    return response.data;
  } catch (error) {
    console.error('Send influencer invitation error:', error);
    return error.response?.data || {
      success: false,
      message: 'Failed to send invitation link.',
      statusCode: 500
    };
  }
};

/**
 * Fetch all influencer commission slabs
 * Method: GET
 * URL: /admin/all-influencer-commission-slabs
 */
export const getAllInfluencerCommissionSlabs = async () => {
  try {
    const response = await apiClient.get('/admin/all-influencer-commission-slabs');
    return response.data;
  } catch (error) {
    console.error('Fetch commission slabs error:', error);
    return error.response?.data || {
      success: false,
      message: 'Failed to fetch commission slabs.',
      statusCode: 500
    };
  }
};

/**
 * Create a new influencer commission slab
 * Method: POST
 * URL: /admin/create-influencer-commission-slab
 * @param {{ minSales: number, maxSales: number, commissionRate: number }} data
 */
export const createInfluencerCommissionSlab = async (data) => {
  try {
    const response = await apiClient.post('/admin/create-influencer-commission-slab', data);
    return response.data;
  } catch (error) {
    console.error('Create commission slab error:', error);
    return error.response?.data || {
      success: false,
      message: 'Failed to create commission slab.',
      statusCode: 500
    };
  }
};

/**
 * Update an influencer commission slab
 * Method: PUT
 * URL: /admin/update-commission-slab/:id
 * @param {string} id - Slab ID
 * @param {{ minSales: number, maxSales: number, commissionRate: number, isActive: boolean }} data
 */
export const updateInfluencerCommissionSlab = async (id, data) => {
  try {
    const response = await apiClient.put(`/admin/update-commission-slab/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('Update commission slab error:', error);
    return error.response?.data || {
      success: false,
      message: 'Failed to update commission slab.',
      statusCode: 500
    };
  }
};

/**
 * Fetch detailed influencer commission slab by ID
 * Method: GET
 * URL: /admin/slab-details/:id
 * @param {string} id - Slab ID
 */
export const getCommissionSlabById = async (id) => {
  try {
    const response = await apiClient.get(`/admin/slab-details/${id}`);
    return response.data;
  } catch (error) {
    console.error('Fetch commission slab details error:', error);
    return error.response?.data || {
      success: false,
      message: 'Failed to fetch commission slab details.',
      statusCode: 500
    };
  }
};

/**
 * Delete an influencer commission slab by ID
 * Method: DELETE
 * URL: /admin/delete-slab/:id
 * @param {string} id - Slab ID
 */
export const deleteInfluencerCommissionSlab = async (id) => {
  try {
    const response = await apiClient.delete(`/admin/delete-slab/${id}`);
    return response.data;
  } catch (error) {
    console.error('Delete commission slab error:', error);
    return error.response?.data || {
      success: false,
      message: 'Failed to delete commission slab.',
      statusCode: 500
    };
  }
};

/**
 * Fetch influencer commissions with filters
 * Method: GET
 * URL: /admin/influencer-commissions
 * @param {{ page: number, limit: number, status: string, month: number, year: number }} params
 */
export const getInfluencerCommissions = async (params = {}) => {
  try {
    const response = await apiClient.get('/admin/influencer-commissions', { params });
    return response.data;
  } catch (error) {
    console.error('Fetch influencer commissions error:', error);
    return error.response?.data || {
      success: false,
      message: 'Failed to fetch influencer commissions.',
      statusCode: 500
    };
  }
};

/**
 * Fetch detailed influencer commissions by influencer ID
 * Method: GET
 * URL: /admin/influencer-commissions/:influencerId
 * @param {string} influencerId - Influencer ID
 * @param {{ month: number, year: number }} params - Month and year filters
 */
export const getInfluencerCommissionDetails = async (influencerId, params = {}) => {
  try {
    const response = await apiClient.get(`/admin/influencer-commissions/${influencerId}`, { params });
    return response.data;
  } catch (error) {
    console.error('Fetch influencer commission details error:', error);
    return error.response?.data || {
      success: false,
      message: 'Failed to fetch influencer commission details.',
      statusCode: 500
    };
  }
};

/**
 * Fetch vendor payouts dashboard with filters
 * Method: GET
 * URL: /admin/vendor-payouts
 * @param {{ page: number, limit: number, status: string, month: number, year: number }} params
 */
export const getVendorPayouts = async (params = {}) => {
  try {
    const response = await apiClient.get('/admin/vendor-payouts', { params });
    return response.data;
  } catch (error) {
    console.error('Fetch vendor payouts error:', error);
    return error.response?.data || {
      success: false,
      message: 'Failed to fetch vendor payouts.',
      statusCode: 500
    };
  }
};

/**
 * Fetch detailed vendor payouts by vendor ID
 * Method: GET
 * URL: /admin/vendor-payouts/:vendorId
 * @param {string} vendorId - Vendor ID
 * @param {{ month: number, year: number, status: string, page: number, limit: number }} params - Query filters
 */
export const getVendorPayoutDetails = async (vendorId, params = {}) => {
  try {
    const response = await apiClient.get(`/admin/vendor-payouts/${vendorId}`, { params });
    return response.data;
  } catch (error) {
    console.error('Fetch vendor payout details error:', error);
    return error.response?.data || {
      success: false,
      message: 'Failed to fetch vendor payout details.',
      statusCode: 500
    };
  }
};

/**
 * Settle vendor payouts (completed payout transactions)
 * Method: POST
 * URL: /payout/vendor-payout/settle
 * @param {{ vendorId: string, remarks: string, transactionId: string, month: number, year: number, vendorOrderIds: string[] }} data
 */
export const settleVendorPayout = async (data) => {
  try {
    const response = await apiClient.post('/payout/vendor-payout/settle', data);
    return response.data;
  } catch (error) {
    console.error('Settle vendor payout error:', error);
    return error.response?.data || {
      success: false,
      message: 'Failed to settle vendor payout.',
      statusCode: 500
    };
  }
};




