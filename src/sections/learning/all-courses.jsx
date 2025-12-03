import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Unstable_Grid2';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';
import { alpha, useTheme } from '@mui/material/styles';

import { Iconify } from 'src/components/iconify';
import { Image } from 'src/components/image';
import { Label } from 'src/components/label';
import { CommonButton } from 'src/components/custom-button';
import { LoadingScreen } from 'src/components/loading-screen';
import { fetchCourses } from 'src/store/slices/courseSlice';
import { DashboardContent } from 'src/layouts/dashboard';
import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

// ----------------------------------------------------------------------

// Helper function to get level color
const getLevelColor = (level) => {
  const levelMap = {
    Beginner: 'success',
    Intermediate: 'warning',
    Advanced: 'error',
  };
  return levelMap[level] || 'default';
};

// Helper function to format price
const formatPrice = (freeOrPaid, amount) => {
  if (!freeOrPaid) {
    return 'Free';
  }
  return `$${Number(amount || 0).toFixed(0)}`;
};

// Transform API course data to UI format
const transformCourse = (course) => ({
  id: course.id,
  title: course.title || 'Untitled Course',
  description: course.description || 'No description available.',
  instructor: 'Jaggery Instructor', // Mock data - backend doesn't have this
  duration: '4.5 hours', // Mock data - backend doesn't have this
  rating: 4.8, // Mock data - backend doesn't have this
  reviews: Math.floor(Math.random() * 3000) + 100, // Mock data
  price: formatPrice(course.freeOrPaid, course.amount),
  level: course.level || 'Beginner',
  levelColor: getLevelColor(course.level || 'Beginner'),
  image: course.image || 'https://readdy.ai/api/search-image?query=Professional%20AI%20learning%20environment&width=400&height=250&orientation=landscape',
  freeOrPaid: course.freeOrPaid,
  amount: course.amount,
});

export function AllCourses() {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { courses, loading } = useSelector((state) => state.courses);

  // Fetch courses on mount
  useEffect(() => {
    dispatch(fetchCourses());
  }, [dispatch]);

  // Transform courses for display
  const learningPaths = useMemo(() => courses.map(transformCourse), [courses]);

  // Static AI Recommendations
  const aiRecommendations = [
    {
      title: 'Advanced Workflow Automation',
      description: 'Recommended based on your learning interests',
      match: 95,
      icon: 'solar:settings-bold',
      color: 'secondary',
    },
    {
      title: 'Community Growth Strategies',
      description: 'Recommended based on your learning interests',
      match: 88,
      icon: 'solar:users-group-two-rounded-bold',
      color: 'primary',
    },
  ];

  if (loading) {
    return <LoadingScreen />;
  }

  if (learningPaths.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 6 }}>
        <Iconify icon="solar:book-bold" width={64} sx={{ color: 'text.disabled', mx: 'auto', mb: 2 }} />
        <Typography variant="h5" sx={{ mb: 1, fontWeight: 600 }}>
          No courses available
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Check back later for new courses!
        </Typography>
      </Box>
    );
  }

  return (
    <DashboardContent>
      {/* Featured Course */}
      <Box sx={{ mb: { xs: 4, md: 6 } }}>
        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          flexWrap="wrap"
          sx={{ mb: { xs: 2, md: 3 } }}
        >
          <Box
            sx={{
              width: { xs: 32, md: 40 },
              height: { xs: 32, md: 40 },
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 1,
              background: 'linear-gradient(135deg, #fbbf24 0%, #f97316 100%)',
              animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
              '@keyframes pulse': {
                '0%, 100%': { opacity: 1 },
                '50%': { opacity: 0.7 },
              },
            }}
          >
            <Iconify icon="solar:star-bold" width={20} sx={{ color: 'common.white' }} />
          </Box>
          <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
            Featured Course
          </Typography>
          <Label
            variant="filled"
            sx={{
              ml: { xs: 0, md: 2 },
              background: 'linear-gradient(135deg, #ec4899 0%, #ef4444 100%)',
              color: 'common.white',
              animation: 'bounce 1s infinite',
              '@keyframes bounce': {
                '0%, 100%': { transform: 'translateY(0)' },
                '50%': { transform: 'translateY(-4px)' },
              },
            }}
          >
            HOT
          </Label>
        </Stack>
        <Card
          sx={{
            position: 'relative',
            overflow: 'hidden',
            borderRadius: { xs: 2, md: 3 },
            minHeight: { xs: 300, md: 400, lg: 450 },
            display: 'flex',
            alignItems: 'center',
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url("https://readdy.ai/api/search-image?query=Advanced%20AI%20automation%20workspace%20with%20holographic%20interfaces%20and%20neural%20network%20visualizations%2C%20futuristic%20learning%20environment%20with%20glowing%20blue%20circuits%2C%20professional%20technology%20education%20setting%20with%20clean%20modern%20design&width=1200&height=400&seq=26&orientation=landscape")`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            transition: 'transform 0.3s',
            '&:hover': { transform: 'scale(1.02)' },
            boxShadow: theme.customShadows.z24,
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(90deg, rgba(37, 99, 235, 0.2) 0%, rgba(147, 51, 234, 0.2) 100%)',
            }}
          />
          <Box
            sx={{
              mx: 'auto',
              maxWidth: 800,
              textAlign: 'center',
              color: 'common.white',
              p: { xs: 2, sm: 3, md: 4 },
              position: 'relative',
              zIndex: 10,
            }}
          >
            <Typography
              variant="h3"
              sx={{
                fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem', lg: '3rem' },
                fontWeight: 'bold',
                mb: { xs: 1.5, md: 2 },
              }}
            >
              Master AI Community Automation
            </Typography>
            <Typography
              variant="body1"
              sx={{
                fontSize: { xs: '0.875rem', sm: '1rem', md: '1.125rem', lg: '1.25rem' },
                color: 'grey.200',
                mb: { xs: 2, md: 3 },
                lineHeight: 1.75,
                px: 1,
              }}
            >
              Learn to build intelligent workflows that scale your community automatically. From member onboarding to content curation, master the art of AI-driven community management.
            </Typography>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={{ xs: 1, sm: 2 }}
              alignItems="center"
              justifyContent="center"
              sx={{ mb: { xs: 2, md: 3 } }}
            >
              <Label
                variant="filled"
                color="success"
                startIcon={<Iconify icon="solar:medal-ribbons-star-bold" width={16} />}
                sx={{
                  animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                }}
              >
                Bestseller
              </Label>
              <Stack direction="row" spacing={0.5} alignItems="center">
                <Iconify icon="solar:star-bold" width={16} sx={{ color: 'warning.main' }} />
                <Typography variant="caption" sx={{ color: 'grey.200' }}>
                  4.9 ★{' '}
                  <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
                    (2,847 reviews)
                  </Box>
                  <Box component="span" sx={{ display: { xs: 'inline', sm: 'none' } }}>
                    (2.8k)
                  </Box>
                </Typography>
              </Stack>
            </Stack>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <CommonButton
                fullWidth={false}
                size="large"
                icon="solar:play-bold"
                iconPosition="left"
                sx={{ maxWidth: { xs: '100%', sm: 'auto' } }}
              >
                Start Learning Now
              </CommonButton>
            </Box>
          </Box>
          {/* Decorative dots */}
          <Box
            sx={{
              position: 'absolute',
              top: { xs: 16, md: 40 },
              left: { xs: 16, md: 40 },
              width: { xs: 6, md: 8 },
              height: { xs: 6, md: 8 },
              borderRadius: '50%',
              bgcolor: alpha(theme.palette.common.white, 0.5),
              animation: 'ping 1s cubic-bezier(0, 0, 0.2, 1) infinite',
              '@keyframes ping': {
                '75%, 100%': { transform: 'scale(2)', opacity: 0 },
              },
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              bottom: { xs: 40, md: 80 },
              right: { xs: 40, md: 80 },
              width: { xs: 8, md: 12 },
              height: { xs: 8, md: 12 },
              borderRadius: '50%',
              bgcolor: alpha(theme.palette.info.main, 0.5),
              animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              top: '33%',
              right: { xs: 16, md: 40 },
              width: { xs: 4, md: 4 },
              height: { xs: 4, md: 4 },
              borderRadius: '50%',
              bgcolor: alpha(theme.palette.secondary.main, 0.5),
              animation: 'bounce 1s infinite',
              '@keyframes bounce': {
                '0%, 100%': { transform: 'translateY(0)' },
                '50%': { transform: 'translateY(-8px)' },
              },
            }}
          />
        </Card>
      </Box>

      {/* Learning Paths */}
      <Box sx={{ mb: { xs: 4, md: 6 } }}>
        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: { xs: 4, md: 6 } }}>
          <Box
            sx={{
              width: { xs: 40, md: 40 },
              height: { xs: 40, md: 40 },
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 1,
              background: 'linear-gradient(135deg, #3b82f6 0%, #14b8a6 100%)',
            }}
          >
            <Iconify icon="solar:target-bold" width={20} sx={{ color: 'common.white' }} />
          </Box>
          <Typography
            variant="h4"
            sx={{
              fontSize: { xs: '1.25rem', md: '1.5rem', lg: '1.875rem' },
              fontWeight: 'bold',
            }}
          >
            Learning Paths
          </Typography>
        </Stack>
        <Grid container spacing={{ xs: 2, sm: 3, md: 3, lg: 3 }}>
          {learningPaths.map((course, index) => (
            <Grid
              key={course.id}
              xs={12}
              sm={6}
              md={4}
              lg={4}
              sx={{
                animation: 'fadeInUp 0.6s ease-out',
                animationDelay: `${index * 0.1}s`,
                animationFillMode: 'both',
                '@keyframes fadeInUp': {
                  from: {
                    opacity: 0,
                    transform: 'translateY(20px)',
                  },
                  to: {
                    opacity: 1,
                    transform: 'translateY(0)',
                  },
                },
              }}
            >
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: { xs: 2, md: 2 },
                  boxShadow: theme.customShadows.z4,
                  transition: 'box-shadow 0.3s ease-in-out',
                  overflow: 'hidden',
                  '&:hover': { boxShadow: theme.customShadows.z16 },
                }}
              >
                <Box sx={{ position: 'relative' }}>
                  <Image
                    alt={course.title}
                    src={course.image}
                    sx={{
                      width: '100%',
                      height: { xs: 192, md: 192 },
                      objectFit: 'cover',
                      objectPosition: 'top',
                    }}
                    onError={(e) => {
                      e.target.src = 'https://readdy.ai/api/search-image?query=Professional%20AI%20learning%20environment&width=400&height=250&orientation=landscape';
                    }}
                  />
                  <Box sx={{ position: 'absolute', top: 16, left: 16 }}>
                    <Label
                      variant="soft"
                      color={course.levelColor}
                      sx={{
                        px: 1,
                        py: 0.5,
                        borderRadius: 2,
                        fontSize: '0.75rem',
                        fontWeight: 500,
                      }}
                    >
                      {course.level}
                    </Label>
                  </Box>
                </Box>
                <Stack spacing={2} sx={{ p: { xs: 3, md: 3 }, flex: 1 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontSize: { xs: '1.125rem', md: '1.125rem' },
                      fontWeight: 600,
                      minHeight: { xs: 56, md: 56 },
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      lineHeight: 1.4,
                    }}
                  >
                    {course.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      fontSize: { xs: '0.875rem', md: '0.875rem' },
                      color: 'text.secondary',
                      minHeight: { xs: 40, md: 40 },
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      mb: 1,
                    }}
                  >
                    {course.description}
                  </Typography>
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                    <Typography variant="caption" sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>
                      {course.instructor}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      •
                    </Typography>
                    <Typography variant="caption" sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>
                      {course.duration}
                    </Typography>
                  </Stack>
                  <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
                    <Stack direction="row" spacing={0.5} alignItems="center">
                      <Iconify icon="solar:star-bold" width={16} sx={{ color: 'warning.main' }} />
                      <Typography variant="subtitle2" sx={{ fontSize: '0.875rem', fontWeight: 500 }}>
                        {course.rating}
                      </Typography>
                      <Typography variant="caption" sx={{ fontSize: '0.875rem', color: 'text.secondary', ml: 0.5 }}>
                        ({course.reviews.toLocaleString()})
                      </Typography>
                    </Stack>
                    <Typography variant="h6" sx={{ fontSize: { xs: '1.125rem', md: '1.125rem' }, fontWeight: 'bold' }}>
                      {course.price}
                    </Typography>
                  </Stack>
                  <Box sx={{ mt: 'auto' }}>
                    <CommonButton
                      fullWidth
                      size="small"
                      component={RouterLink}
                      href={paths.learningCourse.details(course.id)}
                    >
                      Enroll Now
                    </CommonButton>
                  </Box>
                </Stack>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* AI Recommendations */}
      <Card
        sx={{
          mb: 4,
          p: { xs: 2, md: 3, lg: 4 },
          borderRadius: { xs: 2, md: 3 },
          position: 'relative',
          overflow: 'hidden',
          background: `linear-gradient(135deg, ${alpha(theme.palette.secondary.main, 0.08)} 0%, ${alpha(theme.palette.primary.main, 0.08)} 50%, ${alpha(theme.palette.info.main, 0.08)} 100%)`,
          transition: 'transform 0.3s',
          '&:hover': { transform: 'scale(1.01)' },
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            background: `linear-gradient(90deg, ${alpha(theme.palette.secondary.main, 0.05)} 0%, ${alpha(theme.palette.primary.main, 0.05)} 100%)`,
          }}
        />
        <Box sx={{ position: 'relative', zIndex: 10 }}>
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            flexWrap="wrap"
            sx={{ mb: { xs: 1.5, md: 2 } }}
          >
            <Box
              sx={{
                width: { xs: 40, md: 48 },
                height: { xs: 40, md: 48 },
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: { xs: 1, md: 1.5 },
                background: 'linear-gradient(135deg, #9333ea 0%, #3b82f6 100%)',
                animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
              }}
            >
              <Iconify icon="solar:cpu-bold" width={24} sx={{ color: 'common.white' }} />
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
              AI Recommendations for You
            </Typography>
            <Label
              variant="filled"
              sx={{
                ml: { xs: 0, md: 2 },
                background: 'linear-gradient(135deg, #22c55e 0%, #3b82f6 100%)',
                color: 'common.white',
                animation: 'bounce 1s infinite',
              }}
            >
              SMART
            </Label>
          </Stack>
          <Typography
            variant="body1"
            sx={{
              fontSize: { xs: '0.875rem', md: '1rem', lg: '1.125rem' },
              color: 'text.secondary',
              mb: { xs: 2, md: 3 },
            }}
          >
            Based on your learning history and community interests, our AI suggests these personalized courses to accelerate your growth.
          </Typography>
          <Grid container spacing={{ xs: 1.5, md: 2 }}>
            {aiRecommendations.map((rec, index) => (
              <Grid key={index} size={{ xs: 12, md: 6 }}>
                <Card
                  sx={{
                    p: { xs: 2, md: 3 },
                    borderRadius: { xs: 1, md: 1.5 },
                    bgcolor: alpha(theme.palette.background.paper, 0.8),
                    backdropFilter: 'blur(8px)',
                    border: `1px solid ${alpha(theme.palette[rec.color].main, 0.2)}`,
                    transition: 'all 0.3s',
                    '&:hover': { transform: 'scale(1.05)', boxShadow: theme.customShadows.z16 },
                  }}
                >
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: { xs: 1, md: 1.5 } }}>
                    <Box
                      sx={{
                        width: { xs: 28, md: 32 },
                        height: { xs: 28, md: 32 },
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: 1,
                        bgcolor: alpha(theme.palette[rec.color].main, 0.12),
                      }}
                    >
                      <Iconify icon={rec.icon} width={16} sx={{ color: `${rec.color}.main` }} />
                    </Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      {rec.title}
                    </Typography>
                  </Stack>
                  <Typography variant="caption" sx={{ color: 'text.secondary', mb: { xs: 1.5, md: 2 } }}>
                    {rec.description}
                  </Typography>
                  <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    spacing={{ xs: 1, sm: 0 }}
                    alignItems={{ xs: 'flex-start', sm: 'center' }}
                    justifyContent="space-between"
                  >
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ width: { xs: '100%', sm: 'auto' } }}>
                      <Box
                        sx={{
                          width: { xs: 48, md: 64 },
                          height: { xs: 6, md: 8 },
                          borderRadius: 1,
                          bgcolor: alpha(theme.palette[rec.color].main, 0.16),
                          overflow: 'hidden',
                          position: 'relative',
                        }}
                      >
                        <LinearProgress
                          variant="determinate"
                          value={rec.match}
                          sx={{
                            height: '100%',
                            bgcolor: 'transparent',
                            '& .MuiLinearProgress-bar': {
                              background: `linear-gradient(90deg, ${theme.palette[rec.color].main} 0%, ${theme.palette.secondary.main} 100%)`,
                              animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                            },
                          }}
                        />
                      </Box>
                      <Typography variant="caption" sx={{ color: `${rec.color}.main`, fontWeight: 600, whiteSpace: 'nowrap' }}>
                        {rec.match}% match
                      </Typography>
                    </Stack>
                    <Button
                      size="small"
                      variant="text"
                      startIcon={<Iconify icon="solar:eye-bold" width={14} />}
                      sx={{
                        color: `${rec.color}.main`,
                        '&:hover': { bgcolor: alpha(theme.palette[rec.color].main, 0.08) },
                        width: { xs: '100%', sm: 'auto' },
                      }}
                    >
                      View Course
                    </Button>
                  </Stack>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Card>
    </DashboardContent>
  );
}
