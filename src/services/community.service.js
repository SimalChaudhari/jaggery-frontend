import axios from 'src/utils/axios';

// Transform backend community data to frontend format
const transformCommunity = (community) => ({
  id: community._id || community.id,
  title: community.title || '',
  description: community.description || '',
  smallImage: community.smallImage || '',
  largeImage: community.largeImage || '',
  pricingType: community.pricingType || 'free',
  amount: community.amount || 0,
  category: community.category || null,
  categoryId: community.categoryId || null,
  // Keep categories for backward compatibility during transition
  categories: community.category ? [community.category] : [],
  createdAt: community.createdAt || new Date(),
  updatedAt: community.updatedAt || new Date(),
});

export const communityService = {
  async getAllCommunities() {
    try {
      const response = await axios.get('/communities');
      const communities = response.data?.data || response.data || [];
      return communities.map(transformCommunity);
    } catch (error) {
      console.error('Error fetching communities:', error);
      throw error;
    }
  },

  async getCommunityById(id) {
    try {
      const response = await axios.get(`/communities/${id}`);
      const community = response.data?.data || response.data;
      return transformCommunity(community);
    } catch (error) {
      console.error('Error fetching community:', error);
      throw error;
    }
  },

  async createCommunity(communityData, smallImageFile = null, largeImageFile = null) {
    try {
      const formData = new FormData();

      // Append all community data fields
      formData.append('title', communityData.title || '');
      if (communityData.description) {
        formData.append('description', communityData.description);
      }
      if (communityData.pricingType) {
        formData.append('pricingType', communityData.pricingType);
      }
      if (communityData.amount !== undefined) {
        formData.append('amount', communityData.amount.toString());
      }
      if (communityData.categoryId) {
        formData.append('categoryId', communityData.categoryId);
      }

      // Append image files if provided (not base64)
      if (smallImageFile instanceof File) {
        formData.append('smallImage', smallImageFile);
      }
      if (largeImageFile instanceof File) {
        formData.append('largeImage', largeImageFile);
      }

      const response = await axios.post('/communities', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      const community = response.data?.community || response.data?.data || response.data;
      return transformCommunity(community);
    } catch (error) {
      console.error('Error creating community:', error);
      throw error;
    }
  },

  async updateCommunity(id, communityData, smallImageFile = null, largeImageFile = null) {
    try {
      const formData = new FormData();

      // Append all community data fields
      if (communityData.title !== undefined) {
        formData.append('title', communityData.title);
      }
      if (communityData.description !== undefined) {
        formData.append('description', communityData.description);
      }
      if (communityData.pricingType !== undefined) {
        formData.append('pricingType', communityData.pricingType);
      }
      if (communityData.amount !== undefined) {
        formData.append('amount', communityData.amount.toString());
      }
      if (communityData.categoryId !== undefined) {
        formData.append('categoryId', communityData.categoryId);
      }

      // Append image files if provided (not base64)
      if (smallImageFile instanceof File) {
        formData.append('smallImage', smallImageFile);
      }
      if (largeImageFile instanceof File) {
        formData.append('largeImage', largeImageFile);
      }

      const response = await axios.put(`/communities/update/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      const community = response.data?.community || response.data?.data || response.data;
      return transformCommunity(community);
    } catch (error) {
      console.error('Error updating community:', error);
      throw error;
    }
  },

  async deleteCommunity(id) {
    try {
      const response = await axios.delete(`/communities/delete/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting community:', error);
      throw error;
    }
  },
};

