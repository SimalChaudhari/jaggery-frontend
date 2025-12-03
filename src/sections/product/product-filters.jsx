import { useCallback, useMemo } from 'react';

import Box from '@mui/material/Box';
import Radio from '@mui/material/Radio';
import Stack from '@mui/material/Stack';
import Badge from '@mui/material/Badge';
import Drawer from '@mui/material/Drawer';
import Rating from '@mui/material/Rating';
import Button from '@mui/material/Button';
import Slider from '@mui/material/Slider';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import FormControlLabel from '@mui/material/FormControlLabel';
import InputBase, { inputBaseClasses } from '@mui/material/InputBase';

import { varAlpha } from 'src/theme/styles';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

// ----------------------------------------------------------------------

export function ProductFilters({ open, onOpen, onClose, canReset, filters, options, maxPrice = 200 }) {
  const marksLabel = useMemo(() => {
    const step = Math.ceil(maxPrice / 20);
    const marks = [];
    for (let i = 0; i <= 20; i += 1) {
      const value = i * step;
      if (value <= maxPrice) {
        const firstValue = i === 0 ? `₹${value}` : `${value}`;
        marks.push({ value, label: i % 4 ? '' : firstValue });
      }
    }
    return marks;
  }, [maxPrice]);

  const handleFilterCategory = useCallback(
    (newValue) => {
      filters.setState({ category: newValue });
    },
    [filters]
  );

  const handleFilterUseCase = useCallback(
    (newValue) => {
      const currentUseCases = filters.state.useCase || [];
      const isArray = Array.isArray(currentUseCases);
      const useCaseArray = isArray ? currentUseCases : (currentUseCases === 'all' ? [] : [currentUseCases]);

      if (newValue === 'all') {
        // If "All" is clicked, clear all selections
        filters.setState({ useCase: [] });
      } else {
        // Toggle the use case
        const index = useCaseArray.indexOf(newValue);
        if (index > -1) {
          // Remove if already selected
          useCaseArray.splice(index, 1);
        } else {
          // Add if not selected
          useCaseArray.push(newValue);
        }
        filters.setState({ useCase: useCaseArray });
      }
    },
    [filters]
  );

  const handleFilterPriceRange = useCallback(
    (event, newValue) => {
      filters.setState({ priceRange: newValue });
    },
    [filters]
  );

  const handleFilterRating = useCallback(
    (newValue) => {
      filters.setState({ rating: newValue });
    },
    [filters]
  );

  const renderHead = (
    <>
      <Box display="flex" alignItems="center" sx={{ py: 2, pr: 1, pl: 2.5 }}>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Filters
        </Typography>

        <Tooltip title="Reset">
          <IconButton onClick={filters.onResetState}>
            <Badge color="error" variant="dot" invisible={!canReset}>
              <Iconify icon="solar:restart-bold" />
            </Badge>
          </IconButton>
        </Tooltip>

        <IconButton onClick={onClose}>
          <Iconify icon="mingcute:close-line" />
        </IconButton>
      </Box>

      <Divider sx={{ borderStyle: 'dashed' }} />
    </>
  );

  const renderCategory = (
    <Box display="flex" flexDirection="column">
      <Typography variant="subtitle2" sx={{ mb: 1 }}>
        Category
      </Typography>
      {options.categories?.map((option) => (
        <FormControlLabel
          key={option}
          control={
            <Radio
              checked={option === filters.state.category}
              onClick={() => handleFilterCategory(option)}
            />
          }
          label={option}
          sx={{ ...(option === 'all' && { textTransform: 'capitalize' }) }}
        />
      ))}
    </Box>
  );

  const renderUseCase = (
    <Box display="flex" flexDirection="column">
      <Typography variant="subtitle2" sx={{ mb: 1 }}>
        Use Case
      </Typography>
      {options.useCases?.map((option) => {
        const currentUseCases = filters.state.useCase || [];
        const isArray = Array.isArray(currentUseCases);
        const useCaseArray = isArray ? currentUseCases : (currentUseCases === 'all' ? [] : [currentUseCases]);
        const isChecked = option === 'all'
          ? useCaseArray.length === 0
          : useCaseArray.includes(option);

        return (
          <FormControlLabel
            key={option}
            control={
              <Checkbox
                checked={isChecked}
                onChange={() => handleFilterUseCase(option)}
              />
            }
            label={option}
            sx={{ ...(option === 'all' && { textTransform: 'capitalize' }) }}
          />
        );
      })}
    </Box>
  );

  const renderPrice = (
    <Box display="flex" flexDirection="column">
      <Typography variant="subtitle2">Price</Typography>

      <Box gap={5} display="flex" sx={{ my: 2 }}>
        <InputRange type="min" value={filters.state.priceRange} onFilters={filters.setState} maxPrice={maxPrice} />
        <InputRange type="max" value={filters.state.priceRange} onFilters={filters.setState} maxPrice={maxPrice} />
      </Box>

      <Slider
        value={filters.state.priceRange}
        onChange={handleFilterPriceRange}
        step={Math.ceil(maxPrice / 20)}
        min={0}
        max={maxPrice}
        marks={marksLabel}
        getAriaValueText={(value) => `₹${value}`}
        valueLabelFormat={(value) => `₹${value}`}
        sx={{ alignSelf: 'center', width: `calc(100% - 24px)` }}
      />
    </Box>
  );

  const renderRating = (
    <Box display="flex" flexDirection="column">
      <Typography variant="subtitle2" sx={{ mb: 2 }}>
        Rating
      </Typography>

      {options.ratings.map((item, index) => (
        <Box
          key={item}
          onClick={() => handleFilterRating(item)}
          sx={{
            mb: 1,
            gap: 1,
            ml: -1,
            p: 0.5,
            display: 'flex',
            borderRadius: 1,
            cursor: 'pointer',
            typography: 'body2',
            alignItems: 'center',
            '&:hover': { opacity: 0.48 },
            ...(filters.state.rating === item && {
              bgcolor: 'action.selected',
            }),
          }}
        >
          <Rating
            readOnly
            value={4 - index}
            sx={{
              '& .MuiRating-iconFilled': {
                color: 'primary.main',
              },
            }}
          /> & Up
        </Box>
      ))}
    </Box>
  );

  return (
    <>
      <Button
        disableRipple
        color="inherit"
        endIcon={
          <Badge color="error" variant="dot" invisible={!canReset}>
            <Iconify icon="ic:round-filter-list" />
          </Badge>
        }
        onClick={onOpen}
      >
        Filters
      </Button>

      <Drawer
        anchor="right"
        open={open}
        onClose={onClose}
        slotProps={{ backdrop: { invisible: true } }}
        PaperProps={{ sx: { width: 320 } }}
      >
        {renderHead}

        <Scrollbar sx={{ px: 2.5, py: 3 }}>
          <Stack spacing={3}>
            {renderCategory}
            {renderUseCase}
            {renderPrice}
            {renderRating}
          </Stack>
        </Scrollbar>
      </Drawer>
    </>
  );
}

// ----------------------------------------------------------------------

function InputRange({ type, value, onFilters, maxPrice = 200 }) {
  const min = value[0];

  const max = value[1];

  const handleBlurInputRange = useCallback(() => {
    if (min < 0) {
      onFilters({ priceRange: [0, max] });
    }
    if (min > maxPrice) {
      onFilters({ priceRange: [maxPrice, max] });
    }
    if (max < 0) {
      onFilters({ priceRange: [min, 0] });
    }
    if (max > maxPrice) {
      onFilters({ priceRange: [min, maxPrice] });
    }
  }, [max, min, onFilters, maxPrice]);

  return (
    <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ width: 1 }}>
      <Typography
        variant="caption"
        sx={{
          flexShrink: 0,
          color: 'text.disabled',
          textTransform: 'capitalize',
          fontWeight: 'fontWeightSemiBold',
        }}
      >
        {`${type} (₹)`}
      </Typography>

      <InputBase
        fullWidth
        value={type === 'min' ? min : max}
        onChange={(event) =>
          type === 'min'
            ? onFilters({ priceRange: [Number(event.target.value), max] })
            : onFilters({ priceRange: [min, Number(event.target.value)] })
        }
        onBlur={handleBlurInputRange}
        inputProps={{
          step: Math.ceil(maxPrice / 20),
          min: 0,
          max: maxPrice,
          type: 'number',
          'aria-labelledby': 'input-slider',
        }}
        sx={{
          maxWidth: 48,
          borderRadius: 0.75,
          bgcolor: (theme) => varAlpha(theme.vars.palette.grey['500Channel'], 0.08),
          [`& .${inputBaseClasses.input}`]: {
            pr: 1,
            py: 0.75,
            textAlign: 'right',
            typography: 'body2',
          },
        }}
      />
    </Stack>
  );
}
