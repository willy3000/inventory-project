import { createSlice } from "@reduxjs/toolkit";

// Create a slice for managing user information
const permissionsSlice = createSlice({
  name: "permissions",
  initialState: {
    permissions: {
      canEditEmployee: false,
      canEditInventory: false,
      canAssignItem: false,
    }, // Or initialize with default user data
  },
  reducers: {
    setPermissions: (state, action) => {
        console.log('permissions set', action.payload)
      state.permissions = action.payload; // Set user information
    },
  },
});

// Export actions and reducer
export const { setPermissions } = permissionsSlice.actions;
export default permissionsSlice.reducer;
