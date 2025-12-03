import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { DashboardContent } from 'src/layouts/dashboard';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { EmptyContent } from 'src/components/empty-content';
import { LoadingScreen } from 'src/components/loading-screen';
import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export function CategoryDetailsView({ category, loading, error }) {
  if (loading) {
    return <LoadingScreen />;
  }

  if (error || !category) {
    return (
      <DashboardContent sx={{ pt: 5 }}>
        <EmptyContent
          filled
          title="Category not found!"
          action={
            <Button
              component={RouterLink}
              href={paths.admin.category.list}
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
        heading="Category Details"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Category', href: paths.admin.category.list },
          { name: category?.title },
        ]}
        action={
          <Button
            component={RouterLink}
            href={paths.admin.category.edit(category?.id)}
            variant="contained"
            color="primary"
            startIcon={<Iconify icon="solar:pen-bold" />}
          >
            Edit
          </Button>
        }
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Grid container spacing={3}>
        <Grid xs={12} md={4}>
          <Card sx={{ p: 3, textAlign: 'center' }}>
            {category.image ? (
              <Box
                component="img"
                src={category.image}
                alt={category.title}
                onError={(e) => {
                  console.error('Image load error:', category.image, e);
                  e.target.style.display = 'none';
                }}
                onLoad={() => {
                  console.log('Image loaded successfully:', category.image);
                }}
                sx={{
                  width: '100%',
                  maxWidth: 200,
                  height: 'auto',
                  borderRadius: 2,
                  mb: 2,
                  objectFit: 'cover',
                  bgcolor: 'grey.200',
                }}
              />
            ) : (
              <Box
                sx={{
                  width: '100%',
                  maxWidth: 200,
                  height: 200,
                  borderRadius: 2,
                  mb: 2,
                  bgcolor: 'grey.200',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Iconify icon="solar:image-broken" width={48} />
              </Box>
            )}

            <Typography variant="h6" sx={{ mb: 1 }}>
              {category.title}
            </Typography>
          </Card>
        </Grid>

        <Grid xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 3 }}>
              Category Information
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
                  {category.title || '-'}
                </Typography>
              </Box>

              <Box sx={{ gridColumn: { xs: 'span 1', sm: 'span 2' } }}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Description
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {category.description || '-'}
                </Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Parent Category
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {category.parentCategory
                    ? (typeof category.parentCategory === 'object' && category.parentCategory.title
                        ? category.parentCategory.title
                        : category.parentCategory)
                    : 'None (This is a parent category)'}
                </Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Image
                </Typography>
                {category.image ? (
                  <Box
                    component="img"
                    src={category.image}
                    alt={category.title}
                    onError={(e) => {
                      console.error('Image load error:', category.image, e);
                      e.target.style.display = 'none';
                    }}
                    onLoad={() => {
                      console.log('Image loaded successfully:', category.image);
                    }}
                    sx={{
                      width: 150,
                      height: 150,
                      borderRadius: 1,
                      objectFit: 'cover',
                      bgcolor: 'grey.200',
                    }}
                  />
                ) : (
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    -
                  </Typography>
                )}
              </Box>

              <Box>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Created At
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {category.createdAt ? new Date(category.createdAt).toLocaleString() : '-'}
                </Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Updated At
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {category.updatedAt ? new Date(category.updatedAt).toLocaleString() : '-'}
                </Typography>
              </Box>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </DashboardContent>
  );
}

