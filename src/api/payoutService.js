import apiClient from './apiClient';

/**
 * Add a new payout bank account
 * Method: POST
 * URL: /payout/bank-account/add
 * @param {object} accountData - { accountHolderName, bankName, ifscCode, accountNumber, accountType, isPrimary }
 */
export const addBankAccount = async (accountData) => {
  try {
    const response = await apiClient.post('/payout/bank-account/add', accountData);
    return response.data;
  } catch (error) {
    console.error('Add bank account error:', error.response || error);
    return error.response?.data || {
      success: false,
      message: error.response?.data?.message || error.message || 'Failed to add bank account.',
      statusCode: error.response?.status || 500
    };
  }
};

/**
 * Fetch list of payout bank accounts
 * Method: GET
 * URL: /payout/bank-account/list (or try fallback /payout/bank-accounts)
 */
export const getBankAccounts = async () => {
  try {
    // Try primary endpoint /payout/bank-account/my-accounts or list
    const response = await apiClient.get('/payout/bank-account/my-accounts').catch(async () => {
      return await apiClient.get('/payout/bank-account/list');
    });
    return response.data;
  } catch (error) {
    console.error('Fetch bank accounts error:', error.response || error);
    return error.response?.data || {
      success: false,
      message: error.response?.data?.message || error.message || 'Failed to fetch bank accounts.',
      statusCode: error.response?.status || 500
    };
  }
};

/**
 * Update an existing payout bank account
 * Method: PUT
 * URL: /payout/bank-account/update/:id
 * @param {string} id - Bank account DB ID
 * @param {object} accountData - { accountHolderName, bankName, ifscCode, accountNumber, accountType, isPrimary }
 */
export const updateBankAccount = async (id, accountData) => {
  try {
    const response = await apiClient.put(`/payout/bank-account/update/${id}`, accountData);
    return response.data;
  } catch (error) {
    console.error('Update bank account error:', error.response || error);
    return error.response?.data || {
      success: false,
      message: error.response?.data?.message || error.message || 'Failed to update bank account.',
      statusCode: error.response?.status || 500
    };
  }
};

/**
 * Delete a payout bank account
 * Method: DELETE
 * URL: /payout/bank-account/delete/:id
 * @param {string} id - Bank account DB ID
 */
export const deleteBankAccount = async (id) => {
  try {
    const response = await apiClient.delete(`/payout/bank-account/delete/${id}`);
    return response.data;
  } catch (error) {
    console.error('Delete bank account error:', error.response || error);
    return error.response?.data || {
      success: false,
      message: error.response?.data?.message || error.message || 'Failed to delete bank account.',
      statusCode: error.response?.status || 500
    };
  }
};

/**
 * Fetch all bank accounts for Admin
 * Method: GET
 * URL: /payout/bank-account/admin/all
 */
export const getAdminAllBankAccounts = async () => {
  try {
    const response = await apiClient.get('/payout/bank-account/admin/all');
    return response.data;
  } catch (error) {
    console.error('Fetch all admin bank accounts error:', error.response || error);
    return error.response?.data || {
      success: false,
      message: error.response?.data?.message || error.message || 'Failed to fetch admin bank accounts.',
      statusCode: error.response?.status || 500
    };
  }
};

/**
 * Fetch specific bank account details for Admin
 * Method: GET
 * URL: /payout/bank-account/details/:id
 * @param {string} id - Bank account DB ID
 */
export const getBankAccountDetails = async (id) => {
  try {
    const response = await apiClient.get(`/payout/bank-account/details/${id}`);
    return response.data;
  } catch (error) {
    console.error('Fetch bank account details error:', error.response || error);
    return error.response?.data || {
      success: false,
      message: error.response?.data?.message || error.message || 'Failed to fetch bank account details.',
      statusCode: error.response?.status || 500
    };
  }
};

/**
 * Update verification status of a bank account (Admin / Superadmin only)
 * Method: PUT
 * URL: /payout/bank-account/update-status/:id
 * @param {string} id - Bank account DB ID
 * @param {object} payload - { status, verificationReference, rejectionReason }
 */
export const updateBankAccountStatus = async (id, payload) => {
  try {
    const response = await apiClient.put(`/payout/bank-account/update-status/${id}`, payload);
    return response.data;
  } catch (error) {
    console.error('Update bank account status error:', error.response || error);
    return error.response?.data || {
      success: false,
      message: error.response?.data?.message || error.message || 'Failed to update bank account status.',
      statusCode: error.response?.status || 500
    };
  }
};
