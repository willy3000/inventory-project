import { createSlice } from '@reduxjs/toolkit';

// Create a slice for managing user information
const itemsSlice = createSlice({
  name: 'items',
  initialState: {
    items: [], // Or initialize with default user data
  },
  reducers: {
    setItems: (state, action) => {
      state.items = action.payload; // Set user information
    },
  },
});

// Export actions and reducer
export const { setItems } = itemsSlice.actions;
export default itemsSlice.reducer;