import { useTheme } from '@mui/material/styles';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { Image } from 'src/components/image';
import { DashboardContent } from 'src/layouts/dashboard';

// ----------------------------------------------------------------------

export function HomeExperienceSection() {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  return (
    <Box
      component="section"
      sx={{
        py: { xs: 6, md: 10 },
        bgcolor: isDarkMode ? 'background.default' : 'common.white',
      }}
    >
      <DashboardContent>
        <Stack
          spacing={4}
          sx={{
            textAlign: 'center',
            alignItems: 'center',
          }}
        >
          {/* Image */}
          <Box
            sx={{
              maxWidth: { xs: '100%', md: '600px' },
              width: '100%',
            }}
          >
            <Image
              src="https://cdn.shopify.com/s/files/1/0601/8354/3963/files/Gudworld_Jaggery_Icon_8bae684b-c968-4a59-b74b-0fcf51e91d20.jpg?v=1663591299"
              alt="Gudworld Jaggery Experience"
              sx={{
                width: '100px',
                height: 'auto',
                objectFit: 'contain',
              }}
            />
          </Box>

          {/* Text Content */}
          <Stack spacing={2} 
          // sx={{ maxWidth: { xs: '100%', md: '800px' } }}
          >
            <Typography
              variant="body1"
              sx={{
                fontSize: { xs: '1rem', md: '1.5rem' },
                // color: '#8D0505',
                color: isDarkMode ? 'text.primary' : '#8D0505',
                lineHeight: 1.8,
                px: { xs: 2, md: 0 },
              }}
            >
              40 Years of &quot;Gud&quot; Experience
            </Typography>

            <Typography
              variant="body1"
              sx={{
                fontSize: { xs: '1rem', md: '1.125rem' },
                // color: '#8D0505',
                color: isDarkMode ? 'text.primary' : '#8D0505',
                lineHeight: 1.8,
                px: { xs: 2, md: 0 },
              }}
            >
              Gudworld is India&apos;s first curated &amp; ethically-manufactured Organic Jaggery brand built
              to bring your childhood memories gushing back!
            </Typography>
          </Stack>
        </Stack>
      </DashboardContent>
    </Box>
  );
}

