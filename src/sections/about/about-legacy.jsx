import { m } from 'framer-motion';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';

import { CONFIG } from 'src/config-global';
import { stylesMode } from 'src/theme/styles';

import { DashboardContent } from 'src/layouts/dashboard';

import { varFade, MotionViewport } from 'src/components/animate';

// ----------------------------------------------------------------------

export function AboutLegacy() {
  return (
    <DashboardContent
      component={MotionViewport}
      sx={{
        pb: { xs: 10, md: 15 },
        textAlign: { xs: 'unset', md: 'unset' },
        overflow: 'hidden',
        boxSizing: 'border-box',
      }}
    >
      <Grid container spacing={{ xs: 5, md: 8 }} alignItems="center">
        {/* Left Column - Text Content */}
        <Grid xs={12} md={6}>
          <m.div variants={varFade({ distance: 24 }).inLeft}>
            <Typography
              // variant="h2"
              sx={{
                mb: 2,
                color: 'primary.main',
                fontWeight: 600,
                fontSize: { xs: '1.5rem', md: '1.8rem' },
                textAlign: 'left',
              }}
            >
              The Legacy
            </Typography>
          </m.div>

          <m.div variants={varFade({ distance: 24 }).inLeft}>
            <Typography
              sx={{
                color: 'primary.main',
                fontSize: { xs: '1rem', md: '1.05rem' },
                lineHeight: 1.8,
                mb: 3,
                [stylesMode.dark]: { color: 'common.white' },
              }}
            >
              However, only when I began to seriously think about joining our family business did I realize that this amazing produce is quite underused. I mean, how often do we really use jaggery in the foods that we make? It is healthy, it tastes great, and can be used in place of sugar in almost everything from baking, making sweets to even beverages. To get my answers, I did a little &apos;analysis&apos; of the kitchen in my own home. Even though we shipped out 30000-40000 kilos of jaggery every day, I was surprised to see that we ourselves rarely used it.
            </Typography>
          </m.div>

          <m.div variants={varFade({ distance: 24 }).inLeft}>
            <Typography
              sx={{
                color: 'primary.main',
                fontSize: { xs: '1rem', md: '1.125rem' },
                lineHeight: 1.8,
                mb: 5,
                [stylesMode.dark]: { color: 'common.white' },
              }}
            >
              The reason for this was quite apparent. Jaggery was difficult to use. Using it meant spending hours breaking huge blocks into smaller pieces or manually powdering it.
            </Typography>
          </m.div>
        </Grid>

        {/* Right Column - Legacy Illustration */}
        <Grid xs={12} md={6}>
          <m.div variants={varFade({ distance: 24 }).inRight}>
            <Box
              sx={{
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Box
                component="img"
                alt="The Legacy - Traditional Jaggery Making Process"
                src={`${CONFIG.site.basePath}/assets/images/about/Legacy.png`}
                sx={{
                  width: '100%',
                  height: 'auto',
                  objectFit: 'contain',
                  display: 'block',
                }}
              />
            </Box>
          </m.div>
        </Grid>
      </Grid>
    </DashboardContent>
  );
}

