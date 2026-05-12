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
