import Button from '@mui/material/Button';

import { RouterLink } from 'src/routes/components';

import { CONFIG } from 'src/config-global';

import { useAuthContext } from 'src/auth/hooks';
import { AccountDrawer } from './account-drawer';

// ----------------------------------------------------------------------

export function SignInButton({ sx, data, ...other }) {
  const { authenticated, user } = useAuthContext();

  // If authenticated, show account drawer instead of sign in button
  if (authenticated) {
    return <AccountDrawer data={data} sx={sx} {...other} />;
  }

  // If not authenticated, show sign in button
  return (
    <Button
      component={RouterLink}
      href={CONFIG.auth.redirectPath}
      variant="outlined"
      sx={sx}
      {...other}
    >
      Sign in
    </Button>
  );
}
