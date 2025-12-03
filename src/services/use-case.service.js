import axios from 'src/utils/axios';
import { CONFIG } from 'src/config-global';

// Helper to get full image URL
const getImageUrl = (imagePath) => {
  if (!imagePath) return '';

  // If already a full URL, return as is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://') || imagePath.startsWith('data:')) {
    return imagePath;
  }

  // Get base URL without /api
  const baseUrl = CONFIG.site.serverUrl.replace('/api', '');

  // If it's a relative path starting with /assets, prepend server base URL
  if (imagePath.startsWith('/assets')) {
    return `${baseUrl}${imagePath}`;
  }

  // If it's just a filename (no path), construct the full path
  if (imagePath && !imagePath.startsWith('/')) {
    return `${baseUrl}/assets/use-case/${imagePath}`;
  }

  // Otherwise return as is (for backward compatibility)
  return imagePath;
};

// Transform backend use-case data to frontend format
const transformUseCase = (useCase) => {
  const imageUrl = getImageUrl(useCase.image);
  return {
    id: useCase._id || useCase.id,
    title: useCase.title || '',
    image: imageUrl,
    createdAt: useCase.createdAt || new Date(),
    updatedAt: useCase.updatedAt || new Date(),
  };
};

export const useCaseService = {
  async getAllUseCases() {
    try {
      const response = await axios.get('/use-cases');
      const useCases = response.data?.data || response.data || [];
      return useCases.map(transformUseCase);
    } catch (error) {
      console.error('Error fetching use cases:', error);
      throw error;
    }
  },

  async getUseCaseById(id) {
    try {
      const response = await axios.get(`/use-cases/${id}`);
      const useCase = response.data?.data || response.data;
      return transformUseCase(useCase);
    } catch (error) {
      console.error('Error fetching use case:', error);
      throw error;
    }
  },

  async createUseCase(formData) {
    try {
      const response = await axios.post('/use-cases', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      const useCase = response.data?.data || response.data;
      return transformUseCase(useCase);
    } catch (error) {
      console.error('Error creating use case:', error);
      throw error;
    }
  },

  async updateUseCase(id, formData) {
    try {
      const response = await axios.put(`/use-cases/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      const useCase = response.data?.data || response.data;
      return transformUseCase(useCase);
    } catch (error) {
      console.error('Error updating use case:', error);
      throw error;
    }
  },

  async deleteUseCase(id) {
    try {
      const response = await axios.delete(`/use-cases/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting use case:', error);
      throw error;
    }
  },
};

