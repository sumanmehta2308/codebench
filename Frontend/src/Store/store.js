import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../Features/storeslice";

/* WORKFLOW: STORE CONFIGURATION
  1. We register 'authReducer' under the key 'auth'.
  2. Anywhere in your app, you can now call: 
     const { user } = useSelector((state) => state.auth);
*/
const store = configureStore({
  reducer: {
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Prevents Redux from crashing due to the Socket object
    }),
});

export default store;
