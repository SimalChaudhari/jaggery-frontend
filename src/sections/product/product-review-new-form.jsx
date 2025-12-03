import { z as zod } from 'zod';
import { useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import { Form, Field } from 'src/components/hook-form';
import { productService } from 'src/services/product.service';
import { toast } from 'src/components/snackbar';
import { useAuthContext } from 'src/auth/hooks';

// ----------------------------------------------------------------------

export const ReviewSchema = zod.object({
  rating: zod.number().min(1, 'Rating must be greater than or equal to 1!'),
  name: zod.string().min(1, { message: 'Name is required!' }),
  review: zod.string().min(1, { message: 'Review is required!' }),
  email: zod
    .string()
    .min(1, { message: 'Email is required!' })
    .email({ message: 'Email must be a valid email address!' }),
});

// ----------------------------------------------------------------------

export function ProductReviewNewForm({ productId, review, onClose, onSuccess, ...other }) {
  const { user } = useAuthContext();
  const isEditMode = !!review;

  const defaultValues = {
    rating: review?.rating || 0,
    review: review?.review || '',
    name: review?.name || user?.name || '',
    email: review?.email || user?.email || '',
  };

  const methods = useForm({
    mode: 'all',
    resolver: zodResolver(ReviewSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  // Update form when review data changes
  useEffect(() => {
    if (review) {
      reset({
        rating: review.rating || 0,
        review: review.review || '',
        name: review.name || user?.name || '',
        email: review.email || user?.email || '',
      });
    } else if (user) {
      reset({
        rating: 0,
        review: '',
        name: user.name || '',
        email: user.email || '',
      });
    }
  }, [review, user, reset]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (!productId) {
        toast.error('Product ID is required');
        return;
      }

      if (isEditMode && review) {
        // Update existing review
        await productService.updateReview(review._id || review.id, {
          rating: data.rating,
          review: data.review,
          name: data.name,
        });
        toast.success('Review updated successfully!');
      } else {
        // Create new review
        await productService.createReview(productId, {
          rating: data.rating,
          review: data.review,
          name: data.name,
          email: data.email,
        });
        toast.success('Review submitted successfully!');
      }

      reset();
      onClose();

      // Call onSuccess callback to refresh reviews if provided
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to submit review';
      toast.error(errorMessage);
      console.error(error);
    }
  });

  const onCancel = useCallback(() => {
    onClose();
    reset();
  }, [onClose, reset]);

  return (
    <Dialog onClose={onClose} {...other}>
      <Form methods={methods} onSubmit={onSubmit}>
        <DialogTitle>{isEditMode ? 'Edit Review' : 'Add Review'}</DialogTitle>

        <DialogContent>
          <div>
            <Typography variant="body2" sx={{ mb: 1 }}>
              Your review about this product:
            </Typography>
            <Field.Rating name="rating" />
          </div>

          <Field.Text name="review" label="Review *" multiline rows={3} sx={{ mt: 3 }} />

          <Field.Text name="name" label="Name *" sx={{ mt: 3 }} />

          <Field.Text
            name="email"
            label="Email *"
            disabled={!!user || isEditMode}
            sx={{ mt: 3 }}
          />
        </DialogContent>

        <DialogActions>
          <Button color="inherit" variant="outlined" onClick={onCancel}>
            Cancel
          </Button>

          <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
            {isEditMode ? 'Update' : 'Post'}
          </LoadingButton>
        </DialogActions>
      </Form>
    </Dialog>
  );
}
