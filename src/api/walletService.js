import apiClient from './apiClient';

/**
 * Fetch the current user's wallet balance, credits, and debits.
 * Method: GET
 * Route: /wallet/user/balance
 */
export const getWalletBalance = async () => {
  try {
    const response = await apiClient.get('/wallet/user/balance');
    return response.data;
  } catch (error) {
    console.error('Fetch wallet balance error:', error);
    return error.response?.data || { success: false, message: 'Failed to fetch wallet balance', statusCode: 500 };
  }
};

/**
 * Fetch the current user's wallet transaction history.
 * Method: GET
 * Route: /wallet/user/transactions
 */
export const getWalletTransactions = async () => {
  try {
    const response = await apiClient.get('/wallet/user/transactions');
    return response.data;
  } catch (error) {
    console.error('Fetch wallet transactions error:', error);
    return error.response?.data || { success: false, message: 'Failed to fetch wallet transactions', statusCode: 500 };
  }
};

/**
 * Add balance/money to the user's wallet.
 * Method: POST
 * Route: /wallet/user/add-balance
 * @param {object} payload - Contains amount, reason, description
 */
export const addWalletBalance = async (payload) => {
  try {
    const response = await apiClient.post('/wallet/user/add-balance', payload);
    return response.data;
  } catch (error) {
    console.error('Add wallet balance error:', error);
    return error.response?.data || { success: false, message: 'Failed to add wallet balance', statusCode: 500 };
  }
};

/**
 * Fetch the vendor's wallet balance details (usable, pending, total earnings).
 * Method: GET
 * Route: /wallet/vendor/balance
 */
export const getVendorWalletBalance = async () => {
  try {
    const response = await apiClient.get('/wallet/vendor/balance');
    return response.data;
  } catch (error) {
    console.error('Fetch vendor wallet balance error:', error);
    return error.response?.data || { success: false, message: 'Failed to fetch vendor wallet balance', statusCode: 500 };
  }
};

/**
 * Fetch the vendor's wallet transaction history ledger.
 * Method: GET
 * Route: /wallet/vendor/transactions
 */
export const getVendorWalletTransactions = async () => {
  try {
    const response = await apiClient.get('/wallet/vendor/transactions');
    return response.data;
  } catch (error) {
    console.error('Fetch vendor wallet transactions error:', error);
    return error.response?.data || { success: false, message: 'Failed to fetch vendor wallet transactions', statusCode: 500 };
  }
};



