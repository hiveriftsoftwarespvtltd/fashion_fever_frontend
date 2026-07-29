import axios from 'axios';
import config from '../config/config';

const apiClient = axios.create({
  baseURL: config.API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true
});

let isRedirectingToAuth = false;

// Interceptor to automatically add token to every request
apiClient.interceptors.request.use(
  (reqConfig) => {
    try {
      if (reqConfig?.skipAuth) {
        return reqConfig;
      }
      if (reqConfig?.headers && 'skipAuth' in reqConfig.headers) {
        try {
          delete reqConfig.headers['skipAuth'];
        } catch (_) {}
        return reqConfig;
      }
      const sessionStr = typeof localStorage !== 'undefined' ? localStorage.getItem('user_session') : null;
      if (sessionStr) {
        const session = JSON.parse(sessionStr);
        const token = session?.token || session?.access_token || session?.jwtToken;

        if (token && reqConfig.headers) {
          if (typeof reqConfig.headers.set === 'function') {
            reqConfig.headers.set('Authorization', `Bearer ${token}`);
          } else {
            reqConfig.headers['Authorization'] = `Bearer ${token}`;
          }
        }
      }
    } catch (err) {
      console.error("Error parsing session in interceptor:", err);
    }
    return reqConfig;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Global Response Interceptor & Session Expiry Management
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    try {
      const status = error?.response?.status;
      const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';

      // Handle 401 Unauthorized (Expired or invalid token)
      if (status === 401) {
        // Clean expired local session
        try {
          localStorage.removeItem('user_session');
          localStorage.removeItem('token');
        } catch (_) {}

        // Broadcast session expired event to UserContext
        if (typeof window !== 'undefined' && typeof window.dispatchEvent === 'function') {
          window.dispatchEvent(new CustomEvent('auth:session_expired', {
            detail: { message: 'Session expired' }
          }));
        }

        // List of routes that strictly require authentication
        const isProtectedRoute = (path) => {
          const protectedPrefixes = [
            '/profile',
            '/checkout',
            '/admin',
            '/vendor',
            '/rider',
            '/service-provider',
            '/distributor',
            '/educator',
            '/my-orders',
            '/wishlist'
          ];
          return protectedPrefixes.some(prefix => path.startsWith(prefix));
        };

        // ONLY redirect to auth page if user is currently on a protected route
        if (isProtectedRoute(currentPath) && currentPath !== '/auth' && currentPath !== '/login' && !isRedirectingToAuth) {
          isRedirectingToAuth = true;

          try {
            sessionStorage.setItem('redirect_after_login', currentPath);
          } catch (e) {
            console.warn('Could not save redirect path:', e);
          }

          setTimeout(() => {
            if (typeof window !== 'undefined') {
              window.location.href = `/auth?expired=true&redirect=${encodeURIComponent(currentPath)}`;
            }
          }, 300);
        }
      }
    } catch (err) {
      console.error("Error in response interceptor:", err);
    }

    return Promise.reject(error);
  }
);

export default apiClient;
