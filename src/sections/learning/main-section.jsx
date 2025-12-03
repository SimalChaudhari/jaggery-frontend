import { useState } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';

import { Iconify } from 'src/components/iconify';
import { AllCourses } from './all-courses';
import { MyProgress } from './my-progress';
import { DashboardContent } from 'src/layouts/dashboard';

// ----------------------------------------------------------------------

export function LearningMainSection() {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState('courses'); // 'courses' or 'progress'

  return (
    <DashboardContent
      component="main"
      sx={{
        py: 4,
        position: 'relative',
        zIndex: 10,
      }}
    >
      {/* Header Section */}
      <Box sx={{ textAlign: 'center', mb: { xs: 4, md: 6 } }}>
        <Box sx={{ position: 'relative', display: 'inline-block', mb: { xs: 1.5, md: 2 } }}>
          <Typography
            variant="h2"
            sx={{
              px: 1,
              fontWeight: 'bold',
              fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem', lg: '3rem' },
              background: 'linear-gradient(135deg, #9333ea 0%, #3b82f6 50%, #14b8a6 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            AI-Powered Learning Hub
          </Typography>
          <Box
            sx={{
              position: 'absolute',
              top: { xs: -8, md: -16 },
              right: { xs: -8, md: -16 },
              width: { xs: 24, md: 32 },
              height: { xs: 24, md: 32 },
              borderRadius: '50%',
              bgcolor: 'warning.main',
              display: { xs: 'none', md: 'flex' },
              alignItems: 'center',
              justifyContent: 'center',
              animation: 'spin 3s linear infinite',
              '@keyframes spin': {
                '0%': { transform: 'rotate(0deg)' },
                '100%': { transform: 'rotate(360deg)' },
              },
            }}
          >
            <Iconify icon="solar:star-bold" width={16} sx={{ color: 'common.white' }} />
          </Box>
        </Box>
        <Typography
          variant="body1"
          sx={{
            fontSize: { xs: '0.875rem', sm: '1rem', md: '1.125rem', lg: '1.25rem' },
            color: 'text.secondary',
            maxWidth: 800,
            mx: 'auto',
            lineHeight: 1.75,
            px: 1,
          }}
        >
          Discover personalized learning paths, AI-curated content, and intelligent progress tracking designed to accelerate your growth in AI and community building.
        </Typography>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={{ xs: 1, md: 3 }}
          justifyContent="center"
          sx={{ mt: { xs: 2, md: 3 }, px: 1 }}
        >
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            sx={{
              px: { xs: 1.5, md: 2 },
              py: { xs: 0.75, md: 1 },
              borderRadius: { xs: 1, sm: '50px' },
              bgcolor: alpha(theme.palette.background.paper, 0.8),
              backdropFilter: 'blur(8px)',
              boxShadow: theme.customShadows.z8,
              border: { xs: `2px solid ${alpha(theme.palette.grey[500], 0.12)}`, sm: 'none' },
            }}
          >
            <Iconify icon="solar:medal-ribbons-star-bold" width={20} sx={{ color: 'warning.main' }} />
            <Typography variant="caption" sx={{ fontWeight: 600, fontSize: { xs: '0.75rem', md: '0.875rem' } }}>
              8 Certificates Earned
            </Typography>
          </Stack>
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            sx={{
              px: { xs: 1.5, md: 2 },
              py: { xs: 0.75, md: 1 },
              borderRadius: { xs: 1, sm: '50px' },
              bgcolor: alpha(theme.palette.background.paper, 0.8),
              backdropFilter: 'blur(8px)',
              boxShadow: theme.customShadows.z8,
              border: { xs: `2px solid ${alpha(theme.palette.grey[500], 0.12)}`, sm: 'none' },
            }}
          >
            <Iconify icon="solar:clock-circle-bold" width={20} sx={{ color: 'info.main' }} />
            <Typography variant="caption" sx={{ fontWeight: 600, fontSize: { xs: '0.75rem', md: '0.875rem' } }}>
              47.5h Learning Time
            </Typography>
          </Stack>
        </Stack>
      </Box>

      {/* Tab Switcher */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4, px: 2 }}>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={1}
          sx={{
            p: 1,
            width: { xs: '100%', sm: 'auto' },
            borderRadius: { xs: 1, md: '50px' },
            bgcolor: alpha(theme.palette.background.paper, 0.9),
            backdropFilter: 'blur(8px)',
            boxShadow: theme.customShadows.z24,
            border: `1px solid ${alpha(theme.palette.grey[500], 0.12)}`,
          }}
        >
          <Button
            onClick={() => setActiveTab('courses')}
            variant={activeTab === 'courses' ? 'contained' : 'outlined'}
            startIcon={<Iconify icon="solar:book-bold" width={18} />}
            sx={{
              minWidth: { xs: '100%', sm: 160 },
              borderRadius: { xs: 1, md: '50px' },
              ...(activeTab === 'courses' && {
                background: 'linear-gradient(135deg, #3b82f6 0%, #9333ea 100%)',
                boxShadow: theme.customShadows.z8,
                '&:hover': {
                  background: 'linear-gradient(135deg, #3b82f6 0%, #9333ea 100%)',
                },
              }),
            }}
          >
            All Courses
          </Button>
          <Button
            onClick={() => setActiveTab('progress')}
            variant={activeTab === 'progress' ? 'contained' : 'outlined'}
            startIcon={<Iconify icon="solar:graph-up-bold" width={18} />}
            sx={{
              minWidth: { xs: '100%', sm: 160 },
              borderRadius: { xs: 1, md: '50px' },
              ...(activeTab === 'progress' && {
                background: 'linear-gradient(135deg, #3b82f6 0%, #9333ea 100%)',
                boxShadow: theme.customShadows.z8,
                '&:hover': {
                  background: 'linear-gradient(135deg, #3b82f6 0%, #9333ea 100%)',
                },
              }),
            }}
          >
            My Progress
          </Button>
        </Stack>
      </Box>

      {/* All Courses View */}
      {activeTab === 'courses' && <AllCourses />}

      {/* My Progress View */}
      {activeTab === 'progress' && <MyProgress />}
    </DashboardContent>
  );
}
