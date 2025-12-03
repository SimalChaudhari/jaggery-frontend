import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import InputBase from '@mui/material/InputBase';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { alpha, useTheme } from '@mui/material/styles';

import { fetchCommunities } from 'src/store/slices/communitySlice';
import { fetchCategories } from 'src/store/slices/categorySlice';
import { LoadingScreen } from 'src/components/loading-screen';
import { Iconify } from 'src/components/iconify';
import { RouterLink } from 'src/routes/components';

// ----------------------------------------------------------------------

export function CommunitiesView() {
  const dispatch = useDispatch();
  const theme = useTheme();
  const { communities, loading } = useSelector((state) => state.communities);
  const { categories } = useSelector((state) => state.categories);

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAllCategories, setShowAllCategories] = useState(false);

  useEffect(() => {
    dispatch(fetchCommunities());
    dispatch(fetchCategories());
  }, [dispatch]);

  // Build category list with "All" option
  const allCategories = [
    { label: 'All', value: 'All', icon: null },
    ...(categories || []).map((cat) => ({
      label: cat.title,
      value: cat.id,
      icon: cat.icon || null,
    })),
  ];

  // Show first 6 categories initially, rest when expanded
  const visibleCategories = showAllCategories
    ? allCategories
    : allCategories.slice(0, 6);

  // Filter communities based on selected category and search query
  const filteredCommunities = (communities || []).filter((community) => {
    const matchesCategory =
      selectedCategory === 'All' ||
      community.category?.id === selectedCategory ||
      community.categoryId === selectedCategory;
    const matchesSearch =
      searchQuery === '' ||
      community.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      community.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <Box
      component="main"
      sx={{
        py: { xs: 4, md: 8 },
        bgcolor: 'background.default',
        minHeight: '100vh',
      }}
    >
      <Container>
        {/* Header Section */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: '2rem', md: '2.5rem' },
              fontWeight: 'bold',
              mb: 2,
              color: 'text.primary',
            }}
          >
            Discover AI Communities
          </Typography>
          <Typography
            variant="body1"
            sx={{
              fontSize: { xs: '1rem', md: '1.125rem' },
              color: 'text.secondary',
              maxWidth: 800,
              mx: 'auto',
            }}
          >
            Join intelligent communities powered by AI or{' '}
            <Box
              component={RouterLink}
              href="/signup"
              sx={{
                color: 'primary.main',
                textDecoration: 'underline',
                '&:hover': {
                  color: 'primary.dark',
                },
              }}
            >
              create your own
            </Box>
          </Typography>
        </Box>

        {/* Search Form */}
        <Box sx={{ maxWidth: 800, mx: 'auto', mb: 6 }}>
          <Box
            sx={{
              position: 'relative',
              borderRadius: 2,
              border: `1px solid ${alpha(theme.palette.grey[500], 0.2)}`,
              bgcolor: 'background.paper',
              '&:hover': {
                borderColor: alpha(theme.palette.grey[500], 0.4),
              },
              '&:focus-within': {
                borderColor: 'primary.main',
                boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.1)}`,
              },
            }}
          >
            <Box
              sx={{
                position: 'absolute',
                left: 12,
                top: '50%',
                transform: 'translateY(-50%)',
                display: 'flex',
                alignItems: 'center',
                color: 'text.secondary',
              }}
            >
              <Iconify icon="solar:magnifer-bold-duotone" width={20} />
            </Box>
            <InputBase
              placeholder="Search for anything"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{
                width: '100%',
                pl: 5,
                pr: 3,
                py: 2,
                fontSize: '0.875rem',
                '& input': {
                  '&::placeholder': {
                    opacity: 0.6,
                  },
                },
              }}
            />
          </Box>
        </Box>

        {/* Category Filters */}
        <Box sx={{ mb: 6 }}>
          <Stack
            direction="row"
            spacing={1}
            sx={{
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: 1,
            }}
          >
            {visibleCategories.map((category) => {
              const isActive = selectedCategory === category.value;
              return (
                <Button
                  key={category.value}
                  onClick={() => setSelectedCategory(category.value)}
                  startIcon={
                    category.icon ? (
                      <Iconify icon={category.icon} width={18} />
                    ) : null
                  }
                  sx={{
                    px: 2,
                    py: 1,
                    borderRadius: 3,
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    textTransform: 'none',
                    whiteSpace: 'nowrap',
                    ...(isActive
                      ? {
                          background: 'linear-gradient(45deg, #56c7da, #fcd60b)',
                          color: 'common.white',
                          boxShadow: theme.shadows[4],
                          '&:hover': {
                            background: 'linear-gradient(45deg, #56c7da, #fcd60b)',
                            boxShadow: theme.shadows[6],
                          },
                        }
                      : {
                          bgcolor: theme.palette.mode === 'dark' ? 'grey.800' : 'grey.100',
                          color: 'text.primary',
                          '&:hover': {
                            bgcolor: alpha(theme.palette.primary.main, 0.1),
                            color: 'primary.main',
                          },
                        }),
                  }}
                >
                  {category.label}
                </Button>
              );
            })}
            {allCategories.length > 6 && (
              <Button
                onClick={() => setShowAllCategories(!showAllCategories)}
                sx={{
                  px: 2,
                  py: 1,
                  borderRadius: 3,
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  textTransform: 'none',
                  whiteSpace: 'nowrap',
                  bgcolor: theme.palette.mode === 'dark' ? 'grey.800' : 'grey.100',
                  color: 'text.primary',
                  '&:hover': {
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                    color: 'primary.main',
                  },
                }}
              >
                {showAllCategories ? 'Show Less' : 'More...'}
              </Button>
            )}
          </Stack>
        </Box>

        {/* Communities Grid */}
        {filteredCommunities.length === 0 ? (
          <Box
            sx={{
              textAlign: 'center',
              py: 10,
              color: 'text.secondary',
            }}
          >
            <Iconify
              icon="solar:users-group-two-rounded-bold-duotone"
              width={64}
              sx={{ mb: 2, opacity: 0.5 }}
            />
            <Typography variant="h6">No communities found</Typography>
          </Box>
        ) : (
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                md: 'repeat(2, 1fr)',
                lg: 'repeat(3, 1fr)',
              },
              gap: 3,
              mb: 6,
            }}
          >
            {filteredCommunities.map((community, index) => (
              <Card
                key={community.id}
                component={RouterLink}
                href={`/communities/${community.id}`}
                sx={{
                  position: 'relative',
                  overflow: 'hidden',
                  textDecoration: 'none',
                  bgcolor: 'background.paper',
                  boxShadow: theme.shadows[2],
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: theme.shadows[8],
                    transform: 'translateY(-4px)',
                  },
                }}
              >
                {/* Cover Image */}
                {community.largeImage && (
                  <Box
                    sx={{
                      position: 'relative',
                      width: '100%',
                      height: 128,
                      overflow: 'hidden',
                    }}
                  >
                    <Box
                      component="img"
                      src={community.largeImage}
                      alt={community.title}
                      sx={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        objectPosition: 'top',
                      }}
                    />
                    {/* Rank Badge */}
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 8,
                        left: 8,
                        bgcolor: 'common.black',
                        color: 'common.white',
                        fontSize: '0.75rem',
                        fontWeight: 'bold',
                        px: 1.5,
                        py: 0.5,
                        borderRadius: 1,
                      }}
                    >
                      #{index + 1}
                    </Box>
                  </Box>
                )}

                {/* Content */}
                <Box sx={{ p: 2 }}>
                  <Stack direction="row" spacing={1.5} sx={{ mb: 1.5, alignItems: 'center' }}>
                    {community.smallImage && (
                      <Box
                        component="img"
                        src={community.smallImage}
                        alt={`${community.title} logo`}
                        sx={{
                          width: 32,
                          height: 32,
                          borderRadius: '50%',
                          objectFit: 'cover',
                          flexShrink: 0,
                        }}
                      />
                    )}
                    <Typography
                      variant="subtitle2"
                      sx={{
                        fontWeight: 600,
                        color: 'text.primary',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        fontSize: '0.875rem',
                      }}
                    >
                      {community.title}
                    </Typography>
                  </Stack>

                  {community.description && (
                    <Typography
                      variant="body2"
                      sx={{
                        color: 'text.secondary',
                        mb: 1.5,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        fontSize: '0.875rem',
                        lineHeight: 1.5,
                      }}
                    >
                      {community.description}
                    </Typography>
                  )}

                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{ mt: 'auto' }}
                  >
                    <Typography
                      variant="caption"
                      sx={{ color: 'text.secondary', fontSize: '0.75rem' }}
                    >
                      {community.memberCount || '0'} Members
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        fontWeight: 600,
                        color: 'text.primary',
                        fontSize: '0.75rem',
                      }}
                    >
                      {community.pricingType === 'free'
                        ? 'Free'
                        : community.amount
                          ? `$${community.amount}/month`
                          : 'Paid'}
                    </Typography>
                  </Stack>
                </Box>
              </Card>
            ))}
          </Box>
        )}
      </Container>
    </Box>
  );
}
