import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTheme } from '@mui/material/styles';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { Image } from 'src/components/image';
import { DashboardContent } from 'src/layouts/dashboard';
import { fetchCategories } from 'src/store/slices/categorySlice';

// ----------------------------------------------------------------------

export function HomeCategorySection() {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { categories, loading } = useSelector((state) => state.categories);
  const isDarkMode = theme.palette.mode === 'dark';

  // Fetch categories
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  // Prepare categories with "Shop All" option
  const displayCategories = useMemo(() => {
    const shopAll = {
      id: 'all',
      title: 'Shop All',
      imageUrl: 'https://gudworld.in/cdn/shop/collections/IMG_9097_1_720x.jpg?v=1665117739',
      path: paths.product.root,
    };

    const parentCategories = (categories || [])
      .filter((cat) => !cat.parentCategory)
      .map((category) => ({
        id: category.id,
        title: category.title,
        imageUrl: category.image || category.imageUrl || category.coverUrl,
        path: `${paths.product.root}?category=${encodeURIComponent(category.title)}`,
      }));

    return [shopAll, ...parentCategories];
  }, [categories]);

  return (
    <Box
      component="section"
      sx={{
        py: { xs: 6, md: 10 },
        bgcolor: isDarkMode ? 'background.default' : 'common.white',
      }}
    >
      <DashboardContent>
        <Stack spacing={4}>
          {/* Title */}
          <Typography
            sx={{
              fontSize: { xs: '1.75rem', md: '1.5rem' },
              fontWeight: '600',
              // color: '#8D0505',
              color: isDarkMode ? 'text.primary' : '#8D0505',
              textAlign: 'left',
            }}
          >
            The Güdness Range
          </Typography>

          {/* Categories Grid */}
          <Grid container spacing={{ xs: 3, md: 4 }}>
            {loading
              ? // Skeleton loader
                [...Array(6)].map((_, index) => (
                  <Grid key={`skeleton-${index}`} xs={6} sm={4} md={2}>
                    <Stack spacing={2} alignItems="center">
                      {/* Circular Image Skeleton */}
                      <Skeleton
                        variant="circular"
                        sx={{
                          width: { xs: 120, md: 150 },
                          height: { xs: 120, md: 150 },
                        }}
                      />
                      {/* Label Skeleton */}
                      <Skeleton
                        variant="text"
                        sx={{
                          width: { xs: 80, md: 100 },
                          height: 20,
                        }}
                      />
                    </Stack>
                  </Grid>
                ))
              : // Actual categories
                displayCategories.map((category) => (
                  <Grid key={category.id} xs={6} sm={4} md={2}>
                    <Stack
                      spacing={2}
                      component={RouterLink}
                      href={category.path}
                      sx={{
                        textDecoration: 'none',
                        alignItems: 'center',
                        cursor: 'pointer',
                        '&:hover': {
                          '& .category-image': {
                            transform: 'scale(1.05)',
                          },
                        },
                      }}
                    >
                      {/* Circular Image Frame */}
                      <Box
                        className="category-image"
                        sx={{
                          // width: { xs: 120, md: 150 },
                          // height: { xs: 120, md: 150 },
                          borderRadius: '50%',
                          overflow: 'hidden',
                          // color: '#8D0505',
                          color: isDarkMode ? 'text.primary' : '#8D0505',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'transform 0.3s ease',
                          // border: '2px solid',
                          borderColor: 'divider',
                        }}
                      >
                        {category.imageUrl ? (
                          <Image
                            src={category.imageUrl}
                            alt={category.title}
                            sx={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                            }}
                          />
                        ) : (
                          <Typography
                            variant="h6"
                            sx={{
                              color: 'common.white',
                              fontSize: { xs: '0.875rem', md: '1rem' },
                              textAlign: 'center',
                              px: 2,
                            }}
                          >
                            {category.title}
                          </Typography>
                        )}
                      </Box>

                      {/* Category Label */}
                      <Typography
                        variant="body1"
                        sx={{
                          // color: '#8D0505',
                          color: isDarkMode ? 'text.primary' : '#8D0505',
                          fontWeight: 600,
                          textAlign: 'center',
                          fontSize: { xs: '0.875rem', md: '1rem' },
                        }}
                      >
                        {category.title}
                      </Typography>
                    </Stack>
                  </Grid>
                ))}
          </Grid>
        </Stack>
      </DashboardContent>
    </Box>
  );
}

