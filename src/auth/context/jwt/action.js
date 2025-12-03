import { deleteCookie } from 'src/utils/cookie';
import axios from 'src/utils/axios';

import { setSession } from './utils';

/** **************************************
 * Sign in with backend API (email only)
 *************************************** */
export const signInWithPassword = async ({ email, password }) => {
  try {
    // Backend expects 'contact' field which can be email or mobile
    const params = { contact: email, password };
    const res = await axios.post('/auth/login', params);
    const { access_token, user } = res.data;

    if (!access_token) {
      throw new Error('Please check your email/username and password');
    }

    // Store user data in sessionStorage
    if (user) {
      sessionStorage.setItem('user', JSON.stringify(user));
    }

    setSession(access_token);
    return { access_token, user };
  } catch (error) {
    const errorMessage =
      error?.response?.data?.message ||
      error?.message ||
      (typeof error === 'string' ? error : 'Login failed. Please check your credentials.');
    throw new Error(errorMessage);
  }
};

/** **************************************
 * Sign up with backend API
 *************************************** */
export const signUp = async ({ email, password, firstName, lastName, username, mobile }) => {
  try {
    const params = {
      username: username || email.split('@')[0], // Use email prefix as username if not provided
      firstname: firstName,
      lastname: lastName,
      email,
      mobile,
      password,
    };
    const res = await axios.post('/auth/register', params);
    const { user, message } = res.data;

    // Store user data in sessionStorage
    if (user) {
      sessionStorage.setItem('user', JSON.stringify(user));
    }

    // Note: Backend register doesn't return access_token, user needs to login after registration
    return { user, message };
  } catch (error) {
    const errorMessage =
      error?.response?.data?.message ||
      error?.message ||
      (typeof error === 'string' ? error : 'Registration failed. Please try again.');
    throw new Error(errorMessage);
  }
};

/** **************************************
 * Forgot password - send reset link to email
 *************************************** */
export const forgotPassword = async ({ email }) => {
  try {
    const params = { email };
    const res = await axios.post('/auth/forgot-password', params);
    return res.data;
  } catch (error) {
    const errorMessage =
      error?.response?.data?.message ||
      error?.message ||
      (typeof error === 'string' ? error : 'Failed to send password reset email. Please try again.');
    throw new Error(errorMessage);
  }
};

/** **************************************
 * Reset password with token
 *************************************** */
export const resetPassword = async ({ token, password }) => {
  try {
    const params = { token, password };
    const res = await axios.post('/auth/reset-password', params);
    return res.data;
  } catch (error) {
    const errorMessage =
      error?.response?.data?.message ||
      error?.message ||
      (typeof error === 'string' ? error : 'Failed to reset password. Please try again.');
    throw new Error(errorMessage);
  }
};

/** **************************************
 * Verify email with token
 *************************************** */
export const verifyEmail = async ({ token }) => {
  try {
    const params = { token };
    const res = await axios.post('/auth/verify-email', params);
    return res.data;
  } catch (error) {
    const errorMessage =
      error?.response?.data?.message ||
      error?.message ||
      (typeof error === 'string' ? error : 'Failed to verify email. Please try again.');
    throw new Error(errorMessage);
  }
};

/** **************************************
 * Resend verification email
 *************************************** */
export const resendVerification = async ({ email }) => {
  try {
    const params = { email };
    const res = await axios.post('/auth/resend-verification', params);
    return res.data;
  } catch (error) {
    const errorMessage =
      error?.response?.data?.message ||
      error?.message ||
      (typeof error === 'string' ? error : 'Failed to resend verification email. Please try again.');
    throw new Error(errorMessage);
  }
};

/** **************************************
 * Sign out
 *************************************** */
export const signOut = async () => {
  try {
    await setSession(null);
    sessionStorage.removeItem('user');
    deleteCookie('access-token');
  } catch (error) {
    console.error('Error during sign out:', error);
    throw error;
  }
};
