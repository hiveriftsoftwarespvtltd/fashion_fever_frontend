import apiClient from './apiClient';

export const registerUser = async (userData) => {
  try {
    const response = await apiClient.post('/auth/register', userData);
    return response.data;
  } catch (error) {
    console.error('Registration error:', error);
    return error.response?.data || { success: false, message: 'Server error', statusCode: 500 };
  }
};

export const verifyEmail = async (verificationData) => {
  try {
    const response = await apiClient.post('/auth/verify-email', verificationData);
    return response.data;
  } catch (error) {
    console.error('Verification error:', error);
    return error.response?.data || { success: false, message: 'Verification failed', statusCode: 500 };
  }
};

export const loginUser = async (loginData) => {
  try {
    const response = await apiClient.post('/auth/login', loginData);
    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    return error.response?.data || { success: false, message: 'Login failed', statusCode: 500 };
  }
};

export const verifyLoginOtp = async (verificationData) => {
  try {
    const response = await apiClient.post('/auth/verify-login-otp', verificationData);
    return response.data;
  } catch (error) {
    console.error('Login verification error:', error);
    return error.response?.data || { success: false, message: 'Invalid OTP', statusCode: 500 };
  }
};

export const getUserDetails = async () => {
  try {
    const response = await apiClient.get('/user/user-details');
    return response.data;
  } catch (error) {
    console.error('Get user details error:', error);
    return error.response?.data || { success: false, message: 'Failed to fetch details', statusCode: 500 };
  }
};

export const resetPassword = async (passwordData) => {
  try {
    const response = await apiClient.post('/auth/reset-password', passwordData);
    return response.data;
  } catch (error) {
    console.error('Reset password error:', error);
    return error.response?.data || { success: false, message: 'Password reset failed', statusCode: 500 };
  }
};

export const sendForgotPasswordOtp = async (emailData) => {
  try {
    const response = await apiClient.post('/auth/send-forgot-password-otp', emailData);
    return response.data;
  } catch (error) {
    console.error('Send forgot password OTP error:', error);
    return error.response?.data || { success: false, message: 'Failed to send OTP', statusCode: 500 };
  }
};

export const verifyForgotPasswordOtp = async (verificationData) => {
  try {
    const response = await apiClient.post('/auth/verify-forgot-password-otp', verificationData);
    return response.data;
  } catch (error) {
    console.error('Verify forgot password OTP error:', error);
    return error.response?.data || { success: false, message: 'Verification failed', statusCode: 500 };
  }
};

export const sendVerifyEmailOtp = async (emailData) => {
  try {
    const response = await apiClient.post('/auth/send-verify-email-otp', emailData);
    return response.data;
  } catch (error) {
    console.error('Send verification OTP error:', error);
    return error.response?.data || { success: false, message: 'Failed to send verification OTP', statusCode: 500 };
  }
};

/**
 * Edit User Details (name, phone, etc.)
 * @param {{ name?: string, phone?: string }} data
 */
export const editUserDetails = async (data) => {
  try {
    const response = await apiClient.patch('/user/edit-user-details', data);
    return response.data;
  } catch (error) {
    console.error('Edit user details error:', error);
    return error.response?.data || { success: false, message: 'Failed to update details', statusCode: 500 };
  }
};

/**
 * Upload User Avatar
 * @param {FormData} formData
 */
export const uploadUserAvatar = async (formData) => {
  try {
    const response = await apiClient.post('/user/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Upload avatar error:', error);
    return error.response?.data || { success: false, message: 'Failed to upload avatar', statusCode: 500 };
  }
};

/**
 * Fetch User Avatar details
 */
export const getUserAvatar = async () => {
  try {
    const response = await apiClient.get('/user/get-user-avatar');
    return response.data;
  } catch (error) {
    console.error('Get user avatar error:', error);
    return error.response?.data || { success: false, message: 'Failed to fetch avatar', statusCode: 500 };
  }
};

/**
 * Delete User Avatar
 */
export const deleteUserAvatar = async () => {
  try {
    const response = await apiClient.delete('/user/delete-avatar');
    return response.data;
  } catch (error) {
    console.error('Delete avatar error:', error);
    return error.response?.data || { success: false, message: 'Failed to delete avatar', statusCode: 500 };
  }
};

/* ══════════════════════════════════════════════════════════
   ADDRESS APIs
══════════════════════════════════════════════════════════ */

/** Add a new address */
export const addAddress = async (data) => {
  try {
    const response = await apiClient.post('/user/add-address', data);
    return response.data;
  } catch (error) {
    console.error('Add address error:', error);
    return error.response?.data || { success: false, message: 'Failed to add address', statusCode: 500 };
  }
};

/** Get all addresses */
export const getAddresses = async () => {
  try {
    const response = await apiClient.get('/user/fetch-addresses');
    return response.data;
  } catch (error) {
    console.error('Get addresses error:', error);
    return error.response?.data || { success: false, message: 'Failed to fetch addresses', statusCode: 500 };
  }
};

/** Get single address details by ID */
export const getAddressDetails = async (id) => {
  try {
    const response = await apiClient.get(`/user/fetch-address-details/${id}`);
    return response.data;
  } catch (error) {
    console.error('Get address details error:', error);
    return error.response?.data || { success: false, message: 'Failed to fetch address details', statusCode: 500 };
  }
};

/** Update an existing address */
export const editAddress = async (id, data) => {
  try {
    const response = await apiClient.put(`/user/update-address/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('Update address error:', error);
    return error.response?.data || { success: false, message: 'Failed to update address', statusCode: 500 };
  }
};

/** Delete an address */
export const deleteAddress = async (id) => {
  try {
    const response = await apiClient.delete(`/user/delete-address/${id}`);
    return response.data;
  } catch (error) {
    console.error('Delete address error:', error);
    return error.response?.data || { success: false, message: 'Failed to delete address', statusCode: 500 };
  }
};

/** Fetch user orders history */
export const getUserOrders = async () => {
  try {
    const response = await apiClient.get('/orders/user-orders');
    return response.data;
  } catch (error) {
    console.error('Fetch user orders error:', error);
    return error.response?.data || { success: false, message: 'Failed to fetch orders history', statusCode: 500 };
  }
};

/** Get requested roles status */
export const getRequestedRoles = async () => {
  try {
    const response = await apiClient.get('/user/requested-roles');
    return response.data;
  } catch (error) {
    console.error('Get requested roles error:', error);
    return error.response?.data || { success: false, message: 'Failed to fetch requested roles', statusCode: 500 };
  }
};

/** Apply for roles */
export const applyForRoles = async (payload) => {
  try {
    const response = await apiClient.post('/user/apply-for-roles', payload);
    return response.data;
  } catch (error) {
    console.error('Apply for roles error:', error);
    return error.response?.data || { success: false, message: 'Failed to apply for roles', statusCode: 500 };
  }
};

/** Raise a support ticket */
export const raiseTicket = async (formData) => {
  try {
    const response = await apiClient.post('/ticket/raise-a-ticket', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Raise ticket error:', error);
    return error.response?.data || { success: false, message: 'Failed to submit support ticket', statusCode: 500 };
  }
};

/** Get logged-in user tickets */
export const getUserTickets = async () => {
  try {
    const response = await apiClient.get('/ticket/my-tickets');
    return response.data;
  } catch (error) {
    console.error('Get user tickets error:', error);
    return error.response?.data || { success: false, message: 'Failed to fetch tickets history', statusCode: 500 };
  }
};

/** Update support ticket status */
export const updateTicketStatus = async (ticketId, payload) => {
  try {
    const response = await apiClient.put(`/ticket/update-status/${ticketId}`, payload);
    return response.data;
  } catch (error) {
    console.error('Update ticket status error:', error);
    return error.response?.data || { success: false, message: 'Failed to update ticket status', statusCode: 500 };
  }
};

/** Edit support ticket details with full modification */
export const editTicket = async (ticketId, formData) => {
  try {
    const response = await apiClient.put(`/ticket/update/${ticketId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Edit ticket error:', error);
    return error.response?.data || { success: false, message: 'Failed to update support ticket', statusCode: 500 };
  }
};

/** Delete support ticket using DELETE method */
export const deleteTicket = async (ticketId) => {
  try {
    const response = await apiClient.delete(`/ticket/delete/${ticketId}`);
    return response.data;
  } catch (error) {
    console.error('Delete ticket error:', error);
    return error.response?.data || { success: false, message: 'Failed to delete support ticket', statusCode: 500 };
  }
};


