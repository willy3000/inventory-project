import { createSlice } from "@reduxjs/toolkit";

// Create a slice for managing user information
const logsSlice = createSlice({
  name: "logs",
  initialState: {
    logs: [], // Or initialize with default user data
  },
  reducers: {
    setLogs: (state, action) => {
      state.logs = action.payload; // Set user information
    },
  },
});

// Export actions and reducer
export const { setLogs } = logsSlice.actions;
export default logsSlice.reducer;
