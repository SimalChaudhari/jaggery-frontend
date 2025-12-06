import { useEffect, useMemo } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2';
import LoadingButton from '@mui/lab/LoadingButton';

import { paths } from 'src/routes/paths';
import { useRouter, usePathname } from 'src/routes/hooks';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { Form, Field } from 'src/components/hook-form';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { MainContent } from 'src/layouts/main/main';

import { useAuthContext } from 'src/auth/hooks';
import { authService } from 'src/services/auth.service';
import { ProfileSchema } from 'src/validations/user-validation-schema';

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

export function ProfileEditView() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, checkUserSession } = useAuthContext();

  // Determine if we're on admin dashboard or regular profile
  const isAdminDashboard = pathname?.includes('/admin/dashboard');
  const profilePath = isAdminDashboard ? paths.dashboard.profile : paths.profile;

  const defaultValues = useMemo(
    () => ({
      firstname: user?.firstname || '',
      lastname: user?.lastname || '',
      username: user?.username || '',
      email: user?.email || '',
      mobile: user?.mobile || '',
    }),
    [user]
  );

  const methods = useForm({
    // mode: 'onTouched',
    // reValidateMode: 'onBlur',
    mode: 'onChange',
    shouldFocusError: true,
    resolver: zodResolver(ProfileSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    trigger,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if (user) {
      reset({
        firstname: user.firstname || '',
        lastname: user.lastname || '',
        username: user.username || '',
        email: user.email || '',
        mobile: user.mobile || '',
      });
    }
  }, [user, reset]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      const updatedUser = await authService.updateProfile(data);
      toast.success('Profile updated successfully');

      // Update user in sessionStorage
      updateUserInStorage(updatedUser);

      // Refresh auth context to reflect changes
      if (checkUserSession) {
        await checkUserSession();
      }

      // Navigate to profile page
      router.push(profilePath);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(error?.response?.data?.message || error?.message || 'Failed to update profile');
    }
  }, async (errors) => {
    // This callback is called when validation fails
    // Trigger validation for all fields to show errors
    await trigger();
  });

  return (
    <MainContent>
      <CustomBreadcrumbs
        heading="Edit Profile"
        links={[
          { name: 'Home', href: paths.home },
          { name: 'Profile', href: profilePath },
          { name: 'Edit' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Form methods={methods} onSubmit={onSubmit}>
        <Grid container spacing={3}>
          <Grid xs={12} md={8}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={3}>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <Field.Text name="firstname" label="First Name" />
                  <Field.Text name="lastname" label="Last Name" />
                </Stack>
                <Field.Text name="username" label="Username" />
                <Field.Text name="email" label="Email" type="email" />
                <Field.Text name="mobile" label="Mobile Number" />

                <Stack direction="row" spacing={2} justifyContent="flex-end">
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => router.push(profilePath)}
                    startIcon={<Iconify icon="eva:arrow-ios-back-fill" />}
                  >
                    Cancel
                  </Button>
                  <LoadingButton
                    type="submit"
                    variant="contained"
                    color="primary"
                    loading={isSubmitting}
                    startIcon={<Iconify icon="solar:check-circle-bold" />}
                  >
                    Save Changes
                  </LoadingButton>
                </Stack>
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </Form>
    </MainContent>
  );
}

