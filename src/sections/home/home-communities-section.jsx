import { useState } from 'react';
import { useTheme } from '@mui/material/styles';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';

import { DashboardContent } from 'src/layouts/dashboard';

// ----------------------------------------------------------------------

export function HomeCommunitiesSection() {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  const [isPlaying, setIsPlaying] = useState(false);

  // YouTube video ID
  const videoId = 'sTtn28vUy9k';
  const thumbnailUrl = `https://i.ytimg.com/vi_webp/${videoId}/maxresdefault.webp`;

  const handlePlay = () => {
    setIsPlaying(true);
  };

  return (
    <Box
      component="section"
      sx={{
        py: { xs: 6, md: 10 },
        bgcolor: isDarkMode ? 'background.default' : 'common.white',
      }}
    >
      <DashboardContent>
        <Stack spacing={4} sx={{ alignItems: 'center' }}>
          {/* Video Container */}
          <Box
            sx={{
              position: 'relative',
              width: '100%',
              // maxWidth: { xs: '100%', md: '900px' },
              borderRadius: 2,
              overflow: 'hidden',
              boxShadow: (t) => t.shadows[8],
            }}
          >
            {!isPlaying ? (
              <Box
                sx={{
                  position: 'relative',
                  width: '100%',
                  paddingTop: '56.25%', // 16:9 aspect ratio
                  cursor: 'pointer',
                }}
                onClick={handlePlay}
              >
                {/* Thumbnail Image */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundImage: `url(${thumbnailUrl})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                  }}
                />

                {/* Play Button Overlay */}
                <Box
                  className="play-button"
                  sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    zIndex: 2,
                  }}
                >
                  <IconButton
                    sx={{
                      width: { xs: 68, md: 80 },
                      height: { xs: 48, md: 56 },
                      p: 0,
                      // '&:hover': {
                      //   transform: 'scale(1.05)',
                      // },
                      // transition: 'transform 0.3s ease',
                    }}
                    aria-label="Play video"
                  >
                    <Box
                      component="svg"
                      height="100%"
                      version="1.1"
                      viewBox="0 0 68 48"
                      width="100%"
                      sx={{
                        filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))',
                      }}
                    >
                      <path
                        className="ytp-large-play-button-bg"
                        d="M66.52,7.74c-0.78-2.93-2.49-5.41-5.42-6.19C55.79,.13,34,0,34,0S12.21,.13,6.9,1.55 C3.97,2.33,2.27,4.81,1.48,7.74C0.06,13.05,0,24,0,24s0.06,10.95,1.48,16.26c0.78,2.93,2.49,5.41,5.42,6.19 C12.21,47.87,34,48,34,48s21.79-0.13,27.1-1.55c2.93-0.78,4.64-3.26,5.42-6.19C67.94,34.95,68,24,68,24S67.94,13.05,66.52,7.74z"
                        fill="#f03"
                      />
                      <path d="M 45,24 27,14 27,34" fill="#fff" />
                    </Box>
                  </IconButton>
                </Box>

                {/* Gradient Overlay */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.3) 100%)',
                    zIndex: 1,
                  }}
                />
              </Box>
            ) : (
              <Box
                sx={{
                  position: 'relative',
                  width: '100%',
                  paddingTop: '56.25%', // 16:9 aspect ratio
                }}
              >
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
                  title="YouTube video player"
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
            )}
          </Box>
        </Stack>
      </DashboardContent>
    </Box>
  );
}
