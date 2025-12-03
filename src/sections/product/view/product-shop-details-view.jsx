import { useState, useEffect } from 'react';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { useTabs } from 'src/hooks/use-tabs';

import { varAlpha } from 'src/theme/styles';

import { Iconify } from 'src/components/iconify';
import { EmptyContent } from 'src/components/empty-content';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { DashboardContent } from 'src/layouts/dashboard';

import { CartIcon } from '../components/cart-icon';
import { useCheckoutContext } from '../../checkout/context';
import { ProductDetailsSkeleton } from '../product-skeleton';
import { ProductDetailsReview } from '../product-details-review';
import { ProductDetailsSummary } from '../product-details-summary';
import { ProductDetailsCarousel } from '../product-details-carousel';
import { ProductDetailsDescription } from '../product-details-description';
import { getImageUrl } from 'src/services/product.service';

// ----------------------------------------------------------------------

export function ProductShopDetailsView({ product: initialProduct, error, loading }) {
  const checkout = useCheckoutContext();
  const [product, setProduct] = useState(initialProduct);
  const [reviewCount, setReviewCount] = useState(initialProduct?.totalReviews || 0);

  const tabs = useTabs('description');

  // Update product and review count when initial product data changes
  useEffect(() => {
    if (initialProduct) {
      setProduct(initialProduct);
      setReviewCount(initialProduct.totalReviews || 0);
    }
  }, [initialProduct]);

  if (loading) {
    return (
      <DashboardContent sx={{ mt: 5, mb: 10 }}>
        <ProductDetailsSkeleton />
      </DashboardContent>
    );
  }

  if (error) {
    return (
      <DashboardContent sx={{ mt: 5, mb: 10 }}>
        <EmptyContent
          filled
          title="Product not found!"
          action={
            <Button
              component={RouterLink}
              href={paths.product.root}
              startIcon={<Iconify width={16} icon="eva:arrow-ios-back-fill" />}
              sx={{ mt: 3 }}
            >
              Back to list
            </Button>
          }
          sx={{ py: 10 }}
        />
      </DashboardContent>
    );
  }

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
  const images = product?.images || [];
  const carouselImages = images.map((img) => extractAndConvertImageUrl(img)).filter((url) => url !== null);

  return (
    <DashboardContent sx={{ mt: 5, mb: 10 }}>
      <CartIcon totalItems={checkout.totalItems} />

      <CustomBreadcrumbs
        links={[
          { name: 'Home', href: '/' },
          { name: 'Shop', href: paths.product.root },
          { name: product?.name || product?.title },
        ]}
        sx={{ mb: 5 }}
      />

      <Grid container spacing={{ xs: 3, md: 5, lg: 8 }}>
        <Grid xs={12} md={6} lg={7}>
          {carouselImages.length > 0 ? (
            <ProductDetailsCarousel images={carouselImages} />
          ) : (
            <Box
              sx={{
                width: '100%',
                height: 400,
                bgcolor: 'grey.200',
                borderRadius: 2,
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
        </Grid>

        <Grid xs={12} md={6} lg={5}>
          {product && (
            <ProductDetailsSummary
              product={product}
              items={checkout.items}
              onAddCart={checkout.onAddToCart}
              onGotoStep={checkout.onGotoStep}
              disableActions={!product?.available}
            />
          )}
        </Grid>
      </Grid>

      <Card sx={{ mt: 5 }}>
        <Tabs
          value={tabs.value}
          onChange={tabs.onChange}
          sx={{
            px: 3,
            boxShadow: (theme) =>
              `inset 0 -2px 0 0 ${varAlpha(theme.vars.palette.grey['500Channel'], 0.08)}`,
          }}
        >
          {[
            { value: 'description', label: 'Description' },
            { value: 'benefits', label: 'Benefits' },
            { value: 'ingredients', label: 'Ingredients' },
            { value: 'storage', label: 'Storage Conditions' },
            { value: 'reviews', label: `Reviews (${reviewCount})` },
          ].map((tab) => (
            <Tab key={tab.value} value={tab.value} label={tab.label} />
          ))}
        </Tabs>

        {tabs.value === 'description' && (
          <ProductDetailsDescription description={product?.description} />
        )}

        {tabs.value === 'benefits' && (
          <ProductDetailsDescription description={product?.benefits} />
        )}

        {tabs.value === 'ingredients' && (
          <ProductDetailsDescription description={product?.ingredients} />
        )}

        {tabs.value === 'storage' && (
          <ProductDetailsDescription description={product?.storageConditions} />
        )}

        {tabs.value === 'reviews' && (
          <ProductDetailsReview
            productId={product?.id}
            ratings={product?.ratings}
            reviews={product?.reviews}
            totalRatings={product?.totalRatings}
            totalReviews={product?.totalReviews}
            onReviewAdded={(updatedTotalReviews, updatedTotalRatings) => {
              // Update review count in tab when reviews are added/updated
              if (updatedTotalReviews !== undefined) {
                setReviewCount(updatedTotalReviews);
              }
              // Update product rating data to reflect in summary
              if (updatedTotalRatings !== undefined || updatedTotalReviews !== undefined) {
                setProduct((prevProduct) => ({
                  ...prevProduct,
                  totalRatings: updatedTotalRatings !== undefined ? updatedTotalRatings : prevProduct?.totalRatings,
                  totalReviews: updatedTotalReviews !== undefined ? updatedTotalReviews : prevProduct?.totalReviews,
                }));
              }
            }}
          />
        )}
      </Card>
    </DashboardContent>
  );
}
