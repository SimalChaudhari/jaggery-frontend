import { z as zod } from 'zod';
import { useMemo } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2';
import LoadingButton from '@mui/lab/LoadingButton';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { toast } from 'src/components/snackbar';
import { Form, Field, RHFUpload } from 'src/components/hook-form';
import { createUseCase, updateUseCase } from 'src/store/slices/useCaseSlice';

// ----------------------------------------------------------------------

export const NewUseCaseSchema = zod.object({
  title: zod.string().min(1, { message: 'Title is required!' }),
  image: zod.any().refine((val) => val !== null && val !== undefined, {
    message: 'Image is required!',
  }),
});

// ----------------------------------------------------------------------

export function UseCaseNewEditForm({ currentUseCase }) {
  const dispatch = useDispatch();
  const router = useRouter();

  const defaultValues = useMemo(
    () => ({
      title: currentUseCase?.title || '',
      image: currentUseCase?.image || null,
    }),
    [currentUseCase]
  );

  // Dynamic schema - image required only for new use cases
  const schema = useMemo(
    () =>
      zod.object({
        title: zod.string().min(1, { message: 'Title is required!' }),
        image: currentUseCase
          ? zod.any().optional() // Optional for edit
          : zod.any().refine((val) => val !== null && val !== undefined, {
            message: 'Image is required!',
          }), // Required for create
      }),
    [currentUseCase]
  );

  const methods = useForm({
    mode: 'onSubmit',
    resolver: zodResolver(schema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('title', data.title);

      // Only append image if it's a File object (new upload)
      // If it's a string (existing URL), don't send it - backend will keep existing image
      if (data.image instanceof File) {
        formData.append('image', data.image);
      }

      // For new use case, image is required
      if (!currentUseCase && !(data.image instanceof File)) {
        toast.error('Image is required');
        return;
      }

      if (currentUseCase) {
        await dispatch(updateUseCase({ id: currentUseCase.id, formData })).unwrap();
        toast.success('Use case updated successfully!');
      } else {
        await dispatch(createUseCase(formData)).unwrap();
        toast.success('Use case created successfully!');
      }
      router.push(paths.admin.useCase.list);
    } catch (error) {
      const errorMessage = error || 'Failed to save use case';
      toast.error(errorMessage);
      console.error('Error saving use case:', error);
    }
  });

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Stack spacing={3}>
              <Field.Text name="title" label="Title" />

              <RHFUpload
                name="image"
                label="Image"
                helperText="Upload use case image (JPG, PNG, etc.)"
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
              {!currentUseCase ? 'Create' : 'Save Changes'}
            </LoadingButton>
          </Stack>
        </Grid>
      </Grid>
    </Form>
  );
}

