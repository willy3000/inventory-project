import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import itemsReducer from "./slices/itemsSlice";
import groupItemsReducer from "./slices/groupItemsSlice";
import employeesReducer from "./slices/employeesSlice";
import operatorsReducer from "./slices/operatorsSlice";
import roleReducer from "./slices/roleSlice";
import logsReducer from "./slices/logsSlice";
import permissionsReducer from "./slices/permissionsSlice";

// Create the Redux store
const store = configureStore({
  reducer: {
    user: userReducer,
    items: itemsReducer,
    employees: employeesReducer,
    groupItems: groupItemsReducer,
    operators: operatorsReducer,
    role: roleReducer,
    logs: logsReducer,
    permissions: permissionsReducer,
  },
});

export default store;
