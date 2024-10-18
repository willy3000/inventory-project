import { createSlice } from '@reduxjs/toolkit';

// Create a slice for managing user information
const employeesSlice = createSlice({
  name: 'employees',
  initialState: {
    employees: [], // Or initialize with default user data
  },
  reducers: {
    setEmployees: (state, action) => {
      state.employees = action.payload; // Set user information
    },
  },
});

// Export actions and reducer
export const { setEmployees } = employeesSlice.actions;
export default employeesSlice.reducer;