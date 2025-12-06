import axios from 'src/utils/axios';

export const addressService = {
  async getAllAddresses(userId = null) {
    try {
      const url = userId ? `/addresses?userId=${userId}` : '/addresses';
      const response = await axios.get(url);
      const addresses = response.data?.data || response.data || [];
      return addresses;
    } catch (error) {
      console.error('Error fetching addresses:', error);
      throw error;
    }
  },

  async getAddressById(id) {
    try {
      const response = await axios.get(`/addresses/${id}`);
      const address = response.data?.data || response.data;
      return address;
    } catch (error) {
      console.error('Error fetching address:', error);
      throw error;
    }
  },

  async getDefaultAddress() {
    try {
      const response = await axios.get('/addresses/default');
      const address = response.data?.data || response.data;
      return address;
    } catch (error) {
      console.error('Error fetching default address:', error);
      throw error;
    }
  },

  async createAddress(addressData, userId = null) {
    try {
      // If userId is provided (for admin), include it in the request body
      const data = userId ? { ...addressData, user: userId } : addressData;
      const response = await axios.post('/addresses', data);
      const address = response.data?.data || response.data;
      return address;
    } catch (error) {
      console.error('Error creating address:', error);
      throw error;
    }
  },

  async updateAddress(id, addressData) {
    try {
      const response = await axios.put(`/addresses/${id}`, addressData);
      const address = response.data?.data || response.data;
      return address;
    } catch (error) {
      console.error('Error updating address:', error);
      throw error;
    }
  },

  async deleteAddress(id) {
    try {
      const response = await axios.delete(`/addresses/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting address:', error);
      throw error;
    }
  },

  async setDefaultAddress(id) {
    try {
      const response = await axios.patch(`/addresses/${id}/default`);
      const address = response.data?.data || response.data;
      return address;
    } catch (error) {
      console.error('Error setting default address:', error);
      throw error;
    }
  },
};

