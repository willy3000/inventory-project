import { createSlice } from '@reduxjs/toolkit';

// Create a slice for managing subscription information
const subsriptionSlice = createSlice({
  name: 'subscription',
  initialState: {
    subscription: null, // default subscription data
  },
  reducers: {
    setSubscription: (state, action) => {
        console.log(action.payload)
      state.subscription = action.payload; // Set subscription information
    },
  },
});

// Export actions and reducer
export const { setSubscription } = subsriptionSlice.actions;
export default subsriptionSlice.reducer;