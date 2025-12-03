import Chip from '@mui/material/Chip';

import { chipProps, FiltersBlock, FiltersResult } from 'src/components/filters-result';

// ----------------------------------------------------------------------

export function ProductFiltersResult({ filters, totalResults, sx, maxPrice = 200 }) {
  const handleRemoveCategory = () => {
    filters.setState({ category: 'all' });
  };

  const handleRemoveUseCase = () => {
    filters.setState({ useCase: [] });
  };

  const handleRemovePrice = () => {
    filters.setState({ priceRange: [0, maxPrice] });
  };

  const handleRemoveRating = () => {
    filters.setState({ rating: '' });
  };

  return (
    <FiltersResult totalResults={totalResults} onReset={filters.onResetState} sx={sx}>
      <FiltersBlock label="Category:" isShow={filters.state.category !== 'all'}>
        <Chip {...chipProps} label={filters.state.category} onDelete={handleRemoveCategory} />
      </FiltersBlock>

      <FiltersBlock
        label="Use Case:"
        isShow={Array.isArray(filters.state.useCase) ? filters.state.useCase.length > 0 : filters.state.useCase !== 'all'}
      >
        {Array.isArray(filters.state.useCase) ? (
          filters.state.useCase.map((useCase) => (
            <Chip
              key={useCase}
              {...chipProps}
              label={useCase}
              onDelete={() => {
                const updated = filters.state.useCase.filter((uc) => uc !== useCase);
                filters.setState({ useCase: updated });
              }}
            />
          ))
        ) : (
          <Chip {...chipProps} label={filters.state.useCase} onDelete={handleRemoveUseCase} />
        )}
      </FiltersBlock>

      <FiltersBlock
        label="Price:"
        isShow={filters.state.priceRange[0] !== 0 || filters.state.priceRange[1] !== maxPrice}
      >
        <Chip
          {...chipProps}
          label={`₹${filters.state.priceRange[0]} - ${filters.state.priceRange[1]}`}
          onDelete={handleRemovePrice}
        />
      </FiltersBlock>

      <FiltersBlock label="Rating:" isShow={!!filters.state.rating}>
        <Chip {...chipProps} label={filters.state.rating} onDelete={handleRemoveRating} />
      </FiltersBlock>
    </FiltersResult>
  );
}
