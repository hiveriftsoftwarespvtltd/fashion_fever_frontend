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
