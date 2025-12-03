import axios from 'src/utils/axios';

// Transform backend size data to frontend format
const transformSize = (size) => ({
  id: size._id || size.id,
  title: size.title || '',
  createdAt: size.createdAt || new Date(),
  updatedAt: size.updatedAt || new Date(),
});

export const sizeService = {
  async getAllSizes() {
    try {
      const response = await axios.get('/sizes');
      const sizes = response.data?.data || response.data || [];
      return sizes.map(transformSize);
    } catch (error) {
      console.error('Error fetching sizes:', error);
      throw error;
    }
  },

  async getSizeById(id) {
    try {
      const response = await axios.get(`/sizes/${id}`);
      const size = response.data?.data || response.data;
      return transformSize(size);
    } catch (error) {
      console.error('Error fetching size:', error);
      throw error;
    }
  },

  async createSize(data) {
    try {
      const response = await axios.post('/sizes', data);
      const size = response.data?.data || response.data;
      return transformSize(size);
    } catch (error) {
      console.error('Error creating size:', error);
      throw error;
    }
  },

  async updateSize(id, data) {
    try {
      const response = await axios.put(`/sizes/${id}`, data);
      const size = response.data?.data || response.data;
      return transformSize(size);
    } catch (error) {
      console.error('Error updating size:', error);
      throw error;
    }
  },

  async deleteSize(id) {
    try {
      const response = await axios.delete(`/sizes/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting size:', error);
      throw error;
    }
  },
};

