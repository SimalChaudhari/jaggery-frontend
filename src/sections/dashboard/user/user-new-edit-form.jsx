import { useMemo } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';
import { useDispatch } from 'react-redux';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import FormControlLabel from '@mui/material/FormControlLabel';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { Label } from 'src/components/label';
import { toast } from 'src/components/snackbar';
import { Form, Field } from 'src/components/hook-form';
import { createUser, updateUser } from 'src/store/slices/userSlice';
import { useAuthContext } from 'src/auth/hooks';
import { NewUserSchema } from 'src/validations/user-validation-schema';

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

export function UserNewEditForm({ currentUser }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const { user: currentLoggedInUser, checkUserSession } = useAuthContext();

  const defaultValues = useMemo(
    () => ({
      status: currentUser?.status || 'Active',
      username: currentUser?.username || '',
      firstname: currentUser?.firstname || '',
      lastname: currentUser?.lastname || '',
      email: currentUser?.email || '',
      phoneNumber: currentUser?.phoneNumber || currentUser?.mobile || '',
      address: currentUser?.address || '',
      city: currentUser?.city || '',
      state: currentUser?.state || '',
      country: currentUser?.country || '',
      zipCode: currentUser?.zipCode || currentUser?.pincode || '',
      // role: currentUser?.role || 'User',
      // password: '',
    }),
    [currentUser]
  );

  const methods = useForm({
    // mode: 'onChange',
    // shouldFocusError: true,
    // resolver: zodResolver(NewUserSchema),
    // defaultValues,
    mode: 'onTouched',
    reValidateMode: 'onBlur',
    shouldFocusError: true,
    resolver: zodResolver(NewUserSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

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
        mobile: data.phoneNumber || '',
        address: data.address || '',
        city: data.city || '',
        state: data.state || '',
        country: data.country || '',
        pincode: data.zipCode || '',
        status, // Backend expects lowercase: "active", "banned", etc.
      };

      if (currentUser) {
        // Update user
        const updatedUser = await dispatch(updateUser({ id: currentUser.id, userData: backendData })).unwrap();
        toast.success('User updated successfully!');

        // If the updated user is the currently logged-in user, update sessionStorage and auth context
        if (currentLoggedInUser && currentUser.id === currentLoggedInUser.id) {
          // Transform updated user data to match sessionStorage format
          const updatedUserData = {
            ...currentLoggedInUser,
            name: `${backendData.firstname} ${backendData.lastname}`.trim() || backendData.username,
            email: backendData.email,
            phoneNumber: backendData.mobile,
            mobile: backendData.mobile,
            address: backendData.address,
            city: backendData.city,
            state: backendData.state,
            country: backendData.country,
            zipCode: backendData.pincode,
            pincode: backendData.pincode,
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
      } else {
        // Create user - password will be set by backend or default
        await dispatch(createUser(backendData)).unwrap();
        toast.success('User created successfully!');
      }

      router.push(paths.admin.user.list);
    } catch (error) {
      toast.error(error || 'Failed to save user');
      console.error('Error saving user:', error);
    }
  });

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid xs={12} md={4}>
          <Card sx={{ pt: 5, pb: 5, px: 3 }}>
            {currentUser && (
              <Label
                color={
                  (values.status === 'Active' && 'success') ||
                  (values.status === 'Banned' && 'error') ||
                  (values.status === 'Inactive' && 'error') ||
                  (values.status === 'Pending' && 'warning') ||
                  'warning'
                }
                sx={{ position: 'absolute', top: 24, right: 24 }}
              >
                {values.status}
              </Label>
            )}

            {currentUser && (
              <Stack spacing={3}>
                <FormControlLabel
                  labelPlacement="start"
                  control={
                    <Controller
                      name="status"
                      control={control}
                      render={({ field }) => (
                        <Switch
                          checked={field.value === 'Active'}
                          onChange={(event) => {
                            if (event.target.checked) {
                              field.onChange('Active');
                            }
                          }}
                        />
                      )}
                    />
                  }
                  label={
                    <>
                      <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                        Active
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        User account is active
                      </Typography>
                    </>
                  }
                  sx={{
                    mx: 0,
                    width: 1,
                    justifyContent: 'space-between',
                  }}
                />

                <FormControlLabel
                  labelPlacement="start"
                  control={
                    <Controller
                      name="status"
                      control={control}
                      render={({ field }) => (
                        <Switch
                          checked={field.value === 'Inactive'}
                          onChange={(event) => {
                            if (event.target.checked) {
                              field.onChange('Inactive');
                            }
                          }}
                        />
                      )}
                    />
                  }
                  label={
                    <>
                      <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                        Inactive
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        User account is inactive
                      </Typography>
                    </>
                  }
                  sx={{
                    mx: 0,
                    width: 1,
                    justifyContent: 'space-between',
                  }}
                />

                <FormControlLabel
                  labelPlacement="start"
                  control={
                    <Controller
                      name="status"
                      control={control}
                      render={({ field }) => (
                        <Switch
                          checked={field.value === 'Pending'}
                          onChange={(event) => {
                            if (event.target.checked) {
                              field.onChange('Pending');
                            }
                          }}
                        />
                      )}
                    />
                  }
                  label={
                    <>
                      <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                        Pending
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        User account is pending verification
                      </Typography>
                    </>
                  }
                  sx={{
                    mx: 0,
                    width: 1,
                    justifyContent: 'space-between',
                  }}
                />

                <FormControlLabel
                  labelPlacement="start"
                  control={
                    <Controller
                      name="status"
                      control={control}
                      render={({ field }) => (
                        <Switch
                          checked={field.value === 'Banned'}
                          onChange={(event) => {
                            if (event.target.checked) {
                              field.onChange('Banned');
                            }
                          }}
                        />
                      )}
                    />
                  }
                  label={
                    <>
                      <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                        Banned
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        Apply disable account
                      </Typography>
                    </>
                  }
                  sx={{
                    mx: 0,
                    width: 1,
                    justifyContent: 'space-between',
                  }}
                />
              </Stack>
            )}
          </Card>
        </Grid>

        <Grid xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
              }}
            >
              <Field.Text name="username" label="Username" />
              <Field.Text name="email" label="Email address" />
              <Field.Text name="firstname" label="First name" />
              <Field.Text name="lastname" label="Last name" />
              <Field.Text name="phoneNumber" label="Phone Number" />

              <Field.Text name="address" label="Address" multiline rows={2} sx={{ gridColumn: { xs: '1', sm: '1 / -1' } }} />

              <Field.Text name="city" label="City" />
              <Field.Text name="state" label="State" />
              <Field.Text name="country" label="Country" />
              <Field.Text name="zipCode" label="Zip Code / Pincode" />
              {/* <Field.Text name="role" label="Role" /> */}
              {/* {!currentUser && (
                <Field.Text name="password" label="Password" type="password" />
              )}
              {currentUser && (
                <Field.Text name="password" label="New Password (leave empty to keep current)" type="password" />
              )} */}
            </Box>

            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" color="primary" loading={isSubmitting}>
                {!currentUser ? 'Create user' : 'Save changes'}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </Form>
  );
}
