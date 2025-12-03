import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { useBoolean } from 'src/hooks/use-boolean';

import { AnimateLogo2 } from 'src/components/animate';
import { Form, Field } from 'src/components/hook-form';
import { Iconify } from 'src/components/iconify';

import { signUp } from 'src/auth/context/jwt';
import { useAuthContext } from 'src/auth/hooks';
import { SignUpSchema } from 'src/validations/user-validation-schema';

// ----------------------------------------------------------------------

export function SimpleSignUpView() {
  const { checkUserSession } = useAuthContext();
  const router = useRouter();
  const password = useBoolean();
  const [errorMsg, setErrorMsg] = useState('');

  const defaultValues = {
    username: '',
    firstName: '',
    lastName: '',
    email: '',
    mobile: '',
    password: '',
  };

  const methods = useForm({
    mode: 'onChange',
    resolver: zodResolver(SignUpSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      await signUp({
        username: data.username,
        email: data.email,
        mobile: data.mobile,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
      });

      // Redirect to verification sent page after successful registration
      const searchParams = new URLSearchParams({ email: data.email }).toString();
      const href = `${paths.auth.simple.verificationSent}?${searchParams}`;
      router.push(href);
    } catch (error) {
      console.error(error);
      setErrorMsg(error && error.message ? error.message : error);
    }
  });

  const renderLogo = <AnimateLogo2 sx={{ mb: 3, mx: 'auto' }} />;

  const renderHead = (
    <Stack alignItems="center" spacing={1.5} sx={{ mb: 5 }}>
      <Typography variant="h5" color="primary">Get started absolutely free</Typography>

      <Stack direction="row" spacing={0.5}>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Already have an account?
        </Typography>

        <Link component={RouterLink} href={paths.auth.simple.signIn} variant="subtitle2">
          Sign in
        </Link>
      </Stack>
    </Stack>
  );

  const renderForm = (
    <Stack spacing={3}>
      <Field.Text
        name="username"
        label="Username"
        placeholder="Choose a username"
        autoComplete="off"
      />

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <Field.Text name="firstName" label="First name" autoComplete="off" />
        <Field.Text name="lastName" label="Last name" autoComplete="off" />
      </Stack>

      <Field.Text name="email" label="Email address" type="email" autoComplete="off" />

      <Field.Text
        name="mobile"
        label="Mobile number"
        placeholder="10-15 digits"
        autoComplete="off"
      />

      <Field.Text
        name="password"
        label="Password"
        placeholder="6+ characters"
        type={password.value ? 'text' : 'password'}
        autoComplete="new-password"
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

      <LoadingButton
        fullWidth
        // color="inherit"
        color="primary"
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
        loadingIndicator="Create account..."
      >
        Create account
      </LoadingButton>
    </Stack>
  );

  const renderTerms = (
    <Typography
      component="div"
      sx={{
        mt: 3,
        textAlign: 'center',
        typography: 'caption',
        color: 'text.secondary',
      }}
    >
      {'By signing up, I agree to '}
      <Link underline="always"
      // color="text.primary"
      color="primary"
      >
        Terms of service
      </Link>
      {' and '}
      <Link underline="always"
      // color="text.primary"
      color="primary"
      >
        Privacy policy
      </Link>
      .
    </Typography>
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

      <Form methods={methods} onSubmit={onSubmit} autoComplete="off">
        {renderForm}
      </Form>

      {renderTerms}
    </>
  );
}

