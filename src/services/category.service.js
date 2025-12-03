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
    return `${baseUrl}/assets/category/${imagePath}`;
  }

  // Otherwise return as is (for backward compatibility)
  return imagePath;
};

// Transform backend category data to frontend format
const transformCategory = (category) => {
  const imageUrl = getImageUrl(category.image);
  const { parentCategory: parentCategoryData } = category;

  // Handle parentCategory - it could be populated (object) or just an ID (string)
  let parentCategory = null;
  if (parentCategoryData) {
    if (typeof parentCategoryData === 'object' && parentCategoryData.title) {
      // Populated parent category
      parentCategory = {
        id: parentCategoryData._id || parentCategoryData.id,
        title: parentCategoryData.title,
      };
    } else {
      // Just an ID string
      parentCategory = parentCategoryData;
    }
  }

  return {
    id: category._id || category.id,
    title: category.title || '',
    description: category.description || '',
    image: imageUrl,
    parentCategory,
    createdAt: category.createdAt || new Date(),
    updatedAt: category.updatedAt || new Date(),
  };
};

export const categoryService = {
  async getAllCategories() {
    try {
      const response = await axios.get('/categories');
      const categories = response.data?.data || response.data || [];
      return categories.map(transformCategory);
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  },

  async getCategoryById(id) {
    try {
      const response = await axios.get(`/categories/${id}`);
      const category = response.data?.data || response.data;
      return transformCategory(category);
    } catch (error) {
      console.error('Error fetching category:', error);
      throw error;
    }
  },

  async createCategory(formData) {
    try {
      const response = await axios.post('/categories', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      const category = response.data?.data || response.data;
      return transformCategory(category);
    } catch (error) {
      console.error('Error creating category:', error);
      throw error;
    }
  },

  async updateCategory(id, formData) {
    try {
      const response = await axios.put(`/categories/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      const category = response.data?.data || response.data;
      return transformCategory(category);
    } catch (error) {
      console.error('Error updating category:', error);
      throw error;
    }
  },

  async deleteCategory(id) {
    try {
      const response = await axios.delete(`/categories/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting category:', error);
      throw error;
    }
  },
};
