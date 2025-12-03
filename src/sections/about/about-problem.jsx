import { m } from 'framer-motion';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';

import { CONFIG } from 'src/config-global';
import { stylesMode } from 'src/theme/styles';

import { DashboardContent } from 'src/layouts/dashboard';

import { varFade, MotionViewport } from 'src/components/animate';

// ----------------------------------------------------------------------

export function AboutProblem() {
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
        {/* Left Column - Problem Illustration */}
        <Grid xs={12} md={6}>
          <m.div variants={varFade({ distance: 24 }).inLeft}>
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
                alt="The Problem - Traditional Kitchen Scene"
                src={`${CONFIG.site.basePath}/assets/images/about/Problem.png`}
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

        {/* Right Column - Text Content */}
        <Grid xs={12} md={6}>
          <m.div variants={varFade({ distance: 24 }).inRight}>
            <Typography
              sx={{
                mb: 2,
                color: 'primary.main',
                fontWeight: 600,
                fontSize: { xs: '1.5rem', md: '1.8rem' },
                textAlign: 'left',
              }}
            >
              The Problem
            </Typography>
          </m.div>

          <m.div variants={varFade({ distance: 24 }).inRight}>
            <Typography
              sx={{
                color: 'primary.main',
                fontSize: { xs: '1rem', md: '1.05rem' },
                lineHeight: 1.8,
                mb: 3,
                [stylesMode.dark]: { color: 'common.white' },
              }}
            >
              I clearly remember my daadi sitting down with jaggery blocks and spending almost an entire afternoon just pounding away at it till we had enough pieces to use in our cooking.
            </Typography>
          </m.div>

          <m.div variants={varFade({ distance: 24 }).inRight}>
            <Typography
              sx={{
                color: 'primary.main',
                fontSize: { xs: '1rem', md: '1.125rem' },
                lineHeight: 1.8,
                mb: 3,
                [stylesMode.dark]: { color: 'common.white' },
              }}
            >
              Would I take all this trouble? Maybe not. And, this would probably mean that generation after generation, the importance of jaggery would just reduce. I was determined not to let that happen because I have personally experienced the magical effect of this simple product on my health. In my younger days, I remember falling sick very often. The only thing that helped me increase my immunity was increasing my jaggery intake over sugar and pairing it with other superfoods. And, I wanted as many people as possible to experience the various benefits of jaggery.
            </Typography>
          </m.div>

          <m.div variants={varFade({ distance: 24 }).inRight}>
            <Typography
              sx={{
                color: 'primary.main',
                fontSize: { xs: '1rem', md: '1.125rem' },
                lineHeight: 1.8,
                mb: 5,
                [stylesMode.dark]: { color: 'common.white' },
              }}
            >
              That is how the idea for Gudworld was born.
            </Typography>
          </m.div>
        </Grid>
      </Grid>
    </DashboardContent>
  );
}

