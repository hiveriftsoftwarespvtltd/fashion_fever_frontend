import apiClient from './apiClient';

/**
 * Fetch my notifications list
 * Method: GET
 * URL: /notifications/my-notifications
 * @param {number} page - Page number
 * @param {number} limit - Limit per page
 */
export const getMyNotifications = async (page = 1, limit = 10) => {
  try {
    const response = await apiClient.get('/notifications/my-notifications', {
      params: { page, limit }
    });
    return response.data;
  } catch (error) {
    console.error('Fetch my notifications error:', error);
    return error.response?.data || {
      success: false,
      message: 'Failed to fetch notifications.',
      statusCode: 500
    };
  }
};

/**
 * Mark a notification as read
 * Method: PATCH
 * URL: /notifications/mark-read/:id
 */
export const markNotificationRead = async (id) => {
  try {
    const response = await apiClient.patch(`/notifications/update-read-status/${id}`);
    return response.data;
  } catch (error) {
    console.error('Mark notification read error:', error);
    return error.response?.data || {
      success: false,
      message: 'Failed to mark notification as read.',
      statusCode: 500
    };
  }
};
