import { createSlice } from '@reduxjs/toolkit';

// Create a slice for managing user information
const userSlice = createSlice({
  name: 'user',
  initialState: {
    user: null, // user is null by default
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload; // Set user information
    },
    clearUser: (state) => {
      state.user = null; // Clear user information
    },
  },
});

// Export actions and reducer
export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;