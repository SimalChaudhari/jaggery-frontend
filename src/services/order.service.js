import axios from 'src/utils/axios';

export const orderService = {
  async createOrder(orderData) {
    try {
      const response = await axios.post('/orders', orderData);
      return response.data?.order || response.data?.data || response.data;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  },

  async getOrderById(orderId) {
    try {
      const response = await axios.get(`/orders/${orderId}`);
      return response.data?.order || response.data?.data || response.data;
    } catch (error) {
      console.error('Error fetching order:', error);
      throw error;
    }
  },

  async getAllOrders() {
    try {
      const response = await axios.get('/orders');
      return response.data?.orders || response.data?.data || response.data;
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
  },

  async updateOrder(orderId, orderData) {
    try {
      const response = await axios.put(`/orders/${orderId}`, orderData);
      return response.data?.order || response.data?.data || response.data;
    } catch (error) {
      console.error('Error updating order:', error);
      throw error;
    }
  },

  async deleteOrder(orderId) {
    try {
      const response = await axios.delete(`/orders/${orderId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting order:', error);
      throw error;
    }
  },
};

