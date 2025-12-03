import Stack from '@mui/material/Stack';

import { BackToTop } from 'src/components/animate/back-to-top';
import { ScrollProgress, useScrollProgress } from 'src/components/animate/scroll-progress';

import { HomeHeroSection } from '../home-hero-section';
import { HomeExperienceSection } from '../home-experience-section';
import { HomeCategorySection } from '../home-category-section';
import { HomeUseCaseSection } from '../home-use-case-section';
import { HomeCommunitiesSection } from '../home-communities-section';
import { HomeMediaSection } from '../home-media-section';

// ----------------------------------------------------------------------

export function HomeView() {
  const pageProgress = useScrollProgress();

  return (
    <>
      <ScrollProgress
        variant="linear"
        progress={pageProgress.scrollYProgress}
        sx={{ position: 'fixed' }}
      />

      <BackToTop />

      <HomeHeroSection />

      <Stack sx={{ position: 'relative', bgcolor: 'background.default' }}>

        <HomeExperienceSection />

        <HomeCategorySection />

        <HomeCommunitiesSection />

        <HomeUseCaseSection />

        <HomeMediaSection />

      </Stack>
    </>
  );
}
