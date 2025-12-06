import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';

import { paths } from 'src/routes/paths';
import { useRouter, usePathname } from 'src/routes/hooks';

import { fDate } from 'src/utils/format-time';

import { MainContent } from 'src/layouts/main/main';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { Iconify } from 'src/components/iconify';

import { useAuthContext } from 'src/auth/hooks';

// ----------------------------------------------------------------------

export function ProfileView() {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuthContext();

  if (!user) {
    router.push(paths.auth.simple.signIn);
    return null;
  }

  // Determine if we're on admin dashboard or regular profile
  const isAdminDashboard = pathname?.includes('/admin/dashboard');
  const editProfilePath = isAdminDashboard ? paths.dashboard.profileEdit : paths.profileEdit;

  return (
    <MainContent>
      <CustomBreadcrumbs
        heading="Profile"
        links={[
          { name: 'Home', href: paths.home },
          { name: 'Profile' },
        ]}
        action={
          <Button
            variant="contained"
            startIcon={<Iconify icon="solar:pen-bold" />}
            onClick={() => router.push(editProfilePath)}
            color="primary"
          >
            Edit Profile
          </Button>
        }
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Card sx={{ p: 3 }}>
        <Stack spacing={3}>
          {/* User Avatar and Basic Info */}
          <Stack direction="row" spacing={3} alignItems="center">
            <Avatar
              src={user?.photoURL}
              alt={user?.name || user?.username || user?.email}
              sx={{ width: 80, height: 80 }}
            >
              {(user?.name || user?.username || user?.email || 'U')?.charAt(0).toUpperCase()}
            </Avatar>

            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="h5" gutterBottom>
                {user?.name || user?.username || user?.email || 'User'}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {user?.email}
              </Typography>
            </Box>
          </Stack>

          <Divider />

          {/* User Details */}
          <Stack spacing={3}>
            <Typography variant="h6">Account Information</Typography>

            <Grid container spacing={3}>
              {(user?.firstname || user?.lastname) && (
                <Grid xs={12} md={6}>
                  <Box>
                    <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>
                      First Name
                    </Typography>
                    <Typography variant="body1">{user?.firstname || 'Not set'}</Typography>
                  </Box>
                </Grid>
              )}

              {(user?.firstname || user?.lastname) && (
                <Grid xs={12} md={6}>
                  <Box>
                    <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>
                      Last Name
                    </Typography>
                    <Typography variant="body1">{user?.lastname || 'Not set'}</Typography>
                  </Box>
                </Grid>
              )}

              {user?.username && (
                <Grid xs={12} md={6}>
                  <Box>
                    <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>
                      Username
                    </Typography>
                    <Typography variant="body1">{user.username}</Typography>
                  </Box>
                </Grid>
              )}

              <Grid xs={12} md={6}>
                <Box>
                  <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>
                    Email
                  </Typography>
                  <Typography variant="body1">{user?.email || 'Not set'}</Typography>
                </Box>
              </Grid>

              {user?.mobile && (
                <Grid xs={12} md={6}>
                  <Box>
                    <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>
                      Mobile Number
                    </Typography>
                    <Typography variant="body1">{user.mobile}</Typography>
                  </Box>
                </Grid>
              )}

              {user?.createdAt && (
                <Grid xs={12} md={6}>
                  <Box>
                    <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>
                      Account Created
                    </Typography>
                    <Typography variant="body1">{fDate(user.createdAt)}</Typography>
                  </Box>
                </Grid>
              )}
            </Grid>
          </Stack>
        </Stack>
      </Card>
    </MainContent>
  );
}

