import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import tableReducer from './tableSlice';
import preferencesReducer from './preferencesSlice';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['preferences']
};

const persistedReducer = persistReducer(persistConfig, preferencesReducer);

export const store = configureStore({
  reducer: {
    table: tableReducer,
    preferences: persistedReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;