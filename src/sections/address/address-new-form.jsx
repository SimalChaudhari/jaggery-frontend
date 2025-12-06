import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Divider from '@mui/material/Divider';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import { Form, Field } from 'src/components/hook-form';
import { AddressSchema } from 'src/validations/address-validation-schema';

// ----------------------------------------------------------------------

export function AddressNewForm({ open, onClose, onCreate }) {
  const defaultValues = {
    address: '',
    city: '',
    state: '',
    country: '',
    pincode: '',
    label: 'Home',
    isDefault: false,
  };

  const methods = useForm({
    mode: 'onTouched',
    reValidateMode: 'onBlur',
    shouldFocusError: true,
    resolver: zodResolver(AddressSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      onCreate({
        address: data.address,
        city: data.city,
        state: data.state,
        country: data.country,
        pincode: data.pincode,
        label: data.label || 'Home',
        isDefault: data.isDefault || false,
      });
      onClose();
    } catch (error) {
      // Error handling
    }
  });

  return (
    <Dialog fullWidth maxWidth="sm" open={open} onClose={onClose}>
      <Form methods={methods} onSubmit={onSubmit}>
        <DialogTitle>New address</DialogTitle>
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
          <Button onClick={onClose}>Cancel</Button>
          <LoadingButton type="submit" variant="contained" color="primary" loading={isSubmitting}>
            Deliver to this address
          </LoadingButton>
        </DialogActions>
      </Form>
    </Dialog>
  );
}
