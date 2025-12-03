import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Unstable_Grid2';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { useAuthContext } from 'src/auth/hooks';

import { Iconify } from 'src/components/iconify';
import { Image } from 'src/components/image';
import { CommonButton } from 'src/components/custom-button';
import { LoadingScreen } from 'src/components/loading-screen';
import { fetchWorkflows } from 'src/store/slices/workflowSlice';

// ----------------------------------------------------------------------

export function Templates() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { authenticated } = useAuthContext();
  const { workflows, loading } = useSelector((state) => state.workflows);

  useEffect(() => {
    dispatch(fetchWorkflows());
  }, [dispatch]);

  const handleUseTemplate = useCallback(() => {
    if (authenticated) {
      router.push(paths.admin.workflow.new);
    } else {
      // If not authenticated, stay on workflows page
      router.push(paths.workflows);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [authenticated, router]);

  if (loading) {
    return <LoadingScreen />;
  }

  const templates = workflows || [];

  return (
    <Box>
      {/* Featured Workflow - Static */}
      <Box sx={{ mb: { xs: 6, md: 8 } }}>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 'bold',
            mb: { xs: 3, md: 4 },
          }}
        >
          Featured Workflow
        </Typography>
        <Card
          sx={{
            position: 'relative',
            borderRadius: { xs: 2, md: 3 },
            overflow: 'hidden',
            minHeight: { xs: 250, md: 300 },
            display: 'flex',
            alignItems: 'center',
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url("https://readdy.ai/api/search-image?query=Advanced%20automation%20workflow%20visualization%20with%20connected%20nodes%20and%20data%20flow%20diagrams%2C%20futuristic%20AI%20process%20management%20interface%20with%20glowing%20connections%2C%20professional%20technology%20workspace%20with%20clean%20modern%20design&width=1200&height=300&seq=27&orientation=landscape")`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <Box
            sx={{
              position: 'relative',
              zIndex: 1,
              maxWidth: 800,
              mx: 'auto',
              textAlign: 'center',
              color: 'common.white',
              p: { xs: 3, sm: 4, md: 5 },
            }}
          >
            <Typography
              variant="h3"
              sx={{
                fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
                fontWeight: 'bold',
                mb: { xs: 2, md: 3 },
                color: 'common.white',
              }}
            >
              Smart Member Onboarding
            </Typography>
            <Typography
              variant="body1"
              sx={{
                fontSize: { xs: '1rem', sm: '1.125rem', md: '1.25rem' },
                mb: { xs: 3, md: 4 },
                color: 'grey.200',
              }}
            >
              Automatically welcome new members, assign them to relevant groups, send personalized content, and track their engagement journey with AI-powered insights.
            </Typography>
            <Stack
              direction="row"
              spacing={{ xs: 2, sm: 3 }}
              justifyContent="center"
              sx={{ mb: { xs: 3, md: 4 }, flexWrap: 'wrap', gap: { xs: 1.5, sm: 2 } }}
            >
              <Stack direction="row" alignItems="center" spacing={1}>
                <Iconify icon="solar:user-plus-bold-duotone" width={20} />
                <Typography variant="body2" sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                  Auto-assign roles
                </Typography>
              </Stack>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Iconify icon="solar:letter-bold-duotone" width={20} />
                <Typography variant="body2" sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                  Welcome sequences
                </Typography>
              </Stack>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Iconify icon="solar:chart-bold-duotone" width={20} />
                <Typography variant="body2" sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                  Engagement tracking
                </Typography>
              </Stack>
            </Stack>
            <Stack direction="row" justifyContent="center">
              <CommonButton
                onClick={handleUseTemplate}
                size="large"
                sx={{ width: { xs: '100%', sm: 'auto' } }}
              >
                Use This Template
              </CommonButton>
            </Stack>
          </Box>
        </Card>
      </Box>

      {/* Workflow Templates Grid */}
      <Box sx={{ mb: { xs: 6, md: 8 } }}>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 'bold',
            mb: { xs: 3, md: 4 },
          }}
        >
          Workflow Templates
        </Typography>
        <Grid container spacing={{ xs: 3, md: 4 }}>
          {templates.map((template) => (
            <Grid key={template.id} xs={12} sm={6} lg={4}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: 2,
                  overflow: 'hidden',
                  transition: 'all 0.3s',
                  '&:hover': {
                    boxShadow: (theme) => theme.customShadows.z16,
                    transform: 'translateY(-4px)',
                  },
                }}
              >
                <Box sx={{ position: 'relative', width: '100%', height: 200 }}>
                  {template.image ? (
                    <Image
                      alt={template.title}
                      src={template.image}
                      sx={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                  ) : (
                    <Box
                      sx={{
                        width: '100%',
                        height: '100%',
                        bgcolor: 'grey.200',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Iconify icon="solar:workflow-bold-duotone" width={64} sx={{ color: 'grey.400' }} />
                    </Box>
                  )}
                  <Box sx={{ position: 'absolute', top: 16, right: 16 }}>
                    <Chip
                      label={template.label?.title || template.label?.name || 'Uncategorized'}
                      size="small"
                      sx={{
                        bgcolor: 'rgba(0, 0, 0, 0.6)',
                        color: 'common.white',
                      }}
                    />
                  </Box>
                </Box>
                <Box sx={{ p: { xs: 2, md: 3 }, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      mb: 1.5,
                      lineHeight: 1.4,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {template.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: 'text.secondary',
                      mb: 2,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      flexGrow: 1,
                    }}
                  >
                    {template.description || 'No description available'}
                  </Typography>
                  {template.tags && template.tags.length > 0 && (
                    <Stack direction="row" spacing={0.5} sx={{ mb: 2, flexWrap: 'wrap', gap: 0.5 }}>
                      {template.tags.slice(0, 3).map((tag, index) => (
                        <Chip
                          key={index}
                          label={typeof tag === 'string' ? tag : tag.title}
                          size="small"
                          sx={{
                            bgcolor: 'grey.100',
                            color: 'text.secondary',
                            fontSize: '0.75rem',
                          }}
                        />
                      ))}
                    </Stack>
                  )}
                  <Stack direction="row" spacing={2} sx={{ mb: 2, fontSize: '0.875rem', color: 'text.secondary' }}>
                    <Stack direction="row" alignItems="center" spacing={0.5}>
                      <Iconify icon="solar:play-bold-duotone" width={16} />
                      <Typography variant="caption">
                        {template.tags?.length || 0} tags
                      </Typography>
                    </Stack>
                    <Stack direction="row" alignItems="center" spacing={0.5}>
                      <Iconify icon="solar:settings-bold-duotone" width={16} />
                      <Typography variant="caption">Configured</Typography>
                    </Stack>
                  </Stack>
                  <Stack direction="row" spacing={1}>
                    <CommonButton
                      size="small"
                      onClick={handleUseTemplate}
                      sx={{ flex: 1 }}
                    >
                      Use Template
                    </CommonButton>
                    <Button
                      variant="outlined"
                      size="small"
                      sx={{ minWidth: 48 }}
                    >
                      <Iconify icon="solar:eye-bold" />
                    </Button>
                  </Stack>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Why Use AI Workflows */}
      <Card
        sx={{
          background: 'linear-gradient(to right, #eff6ff, #faf5ff)',
          borderRadius: { xs: 2, md: 3 },
          p: { xs: 4, md: 6 },
          mb: { xs: 4, md: 6 },
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontSize: { xs: '1.25rem', md: '1.5rem' },
            fontWeight: 'bold',
            mb: { xs: 3, md: 4 },
            textAlign: 'center',
            color: 'text.primary',
          }}
        >
          Why Use AI Workflows?
        </Typography>
        <Grid container spacing={{ xs: 3, md: 4 }}>
          <Grid xs={12} md={4}>
            <Box sx={{ textAlign: 'center' }}>
              <Box
                sx={{
                  width: { xs: 48, md: 64 },
                  height: { xs: 48, md: 64 },
                  bgcolor: '#dbeafe',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: { xs: 2, md: 3 },
                }}
              >
                <Iconify
                  icon="solar:clock-circle-bold-duotone"
                  width={{ xs: 20, md: 24 }}
                  sx={{ color: '#2563eb' }}
                />
              </Box>
              <Typography
                variant="h6"
                sx={{
                  fontSize: { xs: '1rem', md: '1.125rem' },
                  fontWeight: 600,
                  mb: 1.5,
                  color: 'text.primary',
                }}
              >
                Save 80% Time
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  fontSize: { xs: '0.875rem', md: '1rem' },
                  color: 'text.secondary',
                }}
              >
                Automate repetitive tasks and focus on what matters most - building meaningful connections.
              </Typography>
            </Box>
          </Grid>
          <Grid xs={12} md={4}>
            <Box sx={{ textAlign: 'center' }}>
              <Box
                sx={{
                  width: { xs: 48, md: 64 },
                  height: { xs: 48, md: 64 },
                  bgcolor: '#dcfce7',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: { xs: 2, md: 3 },
                }}
              >
                <Iconify
                  icon="solar:users-group-rounded-bold-duotone"
                  width={{ xs: 20, md: 24 }}
                  sx={{ color: '#16a34a' }}
                />
              </Box>
              <Typography
                variant="h6"
                sx={{
                  fontSize: { xs: '1rem', md: '1.125rem' },
                  fontWeight: 600,
                  mb: 1.5,
                  color: 'text.primary',
                }}
              >
                Better Engagement
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  fontSize: { xs: '0.875rem', md: '1rem' },
                  color: 'text.secondary',
                }}
              >
                Deliver personalized experiences that keep members active and engaged in your community.
              </Typography>
            </Box>
          </Grid>
          <Grid xs={12} md={4}>
            <Box sx={{ textAlign: 'center' }}>
              <Box
                sx={{
                  width: { xs: 48, md: 64 },
                  height: { xs: 48, md: 64 },
                  bgcolor: '#f3e8ff',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: { xs: 2, md: 3 },
                }}
              >
                <Iconify
                  icon="solar:chart-2-bold-duotone"
                  width={{ xs: 20, md: 24 }}
                  sx={{ color: '#9333ea' }}
                />
              </Box>
              <Typography
                variant="h6"
                sx={{
                  fontSize: { xs: '1rem', md: '1.125rem' },
                  fontWeight: 600,
                  mb: 1.5,
                  color: 'text.primary',
                }}
              >
                Scale Effortlessly
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  fontSize: { xs: '0.875rem', md: '1rem' },
                  color: 'text.secondary',
                }}
              >
                Handle thousands of members with the same personal touch as your first ten members.
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Card>
    </Box>
  );
}

