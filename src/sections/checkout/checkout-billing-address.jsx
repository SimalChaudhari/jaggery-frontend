import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';

import { useBoolean } from 'src/hooks/use-boolean';
import { useAuthContext } from 'src/auth/hooks';
import { addressService } from 'src/services/address.service';
import { toast } from 'src/components/snackbar';

import { Iconify } from 'src/components/iconify';

import { useCheckoutContext } from './context';
import { CheckoutSummary } from './checkout-summary';
import { AddressItem, AddressNewForm } from '../address';

// ----------------------------------------------------------------------

export function CheckoutBillingAddress() {
  const checkout = useCheckoutContext();
  const { user, addresses, addressesLoading, fetchUserAddresses } = useAuthContext();

  const addressForm = useBoolean();

  // Transform address format for AddressItem component
  const transformAddress = (addr) => ({
    id: addr._id || addr.id,
    name: `${user?.firstname || ''} ${user?.lastname || ''}`.trim() || user?.name || 'User',
    addressType: addr.label || 'Home',
    fullAddress: `${addr.address}, ${addr.city}, ${addr.state}, ${addr.country} - ${addr.pincode}`,
    mobile: user?.mobile || '',
    primary: addr.isDefault || false,
  });

  // Handle new address creation from form
  const handleCreateAddress = async (addressData) => {
    try {
      // Save address to database
      const savedAddress = await addressService.createAddress(addressData);

      // Refresh addresses list
      if (fetchUserAddresses && user) {
        await fetchUserAddresses(user._id || user.id);
      }

      // Transform saved address data to checkout format
      const transformedAddress = {
        id: savedAddress._id || savedAddress.id,
        name: `${user?.firstname || ''} ${user?.lastname || ''}`.trim() || user?.name || 'User',
        addressType: savedAddress.label || 'Home',
        fullAddress: `${savedAddress.address}, ${savedAddress.city}, ${savedAddress.state}, ${savedAddress.country} - ${savedAddress.pincode}`,
        mobile: user?.mobile || '',
        primary: savedAddress.isDefault || false,
      };

      // Set as billing address in checkout
      checkout.onCreateBilling(transformedAddress);
      toast.success('Address saved successfully!');
    } catch (error) {
      console.error('Error creating address:', error);
      toast.error(error?.response?.data?.message || error?.message || 'Failed to save address');
    }
  };

  return (
    <>
      <Grid container spacing={3}>
        <Grid xs={12} md={8}>
          {addressesLoading ? (
            <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'center', py: 3 }}>
              Loading addresses...
            </Typography>
          ) : addresses && addresses.length > 0 ? (
            addresses.map((address) => {
              const transformedAddress = transformAddress(address);
              return (
                <AddressItem
                  key={transformedAddress.id}
                  address={transformedAddress}
                  action={
                    <Stack flexDirection="row" flexWrap="wrap" flexShrink={0}>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => checkout.onCreateBilling(transformedAddress)}
                        color="primary"
                      >
                        Deliver to this address
                      </Button>
                    </Stack>
                  }
                  sx={{
                    p: 3,
                    mb: 3,
                    borderRadius: 2,
                    boxShadow: (theme) => theme.customShadows.card,
                  }}
                />
              );
            })
          ) : (
            <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'center', py: 3 }}>
              No addresses found. Please add a new address.
            </Typography>
          )}

          <Stack direction="row" justifyContent="space-between">
            <Button
              size="small"
              color="inherit"
              onClick={checkout.onBackStep}
              startIcon={<Iconify icon="eva:arrow-ios-back-fill" />}
            >
              Back
            </Button>

            <Button
              size="small"
              color="primary"
              onClick={addressForm.onTrue}
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              New address
            </Button>
          </Stack>
        </Grid>

        <Grid xs={12} md={4}>
          <CheckoutSummary
            total={checkout.total}
            subtotal={checkout.subtotal}
            discount={checkout.discount}
          />
        </Grid>
      </Grid>

      <AddressNewForm
        open={addressForm.value}
        onClose={addressForm.onFalse}
        onCreate={handleCreateAddress}
      />
    </>
  );
}
