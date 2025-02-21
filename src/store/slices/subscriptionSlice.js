import { createSlice } from '@reduxjs/toolkit';

// Create a slice for managing user information
const subsriptionSlice = createSlice({
  name: 'subscription',
  initialState: {
    subscription: null, // Or initialize with default user data
  },
  reducers: {
    setSubscription: (state, action) => {
        console.log(action.payload)
      state.subscription = action.payload; // Set user information
    },
  },
});

// Export actions and reducer
export const { setSubscription } = subsriptionSlice.actions;
export default subsriptionSlice.reducer;