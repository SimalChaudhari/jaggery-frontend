import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Alert from '@mui/material/Alert';
import { useTheme } from '@mui/material/styles';

import { usePathname } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';

import { useBoolean } from 'src/hooks/use-boolean';
import { useSettingsContext } from 'src/components/settings';

import { fetchCategories } from 'src/store/slices/categorySlice';

import { Main } from './main';
import { NavMobile } from './nav/mobile';
import { NavDesktop } from './nav/desktop';
import { Footer, HomeFooter } from './footer';
import { HeaderBase } from '../core/header-base';
import { LayoutSection } from '../core/layout-section';
import { navData as mainNavData } from '../config-nav-main';
import { _account } from '../config-nav-account';

// ----------------------------------------------------------------------

export function MainLayout({ sx, data, children }) {
  const theme = useTheme();
  const dispatch = useDispatch();
  const pathname = usePathname();

  const mobileNavOpen = useBoolean();

  const settings = useSettingsContext();

  const homePage = pathname === '/';

  const layoutQuery = 'md';

  // Fetch categories for Shop dropdown
  const { categories } = useSelector((state) => state.categories);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  // Build navData with dynamic categories for Shop
  const navData = useMemo(() => {
    const baseNavData = data?.nav ?? mainNavData;

    // Find Shop item and populate its children with categories
    return baseNavData.map((item) => {
      if (item.title === 'Shop' && categories && categories.length > 0) {
        return {
          ...item,
          children: [
            {
              subheader: '',
              items: [
                { title: 'Shop All', path: paths.product.root },
                ...categories
                  .filter((cat) => !cat.parentCategory) // Only show parent categories
                  .map((category) => ({
                    title: category.title,
                    path: `${paths.product.root}?category=${encodeURIComponent(category.title)}`,
                  })),
              ],
            },
          ],
        };
      }
      return item;
    });
  }, [data?.nav, categories]);

  return (
    <>
      <NavMobile data={navData} open={mobileNavOpen.value} onClose={mobileNavOpen.onFalse} />

      <LayoutSection
        /** **************************************
         * Header
         *************************************** */
        headerSection={
          <HeaderBase
            layoutQuery={layoutQuery}
            onOpenNav={mobileNavOpen.onTrue}
            data={{
              nav: navData,
              account: _account,
            }}
            slotsDisplay={{
              account: false,
              helpLink: false,
              contacts: false,
              searchbar: false,
              workspaces: false,
              localization: false,
              notifications: false,
            }}
            slots={{
              topArea: (
                <Alert severity="info" sx={{ display: 'none', borderRadius: 0 }}>
                  This is an info Alert.
                </Alert>
              ),
              leftAreaEnd: (
                <NavDesktop
                  data={navData}
                  sx={{
                    display: 'none',
                    [theme.breakpoints.up(layoutQuery)]: {
                      ml: 2.5,
                      display: 'flex',
                    },
                  }}
                />
              ),
            }}
          />
        }
        /** **************************************
         * Footer
         *************************************** */
        footerSection={homePage ? <HomeFooter /> : <Footer layoutQuery={layoutQuery} />}
        /** **************************************
         * Style
         *************************************** */
        cssVars={{
          '--layout-dashboard-content-pt': settings.compactLayout ? theme.spacing(1) : theme.spacing(2),
          '--layout-dashboard-content-pb': settings.compactLayout ? theme.spacing(8) : theme.spacing(10),
          '--layout-dashboard-content-px': settings.compactLayout ? theme.spacing(5) : theme.spacing(3),
        }}
        sx={sx}
      >
        <Main>{children}</Main>
      </LayoutSection>
    </>
  );
}
