import { useState, useEffect, useCallback } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Rating from '@mui/material/Rating';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import ButtonBase from '@mui/material/ButtonBase';
import ListItemText from '@mui/material/ListItemText';
import Tooltip from '@mui/material/Tooltip';

import { fDate } from 'src/utils/format-time';

import { Iconify } from 'src/components/iconify';
import { productService } from 'src/services/product.service';
import { toast } from 'src/components/snackbar';
import { useAuthContext } from 'src/auth/hooks';

// ----------------------------------------------------------------------

export function ProductReviewItem({ review, onUpdate }) {
  const { user, authenticated } = useAuthContext();
  const [likes, setLikes] = useState(review?.likes?.length || 0);
  const [dislikes, setDislikes] = useState(review?.dislikes?.length || 0);
  const [userLiked, setUserLiked] = useState(false);
  const [userDisliked, setUserDisliked] = useState(false);
  const [loading, setLoading] = useState(false);

  const reviewId = review?._id || review?.id;
  const userId = user?._id || user?.id;

  // Check if user has already liked/disliked this review
  useEffect(() => {
    if (review) {
      const likesArray = review.likes || [];
      const dislikesArray = review.dislikes || [];
      setLikes(likesArray.length);
      setDislikes(dislikesArray.length);

      // For authenticated users, check if current user's ID is in the likes/dislikes arrays
      if (authenticated && userId) {
        // Convert both to strings for comparison (handles ObjectId and string formats)
        const userIdStr = String(userId);
        setUserLiked(likesArray.some((id) => String(id) === userIdStr));
        setUserDisliked(dislikesArray.some((id) => String(id) === userIdStr));
      } else {
        // For non-authenticated users, just show counts
        setUserLiked(false);
        setUserDisliked(false);
      }
    }
  }, [review, authenticated, userId]);

  const handleLike = useCallback(async () => {
    if (!reviewId || loading || !authenticated) {
      if (!authenticated) {
        toast.error('Please sign in to like reviews');
      }
      return;
    }

    try {
      setLoading(true);
      if (userLiked) {
        // Remove like
        await productService.removeLike(reviewId);
        setLikes((prev) => Math.max(0, prev - 1));
        setUserLiked(false);
        toast.success('Like removed');
      } else {
        // Add like (and remove dislike if present)
        await productService.likeReview(reviewId);
        setLikes((prev) => prev + 1);
        setUserLiked(true);
        if (userDisliked) {
          setDislikes((prev) => Math.max(0, prev - 1));
          setUserDisliked(false);
        }
        toast.success('Review liked');
      }

      // Notify parent to refresh reviews if callback provided
      if (onUpdate) {
        // Small delay to ensure backend has updated
        setTimeout(() => {
          onUpdate();
        }, 100);
      }
    } catch (error) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to update like';
      if (error?.response?.status === 401) {
        toast.error('Please sign in to like reviews');
      } else {
        toast.error(errorMessage);
      }
      console.error('Error updating like:', error);
    } finally {
      setLoading(false);
    }
  }, [reviewId, authenticated, userLiked, userDisliked, loading, onUpdate]);

  const handleDislike = useCallback(async () => {
    if (!reviewId || loading || !authenticated) {
      if (!authenticated) {
        toast.error('Please sign in to dislike reviews');
      }
      return;
    }

    try {
      setLoading(true);
      if (userDisliked) {
        // Remove dislike
        await productService.removeDislike(reviewId);
        setDislikes((prev) => Math.max(0, prev - 1));
        setUserDisliked(false);
        toast.success('Dislike removed');
      } else {
        // Add dislike (and remove like if present)
        await productService.dislikeReview(reviewId);
        setDislikes((prev) => prev + 1);
        setUserDisliked(true);
        if (userLiked) {
          setLikes((prev) => Math.max(0, prev - 1));
          setUserLiked(false);
        }
        toast.success('Review disliked');
      }

      // Notify parent to refresh reviews if callback provided
      if (onUpdate) {
        // Small delay to ensure backend has updated
        setTimeout(() => {
          onUpdate();
        }, 100);
      }
    } catch (error) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to update dislike';
      if (error?.response?.status === 401) {
        toast.error('Please sign in to dislike reviews');
      } else {
        toast.error(errorMessage);
      }
      console.error('Error updating dislike:', error);
    } finally {
      setLoading(false);
    }
  }, [reviewId, authenticated, userLiked, userDisliked, loading, onUpdate]);

  const renderInfo = (
    <Stack
      spacing={2}
      alignItems="center"
      direction={{ xs: 'row', md: 'column' }}
      sx={{ pb:2, width: { md: 240 }, textAlign: { md: 'center' } }}
    >
      <Avatar
        src={review.avatarUrl}
        sx={{ width: { xs: 48, md: 64 }, height: { xs: 48, md: 64 } }}
      />

      <ListItemText
        primary={review.name}
        secondary={fDate(review.createdAt || review.postedAt)}
        primaryTypographyProps={{ noWrap: true, typography: 'subtitle2', mb: 0.5 }}
        secondaryTypographyProps={{ noWrap: true, typography: 'caption', component: 'span' }}
      />
    </Stack>
  );

  const renderContent = (
    <Stack spacing={1} flexGrow={1}>
      <Rating
        size="small"
        value={review.rating}
        precision={0.1}
        readOnly
        sx={{
          '& .MuiRating-iconFilled': {
            color: 'primary.main',
          },
        }}
      />

      {review.isPurchased && (
        <Stack
          direction="row"
          alignItems="center"
          sx={{ color: 'success.main', typography: 'caption' }}
        >
          <Iconify icon="ic:round-verified" width={16} sx={{ mr: 0.5 }} />
          Verified purchase
        </Stack>
      )}

      <Typography variant="body2">{review.review || review.comment}</Typography>

      {!!review.attachments?.length && (
        <Stack direction="row" flexWrap="wrap" spacing={1} sx={{ pt: 1 }}>
          {review.attachments.map((attachment) => (
            <Box
              key={attachment}
              component="img"
              alt={attachment}
              src={attachment}
              sx={{ width: 64, height: 64, borderRadius: 1.5 }}
            />
          ))}
        </Stack>
      )}

      <Stack direction="row" spacing={2} sx={{ pt: 1.5 }}>
        <Tooltip title={!authenticated ? 'Sign in to like reviews' : userLiked ? 'Remove like' : 'Like this review'}>
          <span>
            <ButtonBase
              onClick={handleLike}
              disabled={loading || !authenticated}
              sx={{
                gap: 0.5,
                typography: 'caption',
                color: userLiked ? 'primary.main' : 'text.secondary',
                opacity: authenticated ? 1 : 0.6,
                cursor: authenticated ? 'pointer' : 'not-allowed',
                '&:hover': {
                  color: authenticated ? (userLiked ? 'primary.dark' : 'primary.main') : 'text.secondary',
                },
                '&:disabled': {
                  opacity: 0.6,
                },
              }}
            >
              <Iconify
                icon={userLiked ? 'solar:like-bold' : 'solar:like-outline'}
                width={16}
                sx={{
                  color: userLiked ? 'primary.main' : 'text.secondary',
                  // filter: userLiked
                  //   ? 'drop-shadow(0 0 6px rgba(25, 118, 210, 0.8)) drop-shadow(0 0 3px rgba(25, 118, 210, 0.5))'
                  //   : 'none',
                  transition: 'all 0.3s ease-in-out',
                  transform: userLiked ? 'scale(1.1)' : 'scale(1)',
                }}
              />
              {likes}
            </ButtonBase>
          </span>
        </Tooltip>

        <Tooltip title={!authenticated ? 'Sign in to dislike reviews' : userDisliked ? 'Remove dislike' : 'Dislike this review'}>
          <span>
            <ButtonBase
              onClick={handleDislike}
              disabled={loading || !authenticated}
              sx={{
                gap: 0.5,
                typography: 'caption',
                color: userDisliked ? 'error.main' : 'text.secondary',
                opacity: authenticated ? 1 : 0.6,
                cursor: authenticated ? 'pointer' : 'not-allowed',
                '&:hover': {
                  color: authenticated ? (userDisliked ? 'error.dark' : 'error.main') : 'text.secondary',
                },
                '&:disabled': {
                  opacity: 0.6,
                },
              }}
            >
              <Iconify
                icon={userDisliked ? 'solar:dislike-bold' : 'solar:dislike-outline'}
                width={16}
                sx={{
                  color: userDisliked ? 'error.main' : 'text.secondary',
                  // filter: userDisliked
                  //   ? 'drop-shadow(0 0 6px rgba(211, 47, 47, 0.8)) drop-shadow(0 0 3px rgba(211, 47, 47, 0.5))'
                  //   : 'none',
                  transition: 'all 0.3s ease-in-out',
                  transform: userDisliked ? 'scale(1.1)' : 'scale(1)',
                }}
              />
              {dislikes}
            </ButtonBase>
          </span>
        </Tooltip>
      </Stack>
    </Stack>
  );

  return (
    <Stack
      spacing={2}
      direction={{ xs: 'column', md: 'row' }}
      sx={{ mt: 5, px: { xs: 2.5, md: 0 } }}
    >
      {renderInfo}

      {renderContent}
    </Stack>
  );
}
