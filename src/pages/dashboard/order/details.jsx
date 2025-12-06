import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { CONFIG } from 'src/config-global';
import { orderService } from 'src/services/order.service';
import { LoadingScreen } from 'src/components/loading-screen';
import { toast } from 'src/components/snackbar';

import { OrderDetailsView } from 'src/sections/order/view';

// ----------------------------------------------------------------------

const metadata = { title: `Order details | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  const { id = '' } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const response = await orderService.getOrderById(id);
        const orderData = response?.order || response;

        // Transform backend order format to frontend format
        const customerName =
          orderData.shippingAddress?.name ||
          (orderData.user?.firstname && orderData.user?.lastname
            ? `${orderData.user.firstname} ${orderData.user.lastname}`
            : orderData.user?.firstname || orderData.user?.username || 'N/A');

        const fullAddress = orderData.shippingAddress
          ? `${orderData.shippingAddress.address}, ${orderData.shippingAddress.city}, ${orderData.shippingAddress.state}, ${orderData.shippingAddress.country} - ${orderData.shippingAddress.pincode}`
          : '';

        const transformedOrder = {
          id: orderData._id || orderData.id,
          orderNumber: orderData.orderNumber,
          customer: {
            name: customerName,
            email: orderData.user?.email || 'N/A',
            address: orderData.shippingAddress?.address || '',
            city: orderData.shippingAddress?.city || '',
            state: orderData.shippingAddress?.state || '',
            country: orderData.shippingAddress?.country || '',
            pincode: orderData.shippingAddress?.pincode || '',
            mobile: orderData.shippingAddress?.mobile || orderData.user?.mobile || '',
          },
          createdAt: orderData.createdAt || new Date(),
          status: (orderData.orderStatus || 'Pending').toLowerCase(),
          items: orderData.items || [],
          subtotal: orderData.subtotal || 0,
          shipping: orderData.shipping || 0,
          discount: orderData.discount || 0,
          totalAmount: orderData.total || 0,
          paymentStatus: orderData.paymentStatus,
          paymentMethod: orderData.paymentMethod,
          shippingAddress: {
            ...orderData.shippingAddress,
            fullAddress,
            phoneNumber: orderData.shippingAddress?.mobile || orderData.user?.mobile || '',
          },
          delivery: {
            shipBy: 'Standard',
            speedy: 'Standard',
            trackingNumber: orderData.orderNumber,
          },
          payment: {
            cardNumber: orderData.paymentMethod === 'stripe' ? '**** **** **** 4242' : 'N/A',
          },
          history: [
            {
              time: orderData.createdAt || new Date(),
              title: 'Order created',
              description: 'Order was created',
            },
            ...(orderData.paymentStatus?.toLowerCase() === 'paid'
              ? [
                  {
                    time: orderData.updatedAt || new Date(),
                    title: 'Payment received',
                    description: 'Payment was successfully received',
                  },
                ]
              : []),
          ],
        };

        setOrder(transformedOrder);
      } catch (error) {
        console.error('Error fetching order:', error);
        toast.error('Failed to load order details');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchOrder();
    }
  }, [id]);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <OrderDetailsView order={order} />
    </>
  );
}
