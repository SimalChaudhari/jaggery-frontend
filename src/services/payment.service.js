import axios from 'src/utils/axios';

export const paymentService = {
  async createPaymentIntent(orderId, amount, currency = 'inr') {
    try {
      const response = await axios.post('/payments/create-payment-intent', {
        orderId,
        amount,
        currency,
      });
      return response.data;
    } catch (error) {
      console.error('Error creating payment intent:', error);
      throw error;
    }
  },

  async confirmPayment(paymentIntentId, orderId) {
    try {
      const response = await axios.post('/payments/confirm-payment', {
        paymentIntentId,
      });
      return response.data;
    } catch (error) {
      console.error('Error confirming payment:', error);
      throw error;
    }
  },
};

