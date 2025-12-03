import Box from '@mui/material/Box';
import Pagination, { paginationClasses } from '@mui/material/Pagination';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';

import { ProductReviewItem } from './product-review-item';

// ----------------------------------------------------------------------

export function ProductReviewList({ reviews, pagination, page, onPageChange, onReviewUpdate, loading }) {
  const totalPages = pagination?.totalPages || 1;
  const hasReviews = reviews && reviews.length > 0;

  return (
    <>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
          <CircularProgress />
        </Box>
      ) : hasReviews ? (
        <>
          {reviews.map((review) => (
            <ProductReviewItem
              key={review._id || review.id}
              review={review}
              onUpdate={onReviewUpdate}
            />
          ))}

          {totalPages > 1 && (
            <Pagination
              count={totalPages}
              page={page}
              onChange={onPageChange}
              color="primary"
              sx={{
                mx: 'auto',
                [`& .${paginationClasses.ul}`]: { my: 5, mx: 'auto', justifyContent: 'center' },
              }}
            />
          )}
        </>
      ) : (
        <Box sx={{ py: 5, textAlign: 'center' }}>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            No reviews yet. Be the first to review this product!
          </Typography>
        </Box>
      )}
    </>
  );
}
