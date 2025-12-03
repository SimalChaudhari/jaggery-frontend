import axios from 'src/utils/axios';
import { CONFIG } from 'src/config-global';

// Helper to get full image URL
export const getImageUrl = (imagePath) => {
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
    return `${baseUrl}/assets/product/${imagePath}`;
  }

  // Otherwise return as is (for backward compatibility)
  return imagePath;
};

// Transform backend product data to frontend format
const transformProduct = (product) => {
  const images = product.images || [];
  const firstImage = images.length > 0 
    ? (typeof images[0] === 'object' ? images[0].image : images[0])
    : null;
  const coverUrl = firstImage ? getImageUrl(firstImage) : '';

  return {
    id: product._id || product.id,
    title: product.title || '',
    name: product.title || '', // For ProductItem component
    description: product.description || '',
    benefits: product.benefits || '',
    ingredients: product.ingredients || '',
    storageConditions: product.storageConditions || '',
    actualPrice: product.actualPrice || 0,
    discountPrice: product.discountPrice || null,
    price: product.actualPrice || 0, // For ProductItem component
    priceSale: product.discountPrice || null, // For ProductItem component
    isSale: product.isSale || false,
    inStock: product.inStock || true,
    available: product.inStock !== false, // For ProductItem component
    categories: product.categories || [],
    useCases: product.useCases || [],
    sizes: product.sizes || [],
    sizePrices: product.sizePrices || [],
    images,
    coverUrl, // For ProductItem component
    colors: [], // Default empty array for ProductItem
    newLabel: { enabled: false, content: '' }, // Default for ProductItem
    saleLabel: { enabled: product.isSale || false, content: 'Sale' }, // Based on isSale
    reviews: product.reviews || [],
    ratings: product.ratings || [],
    totalRatings: product.totalRatings || 0,
    totalReviews: product.totalReviews || 0,
    createdAt: product.createdAt || new Date(),
    updatedAt: product.updatedAt || new Date(),
  };
};

export const productService = {
  async getAllProducts() {
    try {
      const response = await axios.get('/products');
      const products = response.data?.data || response.data || [];
      return products.map(transformProduct);
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },

  async getProductById(id) {
    try {
      const response = await axios.get(`/products/${id}`);
      const product = response.data?.data || response.data;
      return transformProduct(product);
    } catch (error) {
      console.error('Error fetching product:', error);
      throw error;
    }
  },

  async createProduct(productData) {
    try {
      const response = await axios.post('/products', productData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      const product = response.data?.data || response.data;
      return transformProduct(product);
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  },

  async updateProduct(id, productData) {
    try {
      const response = await axios.put(`/products/${id}`, productData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      const product = response.data?.data || response.data;
      return transformProduct(product);
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  },

  async deleteProduct(id) {
    try {
      const response = await axios.delete(`/products/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  },

  async addProductImages(productId, images) {
    try {
      const formData = new FormData();
      images.forEach((image) => {
        formData.append('images', image);
      });
      const response = await axios.post(`/products/${productId}/images`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data?.data || response.data;
    } catch (error) {
      console.error('Error adding product images:', error);
      throw error;
    }
  },

  async deleteProductImage(imageId) {
    try {
      const response = await axios.delete(`/products/images/${imageId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting product image:', error);
      throw error;
    }
  },

  async createReview(productId, reviewData) {
    try {
      const response = await axios.post(`/products/${productId}/reviews`, reviewData);
      return response.data?.data || response.data;
    } catch (error) {
      console.error('Error creating review:', error);
      throw error;
    }
  },

  async getProductReviews(productId, page = 1, limit = 10) {
    try {
      const response = await axios.get(`/products/${productId}/reviews`, {
        params: { page, limit },
      });
      return response.data?.data || response.data;
    } catch (error) {
      console.error('Error fetching product reviews:', error);
      throw error;
    }
  },

  async likeReview(reviewId) {
    try {
      const response = await axios.post(`/reviews/${reviewId}/like`);
      return response.data?.data || response.data;
    } catch (error) {
      console.error('Error liking review:', error);
      throw error;
    }
  },

  async dislikeReview(reviewId) {
    try {
      const response = await axios.post(`/reviews/${reviewId}/dislike`);
      return response.data?.data || response.data;
    } catch (error) {
      console.error('Error disliking review:', error);
      throw error;
    }
  },

  async removeLike(reviewId) {
    try {
      const response = await axios.post(`/reviews/${reviewId}/remove-like`);
      return response.data?.data || response.data;
    } catch (error) {
      console.error('Error removing like:', error);
      throw error;
    }
  },

  async removeDislike(reviewId) {
    try {
      const response = await axios.post(`/reviews/${reviewId}/remove-dislike`);
      return response.data?.data || response.data;
    } catch (error) {
      console.error('Error removing dislike:', error);
      throw error;
    }
  },

  async updateReview(reviewId, reviewData) {
    try {
      const response = await axios.put(`/reviews/${reviewId}`, reviewData);
      return response.data?.data || response.data;
    } catch (error) {
      console.error('Error updating review:', error);
      throw error;
    }
  },

  async getMyReview(productId) {
    try {
      const response = await axios.get(`/products/${productId}/reviews/my-review`);
      return response.data?.data || null;
    } catch (error) {
      // If no review found, return null (not an error)
      if (error?.response?.status === 404 || error?.response?.status === 400) {
        return null;
      }
      console.error('Error fetching my review:', error);
      throw error;
    }
  },
};

