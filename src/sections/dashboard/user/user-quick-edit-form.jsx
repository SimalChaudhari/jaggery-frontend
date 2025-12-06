import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useDispatch } from 'react-redux';

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import MenuItem from '@mui/material/MenuItem';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import { USER_STATUS_OPTIONS } from 'src/_mock';

import { toast } from 'src/components/snackbar';
import { Form, Field } from 'src/components/hook-form';
import { updateUser } from 'src/store/slices/userSlice';
import { useAuthContext } from 'src/auth/hooks';
import { UserQuickEditSchema } from 'src/validations/user-validation-schema';

// Helper to update user in sessionStorage
const updateUserInStorage = (updatedUser) => {
  try {
    const userStr = sessionStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      const updatedUserData = {
        ...user,
        ...updatedUser,
        // Preserve accessToken if it exists
        accessToken: user.accessToken || updatedUser.accessToken,
      };
      sessionStorage.setItem('user', JSON.stringify(updatedUserData));
    }
  } catch (error) {
    console.error('Error updating user in sessionStorage:', error);
  }
};

// ----------------------------------------------------------------------

export function UserQuickEditForm({ currentUser, open, onClose }) {
  const dispatch = useDispatch();
  const { user: currentLoggedInUser, checkUserSession } = useAuthContext();
  const defaultValues = useMemo(
    () => ({
      username: currentUser?.username || '',
      firstname: currentUser?.firstname || '',
      lastname: currentUser?.lastname || '',
      email: currentUser?.email || '',
      mobile: currentUser?.mobile || '',
      status: currentUser?.status,
    }),
    [currentUser]
  );

  const methods = useForm({
    mode: 'all',
    resolver: zodResolver(UserQuickEditSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      // Ensure status is capitalized (backend expects "Active", "Inactive", "Banned", etc.)
      const status = data.status
        ? data.status.charAt(0).toUpperCase() + data.status.slice(1).toLowerCase()
        : 'Active';

      // Transform frontend data to backend format
      const backendData = {
        username: data.username,
        firstname: data.firstname,
        lastname: data.lastname,
        email: data.email,
        mobile: data.mobile || '',
        status, // Backend expects capitalized: "Active", "Inactive", etc.
      };

      await dispatch(updateUser({ id: currentUser.id, userData: backendData })).unwrap();

      // If the updated user is the currently logged-in user, update sessionStorage and auth context
      if (currentLoggedInUser && currentUser.id === currentLoggedInUser.id) {
        // Transform updated user data to match sessionStorage format
          const updatedUserData = {
            ...currentLoggedInUser,
            name: `${backendData.firstname} ${backendData.lastname}`.trim() || backendData.username,
            email: backendData.email,
            mobile: backendData.mobile,
            status: backendData.status,
            // Preserve other fields
            id: currentLoggedInUser.id,
            accessToken: currentLoggedInUser.accessToken,
          };

        updateUserInStorage(updatedUserData);

        // Refresh auth context
        if (checkUserSession) {
          await checkUserSession();
        }
      }

      reset();
      onClose();
      toast.success('User updated successfully!');
    } catch (error) {
      toast.error(error || 'Failed to update user');
      console.error('Error updating user:', error);
    }
  });

  return (
    <Dialog
      fullWidth
      maxWidth={false}
      open={open}
      onClose={onClose}
      PaperProps={{ sx: { maxWidth: 720 } }}
    >
      <Form methods={methods} onSubmit={onSubmit}>
        <DialogTitle>Quick Update</DialogTitle>

        <DialogContent>
          <Alert variant="outlined" severity="info" sx={{ mb: 3 }}>
            Account is waiting for confirmation
          </Alert>

          <Box
            rowGap={3}
            columnGap={2}
            display="grid"
            gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' }}
          >
            <Field.Select name="status" label="Status">
              {USER_STATUS_OPTIONS.map((status) => (
                <MenuItem key={status.value} value={status.value}>
                  {status.label}
                </MenuItem>
              ))}
            </Field.Select>

            <Box sx={{ display: { xs: 'none', sm: 'block' } }} />

            <Field.Text name="username" label="Username" />
            <Field.Text name="email" label="Email address" />
            <Field.Text name="firstname" label="First name" />
            <Field.Text name="lastname" label="Last name" />
            <Field.Text name="mobile" label="Mobile Number" />
          </Box>
        </DialogContent>

        <DialogActions>
          <Button variant="outlined" color="primary" onClick={onClose}>
            Cancel
          </Button>

          <LoadingButton type="submit" variant="contained" color="primary" loading={isSubmitting}>
            Update
          </LoadingButton>
        </DialogActions>
      </Form>
    </Dialog>
  );
}
