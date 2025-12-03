import { z as zod } from 'zod';
import { useMemo, useState, useCallback, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import FormControlLabel from '@mui/material/FormControlLabel';
import LoadingButton from '@mui/lab/LoadingButton';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { Form, Field } from 'src/components/hook-form';
import { Upload } from 'src/components/upload';
import { createProduct, updateProduct } from 'src/store/slices/productSlice';
import { fetchCategories } from 'src/store/slices/categorySlice';
import { fetchUseCases } from 'src/store/slices/useCaseSlice';
import { fetchSizes } from 'src/store/slices/sizeSlice';
import { productService } from 'src/services/product.service';
import { CONFIG } from 'src/config-global';

// Helper to get full image URL
const getImageUrl = (imagePath) => {
  if (!imagePath) return '';

  // If already a full URL, return as is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://') || imagePath.startsWith('data:')) {
    return imagePath;
  }

  // Get base URL without /api
  const baseUrl = CONFIG.site.serverUrl.replace('/api', '');

  // If it's a relative path starting with /assets, prepend server base URL
  if (imagePath.startsWith('/assets')) {
    return `${baseUrl}${imagePath}`;
  }

  // If it's just a filename (no path), construct the full path
  if (imagePath && !imagePath.startsWith('/')) {
    return `${baseUrl}/assets/product/${imagePath}`;
  }

  // Otherwise return as is (for backward compatibility)
  return imagePath;
};

// ----------------------------------------------------------------------

export const NewProductSchema = zod.object({
  title: zod.string().min(1, { message: 'Title is required!' }),
  description: zod.string().min(1, { message: 'Description is required!' }),
  benefits: zod.string().optional(),
  ingredients: zod.string().optional(),
  storageConditions: zod.string().optional(),
  actualPrice: zod.number().min(0, { message: 'Actual price must be greater than or equal to 0' }),
  discountPrice: zod.number().optional(),
  isSale: zod.boolean().default(false),
  inStock: zod.boolean().default(true),
  categories: zod.array(zod.string()).min(1, { message: 'At least one category is required' }),
  useCases: zod.array(zod.string()).optional(),
  sizes: zod.array(zod.string()).optional(),
  sizePrices: zod.array(zod.object({
    sizeId: zod.string(),
    actualPrice: zod.number().min(0),
    discountPrice: zod.number().optional(),
  })).optional(),
});

// ----------------------------------------------------------------------

export function ProductNewEditForm({ currentProduct }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const { categories } = useSelector((state) => state.categories);
  const { useCases } = useSelector((state) => state.useCases);
  const { sizes } = useSelector((state) => state.sizes);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [originalImages, setOriginalImages] = useState([]); // Store original images with IDs
  const [deletedImageIds, setDeletedImageIds] = useState([]); // Track deleted image IDs

  // Fetch categories, use cases, and sizes on mount
  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchUseCases());
    dispatch(fetchSizes());
  }, [dispatch]);

  const defaultValues = useMemo(
    () => ({
      title: currentProduct?.title || '',
      description: currentProduct?.description || '',
      benefits: currentProduct?.benefits || '',
      ingredients: currentProduct?.ingredients || '',
      storageConditions: currentProduct?.storageConditions || '',
      actualPrice: currentProduct?.actualPrice || 0,
      discountPrice: currentProduct?.discountPrice || undefined,
      isSale: currentProduct?.isSale ?? false,
      inStock: currentProduct?.inStock ?? true,
      categories: currentProduct?.categories?.map((cat) => (typeof cat === 'object' ? cat._id || cat.id : cat)) || [],
      useCases: currentProduct?.useCases?.map((uc) => (typeof uc === 'object' ? uc._id || uc.id : uc)) || [],
      sizes: currentProduct?.sizes?.map((size) => (typeof size === 'object' ? size._id || size.id : size)) || [],
      sizePrices: currentProduct?.sizePrices?.map((sp) => ({
        sizeId: typeof sp.sizeId === 'object' ? sp.sizeId._id || sp.sizeId.id : sp.sizeId,
        actualPrice: sp.actualPrice || 0,
        discountPrice: sp.discountPrice || undefined,
      })) || [],
    }),
    [currentProduct]
  );

  const methods = useForm({
    mode: 'onSubmit',
    resolver: zodResolver(NewProductSchema),
    defaultValues,
  });

  const {
    reset,
    setValue,
    watch,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  // Set preview images when currentProduct changes (separate effect for images)
  useEffect(() => {
    if (currentProduct?.id && currentProduct?.images) {
      // Set preview images from existing product images
      if (currentProduct.images && currentProduct.images.length > 0) {
        // Store original images with IDs (keep original path for deletion tracking)
        const originalImagesData = currentProduct.images.map((img) => {
          if (typeof img === 'object') {
            const imagePath = img.image || img;
            // If it's already a full URL (Cloudinary), use it directly
            const imageUrl = imagePath.startsWith('http://') || imagePath.startsWith('https://')
              ? imagePath
              : getImageUrl(imagePath);
            return {
              id: img._id || img.id,
              image: imagePath, // Store original path
              imageUrl, // Store full URL for preview
            };
          }
          const imagePath = img;
          // If it's already a full URL (Cloudinary), use it directly
          const imageUrl = imagePath.startsWith('http://') || imagePath.startsWith('https://')
            ? imagePath
            : getImageUrl(imagePath);
          return {
            id: null,
            image: imagePath, // Store original path
            imageUrl, // Store full URL for preview
          };
        });
        setOriginalImages(originalImagesData);

        // Use full URLs for preview - these will be passed to Upload component
        const imageUrls = originalImagesData
          .map((img) => img.imageUrl)
          .filter(Boolean);
        console.log('Setting preview images:', imageUrls.length, 'images', imageUrls);
        setPreviewImages(imageUrls);
      } else {
        console.log('No images found in product');
        setPreviewImages([]);
        setOriginalImages([]);
      }
    } else if (!currentProduct?.id) {
      setPreviewImages([]);
      setOriginalImages([]);
    }
    // Reset deleted image IDs when product changes
    setDeletedImageIds([]);
  }, [currentProduct?.id, currentProduct?.images]);

  // Reset form and preview when currentProduct changes
  useEffect(() => {
    if (currentProduct?.id) {
      reset({
        title: currentProduct.title || '',
        description: currentProduct.description || '',
        benefits: currentProduct.benefits || '',
        ingredients: currentProduct.ingredients || '',
        storageConditions: currentProduct.storageConditions || '',
        actualPrice: currentProduct.actualPrice || 0,
        discountPrice: currentProduct.discountPrice || undefined,
        isSale: currentProduct.isSale ?? false,
        inStock: currentProduct.inStock ?? true,
        categories: currentProduct.categories?.map((cat) => (typeof cat === 'object' ? cat._id || cat.id : cat)) || [],
        useCases: currentProduct.useCases?.map((uc) => (typeof uc === 'object' ? uc._id || uc.id : uc)) || [],
        sizes: currentProduct.sizes?.map((size) => (typeof size === 'object' ? size._id || size.id : size)) || [],
        sizePrices: currentProduct.sizePrices?.map((sp) => ({
          sizeId: typeof sp.sizeId === 'object' ? sp.sizeId._id || sp.sizeId.id : sp.sizeId,
          actualPrice: sp.actualPrice || 0,
          discountPrice: sp.discountPrice || undefined,
        })) || [],
      });
      setSelectedFiles([]);
      setDeletedImageIds([]);
    } else {
      reset({
        title: '',
        description: '',
        benefits: '',
        ingredients: '',
        storageConditions: '',
        actualPrice: 0,
        discountPrice: undefined,
        isSale: false,
        inStock: true,
        categories: [],
        useCases: [],
        sizes: [],
        sizePrices: [],
      });
      setPreviewImages([]);
      setSelectedFiles([]);
      setDeletedImageIds([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentProduct?.id, reset]);

  // Handle multiple files drop from Upload component
  const handleDrop = useCallback(
    (acceptedFiles) => {
      const newFiles = acceptedFiles.filter((file) => {
        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          toast.error(`Image ${file.name} size should be less than 5MB`);
          return false;
        }
        return true;
      });

      if (newFiles.length === 0) return;

      setSelectedFiles((prev) => [...prev, ...newFiles]);
      setValue('images', 'files-selected', { shouldValidate: true });
    },
    [setValue]
  );

  // Handle file remove
  const handleRemove = useCallback((file) => {
    // Check if it's a File object (new file) or a string (existing image URL)
    if (file instanceof File) {
      setSelectedFiles((prev) => prev.filter((f) => f !== file));
    } else {
      // It's an existing image (full URL), find and track deletion
      // Match by imageUrl (full URL) since preview uses full URLs
      const originalImage = originalImages.find((img) => img.imageUrl === file);
      if (originalImage && originalImage.id) {
        // Track this image ID for deletion
        setDeletedImageIds((prev) => [...prev, originalImage.id]);
      }
      setPreviewImages((prev) => prev.filter((img) => img !== file));
    }
  }, [originalImages]);

  // Handle remove all
  const handleRemoveAll = useCallback(() => {
    // Track all original image IDs for deletion
    const allImageIds = originalImages.filter((img) => img.id).map((img) => img.id);
    setDeletedImageIds((prev) => [...prev, ...allImageIds]);
    setSelectedFiles([]);
    setPreviewImages([]);
    setValue('images', '', { shouldValidate: true });
  }, [setValue, originalImages]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      // Validate: if sizes selected, sizePrices must have values
      if (data.sizes && data.sizes.length > 0) {
        if (!data.sizePrices || data.sizePrices.length === 0) {
          toast.error('Please set prices for selected sizes');
          return;
        }
        // Validate each size has a price
        const missingPrices = data.sizes.filter((sizeId) => {
          const hasPrice = data.sizePrices?.some((sp) => sp.sizeId === sizeId && sp.actualPrice > 0);
          return !hasPrice;
        });
        if (missingPrices.length > 0) {
          toast.error('Please set actual price for all selected sizes');
          return;
        }
      }

      // No sizes selected, validate normal prices
      if ((!data.sizes || data.sizes.length === 0) && (!data.actualPrice || data.actualPrice <= 0)) {
        toast.error('Please enter a valid actual price');
        return;
      }

      // Create FormData to send files
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('description', data.description);
      formData.append('benefits', data.benefits || '');
      formData.append('ingredients', data.ingredients || '');
      formData.append('storageConditions', data.storageConditions || '');
      formData.append('isSale', data.isSale.toString());
      formData.append('inStock', data.inStock.toString());
      formData.append('categories', JSON.stringify(data.categories));
      // Always send useCases, even if empty (for clearing on update)
      formData.append('useCases', JSON.stringify(data.useCases || []));

      // If sizes are selected, use size-specific prices, otherwise use normal prices
      if (data.sizes && data.sizes.length > 0) {
        formData.append('sizes', JSON.stringify(data.sizes));
        // Send sizePrices when sizes are selected
        if (data.sizePrices && data.sizePrices.length > 0) {
          formData.append('sizePrices', JSON.stringify(data.sizePrices));
        }
        // Also send base actualPrice (can be used as default/fallback)
        formData.append('actualPrice', (data.actualPrice || 0).toString());
        if (data.discountPrice !== undefined && data.discountPrice !== null) {
          formData.append('discountPrice', data.discountPrice.toString());
        }
      } else {
        // No sizes selected, use normal prices
        formData.append('actualPrice', data.actualPrice.toString());
        if (data.discountPrice !== undefined && data.discountPrice !== null) {
          formData.append('discountPrice', data.discountPrice.toString());
        }
      }

      // Append new image files
      selectedFiles.forEach((file) => {
        formData.append('images', file);
      });

      // Append deleted image IDs if any
      if (currentProduct && deletedImageIds.length > 0) {
        formData.append('deletedImageIds', JSON.stringify(deletedImageIds));
      }

      if (currentProduct) {
        // Delete images first if any are marked for deletion
        if (deletedImageIds.length > 0) {
          try {
            await Promise.all(
              deletedImageIds.map((imageId) =>
                productService.deleteProductImage(imageId).catch((err) => {
                  console.error(`Failed to delete image ${imageId}:`, err);
                  // Continue even if one deletion fails
                })
              )
            );
          } catch (error) {
            console.error('Error deleting images:', error);
            // Continue with update even if image deletion fails
          }
        }

        await dispatch(updateProduct({ id: currentProduct.id, productData: formData })).unwrap();
        toast.success('Product updated successfully!');
      } else {
        if (selectedFiles.length === 0) {
          toast.error('Please select at least one image');
          return;
        }
        await dispatch(createProduct(formData)).unwrap();
        toast.success('Product created successfully!');
      }
      router.push(paths.admin.product.list);
    } catch (error) {
      const errorMessage = error || 'Failed to save product';
      toast.error(errorMessage);
      console.error('Error saving product:', error);
    }
  });

  const values = watch();
  const selectedSizes = watch('sizes') || [];

  // Handle size selection change - initialize sizePrices for new sizes
  useEffect(() => {
    const currentSizePrices = values.sizePrices || [];

    // Create a map of existing prices by sizeId
    const priceMap = new Map();
    currentSizePrices.forEach((sp) => {
      priceMap.set(sp.sizeId, sp);
    });

    // Build new array maintaining selectedSizes order
    const newSizePrices = selectedSizes.map((sizeId) => {
      const existing = priceMap.get(sizeId);
      if (existing) {
        return existing;
      }
      return {
        sizeId,
        actualPrice: 0,
        discountPrice: undefined,
      };
    });

    // Only update if there's a change
    if (JSON.stringify(newSizePrices) !== JSON.stringify(currentSizePrices)) {
      setValue('sizePrices', newSizePrices, { shouldValidate: false });
    }
  }, [selectedSizes, setValue, values.sizePrices]);

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Stack spacing={3}>
              <Field.Text name="title" label="Title" />

                    <Stack spacing={1.5}>
                      <Typography variant="subtitle2">Description</Typography>
                      <Field.Editor name="description" placeholder="Write product description..." sx={{ minHeight: 300 }} />
                    </Stack>

                    <Stack spacing={1.5}>
                      <Typography variant="subtitle2">Benefits</Typography>
                      <Field.Editor name="benefits" placeholder="Write product benefits..." sx={{ minHeight: 250 }} />
                    </Stack>

                    <Stack spacing={1.5}>
                      <Typography variant="subtitle2">Ingredients</Typography>
                      <Field.Editor name="ingredients" placeholder="Write product ingredients..." sx={{ minHeight: 250 }} />
                    </Stack>

                    <Stack spacing={1.5}>
                      <Typography variant="subtitle2">Storage Conditions</Typography>
                      <Field.Editor name="storageConditions" placeholder="Write storage conditions..." sx={{ minHeight: 250 }} />
                    </Stack>

              {/* Show normal prices only if no sizes are selected */}
              {selectedSizes.length === 0 && (
                <Stack direction="row" spacing={2}>
                  <Field.Text name="actualPrice" label="Actual Price" type="number" />
                  <Field.Text name="discountPrice" label="Discount Price (Optional)" type="number" />
                </Stack>
              )}

              <Stack direction="row" spacing={2}>
                <Box sx={{ flex: 1 }}>
                  <Field.MultiSelect
                    name="categories"
                    chip
                    checkbox
                    label="Select Categories"
                    fullWidth
                    showSelectAll
                    options={categories.map((category) => ({
                      value: category.id,
                      label: category.title,
                    }))}
                  />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Field.MultiSelect
                    name="useCases"
                    chip
                    checkbox
                    label="Select Use Cases"
                    fullWidth
                    showSelectAll
                    options={useCases.map((useCase) => ({
                      value: useCase.id,
                      label: useCase.title,
                    }))}
                  />
                </Box>
              </Stack>

              <Box>
                <Field.MultiSelect
                  name="sizes"
                  chip
                  checkbox
                  label="Select Sizes"
                  fullWidth
                  showSelectAll
                  onSelectAll={() => {
                    const currentSizes = watch('sizes') || [];
                    const allSizeIds = sizes.map((size) => size.id);
                    const allSelected = sizes.length > 0 && sizes.every((size) => currentSizes.includes(size.id));

                    if (allSelected) {
                      setValue('sizes', [], { shouldValidate: true });
                      setValue('sizePrices', [], { shouldValidate: true });
                    } else {
                      setValue('sizes', allSizeIds, { shouldValidate: true });
                    }
                  }}
                  options={sizes.map((size) => ({
                    value: size.id,
                    label: size.title,
                  }))}
                />
              </Box>

              {/* Size-specific prices */}
              {selectedSizes.length > 0 && (
                <Box>
                  <Typography variant="subtitle2" sx={{ mb: 2 }}>
                    Size-Specific Prices
                  </Typography>
                  <Stack spacing={2}>
                    {selectedSizes.map((sizeId, index) => {
                      const size = sizes.find((s) => s.id === sizeId);

                      return (
                        <Card key={sizeId} sx={{ p: 2 }}>
                          <Typography variant="subtitle2" sx={{ mb: 2 }}>
                            {size?.title || 'Unknown Size'}
                          </Typography>
                          <Stack direction="row" spacing={2}>
                            <Field.Text
                              name={`sizePrices.${index}.actualPrice`}
                              label="Actual Price"
                              type="number"
                              sx={{ flex: 1 }}
                            />
                            <Field.Text
                              name={`sizePrices.${index}.discountPrice`}
                              label="Discount Price (Optional)"
                              type="number"
                              sx={{ flex: 1 }}
                            />
                          </Stack>
                        </Card>
                      );
                    })}
                  </Stack>
                </Box>
              )}

              <Box>
                <Typography variant="subtitle2" sx={{ mb: 2 }}>
                  Images
                </Typography>
                <Upload
                  multiple
                  value={
                    selectedFiles.length > 0 || previewImages.length > 0
                      ? [...selectedFiles, ...previewImages]
                      : null
                  }
                  onDrop={handleDrop}
                  onRemove={handleRemove}
                  onRemoveAll={handleRemoveAll}
                  maxSize={5 * 1024 * 1024} // 5MB
                  accept={{
                    'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
                  }}
                  thumbnail
                />
                {/* Debug info - remove after testing */}
                {process.env.NODE_ENV === 'development' && (
                  <Typography variant="caption" sx={{ color: 'text.secondary', mt: 1, display: 'block' }}>
                    Preview Images: {previewImages.length}, Selected Files: {selectedFiles.length}
                  </Typography>
                )}
              </Box>
            </Stack>
          </Card>
        </Grid>

        <Grid xs={12} md={4}>
          <Stack spacing={3} sx={{ position: 'sticky', top: 24, alignSelf: 'flex-start' }}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={3}>
                <FormControlLabel
                  control={
                    <Controller
                      name="isSale"
                      control={methods.control}
                      render={({ field }) => <Switch {...field} checked={field.value} />}
                    />
                  }
                  label="On Sale"
                />

                <FormControlLabel
                  control={
                    <Controller
                      name="inStock"
                      control={methods.control}
                      render={({ field }) => <Switch {...field} checked={field.value} />}
                    />
                  }
                  label="In Stock"
                />
              </Stack>
            </Card>

            <Stack direction="row" spacing={1.5}>
              <Button
                fullWidth
                // color="inherit"
                color="primary"
                variant="outlined"
                size="large"
                onClick={() => router.back()}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <LoadingButton
                type="submit"
                variant="contained"
                size="large"
                loading={isSubmitting}
                fullWidth
                disabled={isSubmitting}
                color="primary"
              >
                {!currentProduct ? 'Create' : 'Save Changes'}
              </LoadingButton>
            </Stack>
          </Stack>
        </Grid>
      </Grid>
    </Form>
  );
}
