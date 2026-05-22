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
