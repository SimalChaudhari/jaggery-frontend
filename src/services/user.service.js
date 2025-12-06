import axios from 'src/utils/axios';

// Transform backend user data to frontend format
const transformUser = (user) => {
  // Combine firstname and lastname to create name, or use username, or fallback to backend name field, or email
  const fullName =
    [user.firstname, user.lastname].filter(Boolean).join(' ') ||
    user.username ||
    user.name ||
    user.email ||
    '';

  // Capitalize status (backend returns lowercase "active", frontend expects "Active")
  const capitalizeStatus = (status) => {
    if (!status) return 'Active';
    return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
  };

  return {
    id: user._id || user.id,
    name: fullName,
    email: user.email || '',
    mobile: user.mobile || '',
    role: user.role || 'User',
    status: capitalizeStatus(user.status) || 'Active',
    username: user.username || '',
    firstname: user.firstname || '',
    lastname: user.lastname || '',
    isVerified: user.isVerified || false,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    avatarUrl: null, // No images as per requirement
  };
};

export const userService = {
  async getAllUsers() {
    try {
      const response = await axios.get('/users');
      const users = response.data?.data || response.data || [];
      return users.map(transformUser);
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },

  async getUserById(id) {
    try {
      const response = await axios.get(`/users/${id}`);
      const user = response.data?.data || response.data;
      return transformUser(user);
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  },

  async createUser(userData) {
    try {
      const response = await axios.post('/users', userData);
      const user = response.data?.user || response.data?.data || response.data;
      return transformUser(user);
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  },

  async updateUser(id, userData) {
    try {
      const response = await axios.put(`/users/${id}`, userData);
      const user = response.data?.user || response.data?.data || response.data;
      return transformUser(user);
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  },

  async updateUserStatus(id, status) {
    try {
      // Status is already in backend format (Active, Inactive, Pending, Banned)
      const response = await axios.patch(`/users/status/${id}`, { status });
      const user = response.data?.data || response.data;
      return transformUser(user);
    } catch (error) {
      console.error('Error updating user status:', error);
      throw error;
    }
  },

  async deleteUser(id) {
    try {
      const response = await axios.delete(`/users/delete/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  },
};

