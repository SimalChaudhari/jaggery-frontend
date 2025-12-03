import { useEffect, useCallback, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector, useDispatch } from 'react-redux';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Rating from '@mui/material/Rating';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { fCurrency, fShortenNumber } from 'src/utils/format-number';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { Form, Field } from 'src/components/hook-form';
import { toast } from 'src/components/snackbar';

import { fetchSizes } from 'src/store/slices/sizeSlice';

import { IncrementerButton } from './components/incrementer-button';

// ----------------------------------------------------------------------

export function ProductDetailsSummary({
  items,
  product,
  onAddCart,
  onGotoStep,
  disableActions,
  ...other
}) {
  const router = useRouter();
  const dispatch = useDispatch();
  const { sizes: allSizes } = useSelector((state) => state.sizes);

  const {
    id,
    name,
    price,
    coverUrl,
    newLabel,
    available,
    priceSale,
    saleLabel,
    totalRatings,
    totalReviews,
    inventoryType,
    subDescription,
    sizes: productSizes = [],
    sizePrices = [],
  } = product;

  // Fetch sizes on mount
  useEffect(() => {
    if (allSizes.length === 0) {
      dispatch(fetchSizes());
    }
  }, [dispatch, allSizes.length]);

  // Helper function to extract number from "Pack of X" for sorting
  const getPackNumber = (sizeTitle) => {
    if (typeof sizeTitle === 'object') {
      sizeTitle = sizeTitle.title || '';
    }
    const match = sizeTitle?.toString().match(/Pack of (\d+)/i);
    return match ? parseInt(match[1], 10) : 999;
  };

  // Get available sizes for this product, sorted by pack number
  const availableSizes = useMemo(() => {
    if (!productSizes || productSizes.length === 0) return [];

    return productSizes
      .map((size) => {
        const sizeId = typeof size === 'object' ? size._id || size.id : size;
        const sizeObj = allSizes.find((s) => s.id === sizeId);
        return sizeObj ? { id: sizeObj.id, title: sizeObj.title } : null;
      })
      .filter(Boolean)
      .sort((a, b) => getPackNumber(a.title) - getPackNumber(b.title));
  }, [productSizes, allSizes]);

  // Get default size (first available size at index 0)
  const defaultSizeId = availableSizes.length > 0 ? availableSizes[0].id : null;

  const defaultValues = {
    id,
    name,
    coverUrl,
    available,
    price,
    priceSale: priceSale || null,
    selectedSize: defaultSizeId,
    quantity: available < 1 ? 0 : 1,
  };

  const methods = useForm({ defaultValues });

  const { reset, watch, control, setValue, handleSubmit } = methods;

  const values = watch();
  const selectedSizeId = watch('selectedSize');

  // Check if product exists in cart (considering size for matching)
  const existProduct = useMemo(() => {
    if (!items?.length || !selectedSizeId) return false;

    // If size is selected, check if same product with same size exists
    return items.some((item) => {
      const itemSizeId = item.size ? (typeof item.size === 'object' ? item.size.id : item.size) : null;
      return item.id === id && itemSizeId === selectedSizeId;
    });
  }, [items, id, selectedSizeId]);

  // Check max quantity for the selected size
  const isMaxQuantity = useMemo(() => {
    // If no items in cart, not max quantity
    if (!items?.length) return false;

    // If no sizes available, check normal product
    if (availableSizes.length === 0) {
      const existingItem = items.find((item) => item.id === id && !item.size);
      return existingItem ? existingItem.quantity >= available : false;
    }

    // If sizes available but none selected, not max quantity (button should be enabled)
    if (!selectedSizeId) return false;

    // If size is selected, check if same product with same size exists and is at max
    const existingItem = items.find((item) => {
      const itemSizeId = item.size ? (typeof item.size === 'object' ? item.size.id : item.size) : null;
      return item.id === id && itemSizeId === selectedSizeId;
    });

    return existingItem ? existingItem.quantity >= available : false;
  }, [items, id, selectedSizeId, available, availableSizes.length]);

  // Get price based on selected size
  const currentPrice = useMemo(() => {
    if (selectedSizeId && sizePrices.length > 0) {
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
    }
    return {
      actualPrice: price,
      discountPrice: priceSale || null,
    };
  }, [selectedSizeId, sizePrices, price, priceSale]);

  // Update price when size changes
  useEffect(() => {
    if (selectedSizeId) {
      setValue('price', currentPrice.actualPrice);
      setValue('priceSale', currentPrice.discountPrice);
    } else {
      setValue('price', price);
      setValue('priceSale', priceSale || null);
    }
  }, [selectedSizeId, currentPrice, setValue, price, priceSale]);

  useEffect(() => {
    if (product) {
      // Auto-select first size if available
      const firstSizeId = availableSizes.length > 0 ? availableSizes[0].id : null;

      // Calculate initial price based on first size
      let initialPrice = price;
      let initialPriceSale = priceSale || null;

      if (firstSizeId && sizePrices.length > 0) {
        const sizePrice = sizePrices.find((sp) => {
          const spSizeId = typeof sp.sizeId === 'object' ? sp.sizeId._id || sp.sizeId.id : sp.sizeId;
          return spSizeId === firstSizeId;
        });
        if (sizePrice) {
          initialPrice = sizePrice.actualPrice;
          initialPriceSale = sizePrice.discountPrice || null;
        }
      }

      reset({
        ...defaultValues,
        selectedSize: firstSizeId,
        price: initialPrice,
        priceSale: initialPriceSale,
      });

      // Set the selected size in form
      if (firstSizeId) {
        setValue('selectedSize', firstSizeId);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product, availableSizes]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (!existProduct) {
        let sizeId = data.selectedSize || selectedSizeId;

        // If sizes are available but none selected, use first size
        if (availableSizes.length > 0 && !sizeId) {
          sizeId = availableSizes[0].id;

          // Update price based on first size
          const sizePrice = sizePrices.find((sp) => {
            const spSizeId = typeof sp.sizeId === 'object' ? sp.sizeId._id || sp.sizeId.id : sp.sizeId;
            return spSizeId === sizeId;
          });

          if (sizePrice) {
            data.price = sizePrice.actualPrice;
            data.priceSale = sizePrice.discountPrice || null;
          }
        }

        const cartItem = {
          ...data,
          size: sizeId ? availableSizes.find((s) => s.id === sizeId) : null,
          subtotal: data.price * data.quantity,
        };
        onAddCart?.(cartItem);
      }
      onGotoStep?.(0);
      router.push(paths.product.checkout);
    } catch (error) {
      console.error(error);
    }
  });

  const handleAddCart = useCallback(() => {
    try {
      // If sizes are available, ensure a size is selected
      if (availableSizes.length > 0 && !selectedSizeId) {
        // Auto-select first size if none selected
        const firstSizeId = availableSizes[0].id;
        setValue('selectedSize', firstSizeId);

        // Update price based on first size
        const sizePrice = sizePrices.find((sp) => {
          const spSizeId = typeof sp.sizeId === 'object' ? sp.sizeId._id || sp.sizeId.id : sp.sizeId;
          return spSizeId === firstSizeId;
        });

        if (sizePrice) {
          setValue('price', sizePrice.actualPrice);
          setValue('priceSale', sizePrice.discountPrice || null);
        }

        // Use first size for cart
        const cartItem = {
          ...values,
          size: availableSizes[0],
          price: sizePrice ? sizePrice.actualPrice : values.price,
          priceSale: sizePrice ? (sizePrice.discountPrice || null) : values.priceSale,
          subtotal: (sizePrice ? sizePrice.actualPrice : values.price) * values.quantity,
        };
        onAddCart?.(cartItem);

        // Reset quantity to 1
        setValue('quantity', 1);

        // Show success toast
        toast.success('Product added to cart successfully!');
        return;
      }

      // Build cart item
      const cartItem = {
        ...values,
        size: selectedSizeId ? availableSizes.find((s) => s.id === selectedSizeId) : null,
        subtotal: values.price * values.quantity,
      };
      onAddCart?.(cartItem);

      // Reset quantity to 1
      setValue('quantity', 1);

      // Show success toast
      toast.success('Product added to cart successfully!');
    } catch (error) {
      console.error(error);
      toast.error('Failed to add product to cart');
    }
  }, [onAddCart, values, selectedSizeId, availableSizes, sizePrices, setValue]);

  const renderPrice = (
    <Box sx={{ typography: 'h5' }}>
      {currentPrice.discountPrice && (
        <Box
          component="span"
          sx={{ color: 'text.disabled', textDecoration: 'line-through', mr: 0.5 }}
        >
          {fCurrency(currentPrice.actualPrice)}
        </Box>
      )}

      {fCurrency(currentPrice.discountPrice || currentPrice.actualPrice)}

      {currentPrice.discountPrice && (
        <Typography variant="caption" sx={{ ml: 1, color: 'success.main' }}>
          Save {fCurrency(currentPrice.actualPrice - currentPrice.discountPrice)}
        </Typography>
      )}
    </Box>
  );

  const renderShare = (
    <Stack spacing={2}>
      <Stack direction="row" alignItems="center" spacing={1.5}>
        <Iconify
          icon="solar:medal-ribbon-star-bold"
          width={20}
          sx={{ color: '#8B4513' }}
        />
        <Typography variant="body2" sx={{ color: '#8B4513' }}>
          No Artificial Flavours
        </Typography>
      </Stack>

      <Stack direction="row" alignItems="center" spacing={1.5}>
        <Iconify
          icon="solar:check-circle-bold"
          width={20}
          sx={{ color: '#8B4513' }}
        />
        <Typography variant="body2" sx={{ color: '#8B4513' }}>
          No Processed Sugar
        </Typography>
      </Stack>

      <Stack direction="row" alignItems="center" spacing={1.5}>
        <Iconify
          icon="solar:leaf-bold"
          width={20}
          sx={{ color: '#8B4513' }}
        />
        <Typography variant="body2" sx={{ color: '#8B4513' }}>
          No Chemicals
        </Typography>
      </Stack>
    </Stack>
  );


  const renderSizeSelection = availableSizes.length > 0 && (
    <Stack spacing={1}>
      <Typography variant="subtitle2">Size</Typography>
      <Stack direction="row" spacing={1} flexWrap="wrap">
        {availableSizes.map((size) => {
          const isSelected = selectedSizeId === size.id;
          return (
            <Button
              key={size.id}
              variant={isSelected ? 'contained' : 'outlined'}
              onClick={() => {
                setValue('selectedSize', isSelected ? null : size.id);
              }}
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
    </Stack>
  );

  const renderQuantity = (
    <Stack direction="row">
      <Typography variant="subtitle2" sx={{ flexGrow: 1 }}>
        Quantity
      </Typography>

      <Stack spacing={1}>
        <IncrementerButton
          name="quantity"
          quantity={values.quantity}
          disabledDecrease={values.quantity <= 1}
          disabledIncrease={false}
          onIncrease={() => setValue('quantity', values.quantity + 1)}
          onDecrease={() => setValue('quantity', values.quantity - 1)}
        />

        <Typography variant="caption" component="div" sx={{ textAlign: 'right' }}>
          Available: {available}
        </Typography>
      </Stack>
    </Stack>
  );

  const renderActions = (
    <Button
      fullWidth
      size="large"
      // color="warning"
      color="primary"
      variant="contained"
      startIcon={<Iconify icon="solar:cart-plus-bold" width={24} />}
      onClick={handleAddCart}
      sx={{ whiteSpace: 'nowrap' }}
    >
      Add to cart
    </Button>
  );

  const renderSubDescription = (
    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
      {subDescription}
    </Typography>
  );

  const renderRating = (
    <Stack direction="row" alignItems="center" sx={{ color: 'text.disabled', typography: 'body2' }}>
      <Rating
        size="small"
        value={totalRatings || 0}
        precision={0.1}
        readOnly
        sx={{
          mr: 1,
          '& .MuiRating-iconFilled': {
            color: 'primary.main',
          },
        }}
      />
      {`(${fShortenNumber(totalReviews || 0)} reviews)`}
    </Stack>
  );

  const renderLabels = (newLabel.enabled || saleLabel.enabled) && (
    <Stack direction="row" alignItems="center" spacing={1}>
      {newLabel.enabled && <Label color="info">{newLabel.content}</Label>}
      {saleLabel.enabled && <Label color="error">{saleLabel.content}</Label>}
    </Stack>
  );

  const renderInventoryType = (
    <Box
      component="span"
      sx={{
        typography: 'overline',
        color:
          (inventoryType === 'out of stock' && 'error.main') ||
          (inventoryType === 'low stock' && 'warning.main') ||
          'success.main',
      }}
    >
      {inventoryType}
    </Box>
  );

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Stack spacing={3} sx={{ pt: 3 }} {...other}>
        <Stack spacing={2} alignItems="flex-start">
          {renderLabels}

          {renderInventoryType}

          <Typography variant="h5">{name}</Typography>

          {/* {renderRating} */}

          {/* {renderPrice} */}

          {/* {renderSubDescription} */}
        </Stack>

        <Divider sx={{ borderStyle: 'dashed' }} />

        {renderSizeSelection}

        {renderSizeSelection && <Divider sx={{ borderStyle: 'dashed' }} />}

        {renderQuantity}

        {renderPrice}

        {renderRating}

        <Divider sx={{ borderStyle: 'dashed' }} />

        {renderActions}

        {renderShare}
      </Stack>
    </Form>
  );
}
