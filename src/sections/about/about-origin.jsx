import { m } from 'framer-motion';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';

import { CONFIG } from 'src/config-global';
import { stylesMode } from 'src/theme/styles';

import { DashboardContent } from 'src/layouts/dashboard';

import { varFade, MotionViewport } from 'src/components/animate';

// ----------------------------------------------------------------------

export function AboutOrigin() {
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
              sx={{
                mb: 2,
                color: 'primary.main',
                fontWeight: 600,
                fontSize: { xs: '1.5rem', md: '1.8rem' },
                textAlign: 'left',
              }}
            >
              The Origin
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
              You see, my father knows every little detail of jaggery making. And, I discussed the idea of producing smaller cubes of jaggery with him. Combining his knowledge and modern technology, we started researching the possibilities. Finally, the solution came in the form of developing an in-house technology that could produce 5g and 10g cubes of jaggery. For me, this was a breakthrough into a whole new world of opportunities. I could see the humble jaggery becoming a brand.
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
              I now imagine a world where even urban homes will readily use jaggery. Health benefits aside, this will even change the lives of all our farmers. It is quite simple. The more jaggery we sell, the more Organic Sugarcane we will buy from the farmers. Our plan also includes teaching farmers different organic farming techniques and equipping them with all the knowledge that they need to start progressing. This is the beginning of a &ldquo;Gud-World&rdquo; in every way. And I am excited to share this journey with all of you.
            </Typography>
          </m.div>
        </Grid>

        {/* Right Column - Origin Illustration */}
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
                alt="The Origin - Family in Kitchen with Gudworld Products"
                src={`${CONFIG.site.basePath}/assets/images/about/Origin.png`}
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

