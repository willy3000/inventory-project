import { createSlice } from '@reduxjs/toolkit';

// Create a slice for managing user information
const roleSlice = createSlice({
  name: 'role',
  initialState: {
    role: "user", // Or initialize with default user data
  },
  reducers: {
    setRole: (state, action) => {
      state.role = action.payload; // Set user information
    },
  },
});

// Export actions and reducer
export const { setRole } = roleSlice.actions;
export default roleSlice.reducer;