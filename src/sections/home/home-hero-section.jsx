import Box from '@mui/material/Box';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { Image } from 'src/components/image';

// ----------------------------------------------------------------------

export function HomeHeroSection() {
  return (
    <Box
      component="section"
      sx={{
        width: '100%',
        height: '100vh',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Box
        component={RouterLink}
        href={paths.product.root}
        sx={{
          display: 'block',
          width: '100%',
          height: '100%',
          cursor: 'pointer',
        }}
      >
        <Image
          src="/assets/images/home/hero_bg.jpg"
          alt="Hero Background"
          sx={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
      </Box>
    </Box>
  );
}

