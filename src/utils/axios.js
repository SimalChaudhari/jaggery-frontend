import axios from 'axios';

import { CONFIG } from 'src/config-global';
import { paths } from 'src/routes/paths';
import { STORAGE_KEY } from 'src/auth/context/jwt/constant';
import { deleteCookie } from 'src/utils/cookie';

// ----------------------------------------------------------------------

const axiosInstance = axios.create({ baseURL: CONFIG.site.serverUrl });

// Request interceptor to add JWT token to all requests
axiosInstance.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem(STORAGE_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Helper function to clear session (avoiding circular dependency)
const clearSession = () => {
  try {
    // Clear session storage
    sessionStorage.removeItem(STORAGE_KEY);
    sessionStorage.removeItem('user');

    // Clear axios default headers
    delete axios.defaults.headers.common.Authorization;

    // Clear cookie
    deleteCookie('access-token');
  } catch (error) {
    console.error('Error clearing session:', error);
  }
};

// Response interceptor for error handling
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Handle 401 Unauthorized errors
    if (error.response && error.response.status === 401) {
      // Clear session and redirect to login
      clearSession();

      // Redirect to login page
      window.location.href = paths.auth.simple.signIn;

      // Return a rejected promise to stop the request chain
      return Promise.reject(new Error('Session expired. Please login again.'));
    }

    // For other errors, return the error response data or a generic message
    return Promise.reject((error.response && error.response.data) || 'Something went wrong!');
  }
);

export default axiosInstance;

// ----------------------------------------------------------------------

export const fetcher = async (args) => {
  try {
    const [url, config] = Array.isArray(args) ? args : [args];

    const res = await axiosInstance.get(url, { ...config });

    return res.data;
  } catch (error) {
    console.error('Failed to fetch:', error);
    throw error;
  }
};

// ----------------------------------------------------------------------

export const endpoints = {
  auth: {
    me: '/api/auth/me',
    signIn: '/api/auth/sign-in',
    signUp: '/api/auth/sign-up',
    google: {
      redirect: '/api/auth/google/redirect'
    }
  },
};
