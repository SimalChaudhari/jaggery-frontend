import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Unstable_Grid2';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { useAuthContext } from 'src/auth/hooks';

import { Iconify } from 'src/components/iconify';
import { Image } from 'src/components/image';
import { CommonButton } from 'src/components/custom-button';

// ----------------------------------------------------------------------

const STATUS_OPTIONS = ['All Status', 'Active', 'Paused', 'Draft'];

const STATIC_WORKFLOWS = [
  {
    id: 1,
    title: 'New Member Welcome Sequence',
    description: 'Active workflow that welcomes new members and guides them through community introduction.',
    image: 'https://readdy.ai/api/search-image?query=Active%20welcome%20automation%20system%20with%20member%20onboarding%20flow%20and%20greeting%20interface%2C%20professional%20community%20management%20dashboard%20with%20real-time%20activity%20monitoring&width=400&height=250&seq=44&orientation=landscape',
    status: 'Active',
    statusColor: 'success',
    category: 'Onboarding',
    tags: ['Welcome', 'Active', 'Onboarding'],
    triggers: 1,
    actions: 5,
    runs: 47,
    lastRun: '2 hours ago',
  },
  {
    id: 2,
    title: 'Weekly Digest Generator',
    description: 'Automatically curates and sends weekly community highlights to all members every Sunday.',
    image: 'https://readdy.ai/api/search-image?query=Weekly%20digest%20automation%20with%20content%20curation%20and%20newsletter%20generation%2C%20professional%20content%20management%20system%20with%20automated%20publishing%20and%20member%20communication&width=400&height=250&seq=45&orientation=landscape',
    status: 'Active',
    statusColor: 'success',
    category: 'Content',
    tags: ['Digest', 'Weekly', 'Content'],
    triggers: 1,
    actions: 3,
    runs: 12,
    lastRun: '3 days ago',
  },
  {
    id: 3,
    title: 'Inactive Member Re-engagement',
    description: "Identifies and re-engages members who haven't been active for 30 days with personalized content.",
    image: 'https://readdy.ai/api/search-image?query=Member%20re-engagement%20system%20with%20activity%20tracking%20and%20personalized%20outreach%20campaigns%2C%20professional%20community%20analytics%20dashboard%20with%20member%20behavior%20insights&width=400&height=250&seq=46&orientation=landscape',
    status: 'Paused',
    statusColor: 'warning',
    category: 'Engagement',
    tags: ['Re-engagement', 'Inactive', 'Personalized'],
    triggers: 1,
    actions: 4,
    runs: 23,
    lastRun: '1 week ago',
  },
  {
    id: 4,
    title: 'Expert Badge Assignment',
    description: 'Automatically assigns expert badges to members based on their contributions and community recognition.',
    image: 'https://readdy.ai/api/search-image?query=Expert%20badge%20and%20recognition%20system%20with%20achievement%20tracking%20and%20member%20rewards%2C%20professional%20gamification%20interface%20with%20badges%20and%20community%20status%20indicators&width=400&height=250&seq=47&orientation=landscape',
    status: 'Active',
    statusColor: 'success',
    category: 'Recognition',
    tags: ['Badges', 'Recognition', 'Expert'],
    triggers: 2,
    actions: 3,
    runs: 8,
    lastRun: '1 day ago',
  },
  {
    id: 5,
    title: 'Content Quality Check',
    description: 'Reviews all new posts for quality and relevance before publishing to maintain community standards.',
    image: 'https://readdy.ai/api/search-image?query=Content%20quality%20review%20system%20with%20AI%20moderation%20and%20approval%20workflow%2C%20professional%20content%20management%20interface%20with%20quality%20control%20and%20publishing%20tools&width=400&height=250&seq=48&orientation=landscape',
    status: 'Draft',
    statusColor: 'default',
    category: 'Moderation',
    tags: ['Quality', 'Moderation', 'Review'],
    triggers: 1,
    actions: 6,
    runs: 0,
    lastRun: 'Never',
  },
  {
    id: 6,
    title: 'Birthday Celebration Bot',
    description: 'Sends personalized birthday wishes and special offers to community members on their special day.',
    image: 'https://readdy.ai/api/search-image?query=Birthday%20celebration%20automation%20with%20personalized%20greetings%20and%20special%20offers%2C%20friendly%20community%20engagement%20system%20with%20celebration%20interface%20and%20member%20appreciation&width=400&height=250&seq=49&orientation=landscape',
    status: 'Active',
    statusColor: 'success',
    category: 'Engagement',
    tags: ['Birthday', 'Celebration', 'Personal'],
    triggers: 1,
    actions: 2,
    runs: 156,
    lastRun: 'Today',
  },
];

export function MyWorkflows() {
  const router = useRouter();
  const { authenticated } = useAuthContext();
  const [selectedStatus, setSelectedStatus] = useState('All Status');
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEditWorkflow = useCallback((workflowId) => {
    if (authenticated) {
      router.push(paths.admin.workflow.edit(workflowId));
    } else {
      // If not authenticated, stay on workflows page
      router.push(paths.workflows);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [authenticated, router]);

  const filteredWorkflows = STATIC_WORKFLOWS.filter((workflow) => {
    if (selectedStatus === 'All Status') return true;
    return workflow.status.toLowerCase() === selectedStatus.toLowerCase();
  });

  return (
    <Box>
      {/* Header with Filter */}
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'flex-start', sm: 'center' }}
        spacing={2}
        sx={{ mb: { xs: 3, md: 4 } }}
      >
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
          Your Active Workflows
        </Typography>
        <Stack direction="row" spacing={2} sx={{ width: { xs: '100%', sm: 'auto' } }}>
          <Box sx={{ width: { xs: '100%', sm: 200 } }}>
            <Autocomplete
              options={STATUS_OPTIONS}
              value={selectedStatus}
              onChange={(event, newValue) => {
                if (newValue) {
                  setSelectedStatus(newValue);
                }
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="All Status"
                  size="small"
                  fullWidth
                />
              )}
            />
          </Box>
          <Button
            variant="outlined"
            startIcon={<Iconify icon="solar:filter-bold-duotone" />}
            onClick={handleMenuOpen}
          >
            Filter
          </Button>
        </Stack>
      </Stack>

      {/* Workflows Grid */}
      <Grid container spacing={{ xs: 3, md: 4 }} sx={{ mb: { xs: 4, md: 6 } }}>
        {filteredWorkflows.map((workflow) => (
          <Grid key={workflow.id} xs={12} sm={6} lg={4}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                borderRadius: 2,
                overflow: 'hidden',
                transition: 'all 0.3s',
                '&:hover': {
                  boxShadow: (theme) => theme.customShadows.z16,
                  transform: 'translateY(-4px)',
                },
              }}
            >
              <Box sx={{ position: 'relative', width: '100%', height: 200 }}>
                {workflow.image ? (
                  <Image
                    alt={workflow.title}
                    src={workflow.image}
                    sx={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                ) : (
                  <Box
                    sx={{
                      width: '100%',
                      height: '100%',
                      bgcolor: 'grey.200',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Iconify icon="solar:workflow-bold-duotone" width={64} sx={{ color: 'grey.400' }} />
                  </Box>
                )}
                <Box sx={{ position: 'absolute', top: 16, left: 16 }}>
                  <Chip
                    label={workflow.status}
                    color={workflow.statusColor}
                    size="small"
                    sx={{ fontWeight: 500 }}
                  />
                </Box>
                <Box sx={{ position: 'absolute', top: 16, right: 16 }}>
                  <Chip
                    label={workflow.category}
                    size="small"
                    sx={{
                      bgcolor: 'rgba(0, 0, 0, 0.6)',
                      color: 'common.white',
                    }}
                  />
                </Box>
              </Box>
              <Box sx={{ p: { xs: 2, md: 3 }, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    mb: 1.5,
                    lineHeight: 1.4,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                >
                  {workflow.title}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: 'text.secondary',
                    mb: 2,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    flexGrow: 1,
                  }}
                >
                  {workflow.description}
                </Typography>
                <Stack direction="row" spacing={0.5} sx={{ mb: 2, flexWrap: 'wrap', gap: 0.5 }}>
                  {workflow.tags.map((tag, index) => (
                    <Chip
                      key={index}
                      label={tag}
                      size="small"
                      sx={{
                        bgcolor: 'grey.100',
                        color: 'text.secondary',
                        fontSize: '0.75rem',
                      }}
                    />
                  ))}
                </Stack>
                <Grid container spacing={2} sx={{ mb: 2, fontSize: '0.875rem', color: 'text.secondary' }}>
                  <Grid xs={6}>
                    <Stack direction="row" alignItems="center" spacing={0.5}>
                      <Iconify icon="solar:play-bold-duotone" width={16} />
                      <Typography variant="caption">{workflow.triggers} triggers</Typography>
                    </Stack>
                  </Grid>
                  <Grid xs={6}>
                    <Stack direction="row" alignItems="center" spacing={0.5}>
                      <Iconify icon="solar:settings-bold-duotone" width={16} />
                      <Typography variant="caption">{workflow.actions} actions</Typography>
                    </Stack>
                  </Grid>
                  {workflow.runs > 0 && (
                    <>
                      <Grid xs={6}>
                        <Stack direction="row" alignItems="center" spacing={0.5}>
                          <Iconify icon="solar:chart-bold-duotone" width={16} />
                          <Typography variant="caption">{workflow.runs} runs</Typography>
                        </Stack>
                      </Grid>
                      <Grid xs={6}>
                        <Stack direction="row" alignItems="center" spacing={0.5}>
                          <Iconify icon="solar:clock-circle-bold-duotone" width={16} />
                          <Typography variant="caption">{workflow.lastRun}</Typography>
                        </Stack>
                      </Grid>
                    </>
                  )}
                  {workflow.runs === 0 && (
                    <Grid xs={12}>
                      <Stack direction="row" alignItems="center" spacing={0.5}>
                        <Iconify icon="solar:clock-circle-bold-duotone" width={16} />
                        <Typography variant="caption">{workflow.lastRun}</Typography>
                      </Stack>
                    </Grid>
                  )}
                </Grid>
                <Stack direction="row" spacing={1}>
                  <CommonButton
                    size="small"
                    onClick={() => handleEditWorkflow(workflow.id)}
                    sx={{ flex: 1 }}
                  >
                    Edit Workflow
                  </CommonButton>
                  <IconButton
                    size="small"
                    onClick={handleMenuOpen}
                    sx={{
                      border: (theme) => `1px solid ${theme.palette.divider}`,
                    }}
                  >
                    <Iconify icon="solar:menu-dots-bold" />
                  </IconButton>
                </Stack>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Workflow Performance */}
      <Card sx={{ p: { xs: 3, md: 4 } }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: { xs: 3, md: 4 } }}>
          Workflow Performance
        </Typography>
        <Grid container spacing={{ xs: 3, md: 4 }}>
          <Grid xs={6} md={3}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main', mb: 0.5 }}>
                1,247
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                Total Executions
              </Typography>
            </Box>
          </Grid>
          <Grid xs={6} md={3}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'success.main', mb: 0.5 }}>
                98.5%
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                Success Rate
              </Typography>
            </Box>
          </Grid>
          <Grid xs={6} md={3}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'warning.main', mb: 0.5 }}>
                47.2h
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                Time Saved
              </Typography>
            </Box>
          </Grid>
          <Grid xs={6} md={3}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'error.main', mb: 0.5 }}>
                156
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                Members Processed
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Card>

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={handleMenuClose}>
          <Iconify icon="solar:filter-bold-duotone" width={20} sx={{ mr: 1 }} />
          Advanced Filters
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <Iconify icon="solar:sort-bold-duotone" width={20} sx={{ mr: 1 }} />
          Sort Options
        </MenuItem>
      </Menu>
    </Box>
  );
}

