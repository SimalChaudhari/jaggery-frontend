import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { UseCaseNewEditForm } from 'src/sections/dashboard/use-case/use-case-new-edit-form';
import { DashboardContent } from 'src/layouts/dashboard';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { LoadingScreen } from 'src/components/loading-screen';
import { paths } from 'src/routes/paths';
import { fetchUseCases } from 'src/store/slices/useCaseSlice';

// ----------------------------------------------------------------------

export const metadata = { name: 'Edit Use Case' };

export default function Page() {
  const params = useParams();
  const dispatch = useDispatch();
  const { useCases, loading } = useSelector((state) => state.useCases);

  useEffect(() => {
    dispatch(fetchUseCases());
  }, [dispatch]);

  const currentUseCase = useCases.find((uc) => uc.id === params.id);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Edit use case"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Use Case', href: paths.admin.useCase.list },
          { name: currentUseCase?.title || 'Edit' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />
      <UseCaseNewEditForm currentUseCase={currentUseCase} />
    </DashboardContent>
  );
}

