import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { courseService } from 'src/services/course.service';
import { toast } from 'src/components/snackbar';

// Async thunks for API calls
export const fetchCourses = createAsyncThunk('courses/fetchCourses', async (_, { rejectWithValue }) => {
  try {
    const response = await courseService.getAllCourses();
    return response;
  } catch (error) {
    const errorMessage = error?.message || 'Failed to fetch courses';
    toast.error(errorMessage);
    return rejectWithValue(errorMessage);
  }
});

export const createCourse = createAsyncThunk('courses/createCourse', async ({ courseData, imageFile }, { rejectWithValue }) => {
  try {
    const response = await courseService.createCourse(courseData, imageFile);
    return response;
  } catch (error) {
    const errorMessage = error?.response?.data?.message || error?.message || 'Failed to create course';
    toast.error(errorMessage);
    return rejectWithValue(errorMessage);
  }
});

export const updateCourse = createAsyncThunk('courses/updateCourse', async ({ id, courseData, imageFile }, { rejectWithValue }) => {
  try {
    const response = await courseService.updateCourse(id, courseData, imageFile);
    return response;
  } catch (error) {
    const errorMessage = error?.response?.data?.message || error?.message || 'Failed to update course';
    toast.error(errorMessage);
    return rejectWithValue(errorMessage);
  }
});

export const deleteCourse = createAsyncThunk('courses/deleteCourse', async (id, { rejectWithValue }) => {
  try {
    await courseService.deleteCourse(id);
    return id; // Return the ID of the deleted course
  } catch (error) {
    const errorMessage = error?.message || 'Failed to delete course';
    toast.error(errorMessage);
    return rejectWithValue(errorMessage);
  }
});

const courseSlice = createSlice({
  name: 'courses',
  initialState: {
    courses: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCourses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCourses.fulfilled, (state, action) => {
        state.loading = false;
        state.courses = action.payload;
      })
      .addCase(fetchCourses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createCourse.fulfilled, (state, action) => {
        state.courses.unshift(action.payload); // Add new course to the beginning
      })
      .addCase(updateCourse.fulfilled, (state, action) => {
        const index = state.courses.findIndex((course) => course.id === action.payload.id);
        if (index !== -1) {
          state.courses[index] = action.payload;
        }
      })
      .addCase(deleteCourse.fulfilled, (state, action) => {
        state.courses = state.courses.filter((course) => course.id !== action.payload);
      });
  },
});

export default courseSlice.reducer;

