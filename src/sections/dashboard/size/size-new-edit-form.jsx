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
import { Form, Field } from 'src/components/hook-form';
import { createSize, updateSize } from 'src/store/slices/sizeSlice';

// ----------------------------------------------------------------------

export const NewSizeSchema = zod.object({
  title: zod.string().min(1, { message: 'Title is required!' }),
});

// ----------------------------------------------------------------------

export function SizeNewEditForm({ currentSize }) {
  const dispatch = useDispatch();
  const router = useRouter();

  const defaultValues = useMemo(
    () => ({
      title: currentSize?.title || '',
    }),
    [currentSize]
  );

  const methods = useForm({
    mode: 'onSubmit',
    resolver: zodResolver(NewSizeSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (currentSize) {
        await dispatch(updateSize({ id: currentSize.id, data })).unwrap();
        toast.success('Size updated successfully!');
      } else {
        await dispatch(createSize(data)).unwrap();
        toast.success('Size created successfully!');
      }
      router.push(paths.admin.size.list);
    } catch (error) {
      const errorMessage = error || 'Failed to save size';
      toast.error(errorMessage);
      console.error('Error saving size:', error);
    }
  });

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Stack spacing={3}>
              <Field.Text name="title" label="Title" />
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
              {!currentSize ? 'Create' : 'Save Changes'}
            </LoadingButton>
          </Stack>
        </Grid>
      </Grid>
    </Form>
  );
}

