import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { sizeService } from 'src/services/size.service';
import { toast } from 'src/components/snackbar';

// Async thunks for API calls
export const fetchSizes = createAsyncThunk('sizes/fetchSizes', async (_, { rejectWithValue }) => {
  try {
    const response = await sizeService.getAllSizes();
    return response;
  } catch (error) {
    const errorMessage = error?.message || 'Failed to fetch sizes';
    toast.error(errorMessage);
    return rejectWithValue(errorMessage);
  }
});

export const createSize = createAsyncThunk('sizes/createSize', async (data, { rejectWithValue }) => {
  try {
    const response = await sizeService.createSize(data);
    return response;
  } catch (error) {
    const errorMessage = error?.response?.data?.message || error?.message || 'Failed to create size';
    toast.error(errorMessage);
    return rejectWithValue(errorMessage);
  }
});

export const updateSize = createAsyncThunk('sizes/updateSize', async ({ id, data }, { rejectWithValue }) => {
  try {
    const response = await sizeService.updateSize(id, data);
    return response;
  } catch (error) {
    const errorMessage = error?.response?.data?.message || error?.message || 'Failed to update size';
    toast.error(errorMessage);
    return rejectWithValue(errorMessage);
  }
});

export const deleteSize = createAsyncThunk('sizes/deleteSize', async (id, { rejectWithValue }) => {
  try {
    await sizeService.deleteSize(id);
    return id; // Return the ID of the deleted size
  } catch (error) {
    const errorMessage = error?.message || 'Failed to delete size';
    toast.error(errorMessage);
    return rejectWithValue(errorMessage);
  }
});

const sizeSlice = createSlice({
  name: 'sizes',
  initialState: {
    sizes: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSizes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSizes.fulfilled, (state, action) => {
        state.loading = false;
        state.sizes = action.payload;
      })
      .addCase(fetchSizes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createSize.fulfilled, (state, action) => {
        state.sizes.unshift(action.payload); // Add new size to the beginning
      })
      .addCase(updateSize.fulfilled, (state, action) => {
        const index = state.sizes.findIndex((size) => size.id === action.payload.id);
        if (index !== -1) {
          state.sizes[index] = action.payload;
        }
      })
      .addCase(deleteSize.fulfilled, (state, action) => {
        state.sizes = state.sizes.filter((size) => size.id !== action.payload);
      });
  },
});

export default sizeSlice.reducer;

