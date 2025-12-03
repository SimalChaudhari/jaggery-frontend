import { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams as useSearchParamsRouter } from 'react-router-dom';

import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { DashboardContent } from 'src/layouts/dashboard';

import { useBoolean } from 'src/hooks/use-boolean';
import { useDebounce } from 'src/hooks/use-debounce';
import { useSetState } from 'src/hooks/use-set-state';

import { orderBy } from 'src/utils/helper';

import { useSearchProducts } from 'src/actions/product';
import { PRODUCT_SORT_OPTIONS, PRODUCT_RATING_OPTIONS } from 'src/_mock';
import { fetchCategories } from 'src/store/slices/categorySlice';
import { fetchUseCases } from 'src/store/slices/useCaseSlice';

import { EmptyContent } from 'src/components/empty-content';

import { ProductList } from '../product-list';
import { ProductSort } from '../product-sort';
import { ProductSearch } from '../product-search';
import { CartIcon } from '../components/cart-icon';
import { ProductFilters } from '../product-filters';
import { useCheckoutContext } from '../../checkout/context';
import { ProductFiltersResult } from '../product-filters-result';

// ----------------------------------------------------------------------

export function ProductShopView({ products, loading }) {
  const dispatch = useDispatch();
  const checkout = useCheckoutContext();
  const { categories } = useSelector((state) => state.categories);
  const { useCases } = useSelector((state) => state.useCases);
  const [searchParams, setSearchParams] = useSearchParamsRouter();

  const openFilters = useBoolean();

  const [sortBy, setSortBy] = useState('featured');

  const [searchQuery, setSearchQuery] = useState('');

  const debouncedQuery = useDebounce(searchQuery);

  // Get category and useCase from URL query parameters
  const categoryFromUrl = searchParams.get('category');
  const useCaseFromUrl = searchParams.get('useCase');

  // Fetch categories and use cases
  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchUseCases());
  }, [dispatch]);

  // Calculate max price from products
  const maxPrice = useMemo(() => {
    if (!products || products.length === 0) return 200; // Default fallback

    let max = 0;
    products.forEach((product) => {
      // Check regular price
      if (product.price && product.price > max) {
        max = product.price;
      }
      if (product.priceSale && product.priceSale > max) {
        max = product.priceSale;
      }
      // Check size prices if available
      if (product.sizePrices && Array.isArray(product.sizePrices)) {
        product.sizePrices.forEach((sizePrice) => {
          if (sizePrice.actualPrice && sizePrice.actualPrice > max) {
            max = sizePrice.actualPrice;
          }
          if (sizePrice.discountPrice && sizePrice.discountPrice > max) {
            max = sizePrice.discountPrice;
          }
        });
      }
    });
    // Round up to nearest 10 and add some padding
    return Math.ceil(max / 10) * 10 + 10;
  }, [products]);

  const initialFilterState = {
    rating: '',
    category: 'all',
    useCase: [], // Changed to array for multiple selections
    priceRange: [0, maxPrice],
  };

  const filters = useSetState(initialFilterState);

  // Update priceRange when maxPrice changes, but only if it's still at default values
  useEffect(() => {
    // Only update if priceRange is still at default (min=0 and max matches previous maxPrice or current maxPrice)
    const isAtDefault = filters.state.priceRange[0] === 0;
    if (isAtDefault) {
      filters.setState({ priceRange: [0, maxPrice] });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [maxPrice]);

  // Track if we're updating from URL to prevent loops
  const isUpdatingFromUrl = useRef(false);
  const isInitialMountCategory = useRef(true);
  const isInitialMountUseCase = useRef(true);

  // Update filter when URL category changes (only from external URL changes)
  useEffect(() => {
    if (isUpdatingFromUrl.current) {
      isUpdatingFromUrl.current = false;
      return;
    }

    if (categoryFromUrl) {
      filters.setState({ category: categoryFromUrl });
    } else if (!isInitialMountCategory.current && filters.state.category !== 'all') {
      // Only reset if filter is not already 'all' (to avoid unnecessary updates)
      // Skip on initial mount to avoid overriding URL category
      filters.setState({ category: 'all' });
    }

    if (isInitialMountCategory.current) {
      isInitialMountCategory.current = false;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryFromUrl]);

  // Update filter when URL useCase changes (only from external URL changes)
  useEffect(() => {
    if (isUpdatingFromUrl.current) {
      isUpdatingFromUrl.current = false;
      return;
    }

    if (useCaseFromUrl) {
      // Set useCase as array with single value from URL
      filters.setState({ useCase: [useCaseFromUrl] });
    } else if (!isInitialMountUseCase.current) {
      // Reset useCase if not in URL (but only after initial mount)
      const currentUseCases = filters.state.useCase || [];
      if (Array.isArray(currentUseCases) && currentUseCases.length > 0) {
        filters.setState({ useCase: [] });
      }
    }

    if (isInitialMountUseCase.current) {
      isInitialMountUseCase.current = false;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [useCaseFromUrl]);

  // Update URL when category filter changes (but not when updating from URL)
  useEffect(() => {
    if (isUpdatingFromUrl.current || isInitialMountCategory.current) {
      return;
    }

    if (filters.state.category === 'all') {
      // Remove category from URL if set to 'all'
      if (searchParams.has('category')) {
        const newParams = new URLSearchParams(searchParams);
        newParams.delete('category');
        isUpdatingFromUrl.current = true;
        setSearchParams(newParams, { replace: true });
      }
    } else if (filters.state.category !== categoryFromUrl) {
      // Update URL if category changed and not from URL
      const newParams = new URLSearchParams(searchParams);
      newParams.set('category', filters.state.category);
      isUpdatingFromUrl.current = true;
      setSearchParams(newParams, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.state.category]);

  // Update URL when useCase filter changes (but not when updating from URL)
  useEffect(() => {
    if (isUpdatingFromUrl.current || isInitialMountUseCase.current) {
      return;
    }

    const currentUseCases = filters.state.useCase || [];
    const useCaseArray = Array.isArray(currentUseCases) ? currentUseCases : [];

    if (useCaseArray.length === 0) {
      // Remove useCase from URL if no use cases selected
      if (searchParams.has('useCase')) {
        const newParams = new URLSearchParams(searchParams);
        newParams.delete('useCase');
        isUpdatingFromUrl.current = true;
        setSearchParams(newParams, { replace: true });
      }
    } else if (useCaseArray.length === 1 && useCaseArray[0] !== useCaseFromUrl) {
      // Update URL if single useCase changed and not from URL
      const newParams = new URLSearchParams(searchParams);
      newParams.set('useCase', useCaseArray[0]);
      isUpdatingFromUrl.current = true;
      setSearchParams(newParams, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.state.useCase]);

  // Handle filter reset - also clear URL
  const handleResetFilters = useCallback(() => {
    // Clear category and useCase from URL first
    const newParams = new URLSearchParams(searchParams);
    if (searchParams.has('category')) {
      newParams.delete('category');
    }
    if (searchParams.has('useCase')) {
      newParams.delete('useCase');
    }
    if (newParams.toString() !== searchParams.toString()) {
      setSearchParams(newParams, { replace: true });
    }
    // Then reset filters
    filters.onResetState();
  }, [filters, searchParams, setSearchParams]);

  const { searchResults, searchLoading } = useSearchProducts(debouncedQuery);

  const dataFiltered = applyFilter({ inputData: products, filters: filters.state, sortBy });

  const canReset =
    filters.state.rating !== '' ||
    filters.state.category !== 'all' ||
    (Array.isArray(filters.state.useCase) ? filters.state.useCase.length > 0 : filters.state.useCase !== 'all') ||
    filters.state.priceRange[0] !== 0 ||
    filters.state.priceRange[1] !== maxPrice;

  const notFound = !loading && !dataFiltered.length && canReset;

  const handleSortBy = useCallback((newValue) => {
    setSortBy(newValue);
  }, []);

  const handleSearch = useCallback((inputValue) => {
    setSearchQuery(inputValue);
  }, []);

  const productsEmpty = !loading && !products.length;

  const renderFilters = (
    <Stack
      spacing={3}
      justifyContent="space-between"
      alignItems={{ xs: 'flex-end', sm: 'center' }}
      direction={{ xs: 'column', sm: 'row' }}
    >
      <ProductSearch
        query={debouncedQuery}
        results={searchResults}
        onSearch={handleSearch}
        loading={searchLoading}
      />

      <Stack direction="row" spacing={1} flexShrink={0}>
        <ProductFilters
          filters={filters}
          canReset={canReset}
          open={openFilters.value}
          onOpen={openFilters.onTrue}
          onClose={openFilters.onFalse}
          options={{
            ratings: PRODUCT_RATING_OPTIONS,
            categories: ['all', ...(categories || []).filter((cat) => !cat.parentCategory).map((cat) => cat.title)],
            useCases: ['all', ...(useCases || []).map((uc) => uc.title)],
          }}
          maxPrice={maxPrice}
        />

        <ProductSort sort={sortBy} onSort={handleSortBy} sortOptions={PRODUCT_SORT_OPTIONS} />
      </Stack>
    </Stack>
  );

  const renderResults = (
    <ProductFiltersResult
      filters={filters}
      totalResults={dataFiltered.length}
      onReset={handleResetFilters}
      maxPrice={maxPrice}
    />
  );

  const renderNotFound = <EmptyContent filled sx={{ py: 10 }} />;

  return (
    <DashboardContent sx={{ mb: 15 }}>
      <CartIcon totalItems={checkout.totalItems} />

      <Typography variant="h4" sx={{ my: { xs: 3, md: 5 } }}>
        Shop
      </Typography>

      <Stack spacing={2.5} sx={{ mb: { xs: 3, md: 5 } }}>
        {renderFilters}

        {canReset && renderResults}
      </Stack>

      {/* Show "No data" only when NOT loading and no products found */}
      {!loading && (notFound || productsEmpty) && renderNotFound}

      {/* Show ProductList: when loading (to show skeleton) OR when not loading and has products */}
      {(loading || !(notFound || productsEmpty)) && <ProductList products={dataFiltered} loading={loading} />}
    </DashboardContent>
  );
}

function applyFilter({ inputData, filters, sortBy }) {
  if (!inputData || !Array.isArray(inputData)) {
    return [];
  }

  const { category, useCase, priceRange, rating } = filters;

  const min = priceRange[0];

  const max = priceRange[1];

  // Sort by
  if (sortBy === 'featured') {
    inputData = orderBy(inputData, ['totalSold'], ['desc']);
  }

  if (sortBy === 'newest') {
    inputData = orderBy(inputData, ['createdAt'], ['desc']);
  }

  if (sortBy === 'priceDesc') {
    inputData = orderBy(inputData, ['price'], ['desc']);
  }

  if (sortBy === 'priceAsc') {
    inputData = orderBy(inputData, ['price'], ['asc']);
  }

  // filters
  if (category !== 'all') {
    inputData = inputData.filter((product) => {
      const productCategories = product.categories || [];
      return productCategories.some((cat) => {
        const catTitle = typeof cat === 'object' ? cat.title : cat;
        return catTitle === category;
      });
    });
  }

  // Handle useCase as array (for checkboxes) or string (for backward compatibility)
  const useCaseArray = Array.isArray(useCase) ? useCase : (useCase === 'all' ? [] : [useCase]);
  if (useCaseArray.length > 0) {
    inputData = inputData.filter((product) => {
      const productUseCases = product.useCases || [];
      return productUseCases.some((uc) => {
        const ucTitle = typeof uc === 'object' ? uc.title : uc;
        return useCaseArray.includes(ucTitle);
      });
    });
  }

  // Note: maxPrice is calculated from products, so we check if range is not default
  // Default range is [0, calculatedMaxPrice], so we check if it's been modified
  if (min !== 0 || max !== (filters.maxPrice || 200)) {
    inputData = inputData.filter((product) => {
      // Check both regular price and size prices
      const productPrice = product.price || 0;
      let maxProductPrice = productPrice;

      // Check size prices if available
      if (product.sizePrices && Array.isArray(product.sizePrices)) {
        product.sizePrices.forEach((sizePrice) => {
          if (sizePrice.actualPrice && sizePrice.actualPrice > maxProductPrice) {
            maxProductPrice = sizePrice.actualPrice;
          }
          if (sizePrice.discountPrice && sizePrice.discountPrice > maxProductPrice) {
            maxProductPrice = sizePrice.discountPrice;
          }
        });
      }

      return maxProductPrice >= min && productPrice <= max;
    });
  }

  if (rating) {
    inputData = inputData.filter((product) => {
      const convertRating = (value) => {
        if (value === 'up5Star') return 5;
        if (value === 'up4Star') return 4;
        if (value === 'up3Star') return 3;
        if (value === 'up2Star') return 2;
        return 1; // up1Star
      };
      // Filter products with rating >= selected rating (e.g., up1Star means >= 1 star)
      return product.totalRatings >= convertRating(rating);
    });
  }

  return inputData;
}
