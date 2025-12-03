import { useSearchParams } from 'react-router-dom';

import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { EmailInboxIcon } from 'src/assets/icons';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export function SimpleVerificationSentView() {
  const router = useRouter();
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email');

  const renderHead = (
    <>
      <EmailInboxIcon sx={{ mx: 'auto' }} />

      <Stack spacing={1} sx={{ mt: 3, mb: 5, textAlign: 'center', whiteSpace: 'pre-line' }}>
        <Typography variant="h5" color="primary">Please check your email!</Typography>

        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {email
            ? `We have sent a verification link to ${email}. \nPlease check your inbox or spam folder and click the verification link to verify your account.`
            : `We have sent a verification link to your email address. \nPlease check your inbox or spam folder and click the verification link to verify your account.`}
        </Typography>

        <Typography variant="body2" sx={{ color: 'text.secondary', mt: 2 }}>
          Once you verify your email, you can login to your account.
        </Typography>
      </Stack>
    </>
  );

  return (
    <>
      {renderHead}

      <Stack spacing={2} sx={{ mt: 3 }}>
        <Button
          component={RouterLink}
          href={paths.auth.simple.signIn}
          fullWidth
          size="large"
          variant="contained"
          color="primary"
          startIcon={<Iconify icon="eva:arrow-ios-back-fill" />}
        >
          Back to sign in
        </Button>

        <Typography variant="body2" sx={{ textAlign: 'center', color: 'text.secondary' }}>
          Didn&apos;t receive the email?{' '}
          <Link
            component="button"
            variant="subtitle2"
            onClick={() => router.push(paths.auth.simple.signIn)}
            sx={{ cursor: 'pointer', textDecoration: 'underline' }}
          >
            Try logging in
          </Link>
          {' '}to resend verification email.
        </Typography>
      </Stack>
    </>
  );
}

