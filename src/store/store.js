import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice'; // Import your user slice
import itemsReducer from './slices/itemsSlice'; // Import your user slice

// Create the Redux store
const store = configureStore({
  reducer: {
    user: userReducer,
    items: itemsReducer,
  },
});

export default store;