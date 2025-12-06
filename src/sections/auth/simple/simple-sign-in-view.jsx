import { z as zod } from 'zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';

import { paths } from 'src/routes/paths';
import { useRouter, useSearchParams } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { useBoolean } from 'src/hooks/use-boolean';

import { AnimateLogo2 } from 'src/components/animate';
import { Form, Field } from 'src/components/hook-form';
import { Iconify } from 'src/components/iconify';

import { useAuthContext } from 'src/auth/hooks';
import { signInWithPassword, resendVerification } from 'src/auth/context/jwt';

// ----------------------------------------------------------------------

export const SignInSchema = zod.object({
  email: zod
    .string()
    .min(1, { message: 'Email is required!' })
    .email({ message: 'Email must be a valid email address!' }),
  password: zod
    .string()
    .min(1, { message: 'Password is required!' })
    .min(6, { message: 'Password must be at least 6 characters!' }),
});

// ----------------------------------------------------------------------

export function SimpleSignInView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { checkUserSession } = useAuthContext();
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isResending, setIsResending] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [showResendOption, setShowResendOption] = useState(false);
  const password = useBoolean();

  // Get returnUrl from query params
  const returnUrl = searchParams.get('returnUrl');

  const defaultValues = {
    email: 'admin@admin.in',
    password: '',
  };

  const methods = useForm({
    resolver: zodResolver(SignInSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      setErrorMsg('');
      setSuccessMsg('');
      setShowResendOption(false);
      const { user } = await signInWithPassword({
        email: data.email,
        password: data.password
      });
      await checkUserSession?.();

      // Addresses will be automatically fetched in AuthProvider's checkUserSession

      // If returnUrl is provided, redirect to that URL
      if (returnUrl) {
        router.push(returnUrl);
        return;
      }

      // Redirect based on user role
      const userRole = user?.role || 'User';
      if (userRole === 'Admin') {
        router.push(`${paths.admin.root}/dashboard`);
      } else {
        router.push('/home');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed. Please check your credentials.';
      setErrorMsg(errorMessage);

      // Check if error is about unverified account
      if (errorMessage.toLowerCase().includes('not verified') || errorMessage.toLowerCase().includes('verify')) {
        setShowResendOption(true);
        setUserEmail(data.email);
      }
    }
  });

  const handleResendVerification = async () => {
    if (!userEmail) {
      setErrorMsg('Please enter your email address to resend verification email.');
      return;
    }

    try {
      setIsResending(true);
      setErrorMsg('');
      setSuccessMsg('');
      const result = await resendVerification({ email: userEmail });
      setSuccessMsg(result.message || 'Verification email has been sent. Please check your inbox.');
      setShowResendOption(false);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to resend verification email.';
      setErrorMsg(errorMessage);
    } finally {
      setIsResending(false);
    }
  };

  const renderLogo = <AnimateLogo2 sx={{ mb: 3, mx: 'auto' }} />;

  const renderHead = (
    <Stack alignItems="center" spacing={1.5} sx={{ mb: 5 }}>
      <Typography variant="h5">Sign in to your account</Typography>

      <Stack direction="row" spacing={0.5}>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {`Don't have an account?`}
        </Typography>

        <Link component={RouterLink} href={paths.auth.simple.signUp} variant="subtitle2">
          Get started
        </Link>
      </Stack>
    </Stack>
  );

  const renderForm = (
    <Stack spacing={3}>
      <Field.Text
        name="email"
        label="Email address"
        placeholder="Enter your email address"
        InputLabelProps={{ shrink: true }}
      />

      <Stack spacing={1.5}>
        <Link
          component={RouterLink}
          href={paths.auth.simple.forgotPassword}
          variant="body2"
          // color="inherit"
          color="primary"
          sx={{ alignSelf: 'flex-end' }}
        >
          Forgot password?
        </Link>

        <Field.Text
          name="password"
          label="Password"
          placeholder="6+ characters"
          type={password.value ? 'text' : 'password'}
          InputLabelProps={{ shrink: true }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={password.onToggle} edge="end">
                  <Iconify icon={password.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Stack>

      <LoadingButton
        fullWidth
        // color="inherit"
        color="primary"
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
        loadingIndicator="Sign in..."
      >
        Sign in
      </LoadingButton>
    </Stack>
  );

  const renderTestCredentials = (
    <Card variant="outlined" sx={{ mt: 3, bgcolor: 'background.neutral' }}>
      <CardContent>
        <Stack spacing={1.5}>
          <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 0.5 }}>
            Development Credentials:
          </Typography>
          <Stack spacing={1}>
            <Typography variant="body2">
              <strong>Admin:</strong> email: <strong>admin@admin.in</strong> | password: <strong>Admin@123</strong>
            </Typography>
            <Typography variant="body2">
              <strong>User:</strong> email: <strong>user@user.in</strong> | password: <strong>User@123</strong>
            </Typography>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );

  return (
    <>
      {renderLogo}

      {renderHead}

      {!!errorMsg && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errorMsg}
        </Alert>
      )}

      {!!successMsg && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {successMsg}
        </Alert>
      )}

      {showResendOption && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          <Stack spacing={2}>
            <Typography variant="body2">
              Your account is not verified. A verification email has been sent to your email address.
            </Typography>
            {userEmail && (
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Didn&apos;t receive the email?
                </Typography>
                <Link
                  component="button"
                  variant="body2"
                  onClick={handleResendVerification}
                  disabled={isResending}
                  sx={{ cursor: 'pointer', textDecoration: 'underline' }}
                >
                  {isResending ? 'Sending...' : 'Resend verification email'}
                </Link>
              </Stack>
            )}
            <Button
              component={RouterLink}
              href={paths.auth.simple.verify}
              variant="outlined"
              size="small"
              sx={{ alignSelf: 'flex-start' }}
            >
              Go to verification page
            </Button>
          </Stack>
        </Alert>
      )}

      <Form methods={methods} onSubmit={onSubmit}>
        {renderForm}
      </Form>

      {renderTestCredentials}
    </>
  );
}

