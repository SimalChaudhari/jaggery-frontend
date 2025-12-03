import { useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';
import IconButton from '@mui/material/IconButton';

import { Image } from 'src/components/image';
import { DashboardContent } from 'src/layouts/dashboard';

// ----------------------------------------------------------------------

const MEDIA_LOGOS = [
  {
    id: 'tv9-marathi',
    name: 'TV9 Marathi',
    imageUrl: 'https://gudworld.in/cdn/shop/files/TV9_Marathi_360x.jpg?v=1661413853',
    videoId: '-mfyGZD5gW0',
    hasVideo: true,
  },
  {
    id: 'zee24taas',
    name: 'Zee 24 Taas',
    imageUrl: 'https://gudworld.in/cdn/shop/files/Zee_360x.jpg?v=1661413883',
    videoId: 'LHc6LvN-cMw',
    hasVideo: true,
  },
  {
    id: 'uni',
    name: 'UNI',
    imageUrl: 'https://gudworld.in/cdn/shop/files/UNI_360x.jpg?v=1661413902',
    hasVideo: false,
  },
];

const RETAILER_LOGOS = [
  {
    id: 'instamart',
    name: 'Instamart',
    imageUrl: 'https://gudworld.in/cdn/shop/files/Instamart_360x.png?v=1755090703',
  },
  {
    id: 'lulu',
    name: 'LuLu',
    imageUrl: 'https://gudworld.in/cdn/shop/files/Lulu_360x.jpg?v=1663587283',
  },
  {
    id: 'natures-basket',
    name: "Nature's Basket",
    imageUrl: 'https://gudworld.in/cdn/shop/files/Nature_s_Basket_360x.jpg?v=1663587295',
  },
];

export function HomeMediaSection() {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  const [selectedVideo, setSelectedVideo] = useState(null);

  const handleLogoClick = (logo) => {
    if (logo.hasVideo) {
      setSelectedVideo(logo);
    }
  };

  const handleCloseVideo = () => {
    setSelectedVideo(null);
  };

  // Close modal on ESC key press
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape' && selectedVideo) {
        handleCloseVideo();
      }
    };

    if (selectedVideo) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [selectedVideo]);

  return (
    <>
      <Box
        component="section"
        sx={{
          py: { xs: 6, md: 10 },
          bgcolor: isDarkMode ? 'background.default' : 'common.white',
        }}
      >
        <DashboardContent>
          <Stack spacing={6}>
            {/* As seen on Section */}
            <Stack spacing={3}>
              <Typography
                sx={{
                  fontSize: { xs: '1.5rem', md: '1.75rem' },
                  fontWeight: '600',
                  color: isDarkMode ? 'text.primary' : '#8D0505',
                  textAlign: 'center',
                }}
              >
                As seen on
              </Typography>

              <Box
                className="new-grid"
                sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginLeft: '-10px',
                  marginRight: '-10px',
                  wordBreak: 'break-word',
                }}
              >
                {MEDIA_LOGOS.map((logo) => (
                  <Box
                    key={logo.id}
                    className="grid-item"
                    sx={{alignItems: 'center',
                      display: 'flex',
                      marginBottom: '10px',
                      paddingLeft: '10px',
                      paddingRight: '10px',
                    }}
                  >
                    <Box
                      className="logo-bar__item"
                      onClick={() => handleLogoClick(logo)}
                      sx={{
                        position: 'relative',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        width: '100%',
                        padding: { xs: '15px 20px', md: '25px 30px' },
                        bgcolor: 'common.white',
                        cursor: logo.hasVideo ? 'pointer' : 'default',
                        opacity: logo.hasVideo ? 1 : 0.8,
                        transition: logo.hasVideo ? 'opacity 0.3s ease' : 'none',
                        '&:hover': logo.hasVideo
                          ? {
                              opacity: 0.7,
                            }
                          : {},
                      }}
                    >
                      <Image
                        className="logo-bar__image"
                        src={logo.imageUrl}
                        alt={logo.name}
                        sx={{
                          width: '100%',
                          maxWidth: '150px',
                          height: 'auto',
                          objectFit: 'contain',
                          margin: '0 auto',
                        }}
                      />
                    </Box>
                  </Box>
                ))}
              </Box>
            </Stack>

            {/* Find us at Section */}
            <Stack spacing={3}>
              <Typography
                sx={{
                  fontSize: { xs: '1.5rem', md: '1.75rem' },
                  fontWeight: '600',
                  color: isDarkMode ? 'text.primary' : '#8D0505',
                  textAlign: 'center',
                }}
              >
                Find us at
              </Typography>

              <Box
                className="new-grid"
                sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginLeft: '-10px',
                  marginRight: '-10px',
                  wordBreak: 'break-word',
                }}
              >
                {RETAILER_LOGOS.map((logo) => (
                  <Box
                    key={logo.id}
                    className="grid-item"
                    sx={{
                      // flex: { xs: '0 0 calc(50% - 20px)', sm: '0 0 calc(33.333% - 20px)', md: '0 0 calc(33.333% - 20px)' },
                      alignItems: 'stretch',
                      display: 'flex',
                      marginBottom: '10px',
                      paddingLeft: '10px',
                      paddingRight: '10px',
                    }}
                  >
                    <Box
                      className="logo-bar__item"
                      sx={{
                        position: 'relative',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        width: '100%',
                        padding: { xs: '15px 20px', md: '25px 30px' },
                        bgcolor: 'common.white',
                      }}
                    >
                      <Image
                        className="logo-bar__image"
                        src={logo.imageUrl}
                        alt={logo.name}
                        sx={{
                          width: '100%',
                          maxWidth: '150px',
                          height: 'auto',
                          objectFit: 'contain',
                          margin: '0 auto',
                        }}
                      />
                    </Box>
                  </Box>
                ))}
              </Box>
            </Stack>
          </Stack>
        </DashboardContent>
      </Box>

      {/* Video Modal */}
      {selectedVideo && (
        <Box
          onClick={handleCloseVideo}
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            bgcolor: 'rgba(0, 0, 0, 0.9)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            p: { xs: 2, md: 4 },
          }}
        >
          <Box
            onClick={(e) => e.stopPropagation()}
            sx={{
              position: 'relative',
              width: '100%',
              maxWidth: { xs: '100%', md: '800px' },
              paddingTop: '45%', // Reduced height
            }}
          >
            <IconButton
              onClick={handleCloseVideo}
              sx={{
                position: 'absolute',
                top: { xs: 8, md: 16 },
                right: { xs: 8, md: 16 },
                color: 'common.white',
                bgcolor: 'rgba(0, 0, 0, 0.7)',
                width: { xs: 40, md: 48 },
                height: { xs: 40, md: 48 },
                '&:hover': {
                  bgcolor: 'rgba(0, 0, 0, 0.9)',
                  transform: 'scale(1.1)',
                },
                transition: 'all 0.2s ease',
                zIndex: 10000,
              }}
              aria-label="Close video"
            >
              <Box
                component="svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M18 6L6 18M6 6L18 18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Box>
            </IconButton>

            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${selectedVideo.videoId}?autoplay=1`}
              title={`${selectedVideo.name} Video`}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
              }}
            />
          </Box>
        </Box>
      )}
    </>
  );
}

