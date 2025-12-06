import axios from 'src/utils/axios';

// Transform backend user data to frontend format
const transformUser = (user) => {
  // Generate name from firstname/lastname or use username
  const fullName = [user.firstname, user.lastname].filter(Boolean).join(' ') || user.username || user.email || '';

  return {
    id: user._id || user.id,
    name: fullName,
    username: user.username || '',
    firstname: user.firstname || '',
    lastname: user.lastname || '',
    email: user.email || '',
    mobile: user.mobile || '',
    role: user.role || 'User',
    status: user.status || 'Active',
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
};

export const authService = {
  async getProfile() {
    try {
      const response = await axios.get('/auth/profile');
      const user = response.data?.data || response.data;
      return transformUser(user);
    } catch (error) {
      console.error('Error fetching profile:', error);
      throw error;
    }
  },

  async updateProfile(userData) {
    try {
      const response = await axios.put('/auth/profile', userData);
      const user = response.data?.data || response.data;
      return transformUser(user);
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  },
};

