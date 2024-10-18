import { createSlice } from '@reduxjs/toolkit';

// Create a slice for managing user information
const groupItemsSlice = createSlice({
  name: 'groupItems',
  initialState: {
    groupItems: [], // Or initialize with default user data
  },
  reducers: {
    setGroupItems: (state, action) => {
      state.groupItems = action.payload; // Set user information
    },
  },
});

// Export actions and reducer
export const { setGroupItems } = groupItemsSlice.actions;
export default groupItemsSlice.reducer;