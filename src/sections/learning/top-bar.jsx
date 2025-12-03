import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';

import { Iconify } from 'src/components/iconify';
import { DashboardContent } from 'src/layouts/dashboard';

// ----------------------------------------------------------------------

export function LearningTopBar() {
  const theme = useTheme();
  const level = 12;
  const currentXP = 2877;
  const maxXP = 3000;
  const streak = 15;
  const progressPercentage = (currentXP / maxXP) * 100;

  return (
    <Box
      sx={{
        top: 0,
        zIndex: 40,
        position: 'sticky',
        backdropFilter: 'blur(8px)',
        borderBottom: `1px solid ${alpha(theme.palette.grey[500], 0.12)}`,
        bgcolor: alpha(theme.palette.background.paper, 0.9),
        boxShadow: theme.customShadows.z8,
      }}
    >
      <DashboardContent
        sx={{
          py: 1.5,
        }}
      >
        <Stack
          direction="row"
          spacing={2}
          alignItems="center"
          justifyContent="space-between"
          sx={{ width: '100%' }}
        >
          <Stack direction="row" spacing={2} alignItems="center" sx={{ flex: 1, minWidth: 0 }}>
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '50%',
                  fontWeight: 'bold',
                  color: 'common.white',
                  background: 'linear-gradient(135deg, #9333ea 0%, #3b82f6 100%)',
                  animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                  '@keyframes pulse': {
                    '0%, 100%': { opacity: 1 },
                    '50%': { opacity: 0.7 },
                  },
                }}
              >
                {level}
              </Box>
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                  Level {level} Learner
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  {currentXP.toLocaleString()}/{maxXP.toLocaleString()} XP
                </Typography>
              </Box>
            </Stack>
          </Stack>
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            sx={{
              cursor: 'pointer',
              transition: 'transform 0.2s',
              '&:hover': { transform: 'scale(1.05)' },
              flexShrink: 0,
            }}
          >
            <Box
              sx={{
                width: 32,
                height: 32,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '50%',
                bgcolor: alpha(theme.palette.warning.main, 0.12),
              }}
            >
              <Iconify icon="solar:flash-bold" width={18} sx={{ color: 'warning.main' }} />
            </Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              {streak} day streak!
            </Typography>
          </Stack>
        </Stack>
      </DashboardContent>
    </Box>
  );
}
