import { useState, useMemo, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import Fab from '@mui/material/Fab';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Rating from '@mui/material/Rating';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { fCurrency } from 'src/utils/format-number';
import { useBoolean } from 'src/hooks/use-boolean';

import { Label } from 'src/components/label';
import { Image } from 'src/components/image';
import { Iconify } from 'src/components/iconify';
import { ColorPreview } from 'src/components/color-utils';
import { toast } from 'src/components/snackbar';

import { useCheckoutContext } from '../checkout/context';
import { fetchSizes } from 'src/store/slices/sizeSlice';

// ----------------------------------------------------------------------

export function ProductItem({ product }) {
  const checkout = useCheckoutContext();
  const dispatch = useDispatch();
  const { sizes: allSizes } = useSelector((state) => state.sizes);

  const { id, name, coverUrl, price, colors, available, sizes, priceSale, newLabel, saleLabel, sizePrices, totalRatings, totalReviews } =
    product;

  // Fetch sizes if not already loaded
  useEffect(() => {
    if (allSizes.length === 0) {
      dispatch(fetchSizes());
    }
  }, [dispatch, allSizes.length]);

  // Get price based on size priority (3, 6, 10)
  const displayPrice = useMemo(() => {
    // If no sizes, use default price
    if (!sizes || sizes.length === 0 || !sizePrices || sizePrices.length === 0) {
      return { actualPrice: price, discountPrice: priceSale };
    }

    // Helper to extract pack number from size title
    const getPackNumber = (sizeTitle) => {
      if (typeof sizeTitle === 'object') {
        sizeTitle = sizeTitle.title || '';
      }
      const match = sizeTitle?.toString().match(/Pack of (\d+)/i);
      return match ? parseInt(match[1], 10) : 999;
    };

    // Get available sizes with their IDs
    const availableSizesWithIds = sizes
      .map((size) => {
        const sizeId = typeof size === 'object' ? size._id || size.id : size;
        const sizeObj = allSizes.find((s) => s.id === sizeId);
        return sizeObj ? { id: sizeObj.id, title: sizeObj.title, packNumber: getPackNumber(sizeObj.title) } : null;
      })
      .filter(Boolean)
      .sort((a, b) => a.packNumber - b.packNumber);

    // Priority order: 3, 6, 10
    const priorityOrder = [3, 6, 10];

    // Find first available size in priority order
    const prioritySize = priorityOrder
      .map((priority) => availableSizesWithIds.find((s) => s.packNumber === priority))
      .find((size) => size !== undefined);

    if (prioritySize) {
      // Find price for this size
      const sizePrice = sizePrices.find((sp) => {
        const spSizeId = typeof sp.sizeId === 'object' ? sp.sizeId._id || sp.sizeId.id : sp.sizeId;
        return spSizeId === prioritySize.id;
      });

      if (sizePrice) {
        return {
          actualPrice: sizePrice.actualPrice,
          discountPrice: sizePrice.discountPrice || null,
        };
      }
    }

    // If no priority size found, use first available size price
    if (availableSizesWithIds.length > 0) {
      const firstSize = availableSizesWithIds[0];
      const sizePrice = sizePrices.find((sp) => {
        const spSizeId = typeof sp.sizeId === 'object' ? sp.sizeId._id || sp.sizeId.id : sp.sizeId;
        return spSizeId === firstSize.id;
      });

      if (sizePrice) {
        return {
          actualPrice: sizePrice.actualPrice,
          discountPrice: sizePrice.discountPrice || null,
        };
      }
    }

    // Fallback to default price
    return { actualPrice: price, discountPrice: priceSale };
  }, [sizes, sizePrices, price, priceSale, allSizes]);

  const linkTo = paths.product.details(id);
  const quickAddModal = useBoolean();
  const [selectedSizeId, setSelectedSizeId] = useState(null);

  // Helper to extract pack number from size title
  const getPackNumber = (sizeTitle) => {
    if (typeof sizeTitle === 'object') {
      sizeTitle = sizeTitle.title || '';
    }
    const match = sizeTitle?.toString().match(/Pack of (\d+)/i);
    return match ? parseInt(match[1], 10) : 999;
  };

  // Get available sizes for this product, sorted by pack number
  const availableSizes = useMemo(() => {
    if (!sizes || sizes.length === 0) return [];

    return sizes
      .map((size) => {
        const sizeId = typeof size === 'object' ? size._id || size.id : size;
        const sizeObj = allSizes.find((s) => s.id === sizeId);
        return sizeObj ? { id: sizeObj.id, title: sizeObj.title, packNumber: getPackNumber(sizeObj.title) } : null;
      })
      .filter(Boolean)
      .sort((a, b) => a.packNumber - b.packNumber);
  }, [sizes, allSizes]);

  // Set default size when modal opens
  useEffect(() => {
    if (quickAddModal.value && availableSizes.length > 0) {
      setSelectedSizeId(availableSizes[0].id);
    }
  }, [quickAddModal.value, availableSizes]);

  const handleAddCart = async () => {
    // If product has sizes, open modal
    if (sizes && sizes.length > 0) {
      quickAddModal.onTrue();
      return;
    }

    // If no sizes, add directly to cart
    const newProduct = {
      id,
      name,
      coverUrl,
      available,
      price,
      colors: [colors[0]],
      quantity: 1,
    };
    try {
      checkout.onAddToCart(newProduct);
      toast.success('Product added to cart successfully!');
    } catch (error) {
      console.error(error);
      toast.error('Failed to add product to cart');
    }
  };

  const handleAddCartFromModal = () => {
    if (!selectedSizeId) {
      toast.error('Please select a size');
      return;
    }

    // Get price for selected size
    let sizeActualPrice = price;
    let sizeDiscountPrice = priceSale || null;

    if (selectedSizeId && sizePrices && sizePrices.length > 0) {
      const sizePrice = sizePrices.find((sp) => {
        const spSizeId = typeof sp.sizeId === 'object' ? sp.sizeId._id || sp.sizeId.id : sp.sizeId;
        return spSizeId === selectedSizeId;
      });
      if (sizePrice) {
        sizeActualPrice = sizePrice.actualPrice;
        sizeDiscountPrice = sizePrice.discountPrice || null;
      }
    }

    const selectedSize = availableSizes.find((s) => s.id === selectedSizeId);

    const cartItem = {
      id,
      name,
      coverUrl,
      available,
      price: sizeActualPrice,
      priceSale: sizeDiscountPrice,
      size: selectedSize ? { id: selectedSize.id, title: selectedSize.title } : null,
      quantity: 1,
      subtotal: sizeActualPrice,
    };

    try {
      checkout.onAddToCart(cartItem);
      toast.success('Product added to cart successfully!');
      quickAddModal.onFalse();
    } catch (error) {
      console.error(error);
      toast.error('Failed to add product to cart');
    }
  };

  const renderLabels = (newLabel.enabled || saleLabel.enabled) && (
    <Stack
      direction="row"
      alignItems="center"
      spacing={1}
      sx={{
        position: 'absolute',
        zIndex: 9,
        top: 16,
        right: 16,
      }}
    >
      {newLabel.enabled && (
        <Label variant="filled" color="info">
          {newLabel.content}
        </Label>
      )}
      {saleLabel.enabled && (
        <Label variant="filled" color="error">
          {saleLabel.content}
        </Label>
      )}
    </Stack>
  );

  const renderImg = (
    <Box sx={{ position: 'relative', p: 1 }}>
      {!!available && (
        <Fab
          color="primary"
          size="medium"
          className="add-cart-btn"
          onClick={handleAddCart}
          sx={{
            right: 16,
            bottom: 16,
            zIndex: 9,
            opacity: 0,
            position: 'absolute',
            transition: (theme) =>
              theme.transitions.create('all', {
                easing: theme.transitions.easing.easeInOut,
                duration: theme.transitions.duration.shorter,
              }),
          }}
        >
          <Iconify icon="solar:cart-plus-bold" width={24} />
        </Fab>
      )}

      <Tooltip title={!available && 'Out of stock'} placement="bottom-end">
        <Image
          alt={name}
          src={coverUrl}
          ratio="1/1"
          sx={{ borderRadius: 1.5, ...(!available && { opacity: 0.48, filter: 'grayscale(1)' }) }}
        />
      </Tooltip>
    </Box>
  );

  const renderContent = (
    <Stack spacing={2.5} sx={{ p: 3, pt: 2 }}>
      <Link component={RouterLink} href={linkTo} color="inherit" variant="subtitle2" noWrap>
        {name}
      </Link>

      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <ColorPreview colors={colors} />

        <Stack direction="row" spacing={0.5} sx={{ typography: 'subtitle1' }}>
          {displayPrice.discountPrice && (
            <Box component="span" sx={{ color: 'text.disabled', textDecoration: 'line-through' }}>
              {fCurrency(displayPrice.actualPrice)}
            </Box>
          )}

          <Box component="span">{fCurrency(displayPrice.discountPrice || displayPrice.actualPrice)}</Box>
      </Stack>
      </Stack>

      <Stack direction="row" alignItems="center" spacing={1} sx={{ typography: 'caption', color: 'text.secondary' }}>
        <Rating
          size="small"
          value={totalRatings || 0}
          precision={0.1}
          readOnly
          sx={{
            '& .MuiRating-iconFilled': {
              color: 'primary.main',
            },
          }}
        />
        <Typography variant="caption" component="span">
          ({totalReviews || 0})
        </Typography>
      </Stack>
    </Stack>
  );

  // Get price for selected size in modal
  const getSelectedSizePrice = useMemo(() => {
    if (!selectedSizeId || !sizePrices || sizePrices.length === 0) {
      return { actualPrice: price, discountPrice: priceSale || null };
    }

    const sizePrice = sizePrices.find((sp) => {
      const spSizeId = typeof sp.sizeId === 'object' ? sp.sizeId._id || sp.sizeId.id : sp.sizeId;
      return spSizeId === selectedSizeId;
    });

    if (sizePrice) {
      return {
        actualPrice: sizePrice.actualPrice,
        discountPrice: sizePrice.discountPrice || null,
      };
    }

    return { actualPrice: price, discountPrice: priceSale || null };
  }, [selectedSizeId, sizePrices, price, priceSale]);

  const renderQuickAddModal = (
    <Dialog open={quickAddModal.value} onClose={quickAddModal.onFalse} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">{name}</Typography>
          <IconButton onClick={quickAddModal.onFalse}>
            <Iconify icon="mingcute:close-line" />
          </IconButton>
        </Stack>
      </DialogTitle>

      <DialogContent>
        <Stack spacing={3} sx={{ pt: 2 }}>
          {/* Price */}
          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Price
            </Typography>
            <Stack direction="row" alignItems="center" spacing={1}>
              {getSelectedSizePrice.discountPrice && (
                <Typography
                  variant="body2"
                  sx={{ color: 'text.disabled', textDecoration: 'line-through' }}
                >
                  {fCurrency(getSelectedSizePrice.actualPrice)}
                </Typography>
              )}
              <Typography variant="h6">
                {fCurrency(getSelectedSizePrice.discountPrice || getSelectedSizePrice.actualPrice)}
              </Typography>
              {getSelectedSizePrice.discountPrice && (
                <Typography variant="caption" sx={{ color: 'success.main' }}>
                  Save {fCurrency(getSelectedSizePrice.actualPrice - getSelectedSizePrice.discountPrice)}
                </Typography>
              )}
            </Stack>
          </Box>

          {/* Size Selection */}
          {availableSizes.length > 0 && (
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Size
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap">
                {availableSizes.map((size) => {
                  const isSelected = selectedSizeId === size.id;
                  return (
                    <Button
                      key={size.id}
                      variant={isSelected ? 'contained' : 'outlined'}
                      onClick={() => setSelectedSizeId(size.id)}
                      sx={{
                        minWidth: 'auto',
                        px: 2,
                        py: 1,
                        borderColor: isSelected ? 'primary.main' : 'grey.300',
                        bgcolor: isSelected ? 'primary.main' : 'transparent',
                        color: isSelected ? 'white' : 'text.primary',
                        '&:hover': {
                          borderColor: 'primary.main',
                          bgcolor: isSelected ? 'primary.dark' : 'action.hover',
                        },
                      }}
                    >
                      {size.title}
                    </Button>
                  );
                })}
              </Stack>
            </Box>
          )}

          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            Tax included.
          </Typography>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 0 }}>
        <Button variant="outlined" color="inherit" onClick={quickAddModal.onFalse} fullWidth>
          Cancel
        </Button>
        <Button
          variant="contained"
          // color="primary"
          color="primary"
          onClick={handleAddCartFromModal}
          disabled={!selectedSizeId}
          fullWidth
          startIcon={<Iconify icon="solar:cart-plus-bold" width={20} />}
        >
          Add to cart
        </Button>
      </DialogActions>
    </Dialog>
  );

  return (
    <>
      <Card sx={{ '&:hover .add-cart-btn': { opacity: 1 } }}>
        {renderLabels}

        {renderImg}

        {renderContent}
      </Card>

      {renderQuickAddModal}
    </>
  );
}
