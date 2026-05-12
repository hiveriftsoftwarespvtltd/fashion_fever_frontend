import axios from 'axios';
import config from '../config/config';

const apiClient = axios.create({
  baseURL: config.API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to automatically add token to every request
apiClient.interceptors.request.use(
  (config) => {
    try {
      const sessionStr = localStorage.getItem('user_session');
      if (sessionStr) {
        const session = JSON.parse(sessionStr);
        const token = session?.token || session?.access_token;
        
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
    } catch (err) {
      console.error("Error parsing session in interceptor:", err);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Global Error Handler
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized
    }
    return Promise.reject(error);
  }
);

export default apiClient;
