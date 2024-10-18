import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import itemsReducer from './slices/itemsSlice'; 
import groupItemsReducer from './slices/groupItemsSlice';
import employeesReducer from './slices/employeesSlice'

// Create the Redux store
const store = configureStore({
  reducer: {
    user: userReducer,
    items: itemsReducer,
    employees: employeesReducer,
    groupItems: groupItemsReducer,
  },
});

export default store;