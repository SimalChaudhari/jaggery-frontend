import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { workflowService } from 'src/services/workflow.service';
import { toast } from 'src/components/snackbar';

// Async thunks for API calls
export const fetchWorkflows = createAsyncThunk('workflows/fetchWorkflows', async (_, { rejectWithValue }) => {
  try {
    const response = await workflowService.getAllWorkflows();
    return response;
  } catch (error) {
    const errorMessage = error?.message || 'Failed to fetch workflows';
    toast.error(errorMessage);
    return rejectWithValue(errorMessage);
  }
});

export const createWorkflow = createAsyncThunk('workflows/createWorkflow', async ({ workflowData, imageFile }, { rejectWithValue }) => {
  try {
    const response = await workflowService.createWorkflow(workflowData, imageFile);
    return response;
  } catch (error) {
    const errorMessage = error?.response?.data?.message || error?.message || 'Failed to create workflow';
    toast.error(errorMessage);
    return rejectWithValue(errorMessage);
  }
});

export const updateWorkflow = createAsyncThunk('workflows/updateWorkflow', async ({ id, workflowData, imageFile }, { rejectWithValue }) => {
  try {
    const response = await workflowService.updateWorkflow(id, workflowData, imageFile);
    return response;
  } catch (error) {
    const errorMessage = error?.response?.data?.message || error?.message || 'Failed to update workflow';
    toast.error(errorMessage);
    return rejectWithValue(errorMessage);
  }
});

export const deleteWorkflow = createAsyncThunk('workflows/deleteWorkflow', async (id, { rejectWithValue }) => {
  try {
    await workflowService.deleteWorkflow(id);
    return id;
  } catch (error) {
    const errorMessage = error?.message || 'Failed to delete workflow';
    toast.error(errorMessage);
    return rejectWithValue(errorMessage);
  }
});

const workflowSlice = createSlice({
  name: 'workflows',
  initialState: {
    workflows: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWorkflows.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWorkflows.fulfilled, (state, action) => {
        state.loading = false;
        state.workflows = action.payload;
      })
      .addCase(fetchWorkflows.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createWorkflow.fulfilled, (state, action) => {
        state.workflows.unshift(action.payload);
      })
      .addCase(updateWorkflow.fulfilled, (state, action) => {
        const index = state.workflows.findIndex((workflow) => workflow.id === action.payload.id);
        if (index !== -1) {
          state.workflows[index] = action.payload;
        }
      })
      .addCase(deleteWorkflow.fulfilled, (state, action) => {
        state.workflows = state.workflows.filter((workflow) => workflow.id !== action.payload);
      });
  },
});

export default workflowSlice.reducer;

