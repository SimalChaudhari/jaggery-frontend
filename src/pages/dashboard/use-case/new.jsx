import { UseCaseNewEditForm } from 'src/sections/dashboard/use-case/use-case-new-edit-form';
import { DashboardContent } from 'src/layouts/dashboard';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { paths } from 'src/routes/paths';

// ----------------------------------------------------------------------

export const metadata = { name: 'New Use Case' };

export default function Page() {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Create a new use case"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Use Case', href: paths.admin.useCase.list },
          { name: 'New' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />
      <UseCaseNewEditForm />
    </DashboardContent>
  );
}

