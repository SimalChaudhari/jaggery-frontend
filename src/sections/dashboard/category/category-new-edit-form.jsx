import { useMemo, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2';
import MenuItem from '@mui/material/MenuItem';
import LoadingButton from '@mui/lab/LoadingButton';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { toast } from 'src/components/snackbar';
import { Form, Field, RHFUpload } from 'src/components/hook-form';
import { createCategory, updateCategory, fetchCategories } from 'src/store/slices/categorySlice';
import { CategorySchema, CategoryEditSchema } from 'src/validations/category-validation-schema';

// ----------------------------------------------------------------------

export function CategoryNewEditForm({ currentCategory }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const { categories } = useSelector((state) => state.categories);

  // Fetch categories for parent category dropdown
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const defaultValues = useMemo(
    () => {
      // Extract parentCategory ID - it could be an object with id property or a string
      let parentCategoryId = '';
      if (currentCategory?.parentCategory) {
        if (typeof currentCategory.parentCategory === 'object' && currentCategory.parentCategory.id) {
          parentCategoryId = currentCategory.parentCategory.id;
        } else if (typeof currentCategory.parentCategory === 'string') {
          parentCategoryId = currentCategory.parentCategory;
        }
      }

      return {
        title: currentCategory?.title || '',
        description: currentCategory?.description || '',
        parentCategory: parentCategoryId,
        image: currentCategory?.image || null,
      };
    },
    [currentCategory]
  );

  // Use appropriate schema based on create/edit
  const schema = currentCategory ? CategoryEditSchema : CategorySchema;

  const methods = useForm({
    mode: 'onTouched',
    reValidateMode: 'onBlur',
    shouldFocusError: true,
    resolver: zodResolver(schema),
    defaultValues,
  });

  const {
    handleSubmit,
    watch,
    formState: { isSubmitting },
  } = methods;

  const imageValue = watch('image');

  const onSubmit = handleSubmit(async (data) => {
    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('description', data.description);

      // Append parentCategory (empty string to clear, or ID to set)
      // If parentCategory is selected, this category becomes a subcategory
      // If not selected, this category is a parent category
      if (currentCategory) {
        // For updates, always send parentCategory (even if empty to clear it)
        formData.append('parentCategory', data.parentCategory || '');
      } else if (data.parentCategory) {
        // For creates, only send if provided
        formData.append('parentCategory', data.parentCategory);
      }

      // Only append image if it's a File object (new upload)
      // If it's a string (existing URL), don't send it - backend will keep existing image
      if (data.image instanceof File) {
        formData.append('image', data.image);
      }

      // For new category, image is required
      if (!currentCategory && !(data.image instanceof File)) {
        toast.error('Image is required');
        return;
      }

      if (currentCategory) {
        await dispatch(updateCategory({ id: currentCategory.id, formData })).unwrap();
        toast.success('Category updated successfully!');
      } else {
        await dispatch(createCategory(formData)).unwrap();
        toast.success('Category created successfully!');
      }
      router.push(paths.admin.category.list);
    } catch (error) {
      const errorMessage = error || 'Failed to save category';
      toast.error(errorMessage);
      console.error('Error saving category:', error);
    }
  });

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Stack spacing={3}>
              <Field.Text name="title" label="Title" />

              <Field.Text
                name="description"
                label="Description"
                multiline
                rows={4}
              />

              <Field.Select
                name="parentCategory"
                label="Parent Category"
                helperText="Select a parent category to make this a subcategory. Leave empty to make this a parent category."
              >
                <MenuItem value="">
                  <em>None (This will be a parent category)</em>
                </MenuItem>
                {categories
                  .filter((cat) => !currentCategory || cat.id !== currentCategory.id)
                  .map((category) => (
                    <MenuItem key={category.id} value={category.id}>
                      {category.title}
                    </MenuItem>
                  ))}
              </Field.Select>

              <RHFUpload
                name="image"
                label="Image"
                helperText="Upload category image (JPG, PNG, etc.)"
                thumbnail
              />
            </Stack>
          </Card>
        </Grid>

        <Grid xs={12} md={4}>
          <Stack direction="row" spacing={1.5} sx={{ position: 'sticky', top: 24 }}>
            <Button fullWidth
            // color="inherit"
            color="primary"
            variant="outlined" size="large" onClick={() => router.back()}>
              Cancel
            </Button>
            <LoadingButton type="submit" variant="contained" color="primary" size="large" loading={isSubmitting} fullWidth>
              {!currentCategory ? 'Create' : 'Save Changes'}
            </LoadingButton>
          </Stack>
        </Grid>
      </Grid>
    </Form>
  );
}

