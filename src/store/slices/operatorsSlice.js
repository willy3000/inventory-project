import { createSlice } from '@reduxjs/toolkit';

// Create a slice for managing user information
const operatorsSlice = createSlice({
  name: 'operators',
  initialState: {
    operators: [], // Or initialize with default user data
  },
  reducers: {
    setOperators: (state, action) => {
      state.operators = action.payload; // Set user information
    },
  },
});

// Export actions and reducer
export const { setOperators } = operatorsSlice.actions;
export default operatorsSlice.reducer;