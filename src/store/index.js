import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import categoryReducer from './slices/categorySlice';
import tagReducer from './slices/tagSlice';
import labelReducer from './slices/labelSlice';
import workflowReducer from './slices/workflowSlice';
import communityReducer from './slices/communitySlice';
import courseReducer from './slices/courseSlice';
import productReducer from './slices/productSlice';
import useCaseReducer from './slices/useCaseSlice';
import sizeReducer from './slices/sizeSlice';
import addressReducer from './slices/addressSlice';

export const store = configureStore({
  reducer: {
    users: userReducer,
    categories: categoryReducer,
    tags: tagReducer,
    labels: labelReducer,
    workflows: workflowReducer,
    communities: communityReducer,
    courses: courseReducer,
    products: productReducer,
    useCases: useCaseReducer,
    sizes: sizeReducer,
    addresses: addressReducer,
  },
});

export default store;

