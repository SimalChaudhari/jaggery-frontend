import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { DashboardContent } from 'src/layouts/dashboard';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { EmptyContent } from 'src/components/empty-content';
import { LoadingScreen } from 'src/components/loading-screen';
import { Iconify } from 'src/components/iconify';
import { Label } from 'src/components/label';
import { ProductDetailsCarousel } from 'src/sections/product/product-details-carousel';
import { getImageUrl } from 'src/services/product.service';

// ----------------------------------------------------------------------

export function ProductDetailsView({ product, loading, error }) {
  if (loading) {
    return <LoadingScreen />;
  }

  if (error || !product) {
    return (
      <DashboardContent sx={{ pt: 5 }}>
        <EmptyContent
          filled
          title="Product not found!"
          action={
            <Button
              component={RouterLink}
              href={paths.admin.product.list}
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

  const images = product.images || [];
  const categories = product.categories || [];
  const useCases = product.useCases || [];

  // Helper function to extract number from "Pack of X" for sorting
  const getPackNumber = (sizeTitle) => {
    if (typeof sizeTitle === 'object') {
      sizeTitle = sizeTitle.title || '';
    }
    const match = sizeTitle.match(/Pack of (\d+)/i);
    return match ? parseInt(match[1], 10) : 999; // Return 999 for non-matching sizes to put them at end
  };

  // Sort sizes by pack number (3, 6, 10)
  const sizes = (product.sizes || []).slice().sort((a, b) => {
    const aTitle = typeof a === 'object' ? a.title : a;
    const bTitle = typeof b === 'object' ? b.title : b;
    return getPackNumber(aTitle) - getPackNumber(bTitle);
  });

  const sizePrices = product.sizePrices || [];

  // Helper function to extract image path and convert to full URL
  const extractAndConvertImageUrl = (img) => {
    let imagePath = null;
    if (typeof img === 'object' && img.image) {
      imagePath = img.image;
    } else if (typeof img === 'string') {
      imagePath = img;
    }
    return imagePath ? getImageUrl(imagePath) : null;
  };

  // Prepare images array for carousel
  const carouselImages = images.map((img) => extractAndConvertImageUrl(img)).filter((url) => url !== null);

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Product Details"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Product', href: paths.admin.product.list },
          { name: product?.title },
        ]}
        action={
          <Button
            component={RouterLink}
            href={paths.admin.product.edit(product?.id)}
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
          <Card sx={{ p: 3 }}>
            {carouselImages.length > 0 ? (
              <Box sx={{ mb: 2 }}>
                <ProductDetailsCarousel images={carouselImages} />
              </Box>
            ) : (
              <Box
                sx={{
                  width: '100%',
                  height: 200,
                  bgcolor: 'grey.200',
                  borderRadius: 1,
                  mb: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  No Image
                </Typography>
              </Box>
            )}

            <Typography variant="h6" sx={{ mb: 1 }}>
              {product.title}
            </Typography>

            <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
              <Label color={product.inStock ? 'success' : 'error'} variant="soft">
                {product.inStock ? 'In Stock' : 'Out of Stock'}
              </Label>
              {product.isSale && <Label color="warning" variant="soft">On Sale</Label>}
            </Stack>
          </Card>
        </Grid>

        <Grid xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 3 }}>
              Product Information
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
                  {product.title || '-'}
                </Typography>
              </Box>

              {/* Only show actual price and discount price if no sizes are selected */}
              {sizes.length === 0 && (
                <>
                  <Box>
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>
                      Actual Price
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      ₹{product.actualPrice || 0}
                    </Typography>
                  </Box>

                  {product.discountPrice && (
                    <Box>
                      <Typography variant="subtitle2" sx={{ mb: 1 }}>
                        Discount Price
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        ₹{product.discountPrice}
                      </Typography>
                    </Box>
                  )}
                </>
              )}

              <Box sx={{ gridColumn: 'span 2' }}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Description
                </Typography>
                <Box
                  sx={{
                    color: 'text.secondary',
                    '& ul, & ol': {
                      pl: 3,
                      mb: 1,
                    },
                    '& li': {
                      mb: 0.5,
                      display: 'list-item',
                    },
                    '& ul': {
                      listStyleType: 'disc',
                    },
                    '& ol': {
                      listStyleType: 'decimal',
                    },
                    '& p': {
                      mb: 1,
                      '&:last-child': {
                        mb: 0,
                      },
                    },
                  }}
                  dangerouslySetInnerHTML={{ __html: product.description || '-' }}
                />
              </Box>

              <Box sx={{ gridColumn: 'span 2' }}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Ingredients
                </Typography>
                <Box
                  sx={{
                    color: 'text.secondary',
                    '& ul, & ol': {
                      pl: 3,
                      mb: 1,
                    },
                    '& li': {
                      mb: 0.5,
                      display: 'list-item',
                    },
                    '& ul': {
                      listStyleType: 'disc',
                    },
                    '& ol': {
                      listStyleType: 'decimal',
                    },
                    '& p': {
                      mb: 1,
                      '&:last-child': {
                        mb: 0,
                      },
                    },
                  }}
                  dangerouslySetInnerHTML={{ __html: product.ingredients || '-' }}
                />
              </Box>

              <Box sx={{ gridColumn: 'span 2' }}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Storage Conditions
                </Typography>
                <Box
                  sx={{
                    color: 'text.secondary',
                    '& ul, & ol': {
                      pl: 3,
                      mb: 1,
                    },
                    '& li': {
                      mb: 0.5,
                      display: 'list-item',
                    },
                    '& ul': {
                      listStyleType: 'disc',
                    },
                    '& ol': {
                      listStyleType: 'decimal',
                    },
                    '& p': {
                      mb: 1,
                      '&:last-child': {
                        mb: 0,
                      },
                    },
                  }}
                  dangerouslySetInnerHTML={{ __html: product.storageConditions || '-' }}
                />
              </Box>

              <Box sx={{ gridColumn: 'span 2' }}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Benefits
                </Typography>
                <Box
                  sx={{
                    color: 'text.secondary',
                    '& ul, & ol': {
                      pl: 3,
                      mb: 1,
                    },
                    '& li': {
                      mb: 0.5,
                      display: 'list-item',
                    },
                    '& ul': {
                      listStyleType: 'disc',
                    },
                    '& ol': {
                      listStyleType: 'decimal',
                    },
                    '& p': {
                      mb: 1,
                      '&:last-child': {
                        mb: 0,
                      },
                    },
                  }}
                  dangerouslySetInnerHTML={{ __html: product.benefits || '-' }}
                />
              </Box>

              <Box>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Categories
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap">
                  {categories.length > 0 ? (
                    categories.map((cat) => (
                      <Chip
                        key={typeof cat === 'object' ? cat._id || cat.id : cat}
                        label={typeof cat === 'object' ? cat.title : cat}
                        size="small"
                      />
                    ))
                  ) : (
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      No categories
                    </Typography>
                  )}
                </Stack>
              </Box>

              {useCases.length > 0 && (
                <Box>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    Use Cases
                  </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap">
                    {useCases.map((uc) => (
                      <Chip
                        key={typeof uc === 'object' ? uc._id || uc.id : uc}
                        label={typeof uc === 'object' ? uc.title : uc}
                        size="small"
                      />
                    ))}
                  </Stack>
                </Box>
              )}

              {sizes.length > 0 && (
                <Box>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    Sizes
                  </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap">
                    {sizes.map((size) => (
                      <Chip
                        key={typeof size === 'object' ? size._id || size.id : size}
                        label={typeof size === 'object' ? size.title : size}
                        size="small"
                      />
                    ))}
                  </Stack>
                </Box>
              )}

              {sizes.length > 0 && sizePrices.length > 0 && (
                <Box sx={{ gridColumn: 'span 2' }}>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    Size-Specific Prices
                  </Typography>
                  <Stack spacing={1}>
                    {sizes.map((size) => {
                      const sizeId = typeof size === 'object' ? size._id || size.id : size;
                      const sp = sizePrices.find((spItem) => {
                        const spSizeId = typeof spItem.sizeId === 'object' ? spItem.sizeId._id || spItem.sizeId.id : spItem.sizeId;
                        return sizeId === spSizeId;
                      });
                      if (!sp) return null;
                      const sizeTitle = typeof size === 'object' ? size.title : (sp.sizeId?.title || 'Unknown Size');
                      return (
                        <Box key={sizeId} sx={{ p: 1.5, bgcolor: 'grey.100', borderRadius: 1 }}>
                          <Typography variant="body2">
                            <strong>{sizeTitle}:</strong> ₹{sp.actualPrice}
                            {sp.discountPrice && ` (Discount: ₹${sp.discountPrice})`}
                          </Typography>
                        </Box>
                      );
                    })}
                  </Stack>
                </Box>
              )}

              <Box>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Created At
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {product.createdAt ? new Date(product.createdAt).toLocaleString() : '-'}
                </Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Updated At
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {product.updatedAt ? new Date(product.updatedAt).toLocaleString() : '-'}
                </Typography>
              </Box>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </DashboardContent>
  );
}
