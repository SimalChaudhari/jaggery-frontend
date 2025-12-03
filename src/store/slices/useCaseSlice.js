import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { useCaseService } from 'src/services/use-case.service';
import { toast } from 'src/components/snackbar';

// Async thunks for API calls
export const fetchUseCases = createAsyncThunk('useCases/fetchUseCases', async (_, { rejectWithValue }) => {
  try {
    const response = await useCaseService.getAllUseCases();
    return response;
  } catch (error) {
    const errorMessage = error?.message || 'Failed to fetch use cases';
    toast.error(errorMessage);
    return rejectWithValue(errorMessage);
  }
});

export const createUseCase = createAsyncThunk('useCases/createUseCase', async (formData, { rejectWithValue }) => {
  try {
    const response = await useCaseService.createUseCase(formData);
    return response;
  } catch (error) {
    const errorMessage = error?.response?.data?.message || error?.message || 'Failed to create use case';
    toast.error(errorMessage);
    return rejectWithValue(errorMessage);
  }
});

export const updateUseCase = createAsyncThunk('useCases/updateUseCase', async ({ id, formData }, { rejectWithValue }) => {
  try {
    const response = await useCaseService.updateUseCase(id, formData);
    return response;
  } catch (error) {
    const errorMessage = error?.response?.data?.message || error?.message || 'Failed to update use case';
    toast.error(errorMessage);
    return rejectWithValue(errorMessage);
  }
});

export const deleteUseCase = createAsyncThunk('useCases/deleteUseCase', async (id, { rejectWithValue }) => {
  try {
    await useCaseService.deleteUseCase(id);
    return id; // Return the ID of the deleted use case
  } catch (error) {
    const errorMessage = error?.message || 'Failed to delete use case';
    toast.error(errorMessage);
    return rejectWithValue(errorMessage);
  }
});

const useCaseSlice = createSlice({
  name: 'useCases',
  initialState: {
    useCases: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUseCases.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUseCases.fulfilled, (state, action) => {
        state.loading = false;
        state.useCases = action.payload;
      })
      .addCase(fetchUseCases.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createUseCase.fulfilled, (state, action) => {
        state.useCases.unshift(action.payload); // Add new use case to the beginning
      })
      .addCase(updateUseCase.fulfilled, (state, action) => {
        const index = state.useCases.findIndex((useCase) => useCase.id === action.payload.id);
        if (index !== -1) {
          state.useCases[index] = action.payload;
        }
      })
      .addCase(deleteUseCase.fulfilled, (state, action) => {
        state.useCases = state.useCases.filter((useCase) => useCase.id !== action.payload);
      });
  },
});

export default useCaseSlice.reducer;

