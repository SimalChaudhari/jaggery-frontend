import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { HomeCategorySection } from 'src/sections/home/home-category-section';
import { HomeUseCaseSection } from 'src/sections/home/home-use-case-section';

// ----------------------------------------------------------------------

const metadata = { title: `Collections - ${CONFIG.site.name}` };

export default function CollectionsPage() {
  return (
    <>
      <Helmet>
        <title>{metadata.title}</title>
      </Helmet>

      <HomeCategorySection />
      <HomeUseCaseSection />
    </>
  );
}

