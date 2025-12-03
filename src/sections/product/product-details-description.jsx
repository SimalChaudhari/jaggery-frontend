import { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Markdown } from 'src/components/markdown';
import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

const MAX_LENGTH = 500; // Character limit before showing "Read more"

export function ProductDetailsDescription({ description }) {
  const [expanded, setExpanded] = useState(false);

  // Check if description is long enough to need truncation
  const isLongDescription = description && description.length > MAX_LENGTH;
  const shouldTruncate = isLongDescription && !expanded;
  
  // Get truncated description
  const displayDescription = shouldTruncate 
    ? `${description.substring(0, MAX_LENGTH)}...` 
    : description;

  return (
    <Box sx={{ p: 3 }}>
      <Markdown
        children={displayDescription}
        sx={{
          '& p, li, ol': {
            typography: 'body2',
          },
          '& ol': {
            p: 0,
            display: { md: 'flex' },
            listStyleType: 'none',
            '& li': {
              '&:first-of-type': { minWidth: 240, mb: { xs: 0.5, md: 0 } },
            },
          },
        }}
      />
      
      {isLongDescription && (
        <Button
          onClick={() => setExpanded(!expanded)}
          endIcon={
            <Iconify
              icon={expanded ? 'eva:arrow-up-fill' : 'eva:arrow-down-fill'}
              width={16}
            />
          }
          sx={{
            mt: 2,
            textTransform: 'none',
          }}
        >
          {expanded ? 'Read less' : 'Read more'}
        </Button>
      )}
    </Box>
  );
}
