import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { SizeNewEditForm } from 'src/sections/dashboard/size/size-new-edit-form';
import { DashboardContent } from 'src/layouts/dashboard';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { LoadingScreen } from 'src/components/loading-screen';
import { paths } from 'src/routes/paths';
import { fetchSizes } from 'src/store/slices/sizeSlice';

// ----------------------------------------------------------------------

export const metadata = { name: 'Edit Size' };

export default function Page() {
  const params = useParams();
  const dispatch = useDispatch();
  const { sizes, loading } = useSelector((state) => state.sizes);

  useEffect(() => {
    dispatch(fetchSizes());
  }, [dispatch]);

  const currentSize = sizes.find((s) => s.id === params.id);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Edit size"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Size', href: paths.admin.size.list },
          { name: currentSize?.title || 'Edit' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />
      <SizeNewEditForm currentSize={currentSize} />
    </DashboardContent>
  );
}

