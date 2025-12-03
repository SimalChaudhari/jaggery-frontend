import { m } from 'framer-motion';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';

import { CONFIG } from 'src/config-global';
import { stylesMode } from 'src/theme/styles';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { varFade, MotionViewport } from 'src/components/animate';
import { background } from 'src/theme/core';

export function AboutWhat() {
  return (
    <DashboardContent
      component={MotionViewport}
      sx={{
        pb: { xs: 10, md: 15 },
        textAlign: { xs: 'unset', md: 'unset' },
        // background: "green",
        overflow: 'hidden',
        boxSizing: 'border-box',
      }}
    >

      <Grid
        container
        spacing={{ xs: 5, md: 8 }}
        alignItems="center"
        sx={{
          // background: "red",
          width: '100%',
          margin: 0,
          boxSizing: 'border-box',
          padding: '0 !important',
        }}
      >
        {/* Left Column - Text Content */}
        <Grid xs={12} md={6} sx={{
          // background:"blue",
          padding: '0 !important',
          }}
          >
          <m.div variants={varFade({ distance: 24 }).inLeft}>
            <Typography
              sx={{
                mb: 3,
                color: 'primary.main',
                fontWeight: 500,
                fontSize: { xs: '1.2rem', md: '1.3rem' },
                padding: '0 !important',
              }}
            >
              40 Years of &ldquo;Gud&rdquo; Experience
            </Typography>
          </m.div>

          <m.div variants={varFade({ distance: 24 }).inLeft}>
            <Typography
              sx={{
                color: 'primary.main',
                fontSize: { xs: '1rem', md: '1.05rem' },
                lineHeight: 1.8,
                mb: 5,
                [stylesMode.dark]: { color: 'common.white' },
              }}
            >
              We aspire to transform people&apos;s sweetener consumption
              patterns from sulphur bleached white sugar or any other
              chemically loaded sweeteners to our Purest Organic
              Jaggery!
            </Typography>
          </m.div>

        </Grid>

        {/* Right Column - Product Images */}
        <Grid xs={12} md={6}
        sx={{
            // background:"yellow",
            padding: '0 !important',
          }}
        >
          <m.div variants={varFade({ distance: 24 }).inRight}>
            <Box
              sx={{
                maxWidth: { md: 700 },
                width: '100%',
                margin: { xs: '0 auto', md: '0 auto' },
                padding: { xs: '0 0 15px', md: '50px 0' },
                display: 'flex',
                gap: 0,
                justifyContent: 'center',
                alignItems: 'center',
                position: 'relative'
              }}
            >
              {/* First Image - IMAGE_2 (Jaggery Piece) - Left side */}
              <Box
                component="img"
                alt="Organic Jaggery"
                src={`${CONFIG.site.basePath}/assets/images/about/IMAGE_2.jpg`}
                sx={{
                  width: '50%',
                  height: 'auto',
                  objectFit: 'cover',
                  display: 'block',
                  position: 'absolute',
                  left: { xs: '25px', md: '50px' },
                  bottom: { xs: '-16px', md: '0px' },
                  // bottom: '0px',
                }}
              />

              {/* Second Image - IMAGE_1 (Products on Shelf) - Right side */}
              <Box
                component="img"
                alt="Gudworld Products on Shelf"
                src={`${CONFIG.site.basePath}/assets/images/about/IMAGE_1.jpg`}
                sx={{
                  width: '50%',
                  height: 'auto',
                  objectFit: 'cover',
                  display: 'block',
                  marginLeft: 'auto',
                }}
              />
            </Box>
          </m.div>
        </Grid>
      </Grid>

      {/* Founder's Message */}
      <Box sx={{pt: { xs: 10, md: 15 }}}>
      <m.div variants={varFade({ distance: 24 }).inUp} sx={{ textAlign: { xs: 'center', md: 'unset' } }}>
        <Typography
          sx={{
            color: 'primary.main',
            fontSize: { xs: '1rem', md: '1.05rem' },
            lineHeight: 1.8,
            mb: { xs: 5, md: 8 },
            maxWidth: { md: '80%' },
            [stylesMode.dark]: { color: 'common.white' },
          }}
        >
          Let me introduce myself. I am Preeti Shinde, the founder of Gudworld. In all the 22 years of my life, I have had the joy of leading a wonderful farm life, surrounded by lush green crops, animals, and the love of people working on our farms. I come from a family with a 40-year long legacy in jaggery production. Some of my fondest childhood memories include visiting our factory and watching in awe as kilo after kilo of jaggery would be loaded into trucks and sent off to be sold.
        </Typography>
      </m.div>
      </Box>
    </DashboardContent>
  );
}
