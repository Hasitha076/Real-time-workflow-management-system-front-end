import { configureStore, combineReducers } from "@reduxjs/toolkit";
import snackbarReducer from "./snackbarSlice";
import userReducer from "./userSlice";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";

// persist config
const persistConfig = {
  key: "root",
  version: 1,
  storage,
};

// root reducer
const rootReducer = combineReducers({
  user: userReducer,
  snackbar: snackbarReducer,
});

// apply persistence
const persistedReducer = persistReducer(persistConfig, rootReducer);

// store config
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore redux-persist non-serializable actions
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

// create persistor
export const persistor = persistStore(store);
