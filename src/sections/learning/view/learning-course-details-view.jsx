import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import { alpha, useTheme } from '@mui/material/styles';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { DashboardContent } from 'src/layouts/dashboard';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { EmptyContent } from 'src/components/empty-content';
import { LoadingScreen } from 'src/components/loading-screen';
import { Iconify } from 'src/components/iconify';
import { Image } from 'src/components/image';
import { Label } from 'src/components/label';
import { CommonButton } from 'src/components/custom-button';

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
  return `$${Number(amount || 0).toFixed(2)}`;
};

export function LearningCourseDetailsView({ course, loading, error }) {
  const theme = useTheme();

  if (loading) {
    return <LoadingScreen />;
  }

  if (error || !course) {
    return (
      <DashboardContent sx={{ pt: 5 }}>
        <EmptyContent
          filled
          title="Course not found!"
          action={
            <Button
              component={RouterLink}
              href={paths.learning}
              startIcon={<Iconify width={16} icon="eva:arrow-ios-back-fill" />}
              sx={{ mt: 3 }}
            >
              Back to Courses
            </Button>
          }
          sx={{ py: 10, height: 'auto', flexGrow: 'unset' }}
        />
      </DashboardContent>
    );
  }

  const levelColor = getLevelColor(course.level);
  const price = formatPrice(course.freeOrPaid, course.amount);

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading={course.title}
        links={[
          { name: 'Home', href: paths.home },
          { name: 'Learning', href: paths.learning },
          { name: course.title },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Grid container spacing={{ xs: 3, md: 4 }}>
        {/* Left Column - Course Image & Info */}
        <Grid xs={12} md={5}>
          <Card
            sx={{
              p: { xs: 2, md: 3 },
              position: 'sticky',
              top: 100,
              borderRadius: 2,
              boxShadow: theme.customShadows.z16,
            }}
          >
            {course.image && (
              <Box sx={{ mb: 3, borderRadius: 2, overflow: 'hidden' }}>
                <Image
                  alt={course.title}
                  src={course.image}
                  ratio="16/9"
                  sx={{
                    borderRadius: 2,
                    width: '100%',
                  }}
                />
              </Box>
            )}

            <Stack spacing={2}>
              <Stack direction="row" spacing={1} flexWrap="wrap">
                <Label variant="soft" color={levelColor} sx={{ px: 1.5, py: 0.5 }}>
                  {course.level || 'Beginner'}
                </Label>
                <Label
                  variant="soft"
                  color={course.freeOrPaid ? 'success' : 'default'}
                  sx={{ px: 1.5, py: 0.5 }}
                >
                  {course.freeOrPaid ? 'Paid' : 'Free'}
                </Label>
              </Stack>

              <Divider />

              <Stack spacing={1.5}>
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                  {price}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {course.freeOrPaid ? 'One-time payment' : 'Free forever'}
                </Typography>
              </Stack>

              <CommonButton fullWidth size="large" sx={{ py: 1.5 }}>
                <Iconify icon="solar:cart-plus-bold" width={20} sx={{ mr: 1 }} />
                Enroll Now
              </CommonButton>

              <Stack spacing={1}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Iconify icon="solar:clock-circle-bold" width={20} sx={{ color: 'text.secondary' }} />
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Estimated 4.5 hours
                  </Typography>
                </Stack>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Iconify icon="solar:book-bold" width={20} sx={{ color: 'text.secondary' }} />
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    12 Lessons
                  </Typography>
                </Stack>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Iconify icon="solar:certificate-bold" width={20} sx={{ color: 'text.secondary' }} />
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Certificate of Completion
                  </Typography>
                </Stack>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Iconify icon="solar:infinity-bold" width={20} sx={{ color: 'text.secondary' }} />
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Lifetime Access
                  </Typography>
                </Stack>
              </Stack>
            </Stack>
          </Card>
        </Grid>

        {/* Right Column - Course Details */}
        <Grid xs={12} md={7}>
          <Stack spacing={{ xs: 3, md: 4 }}>
            {/* Course Description */}
            <Card sx={{ p: { xs: 2, md: 3 }, borderRadius: 2 }}>
              <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
                About This Course
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: 'text.secondary',
                  lineHeight: 1.8,
                  whiteSpace: 'pre-line',
                }}
              >
                {course.description || 'No description available for this course.'}
              </Typography>
            </Card>

            {/* What You'll Learn */}
            <Card sx={{ p: { xs: 2, md: 3 }, borderRadius: 2 }}>
              <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
                What You&apos;ll Learn
              </Typography>
              <Stack spacing={1.5}>
                {[
                  'Master AI fundamentals and practical applications',
                  'Build real-world projects with hands-on experience',
                  'Understand community building strategies',
                  'Learn from industry experts and best practices',
                ].map((item, index) => (
                  <Stack key={index} direction="row" spacing={1.5} alignItems="flex-start">
                    <Iconify
                      icon="solar:check-circle-bold"
                      width={20}
                      sx={{ color: 'success.main', mt: 0.5, flexShrink: 0 }}
                    />
                    <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
                      {item}
                    </Typography>
                  </Stack>
                ))}
              </Stack>
            </Card>

            {/* Course Content */}
            <Card sx={{ p: { xs: 2, md: 3 }, borderRadius: 2 }}>
              <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
                Course Content
              </Typography>
              <Stack spacing={1}>
                {[
                  { title: 'Introduction to AI', duration: '15 min' },
                  { title: 'Getting Started', duration: '20 min' },
                  { title: 'Core Concepts', duration: '45 min' },
                  { title: 'Advanced Topics', duration: '60 min' },
                  { title: 'Practical Applications', duration: '90 min' },
                ].map((item, index) => (
                  <Box
                    key={index}
                    sx={{
                      p: 2,
                      borderRadius: 1,
                      bgcolor: alpha(theme.palette.grey[500], 0.08),
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {index + 1}. {item.title}
                      </Typography>
                    </Stack>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      {item.duration}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </Card>

            {/* Instructor */}
            <Card sx={{ p: { xs: 2, md: 3 }, borderRadius: 2 }}>
              <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
                Instructor
              </Typography>
              <Stack direction="row" spacing={2} alignItems="center">
                <Box
                  sx={{
                    width: 64,
                    height: 64,
                    borderRadius: '50%',
                    bgcolor: 'primary.main',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'common.white',
                    fontWeight: 'bold',
                    fontSize: '1.5rem',
                  }}
                >
                  AI
                </Box>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Jaggery Instructor
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Expert in AI and Community Building
                  </Typography>
                </Box>
              </Stack>
            </Card>
          </Stack>
        </Grid>
      </Grid>
    </DashboardContent>
  );
}

