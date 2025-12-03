import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';

import { useGetCommunity } from 'src/actions/community';
import { LoadingScreen } from 'src/components/loading-screen';
import { EmptyContent } from 'src/components/empty-content';
import { Iconify } from 'src/components/iconify';
import { CommonButton } from 'src/components/custom-button';
import { RouterLink } from 'src/routes/components';
import { paths } from 'src/routes/paths';

// ----------------------------------------------------------------------

export function CommunityDetailView({ communityId }) {
  const theme = useTheme();
  const { community, communityLoading: loading, communityError: error } = useGetCommunity(communityId);

  if (loading) {
    return <LoadingScreen />;
  }

  if (error || !community) {
    return (
      <Box
        sx={{
          py: { xs: 10, md: 15 },
          bgcolor: 'background.default',
          minHeight: '100vh',
        }}
      >
        <Container>
          <EmptyContent
            filled
            title="Community not found!"
            description={error || 'The community you are looking for does not exist.'}
            action={
              <Button
                component={RouterLink}
                href={paths.communities}
                variant="contained"
                startIcon={<Iconify width={16} icon="eva:arrow-ios-back-fill" />}
                sx={{ mt: 3 }}
              >
                Back to Communities
              </Button>
            }
            sx={{ py: 10, height: 'auto', flexGrow: 'unset' }}
          />
        </Container>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        py: { xs: 6, md: 10 },
        bgcolor: 'background.default',
        minHeight: '100vh',
      }}
    >
      <Container maxWidth="lg">
        {/* Back Button */}
        <Button
          component={RouterLink}
          href={paths.communities}
          startIcon={<Iconify icon="eva:arrow-ios-back-fill" width={20} />}
          sx={{ mb: 4 }}
        >
          Back to Communities
        </Button>

        {/* Hero Section with Cover Image */}
        {community.largeImage && (
          <Box
            sx={{
              position: 'relative',
              width: '100%',
              height: { xs: 200, md: 400 },
              borderRadius: 2,
              overflow: 'hidden',
              mb: 4,
            }}
          >
            <Box
              component="img"
              src={community.largeImage}
              alt={community.title}
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
            <Box
              sx={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)',
                p: 3,
              }}
            >
              <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
                {community.smallImage && (
                  <Box
                    component="img"
                    src={community.smallImage}
                    alt={`${community.title} logo`}
                    sx={{
                      width: 64,
                      height: 64,
                      borderRadius: '50%',
                      objectFit: 'cover',
                      border: `3px solid ${theme.palette.common.white}`,
                    }}
                  />
                )}
                <Box>
                  <Typography
                    variant="h3"
                    sx={{
                      color: 'common.white',
                      fontWeight: 'bold',
                      mb: 0.5,
                      fontSize: { xs: '1.5rem', md: '2.5rem' },
                    }}
                  >
                    {community.title}
                  </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap">
                    {community.category && (
                      <Chip
                        label={community.category.title}
                        size="small"
                        sx={{
                          bgcolor: alpha(theme.palette.primary.main, 0.2),
                          color: 'common.white',
                          border: `1px solid ${alpha(theme.palette.primary.main, 0.5)}`,
                        }}
                      />
                    )}
                    <Chip
                      label={community.pricingType === 'free' ? 'Free' : 'Paid'}
                      size="small"
                      sx={{
                        bgcolor:
                          community.pricingType === 'free'
                            ? alpha(theme.palette.success.main, 0.2)
                            : alpha(theme.palette.warning.main, 0.2),
                        color: 'common.white',
                        border: `1px solid ${
                          community.pricingType === 'free'
                            ? alpha(theme.palette.success.main, 0.5)
                            : alpha(theme.palette.warning.main, 0.5)
                        }`,
                      }}
                    />
                  </Stack>
                </Box>
              </Stack>
            </Box>
          </Box>
        )}

        {/* Content Section */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' },
            gap: 4,
          }}
        >
          {/* Main Content */}
          <Box>
            {!community.largeImage && (
              <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 4 }}>
                {community.smallImage && (
                  <Box
                    component="img"
                    src={community.smallImage}
                    alt={`${community.title} logo`}
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: '50%',
                      objectFit: 'cover',
                    }}
                  />
                )}
                <Box>
                  <Typography variant="h3" sx={{ mb: 1, fontSize: { xs: '1.5rem', md: '2rem' } }}>
                    {community.title}
                  </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap">
                    {community.category && (
                      <Chip label={community.category.title} size="small" variant="outlined" />
                    )}
                    <Chip
                      label={community.pricingType === 'free' ? 'Free' : 'Paid'}
                      size="small"
                      color={community.pricingType === 'free' ? 'success' : 'warning'}
                    />
                  </Stack>
                </Box>
              </Stack>
            )}

            <Card sx={{ p: 4, mb: 3 }}>
              <Typography variant="h5" sx={{ mb: 3 }}>
                About
              </Typography>
              {community.description ? (
                <Typography
                  variant="body1"
                  sx={{
                    color: 'text.secondary',
                    lineHeight: 1.8,
                    whiteSpace: 'pre-wrap',
                  }}
                >
                  {community.description}
                </Typography>
              ) : (
                <Typography variant="body2" sx={{ color: 'text.secondary', fontStyle: 'italic' }}>
                  No description available.
                </Typography>
              )}
            </Card>
          </Box>

          {/* Sidebar */}
          <Box>
            <Card sx={{ p: 3, position: 'sticky', top: 100 }}>
              <Stack spacing={3}>
                <Box>
                  <Typography variant="subtitle2" sx={{ mb: 1, color: 'text.secondary' }}>
                    Pricing
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    {community.pricingType === 'free' ? (
                      'Free'
                    ) : community.amount ? (
                      `$${parseFloat(community.amount).toFixed(2)}/month`
                    ) : (
                      'Paid'
                    )}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="subtitle2" sx={{ mb: 1, color: 'text.secondary' }}>
                    Members
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {community.memberCount || '0'} Members
                  </Typography>
                </Box>

                {community.category && (
                  <Box>
                    <Typography variant="subtitle2" sx={{ mb: 1, color: 'text.secondary' }}>
                      Category
                    </Typography>
                    <Chip
                      label={community.category.title}
                      icon={
                        community.category.icon ? (
                          <Iconify icon={community.category.icon} width={16} />
                        ) : null
                      }
                      size="medium"
                      variant="outlined"
                    />
                  </Box>
                )}

                <CommonButton
                  size="large"
                  fullWidth
                >
                  Join Community
                </CommonButton>
              </Stack>
            </Card>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

