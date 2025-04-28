import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // Defaults to localStorage for web
import authReducer from "./slices/authSlice";
import serviceReducer from "./slices/serviceSlice";
import organizationReducer from "./slices/orgSlice";
import projectReducer from "./slices/projectSlice";
import userReducer from "./slices/userSlice";
import chatGroupReducer from "./slices/chatGroupSlice";
import themeReducer from './slices/themeSlice';
import taskReducer from "./slices/taskSlice";
import fileReducer from "./slices/fileSlice";

// Persist configuration
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth"], // Only persist the auth slice
};

const persistedAuthReducer = persistReducer(persistConfig, authReducer);

const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    user: userReducer,
    service: serviceReducer,
    organization: organizationReducer,
    project:projectReducer,
    file: fileReducer,
    task: taskReducer,
    chatGroup: chatGroupReducer,
    theme: themeReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST"], // Ignore redux-persist actions
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const persistor = persistStore(store); // Create a persistor
export default store;