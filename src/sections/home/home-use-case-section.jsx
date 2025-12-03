import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTheme } from '@mui/material/styles';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { Image } from 'src/components/image';
import { DashboardContent } from 'src/layouts/dashboard';
import { fetchUseCases } from 'src/store/slices/useCaseSlice';

// ----------------------------------------------------------------------

export function HomeUseCaseSection() {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { useCases } = useSelector((state) => state.useCases);
  const isDarkMode = theme.palette.mode === 'dark';

  // Fetch use cases
  useEffect(() => {
    dispatch(fetchUseCases());
  }, [dispatch]);

  // Prepare use cases for display
  const displayUseCases = useMemo(
    () =>
      (useCases || []).map((useCase) => ({
        id: useCase.id,
        title: useCase.title,
        imageUrl: useCase.image || '',
        path: `${paths.product.root}?useCase=${encodeURIComponent(useCase.title)}`,
      })),
    [useCases]
  );

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
              color: isDarkMode ? 'text.primary' : '#8D0505',
              textAlign: 'left',
            }}
          >
            Use Case Categories
          </Typography>

          {/* Use Cases Grid */}
          <Grid container spacing={{ xs: 3, md: 4 }}>
            {displayUseCases.map((useCase) => (
              <Grid key={useCase.id} xs={6} sm={4} md={2}>
                <Stack
                  spacing={2}
                  component={RouterLink}
                  href={useCase.path}
                  sx={{
                    textDecoration: 'none',
                    alignItems: 'center',
                    cursor: 'pointer',
                    '&:hover': {
                      '& .use-case-image': {
                        transform: 'scale(1.05)',
                      },
                    },
                  }}
                >
                  {/* Circular Image Frame */}
                  <Box
                    className="use-case-image"
                    sx={{
                      borderRadius: '50%',
                      overflow: 'hidden',
                      color: isDarkMode ? 'text.primary' : '#8D0505',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'transform 0.3s ease',
                      borderColor: 'divider',
                    }}
                  >
                    {useCase.imageUrl ? (
                      <Image
                        src={useCase.imageUrl}
                        alt={useCase.title}
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
                        {useCase.title}
                      </Typography>
                    )}
                  </Box>

                  {/* Use Case Label */}
                  <Typography
                    variant="body1"
                    sx={{
                      color: isDarkMode ? 'text.primary' : '#8D0505',
                      fontWeight: 600,
                      textAlign: 'center',
                      fontSize: { xs: '0.875rem', md: '1rem' },
                    }}
                  >
                    {useCase.title}
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

