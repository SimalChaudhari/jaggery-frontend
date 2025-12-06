import { useState, useEffect, useRef } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import Grid from '@mui/material/Unstable_Grid2';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';

import { useAuthContext } from 'src/auth/hooks';
import { useCheckoutContext } from './context';
import { CheckoutSummary } from './checkout-summary';
import { CheckoutBillingInfo } from './checkout-billing-info';
import { CONFIG } from 'src/config-global';
import { orderService } from 'src/services/order.service';
import { paymentService } from 'src/services/payment.service';
import { toast } from 'src/components/snackbar';
import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';

// ----------------------------------------------------------------------

// Initialize Stripe
const stripePromise = loadStripe(CONFIG.stripe.publishableKey || '');

function PaymentForm({ checkout, user, orderId }) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements || !orderId) {
      return;
    }

    try {
      setIsProcessing(true);

      // Submit payment form
      const { error: submitError } = await elements.submit();
      if (submitError) {
        toast.error(submitError.message);
        setIsProcessing(false);
        return;
      }

      // Confirm payment with Stripe
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}${paths.product.root}/checkout?step=3`,
          receipt_email: user?.email || undefined,
        },
        redirect: 'if_required',
      });

      if (error) {
        toast.error(error.message || 'Payment failed');
        setIsProcessing(false);
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        try {
          // Confirm payment on backend
          await paymentService.confirmPayment(paymentIntent.id, orderId);

          // Reset checkout and clear cart
          checkout.onUpdateField('items', []);
          checkout.onUpdateField('billing', null);
          checkout.onUpdateField('subtotal', 0);
          checkout.onUpdateField('total', 0);
          checkout.onUpdateField('discount', 0);
          checkout.onUpdateField('shipping', 0);
          checkout.onUpdateField('totalItems', 0);

          toast.success('Payment successful! Order placed successfully.');

          // Redirect to home page
          router.push(paths.product.root);
        } catch (confirmError) {
          console.error('Error confirming payment:', confirmError);
          toast.error('Payment succeeded but failed to confirm order. Please contact support.');
          setIsProcessing(false);
        }
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast.error(error?.response?.data?.message || error?.message || 'Payment failed');
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Payment Details
        </Typography>
        <PaymentElement />
      </Card>

      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        loading={isProcessing}
        color="primary"
        disabled={!stripe || isProcessing}
      >
        {isProcessing ? 'Processing...' : 'Complete order'}
      </LoadingButton>
    </form>
  );
}

export function CheckoutPaymentReview() {
  const checkout = useCheckoutContext();
  const { user } = useAuthContext();
  const [clientSecret, setClientSecret] = useState(null);
  const [orderId, setOrderId] = useState(null);
  const [isInitializing, setIsInitializing] = useState(false);
  const isInitializedRef = useRef(false);

  // Set shipping to 0 when component mounts
  useEffect(() => {
    if (checkout.shipping !== 0) {
      checkout.onUpdateField('shipping', 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Initialize payment: Create order and payment intent
  useEffect(() => {
    const initializePayment = async () => {
      // Prevent multiple initializations using ref
      if (isInitializedRef.current || isInitializing || clientSecret) {
        return;
      }

      if (!checkout.billing || !checkout.items || checkout.items.length === 0) {
        return;
      }

      // Mark as initialized immediately to prevent duplicate calls
      isInitializedRef.current = true;

      try {
        setIsInitializing(true);

        // Parse billing address
        let shippingAddress = {
          name: checkout.billing.name || `${user?.firstname || ''} ${user?.lastname || ''}`.trim() || 'User',
          address: '',
          city: '',
          state: '',
          country: '',
          pincode: '',
          mobile: checkout.billing.mobile || user?.mobile || '',
        };

        if (checkout.billing.fullAddress) {
          const parts = checkout.billing.fullAddress.split(',');
          const lastPart = parts[parts.length - 1] || '';
          const pincodeMatch = lastPart.match(/-?\s*(\d+)/);

          shippingAddress = {
            name: checkout.billing.name || `${user?.firstname || ''} ${user?.lastname || ''}`.trim() || 'User',
            address: parts[0]?.trim() || '',
            city: parts[1]?.trim() || '',
            state: parts[2]?.trim() || '',
            country: parts[3]?.split('-')[0]?.trim() || '',
            pincode: pincodeMatch ? pincodeMatch[1] : '',
            mobile: checkout.billing.mobile || user?.mobile || '',
          };
        } else if (checkout.billing.address) {
          shippingAddress = {
            name: checkout.billing.name || `${user?.firstname || ''} ${user?.lastname || ''}`.trim() || 'User',
            address: checkout.billing.address || '',
            city: checkout.billing.city || '',
            state: checkout.billing.state || '',
            country: checkout.billing.country || '',
            pincode: checkout.billing.pincode || '',
            mobile: checkout.billing.mobile || user?.mobile || '',
          };
        }

        const orderData = {
          items: checkout.items.map((item) => ({
            product: item.id || item.product?.id || item.product,
            quantity: item.quantity,
            price: item.price || item.priceSale || item.subtotal || 0,
            name: item.name || item.title,
            image: item.cover || item.coverUrl || item.image,
          })),
          shippingAddress,
          paymentMethod: 'stripe',
          subtotal: checkout.subtotal,
          shipping: checkout.shipping || 0,
          discount: checkout.discount || 0,
          total: checkout.total,
        };

        const order = await orderService.createOrder(orderData);
        const orderIdValue = order._id || order.id;
        setOrderId(orderIdValue);

        const paymentIntent = await paymentService.createPaymentIntent(orderIdValue, checkout.total, 'inr');
        setClientSecret(paymentIntent.clientSecret);
        setIsInitializing(false);
      } catch (error) {
        console.error('Error initializing payment:', error);
        toast.error(error?.response?.data?.message || error?.message || 'Failed to initialize payment');
        setIsInitializing(false);
      }
    };

    initializePayment();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  console.log('AUTH USER DATA', user);
  console.log('USER EMAIL', user?.email);

  return (
    <Grid container spacing={3}>
      <Grid xs={12} md={8}>
        {isInitializing || !clientSecret ? (
          <Card sx={{ p: 3, mb: 3 }}>
            <Typography variant="body2" sx={{ textAlign: 'center' }}>
              {isInitializing ? 'Initializing payment...' : 'Please wait...'}
            </Typography>
          </Card>
        ) : (
          <Elements stripe={stripePromise} options={{ clientSecret }}>
            <PaymentForm
              checkout={checkout}
              user={user}
              orderId={orderId}
            />
          </Elements>
        )}
      </Grid>

      <Grid xs={12} md={4}>
        <CheckoutBillingInfo billing={checkout.billing} onBackStep={checkout.onBackStep} />

        <CheckoutSummary
          total={checkout.total}
          subtotal={checkout.subtotal}
          discount={checkout.discount}
          shipping={checkout.shipping}
          onEdit={() => checkout.onGotoStep(0)}
        />
      </Grid>
    </Grid>
  );
}

