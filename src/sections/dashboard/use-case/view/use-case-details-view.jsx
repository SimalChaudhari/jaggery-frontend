import { useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { DashboardContent } from 'src/layouts/dashboard';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { EmptyContent } from 'src/components/empty-content';
import { LoadingScreen } from 'src/components/loading-screen';
import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export function UseCaseDetailsView({ useCase, loading, error }) {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  if (loading) {
    return <LoadingScreen />;
  }

  if (error || !useCase) {
    return (
      <DashboardContent sx={{ pt: 5 }}>
        <EmptyContent
          filled
          title="Use case not found!"
          action={
            <Button
              component={RouterLink}
              href={paths.admin.useCase.list}
              startIcon={<Iconify width={16} icon="eva:arrow-ios-back-fill" />}
              sx={{ mt: 3 }}
            >
              Back to list
            </Button>
          }
          sx={{ py: 10, height: 'auto', flexGrow: 'unset' }}
        />
      </DashboardContent>
    );
  }

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Use Case Details"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Use Case', href: paths.admin.useCase.list },
          { name: useCase?.title },
        ]}
        action={
          <Button
            component={RouterLink}
            href={paths.admin.useCase.edit(useCase?.id)}
            variant="contained"
            startIcon={<Iconify icon="solar:pen-bold" />}
            color="primary"
          >
            Edit
          </Button>
        }
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Grid container spacing={3}>
        <Grid xs={12} md={4}>
          <Card sx={{ p: 3, textAlign: 'center' }}>
            <Box
              sx={{
                width: '100%',
                maxWidth: 200,
                height: 200,
                borderRadius: 2,
                mx: 'auto',
                mb: 2,
                bgcolor: 'grey.200',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                position: 'relative',
              }}
            >
              {useCase.image && !imageError && (
                <Box
                  component="img"
                  src={useCase.image}
                  alt={useCase.title}
                  onError={() => setImageError(true)}
                  onLoad={() => setImageLoaded(true)}
                  sx={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    display: imageLoaded ? 'block' : 'none',
                  }}
                />
              )}
              {(!useCase.image || imageError || !imageLoaded) && (
                <Iconify icon="solar:image-broken" width={40} sx={{ color: 'text.disabled' }} />
              )}
            </Box>

            <Typography variant="h6" sx={{ mb: 1 }}>
              {useCase.title}
            </Typography>
          </Card>
        </Grid>

        <Grid xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 3 }}>
              Use Case Information
            </Typography>

            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
              }}
            >
              <Box>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Title
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {useCase.title || '-'}
                </Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Image
                </Typography>
                {useCase.image && !imageError ? (
                  <Box
                    component="img"
                    src={useCase.image}
                    alt={useCase.title}
                    onError={() => setImageError(true)}
                    onLoad={() => setImageLoaded(true)}
                    sx={{
                      width: 150,
                      height: 150,
                      borderRadius: 1,
                      objectFit: 'cover',
                      display: imageLoaded ? 'block' : 'none',
                    }}
                  />
                ) : (
                  <Iconify icon="solar:image-broken" width={40} sx={{ color: 'text.disabled' }} />
                )}
              </Box>

              <Box>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Created At
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {useCase.createdAt ? new Date(useCase.createdAt).toLocaleString() : '-'}
                </Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Updated At
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {useCase.updatedAt ? new Date(useCase.updatedAt).toLocaleString() : '-'}
                </Typography>
              </Box>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </DashboardContent>
  );
}

