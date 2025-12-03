import React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Unstable_Grid2'; // keep Unstable_Grid2 if you want Grid v2
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';
import { alpha, useTheme } from '@mui/material/styles';

import { Iconify } from 'src/components/iconify';
import { Image } from 'src/components/image';
import { CommonButton } from 'src/components/custom-button';
import { DashboardContent } from 'src/layouts/dashboard';

// ----------------------------------------------------------------------

export function MyProgress() {
  const theme = useTheme();
  const myCourses = [
    {
      id: 1,
      title: 'AI Community Building Fundamentals',
      progress: 75,
      lessons: '9/12',
      timeRemaining: '1.2 hours',
      lastAccessed: '2 hours ago',
      nextLesson: 'Member Retention Strategies',
      image:
        'https://readdy.ai/api/search-image?query=Professional%20AI%20learning%20environment%20with%20diverse%20students%20studying%20artificial%20intelligence%20concepts%2C%20modern%20classroom%20with%20digital%20displays%20and%20interactive%20technology%2C%20educational%20atmosphere%20with%20clean%20design&width=100&height=100&seq=34&orientation=squarish',
    },
    {
      id: 2,
      title: 'Advanced Workflow Automation',
      progress: 45,
      lessons: '8/18',
      timeRemaining: '3.4 hours',
      lastAccessed: '1 day ago',
      nextLesson: 'Complex Trigger Conditions',
      image:
        'https://readdy.ai/api/search-image?query=Advanced%20automation%20workflow%20visualization%20with%20complex%20diagrams%20and%20AI%20processing%20nodes%2C%20professional%20technology%20workspace%20with%20multiple%20monitors%20showing%20data%20flows%20and%20analytics&width=100&height=100&seq=35&orientation=squarish',
    },
    {
      id: 3,
      title: 'Community Psychology & AI',
      progress: 100,
      lessons: '10/10',
      timeRemaining: 'Completed',
      lastAccessed: '3 days ago',
      nextLesson: 'Course Completed',
      image:
        'https://readdy.ai/api/search-image?query=Psychology%20and%20AI%20research%20environment%20with%20brain%20visualization%20and%20human%20behavior%20analytics%2C%20scientific%20study%20atmosphere%20with%20charts%20and%20data%20analysis%2C%20professional%20academic%20setting&width=100&height=100&seq=36&orientation=squarish',
    },
    {
      id: 4,
      title: 'Data Analytics for Communities',
      progress: 20,
      lessons: '3/15',
      timeRemaining: '4.1 hours',
      lastAccessed: '1 week ago',
      nextLesson: 'Setting Up Analytics',
      image:
        'https://readdy.ai/api/search-image?query=Data%20analytics%20dashboard%20with%20community%20metrics%20and%20AI%20insights%2C%20professional%20business%20intelligence%20environment%20with%20charts%20and%20graphs%2C%20modern%20office%20workspace%20with%20data%20visualization&width=100&height=100&seq=37&orientation=squarish',
    },
  ];

  return (
    <DashboardContent>
      <Grid container spacing={{ xs: 2, md: 4 }}>
        {/* LEFT SIDE – 8 columns on md+ */}
        <Grid xs={12} md={8}>
          <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: { xs: 2, md: 3 } }}>
            <Box
              sx={{
                width: { xs: 32, md: 40 },
                height: { xs: 32, md: 40 },
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 1,
                background: 'linear-gradient(135deg, #22c55e 0%, #3b82f6 100%)',
                animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
              }}
            >
              <Iconify icon="solar:graph-up-bold" width={20} sx={{ color: 'common.white' }} />
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
              Your Learning Journey
            </Typography>
          </Stack>

          <Stack spacing={{ xs: 2, md: 3 }}>
            {myCourses.map((course) => (
              <Card key={course.id} sx={{ p: { xs: 2, md: 3 } }}>
                <Stack
                  direction={{ xs: 'column', sm: 'row' }}
                  spacing={{ xs: 2, sm: 2 }}
                  alignItems={{ xs: 'flex-start', sm: 'flex-start' }}
                >
                  <Image
                    alt={course.title}
                    src={course.image}
                    ratio="1/1"
                    sx={{
                      width: { xs: '100%', sm: 80 },
                      height: { xs: 160, sm: 80 },
                      borderRadius: 1,
                      flexShrink: 0,
                    }}
                  />
                  <Box sx={{ flex: 1, minWidth: 0, width: '100%' }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                      {course.title}
                    </Typography>
                    <Box sx={{ mb: 1.5 }}>
                      <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                          Progress
                        </Typography>
                        <Typography variant="caption" sx={{ fontWeight: 600 }}>
                          {course.progress}%
                        </Typography>
                      </Stack>
                      <LinearProgress
                        variant="determinate"
                        value={course.progress}
                        sx={{
                          height: 8,
                          borderRadius: 1,
                          bgcolor: alpha(theme.palette.grey[500], 0.16),
                          '& .MuiLinearProgress-bar': {
                            borderRadius: 1,
                            bgcolor: 'primary.main',
                          },
                        }}
                      />
                    </Box>

                    <Grid container spacing={{ xs: 1, sm: 2 }} sx={{ mb: 2 }}>
                      <Grid xs={12} sm={6}>
                        <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                          Lessons: {course.lessons}
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                          Time remaining: {course.timeRemaining}
                        </Typography>
                      </Grid>

                      <Grid xs={12} sm={6}>
                        <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                          Last accessed: {course.lastAccessed}
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                          Next: {course.nextLesson}
                        </Typography>
                      </Grid>
                    </Grid>

                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} alignItems={{ xs: 'stretch', sm: 'center' }}>
                      <CommonButton size="small" sx={{ width: { xs: '100%', sm: 'auto' } }}>
                        Continue Learning
                      </CommonButton>
                      <Button
                        variant="text"
                        size="small"
                        sx={{
                          color: 'primary.main',
                          '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.08) },
                          width: { xs: '100%', sm: 'auto' },
                        }}
                      >
                        View Details
                      </Button>
                    </Stack>
                  </Box>
                </Stack>
              </Card>
            ))}
          </Stack>
        </Grid>

        {/* RIGHT SIDE – 4 columns on md+ */}
        <Grid xs={12} md={4}>
        <Stack spacing={{ xs: 2, md: 3 }}>
            <Card
              sx={{
                p: { xs: 2, md: 3 },
                bgcolor: alpha(theme.palette.background.paper, 0.9),
                backdropFilter: 'blur(8px)',
                boxShadow: theme.customShadows.z16,
                border: `1px solid ${alpha(theme.palette.grey[500], 0.12)}`,
                transition: 'transform 0.3s',
                '&:hover': { transform: 'scale(1.05)' },
              }}
            >
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: { xs: 1.5, md: 2 } }}>
                <Box
                  sx={{
                    width: { xs: 28, md: 32 },
                    height: { xs: 28, md: 32 },
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 1,
                    bgcolor: alpha(theme.palette.info.main, 0.12),
                  }}
                >
                  <Iconify icon="solar:chart-2-bold" width={16} sx={{ color: 'info.main' }} />
                </Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  Learning Stats
                </Typography>
              </Stack>
              <Stack spacing={{ xs: 1.5, md: 2 }}>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  sx={{
                    p: { xs: 1.25, md: 1.5 },
                    borderRadius: 1,
                    background: `linear-gradient(90deg, ${alpha(theme.palette.info.main, 0.08)} 0%, ${alpha(theme.palette.secondary.main, 0.08)} 100%)`,
                  }}
                >
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Iconify icon="solar:clock-circle-bold" width={16} sx={{ color: 'info.main' }} />
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      Total Hours
                    </Typography>
                  </Stack>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    47.5h
                  </Typography>
                </Stack>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  sx={{
                    p: { xs: 1.25, md: 1.5 },
                    borderRadius: 1,
                    background: `linear-gradient(90deg, ${alpha(theme.palette.success.main, 0.08)} 0%, ${alpha(theme.palette.info.main, 0.08)} 100%)`,
                  }}
                >
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Iconify icon="solar:book-bold" width={16} sx={{ color: 'success.main' }} />
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      Courses Completed
                    </Typography>
                  </Stack>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    12
                  </Typography>
                </Stack>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  sx={{
                    p: { xs: 1.25, md: 1.5 },
                    borderRadius: 1,
                    background: `linear-gradient(90deg, ${alpha(theme.palette.warning.main, 0.08)} 0%, ${alpha(theme.palette.error.main, 0.08)} 100%)`,
                  }}
                >
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Iconify icon="solar:medal-ribbons-star-bold" width={16} sx={{ color: 'warning.main' }} />
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      Certificates Earned
                    </Typography>
                  </Stack>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    8
                  </Typography>
                </Stack>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  sx={{
                    p: { xs: 1.25, md: 1.5 },
                    borderRadius: 1,
                    background: `linear-gradient(90deg, ${alpha(theme.palette.warning.main, 0.08)} 0%, ${alpha(theme.palette.error.main, 0.08)} 100%)`,
                  }}
                >
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Iconify icon="solar:target-bold" width={16} sx={{ color: 'warning.main' }} />
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      Current Streak
                    </Typography>
                  </Stack>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'warning.main' }}>
                    15 days
                  </Typography>
                </Stack>
              </Stack>
            </Card>

            <Card
              sx={{
                p: { xs: 2, md: 3 },
                position: 'relative',
                overflow: 'hidden',
                borderRadius: 2,
                background: 'linear-gradient(135deg, #3b82f6 0%, #9333ea 50%, #ec4899 100%)',
                color: 'common.white',
                transition: 'transform 0.3s',
                '&:hover': { transform: 'scale(1.05)' },
              }}
            >
              <Box
                sx={{
                  position: 'absolute',
                  inset: 0,
                  bgcolor: alpha(theme.palette.common.white, 0.1),
                  animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                }}
              />
              <Box sx={{ position: 'relative', zIndex: 10 }}>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                  <Box
                    sx={{
                      width: { xs: 32, md: 40 },
                      height: { xs: 32, md: 40 },
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: 1,
                      bgcolor: alpha(theme.palette.common.white, 0.2),
                      animation: 'bounce 1s infinite',
                    }}
                  >
                    <Iconify icon="solar:medal-ribbons-star-bold" width={24} />
                  </Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    Achievement Unlocked!
                  </Typography>
                </Stack>
                <Typography variant="body2" sx={{ color: 'grey.200', mb: { xs: 1.5, md: 2 } }}>
                  You&apos;ve completed 5 AI courses this month
                </Typography>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Box
                    sx={{
                      width: { xs: 28, md: 32 },
                      height: { xs: 28, md: 32 },
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: '50%',
                      bgcolor: 'warning.main',
                      animation: 'spin 3s linear infinite',
                      '@keyframes spin': {
                        '0%': { transform: 'rotate(0deg)' },
                        '100%': { transform: 'rotate(360deg)' },
                      },
                    }}
                  >
                    <Iconify icon="solar:star-bold" width={14} sx={{ color: 'common.white' }} />
                  </Box>
                  <Typography variant="caption" sx={{ fontWeight: 600 }}>
                    +50 XP Bonus!
                  </Typography>
                </Stack>
              </Box>
            </Card>

            <Card
              sx={{
                p: { xs: 2, md: 3 },
                bgcolor: alpha(theme.palette.background.paper, 0.9),
                backdropFilter: 'blur(8px)',
                boxShadow: theme.customShadows.z16,
                border: `1px solid ${alpha(theme.palette.grey[500], 0.12)}`,
                transition: 'transform 0.3s',
                '&:hover': { transform: 'scale(1.05)' },
              }}
            >
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: { xs: 1.5, md: 2 } }}>
                <Box
                  sx={{
                    width: { xs: 28, md: 32 },
                    height: { xs: 28, md: 32 },
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 1,
                    background: 'linear-gradient(135deg, #9333ea 0%, #ec4899 100%)',
                    animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                  }}
                >
                  <Iconify icon="solar:target-bold" width={16} sx={{ color: 'common.white' }} />
                </Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  Next Milestone
                </Typography>
              </Stack>
              <Box sx={{ mb: 1.5 }}>
                <Stack
                  direction={{ xs: 'column', sm: 'row' }}
                  justifyContent="space-between"
                  alignItems={{ xs: 'flex-start', sm: 'center' }}
                  spacing={{ xs: 0.5, sm: 0 }}
                  sx={{ mb: 1 }}
                >
                  <Stack direction="row" spacing={0.5} alignItems="center">
                    <Iconify icon="solar:medal-ribbons-star-bold" width={14} sx={{ color: 'info.main' }} />
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      AI Expert Badge
                    </Typography>
                  </Stack>
                  <Typography variant="caption" sx={{ fontWeight: 600 }}>
                    8/10 courses
                  </Typography>
                </Stack>
                <Box
                  sx={{
                    width: '100%',
                    height: { xs: 10, md: 12 },
                    borderRadius: 1.5,
                    bgcolor: alpha(theme.palette.grey[500], 0.16),
                    overflow: 'hidden',
                    position: 'relative',
                  }}
                >
                  <LinearProgress
                    variant="determinate"
                    value={80}
                    sx={{
                      height: '100%',
                      bgcolor: 'transparent',
                      '& .MuiLinearProgress-bar': {
                        background: 'linear-gradient(90deg, #3b82f6 0%, #9333ea 100%)',
                        position: 'relative',
                        '&::after': {
                          content: '""',
                          position: 'absolute',
                          inset: 0,
                          bgcolor: alpha(theme.palette.common.white, 0.3),
                          animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                        },
                      },
                    }}
                  />
                </Box>
              </Box>
              <Typography variant="caption" sx={{ color: 'text.secondary', mb: { xs: 1.5, md: 0 }, display: 'block' }}>
                Complete 2 more courses to earn your AI Expert badge
              </Typography>
              <CommonButton
                fullWidth
                size="small"
                icon="solar:arrow-up-bold"
                iconPosition="left"
                sx={{ mt: 1.5 }}
              >
                Level Up Now!
              </CommonButton>
            </Card>
          </Stack>
        </Grid>
      </Grid>
    </DashboardContent>
  );
}
