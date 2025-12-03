import { SizeNewEditForm } from 'src/sections/dashboard/size/size-new-edit-form';
import { DashboardContent } from 'src/layouts/dashboard';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { paths } from 'src/routes/paths';

// ----------------------------------------------------------------------

export const metadata = { name: 'New Size' };

export default function Page() {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Create a new size"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Size', href: paths.admin.size.list },
          { name: 'New' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />
      <SizeNewEditForm />
    </DashboardContent>
  );
}

