import { useState, useEffect } from 'react';

import { paths } from 'src/routes/paths';
import { useRouter, useSearchParams } from 'src/routes/hooks';

import { CONFIG } from 'src/config-global';

import { SplashScreen } from 'src/components/loading-screen';

import { useAuthContext } from '../hooks';

// ----------------------------------------------------------------------

export function GuestGuard({ children }) {
  const router = useRouter();

  const searchParams = useSearchParams();

  const { loading, authenticated, user } = useAuthContext();

  const [isChecking, setIsChecking] = useState(true);

  const checkPermissions = async () => {
    if (loading) {
      return;
    }

    if (authenticated) {
      // Get returnTo from URL or redirect based on role
      const returnTo = searchParams.get('returnTo');

      if (returnTo) {
        router.replace(returnTo);
      } else {
        // Redirect based on user role
        const userRole = user?.role || 'User';
        if (userRole === 'Admin') {
          router.replace(`${paths.admin.root}/dashboard`);
        } else {
          router.replace('/home');
        }
      }
      return;
    }

    setIsChecking(false);
  };

  useEffect(() => {
    checkPermissions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authenticated, loading]);

  if (isChecking) {
    return <SplashScreen />;
  }

  return <>{children}</>;
}
