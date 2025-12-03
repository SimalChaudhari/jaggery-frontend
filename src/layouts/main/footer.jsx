import React from 'react';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Unstable_Grid2';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import { RouterLink } from 'src/routes/components';
import { DashboardContent } from '../dashboard';
import { Container } from '@mui/material';
import { Iconify } from 'src/components/iconify';
import { Image } from 'src/components/image';
import { paths } from 'src/routes/paths';

// ----------------------------------------------------------------------

const FOOTER_LINKS = [
  { label: 'Community', path: '/community', external: false },
  { label: 'Affiliates', path: '/affiliate-program', external: false },
  { label: 'Support', path: 'https://help.skool.com/', external: true },
  { label: 'Careers', path: '/careers', external: false },
];

// ----------------------------------------------------------------------

const PAGE_LINKS = [
  { label: 'Home', path: paths.home },
  { label: 'About Us', path: paths.about },
  { label: 'Shop', path: paths.product.root },
  { label: 'Contact Us', path: paths.contact },
  { label: 'My account', path: paths.dashboard.root },
];

const POLICY_LINKS = [
  { label: 'Privacy Policy', href: '#' },
  { label: 'Terms of Use', href: '#' },
  { label: 'Shipping & Return Policy', href: '#' },
  { label: 'Disclaimer', href: '#' },
];

export function Footer({ layoutQuery, sx }) {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = React.useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    // Handle subscription logic here
    console.log('Subscribe:', email);
    setEmail('');
  };

  return (
    <Box
      component="footer"
      sx={{
        mt: 8,
        bgcolor: '#8D0505',
        color: 'common.white',
        ...sx,
      }}
    >
      <DashboardContent
        sx={{
          py: { xs: 4, md: 6 },
        }}
      >
        {/* Logo */}
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Link
            component={RouterLink}
            href={paths.home}
            sx={{
              textDecoration: 'none',
              display: 'inline-block',
            }}
          >
            <Image
              src="https://gudworld.in/cdn/shop/files/gudworld_logo_2_4x_ec49e954-771b-4509-b5b8-0a746d972570_compact.png?v=1667910889"
              alt="Gudworld Logo"
              sx={{
                // height: { xs: 40, md: 60 },
                width: 'auto',
              }}
            />
          </Link>
          <Typography
            variant="body1"
            sx={{
              color: 'common.white',
              fontStyle: 'italic',
              my: 5,
              fontSize: { xs: '0.875rem', md: '1.5rem' },
              fontWeight: 600,
            }}
          >
            &quot;No more sugar coating from now on, enjoy the real deal with GudWorld!&quot;
          </Typography>
        </Box>

        {/* Main Content - Three Columns */}
        <Grid container spacing={4} sx={{ mb: 4 }}>
          {/* Left Column - Contact Information */}
          <Grid xs={12} md={4}>
            <Stack spacing={2}>
              <Stack direction="row" spacing={1.5} alignItems="flex-start">
                <Iconify icon="solar:map-point-bold" width={20} sx={{ color: 'common.white', mt: 0.5, flexShrink: 0 }} />
                <Typography variant="body2" sx={{ color: 'common.white' }}>
                  Panchaganga Farm Solutions Pvt Ltd, B-12 Part 2, MIDC, Waluj, Chhatrapati Sambhajinagar, 431136
                  Maharashtra, India
                </Typography>
              </Stack>
              <Stack direction="row" spacing={1.5} alignItems="center">
                <Iconify icon="solar:phone-bold" width={20} sx={{ color: 'common.white', flexShrink: 0 }} />
                <Typography variant="body2" sx={{ color: 'common.white' }}>
                  Phone : +91 8010906093
                </Typography>
              </Stack>
              <Stack direction="row" spacing={1.5} alignItems="center">
                <Iconify icon="solar:letter-bold" width={20} sx={{ color: 'common.white', flexShrink: 0 }} />
                <Typography variant="body2" sx={{ color: 'common.white' }}>
                  Mail address : care@gudworld.in
                </Typography>
              </Stack>
            </Stack>
          </Grid>

          {/* Middle Column - Pages */}
          <Grid xs={12} md={4}>
            <Stack spacing={2}>
              <Typography variant="h6" sx={{ color: 'common.white', fontWeight: 'bold' }}>
                Pages
              </Typography>
              <Stack spacing={1.5}>
                {PAGE_LINKS.map((link) => (
                  <Link
                    key={link.label}
                    component={RouterLink}
                    href={link.path}
                    sx={{
                      color: 'common.white',
                      textDecoration: 'none',
                      fontSize: '0.875rem',
                      '&:hover': {
                        textDecoration: 'underline',
                      },
                    }}
                  >
                    {link.label}
                  </Link>
                ))}
              </Stack>
            </Stack>
          </Grid>

          {/* Right Column - Newsletter & Social Media */}
          <Grid xs={12} md={4}>
            <Stack spacing={3}>
              {/* Newsletter */}
              <Box>
                <Typography variant="body2" sx={{ color: 'common.white', mb: 2 }}>
                  Subscribe to our newsletter for all the new launches and offers!
                </Typography>
                <Box component="form" onSubmit={handleSubscribe}>
                  <Stack direction="row" spacing={0} sx={{ alignItems: 'stretch' }}>
                    <TextField
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      size="small"
                      sx={{
                        flex: '1 1 auto',
                        minWidth: 0,
                        '& .MuiOutlinedInput-root': {
                          bgcolor: 'transparent',
                          color: 'common.white',
                          borderRadius: '50px 0 0 50px',
                          height: '100%',
                          '& fieldset': {
                            borderColor: '#ba8b00',
                            // borderWidth: '1px',
                          },
                          '&:hover fieldset': {
                            borderColor: '#ba8b00',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#ba8b00',
                          },
                        },
                        '& .MuiOutlinedInput-input': {
                          padding: '8px 10px',
                          height: '100%',
                          '&::placeholder': {
                            color: 'rgba(255, 255, 255, 0.7)',
                            opacity: 1,
                          },
                        },
                      }}
                    />
                    <Button
                      type="submit"
                      variant="contained"
                      sx={{
                        bgcolor: '#916242',
                        color: 'common.white',
                        minWidth: '90px',
                        borderRadius: '0 50px 50px 0',
                        border: '1px solid transparent',
                        padding: '8px 20px',
                        height: '100%',
                        fontWeight: 700,
                        fontSize: 'calc(1rem + 2px)',
                        lineHeight: 1.42,
                        textAlign: 'center',
                        whiteSpace: 'normal',
                        cursor: 'pointer',
                        '&:hover': {
                          bgcolor: '#7a5235',
                        },
                      }}
                    >
                      Subscribe
                    </Button>
                  </Stack>
                </Box>
              </Box>

              {/* Social Media */}
              <Box>
                <Typography variant="body2" sx={{ color: 'common.white', mb: 1.5 }}>
                  Follow us
                </Typography>
                <Stack direction="row" spacing={1}>
                  <IconButton
                    href="https://www.instagram.com/gudworld.in/?hl=en"
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      color: 'common.white',
                      '&:hover': {
                        bgcolor: 'rgba(255, 255, 255, 0.1)',
                      },
                    }}
                  >
                    <Iconify icon="mdi:instagram" width={24} />
                  </IconButton>
                  <IconButton
                    href="https://www.facebook.com/gudworld.in/"
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      color: 'common.white',
                      '&:hover': {
                        bgcolor: 'rgba(255, 255, 255, 0.1)',
                      },
                    }}
                  >
                    <Iconify icon="mdi:facebook" width={24} />
                  </IconButton>
                </Stack>
              </Box>
            </Stack>
          </Grid>
        </Grid>

        <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.2)', mb: 3 }} />

        {/* Bottom Bar - First Section: Policy Links and Copyright */}
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          justifyContent="space-between"
          alignItems={{ xs: 'flex-start', md: 'center' }}
          spacing={2}
          sx={{ mb: 2 }}
        >
          {/* Policy Links */}
          <Stack direction="row" spacing={2} sx={{ flexWrap: 'wrap' }}>
            {POLICY_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                sx={{
                  color: 'common.white',
                  textDecoration: 'none',
                  fontSize: '0.875rem',
                  '&:hover': {
                    textDecoration: 'underline',
                  },
                }}
              >
                {link.label}
              </Link>
            ))}
          </Stack>

          {/* Copyright */}
          <Typography variant="body2" sx={{ color: 'common.white', fontSize: '0.875rem' }}>
            Copyright © 2021 Gudworld
          </Typography>
        </Stack>

        {/* Bottom Bar - Second Section: Made with ❤️ Unifynd */}
        <Box
          sx={{
            textAlign: 'center',
            pt: 2,
            borderTop: '1px solid',
            borderColor: 'rgba(255, 255, 255, 0.2)',
          }}
        >
          <Typography variant="body2" sx={{ color: 'common.white', fontSize: '0.875rem' }}>
            Made with <Box component="span" sx={{ color: 'error.main' }}>❤️</Box> Unifynd
          </Typography>
        </Box>
      </DashboardContent>
    </Box>
  );
}

// ----------------------------------------------------------------------

export function HomeFooter({ sx }) {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = React.useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    // Handle subscription logic here
    console.log('Subscribe:', email);
    setEmail('');
  };

  return (
    <Box
      component="footer"
      sx={{
        mt: 8,
        bgcolor: '#8D0505',
        color: 'common.white',
        ...sx,
      }}
    >
      <Container
        sx={{
          py: { xs: 4, md: 6 },
        }}
      >
        {/* Logo */}
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Link
            component={RouterLink}
            href={paths.home}
            sx={{
              textDecoration: 'none',
              display: 'inline-block',
            }}
          >
            <Image
              src="https://gudworld.in/cdn/shop/files/gudworld_logo_2_4x_ec49e954-771b-4509-b5b8-0a746d972570_compact.png?v=1667910889"
              alt="Gudworld Logo"
              sx={{
                height: { xs: 40, md: 60 },
                width: 'auto',
              }}
            />
          </Link>
        </Box>

        {/* Main Content - Three Columns */}
        <Grid container spacing={4} sx={{ mb: 4 }}>
          {/* Left Column - Contact Information */}
          <Grid xs={12} md={4}>
            <Stack spacing={2}>
              <Stack direction="row" spacing={1.5} alignItems="flex-start">
                <Iconify icon="solar:map-point-bold" width={20} sx={{ color: 'common.white', mt: 0.5, flexShrink: 0 }} />
                <Typography variant="body2" sx={{ color: 'common.white' }}>
                  Panchaganga Farm Solutions Pvt Ltd, B-12 Part 2, MIDC, Waluj, Chhatrapati Sambhajinagar, 431136
                  Maharashtra, India
                </Typography>
              </Stack>
              <Stack direction="row" spacing={1.5} alignItems="center">
                <Iconify icon="solar:phone-bold" width={20} sx={{ color: 'common.white', flexShrink: 0 }} />
                <Typography variant="body2" sx={{ color: 'common.white' }}>
                  Phone : +91 8010906093
                </Typography>
              </Stack>
              <Stack direction="row" spacing={1.5} alignItems="center">
                <Iconify icon="solar:letter-bold" width={20} sx={{ color: 'common.white', flexShrink: 0 }} />
                <Typography variant="body2" sx={{ color: 'common.white' }}>
                  Mail address : care@gudworld.in
                </Typography>
              </Stack>
            </Stack>
          </Grid>

          {/* Middle Column - Pages */}
          <Grid xs={12} md={4}>
            <Stack spacing={2}>
              <Typography variant="h6" sx={{ color: 'common.white', fontWeight: 'bold' }}>
                Pages
              </Typography>
              <Stack spacing={1.5}>
                {PAGE_LINKS.map((link) => (
                  <Link
                    key={link.label}
                    component={RouterLink}
                    href={link.path}
                    sx={{
                      color: 'common.white',
                      textDecoration: 'none',
                      fontSize: '0.875rem',
                      '&:hover': {
                        textDecoration: 'underline',
                      },
                    }}
                  >
                    {link.label}
                  </Link>
                ))}
              </Stack>
            </Stack>
          </Grid>

          {/* Right Column - Newsletter & Social Media */}
          <Grid xs={12} md={4}>
            <Stack spacing={3}>
              {/* Newsletter */}
              <Box>
                <Typography variant="body2" sx={{ color: 'common.white', mb: 2 }}>
                  Subscribe to our newsletter for all the new launches and offers!
                </Typography>
                <Box component="form" onSubmit={handleSubscribe}>
                  <Stack direction="row" spacing={0} sx={{ alignItems: 'stretch' }}>
                    <TextField
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      size="small"
                      sx={{
                        flex: '1 1 auto',
                        minWidth: 0,
                        '& .MuiOutlinedInput-root': {
                          bgcolor: 'transparent',
                          color: 'common.white',
                          borderRadius: '50px 0 0 50px',
                          height: '100%',
                          '& fieldset': {
                            borderColor: '#ba8b00',
                            borderWidth: '1px',
                          },
                          '&:hover fieldset': {
                            borderColor: '#ba8b00',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#ba8b00',
                          },
                        },
                        '& .MuiOutlinedInput-input': {
                          padding: '8px 10px',
                          height: '100%',
                          '&::placeholder': {
                            color: 'rgba(255, 255, 255, 0.7)',
                            opacity: 1,
                          },
                        },
                      }}
                    />
                    <Button
                      type="submit"
                      variant="contained"
                      sx={{
                        bgcolor: '#916242',
                        color: 'common.white',
                        minWidth: '90px',
                        borderRadius: '0 50px 50px 0',
                        border: '1px solid transparent',
                        padding: '8px 20px',
                        height: '100%',
                        fontWeight: 700,
                        fontSize: 'calc(1rem + 2px)',
                        lineHeight: 1.42,
                        textAlign: 'center',
                        whiteSpace: 'normal',
                        cursor: 'pointer',
                        '&:hover': {
                          bgcolor: '#7a5235',
                        },
                      }}
                    >
                      Subscribe
                    </Button>
                  </Stack>
                </Box>
              </Box>

              {/* Social Media */}
              <Box>
                <Typography variant="body2" sx={{ color: 'common.white', mb: 1.5 }}>
                  Follow us
                </Typography>
                <Stack direction="row" spacing={1}>
                  <IconButton
                    href="https://www.instagram.com/gudworld.in/?hl=en"
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      color: 'common.white',
                      '&:hover': {
                        bgcolor: 'rgba(255, 255, 255, 0.1)',
                      },
                    }}
                  >
                    <Iconify icon="mdi:instagram" width={24} />
                  </IconButton>
                  <IconButton
                    href="https://www.facebook.com/gudworld.in/"
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      color: 'common.white',
                      '&:hover': {
                        bgcolor: 'rgba(255, 255, 255, 0.1)',
                      },
                    }}
                  >
                    <Iconify icon="mdi:facebook" width={24} />
                  </IconButton>
                </Stack>
              </Box>
            </Stack>
          </Grid>
        </Grid>

        <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.2)', mb: 3 }} />

        {/* Bottom Bar */}
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          justifyContent="space-between"
          alignItems={{ xs: 'flex-start', md: 'center' }}
          spacing={2}
        >
          {/* Policy Links */}
          <Stack direction="row" spacing={2} sx={{ flexWrap: 'wrap' }}>
            {POLICY_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                sx={{
                  color: 'common.white',
                  textDecoration: 'none',
                  fontSize: '0.875rem',
                  '&:hover': {
                    textDecoration: 'underline',
                  },
                }}
              >
                {link.label}
              </Link>
            ))}
          </Stack>

          {/* Made with ❤️ Unifynd */}
          <Typography variant="body2" sx={{ color: 'common.white', fontSize: '0.875rem' }}>
            Made with <Box component="span" sx={{ color: 'error.main' }}>❤️</Box> Unifynd
          </Typography>

          {/* Copyright */}
          <Typography variant="body2" sx={{ color: 'common.white', fontSize: '0.875rem' }}>
            Copyright © 2021 Gudworld
          </Typography>
        </Stack>
      </Container>
    </Box>
  );
}
