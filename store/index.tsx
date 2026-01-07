import "react-native-get-random-values";

// project import
import reducers, { RootState } from "./reducers";

// third-party
import { configureStore } from "@reduxjs/toolkit";
import Constants from "expo-constants";
import React from "react";
import { Provider } from "react-redux";
import { persistReducer, persistStore } from "redux-persist";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { setupListeners } from "@reduxjs/toolkit/query";
import { encryptTransform } from "redux-persist-transform-encrypt";
import { Persistor } from "redux-persist/es/types";
import { apiMiddlewares } from "../api/services";
import { userNotificationMiddleware } from "./middleware/userNotificationMiddleware";
import { socketMiddleware } from "./middleware/socketMiddleware";

import { chatListenerMiddleware } from "./middleware/chatMiddleware";

// ==============================|| REDUX PERSIST For Next.js SSR ||============================== //
import { PersistGate } from "redux-persist/integration/react";

// ==============================|| REDUX TOOLKIT - MAIN STORE ||============================== //

const APP_NAME = Constants.expoConfig?.extra?.APP_NAME || "MyApp";

const persistConfig = {
  keyPrefix: APP_NAME.replaceAll(" ", "-").toLowerCase() + "-",
  key: "store",
  storage: AsyncStorage,
  transforms: [
    // For Store Encryption in LocalStorage
    encryptTransform({
      secretKey: "your-secret-key", // Replace with your actual secret key
    }),
  ],
  // Only persist the auth slice
  whitelist: ["auth"],
};

// Persist All reducers
const persistedReducer = persistReducer<RootState>(persistConfig, reducers);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware({
      serializableCheck: false,
    })
      .prepend(userNotificationMiddleware.middleware)
      .prepend(chatListenerMiddleware.middleware)
      .concat(...apiMiddlewares, socketMiddleware);
  },
});

// Setup React Query listeners for re-fetching on app focus or network change etc
setupListeners(store.dispatch);

const persistor = persistStore(store) as Persistor;

const { dispatch } = store;

interface ReduxPersistedProps {
  children: React.ReactNode;
}

export type AppDispatch = typeof store.dispatch;

const ReduxPersisted = ({ children }: ReduxPersistedProps) => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  );
};

export { dispatch, ReduxPersisted, store };
