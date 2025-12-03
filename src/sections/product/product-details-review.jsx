import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Rating from '@mui/material/Rating';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';

import { useBoolean } from 'src/hooks/use-boolean';
import { useAuthContext } from 'src/auth/hooks';

import { sumBy } from 'src/utils/helper';
import { fShortenNumber } from 'src/utils/format-number';

import { Iconify } from 'src/components/iconify';
import { productService } from 'src/services/product.service';

import { ProductReviewList } from './product-review-list';
import { ProductReviewNewForm } from './product-review-new-form';

// ----------------------------------------------------------------------

export function ProductDetailsReview({ productId, totalRatings: initialTotalRatings, totalReviews: initialTotalReviews, ratings: initialRatings = [], reviews: initialReviews = [], onReviewAdded }) {
  const { user, authenticated } = useAuthContext();
  const review = useBoolean();
  const editReview = useBoolean();
  const [reviews, setReviews] = useState(initialReviews);
  const [ratings, setRatings] = useState(initialRatings);
  const [totalRatings, setTotalRatings] = useState(initialTotalRatings || 0);
  const [totalReviews, setTotalReviews] = useState(initialTotalReviews || 0);
  const [loading, setLoading] = useState(false);
  const [myReview, setMyReview] = useState(null);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalCount: 0,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  });

  // Fetch reviews when productId or page changes
  useEffect(() => {
    if (productId) {
      fetchReviews(page);
      if (authenticated && page === 1) {
        // Only fetch my review on first page or when productId changes
        fetchMyReview();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId, page]);

  // Fetch my review when authentication status changes
  useEffect(() => {
    if (productId && authenticated) {
      fetchMyReview();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authenticated]);

  const fetchMyReview = async () => {
    if (!productId || !authenticated) return;

    try {
      const userReview = await productService.getMyReview(productId);
      setMyReview(userReview);
    } catch (error) {
      // User might not have a review, that's okay
      setMyReview(null);
    }
  };

  const fetchReviews = async (currentPage = 1, updateParent = false) => {
    if (!productId) return;

    try {
      setLoading(true);
      const data = await productService.getProductReviews(productId, currentPage, 10);
      if (data) {
        setReviews(data.reviews || []);
        setRatings(data.ratings || []);
        setTotalRatings(data.totalRatings || 0);
        const newTotalReviews = data.totalReviews || 0;
        setTotalReviews(newTotalReviews);
        if (data.pagination) {
          setPagination(data.pagination);
        }
        // Update parent component with new review count and rating only when requested
        if (updateParent && onReviewAdded) {
          onReviewAdded(newTotalReviews, data.totalRatings || 0);
        }
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
    // Scroll to top of reviews section
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReviewAdded = async () => {
    // Refresh reviews after a new one is added (go to first page)
    setPage(1);
    await fetchReviews(1, true); // Pass true to update parent
    if (authenticated) {
      await fetchMyReview();
    }
  };

  const total = sumBy(ratings, (star) => star.starCount);

  const renderSummary = (
    <Stack spacing={1} alignItems="center" justifyContent="center">
      <Typography variant="subtitle2" color="primary">Average rating</Typography>

      <Typography variant="h2" color="primary">
        {totalRatings}
        /5
      </Typography>

      <Rating
        readOnly
        value={totalRatings}
        precision={0.1}
        sx={{
          '& .MuiRating-iconFilled': {
            color: 'primary.main',
          },
        }}
      />

      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
        ({fShortenNumber(totalReviews)} reviews)
      </Typography>
    </Stack>
  );

  const renderProgress = (
    <Stack
      spacing={1.5}
      sx={{
        py: 5,
        px: { xs: 3, md: 5 },
        borderLeft: (theme) => ({ md: `dashed 1px ${theme.vars.palette.divider}` }),
        borderRight: (theme) => ({ md: `dashed 1px ${theme.vars.palette.divider}` }),
      }}
    >
      {ratings
        .slice(0)
        .reverse()
        .map((rating) => (
          <Stack key={rating.name} direction="row" alignItems="center">
            <Typography variant="subtitle2" component="span" sx={{ width: 42 }} color="primary">
              {rating.name}
            </Typography>

            <LinearProgress
              // color="inherit"
              color="primary"
              variant="determinate"
              value={(rating.starCount / total) * 100}
              sx={{ mx: 2, flexGrow: 1 }}
            />

            <Typography
              variant="body2"
              component="span"
              sx={{ minWidth: 48,
              color: 'text.primary'
              // color: 'text.secondary'
               }}
            >
              {fShortenNumber(rating.reviewCount)}
            </Typography>
          </Stack>
        ))}
    </Stack>
  );

  const renderReviewButton = (
    <Stack alignItems="center" justifyContent="center" spacing={1}>
      {myReview ? (
        <Button
          size="large"
          variant="soft"
          color="primary"
          onClick={() => {
            editReview.onTrue();
          }}
          startIcon={<Iconify icon="solar:pen-bold" />}
        >
          Edit your review
        </Button>
      ) : (
        <Button
          size="large"
          variant="soft"
          color="inherit"
          onClick={review.onTrue}
          startIcon={<Iconify icon="solar:pen-bold" />}
        >
          Write your review
        </Button>
      )}
    </Stack>
  );

  return (
    <>
      <Box
        display="grid"
        gridTemplateColumns={{ xs: 'repeat(1, 1fr)', md: 'repeat(3, 1fr)' }}
        sx={{ py: { xs: 5, md: 0 } }}
      >
        {renderSummary}

        {renderProgress}

        {renderReviewButton}
      </Box>

      <Divider sx={{ borderStyle: 'dashed' }} />

      <ProductReviewList
        reviews={reviews}
        pagination={pagination}
        page={page}
        onPageChange={handlePageChange}
        onReviewUpdate={() => fetchReviews(page)}
        loading={loading}
      />

      <ProductReviewNewForm
        open={review.value}
        onClose={review.onFalse}
        productId={productId}
        onSuccess={handleReviewAdded}
      />

      <ProductReviewNewForm
        open={editReview.value}
        onClose={editReview.onFalse}
        productId={productId}
        review={myReview}
        onSuccess={handleReviewAdded}
      />
    </>
  );
}
