import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Dialog from '@mui/material/Dialog';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import LoadingButton from '@mui/lab/LoadingButton';
import Grid from '@mui/material/Unstable_Grid2';

import { Iconify } from 'src/components/iconify';
import { Label } from 'src/components/label';
import { Form, Field } from 'src/components/hook-form';
import { toast } from 'src/components/snackbar';
import {
  fetchAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} from 'src/store/slices/addressSlice';
import { AddressSchema } from 'src/validations/address-validation-schema';
import { useTheme } from '@emotion/react';

// ----------------------------------------------------------------------

export function UserAddressManagement({ userId }) {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  const dispatch = useDispatch();
  const { addresses } = useSelector((state) => state.addresses);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState(null);

  const methods = useForm({
    mode: 'onTouched',
    reValidateMode: 'onBlur',
    shouldFocusError: true,
    resolver: zodResolver(AddressSchema),
    defaultValues: {
      address: '',
      city: '',
      state: '',
      country: '',
      pincode: '',
      label: 'Home',
      isDefault: false,
    },
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const userAddresses = addresses.filter((addr) => {
    const addrUserId = addr.user?._id || addr.user || addr.userId;
    return addrUserId === userId || addrUserId?.toString() === userId?.toString();
  });

  const handleOpenDialog = (address = null) => {
    setEditingAddress(address);
    if (address) {
      reset({
        address: address.address || '',
        city: address.city || '',
        state: address.state || '',
        country: address.country || '',
        pincode: address.pincode || '',
        label: address.label || 'Home',
        isDefault: address.isDefault || false,
      });
    } else {
      reset({
        address: '',
        city: '',
        state: '',
        country: '',
        pincode: '',
        label: 'Home',
        isDefault: false,
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingAddress(null);
    reset();
  };

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (editingAddress) {
        await dispatch(
          updateAddress({
            id: editingAddress._id || editingAddress.id,
            addressData: data,
          })
        ).unwrap();
        toast.success('Address updated successfully!');
      } else {
        await dispatch(createAddress({ addressData: data, userId })).unwrap();
        toast.success('Address created successfully!');
      }
      handleCloseDialog();
    } catch (err) {
      toast.error(err || 'Failed to save address');
    }
  });

  const handleDeleteClick = (id) => {
    setAddressToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!addressToDelete) return;

    try {
      await dispatch(deleteAddress(addressToDelete)).unwrap();
      toast.success('Address deleted successfully!');
      dispatch(fetchAddresses(userId));
      setDeleteDialogOpen(false);
      setAddressToDelete(null);
    } catch (err) {
      toast.error(err || 'Failed to delete address');
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setAddressToDelete(null);
  };

  const handleSetDefault = async (id) => {
    try {
      await dispatch(setDefaultAddress(id)).unwrap();
      toast.success('Default address updated!');
    } catch (err) {
      toast.error(err || 'Failed to set default address');
    }
  };

  return (
    <>
      <Grid xs={12}>
        <Card sx={{ p: 3 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
            <Typography variant="h6"
            // color={isDarkMode ? 'text.primary' : '#8D0505'}
            >Addresses</Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<Iconify icon="mingcute:add-line" />}
              onClick={() => handleOpenDialog()}
            >
              Add Address
            </Button>
          </Stack>
          {userAddresses.length > 0 ? (
            <Stack spacing={2}>
              {userAddresses.map((address) => (
                <Card key={address._id || address.id} variant="outlined" sx={{ p: 2 }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                    <Box sx={{ flexGrow: 1 }}>
                      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                        {address.isDefault && (
                          <Label color="primary" variant="soft">
                            Default
                          </Label>
                        )}
                        {address.label && (
                          <Typography variant="subtitle2" sx={{ color: 'text.primary' }}>
                            {address.label}
                          </Typography>
                        )}
                      </Stack>
                      <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 500 }}>
                        {address.address}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.primary' }}>
                        {address.city}, {address.state}, {address.country} - {address.pincode}
                      </Typography>
                    </Box>
                    <Stack direction="row" spacing={1}>
                      {!address.isDefault && (
                        <IconButton
                          size="small"
                          onClick={() => handleSetDefault(address._id || address.id)}
                          title="Set as default"
                        >
                          <Iconify icon="solar:star-bold" />
                        </IconButton>
                      )}
                      <IconButton
                        size="small"
                        onClick={() => handleOpenDialog(address)}
                        title="Edit address"
                      >
                        <Iconify icon="solar:pen-bold" />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDeleteClick(address._id || address.id)}
                        title="Delete address"
                      >
                        <Iconify icon="solar:trash-bin-trash-bold" />
                      </IconButton>
                    </Stack>
                  </Stack>
                </Card>
              ))}
            </Stack>
          ) : (
            <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'center', py: 3 }}>
              No addresses found for this user.
            </Typography>
          )}
        </Card>
      </Grid>

      {/* Address Add/Edit Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <Form methods={methods} onSubmit={onSubmit}>
          <DialogTitle
            color={isDarkMode ? 'text.primary' : 'primary'}
          >{editingAddress ? 'Edit Address' : 'Add New Address'}</DialogTitle>
          <Divider />
          <DialogContent>
            <Stack spacing={2} sx={{ pt: 2 }}>
              <Field.RadioGroup
                row
                name="label"
                options={[
                  { label: 'Home', value: 'Home' },
                  { label: 'Office', value: 'Office' },
                ]}
              />
              <Field.Text name="address" label="Address" multiline rows={2} />
              <Field.Text name="city" label="City" />
              <Field.Text name="state" label="State" />
              <Field.Text name="country" label="Country" />
              <Field.Text name="pincode" label="Pincode" />
              <Field.Checkbox name="isDefault" label="Set as default address" />
            </Stack>
          </DialogContent>
          <Divider />
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <LoadingButton type="submit" variant="contained"
              color="primary"
              // color={isDarkMode ? '' : 'primary'}
              loading={isSubmitting}
            >
              {editingAddress ? 'Update' : 'Add'}
            </LoadingButton>
          </DialogActions>
        </Form>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel} maxWidth="xs" fullWidth>
        <DialogTitle>Delete Address</DialogTitle>
        <Divider />
        <DialogContent>
          <Typography variant="body1">
            Are you sure you want to delete this address? This action cannot be undone.
          </Typography>
        </DialogContent>
        <Divider />
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

