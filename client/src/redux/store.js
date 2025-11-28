// app/store.js
import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import cartReducer from './slices/cartSlice';
import userReducer from './slices/userSlice';

// const cartPersistConfig = {
//   key: 'cart',
//   storage,
//   whitelist: ['items', 'total'],
// };

// const userPersistConfig = {
//   key: 'userState',
//   storage,
//   whitelist: ['user'], // or the key in your slice that holds login info
// };

// const persistedCartReducer = persistReducer(cartPersistConfig, cartReducer);
// const persistedUserReducer = persistReducer(userPersistConfig, userReducer);

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    userState: userReducer,
  },
  // middleware: (getDefaultMiddleware) =>
  //   getDefaultMiddleware({
  //     serializableCheck: {
  //       ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
  //     },
  //   }),
});

export default store;