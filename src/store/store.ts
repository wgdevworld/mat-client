import AsyncStorage from '@react-native-async-storage/async-storage';
import {configureStore} from '@reduxjs/toolkit';
import {persistReducer} from 'redux-persist';
import {changeStringToJSON} from '../tools/CommonFunc';
import rootReducer, {initialStateObject} from './modules';

export const initStore = async () => {
  const storage = await AsyncStorage.getItem('persist:root');

  if (storage) {
    const root = changeStringToJSON(storage);

    Object.keys(root).forEach(key => {
      // String to JSON
      const store = changeStringToJSON(root[key]);
      if (initialStateObject[key]) {
        root[key] = {
          ...initialStateObject[key],
          ...store,
        };
      } else {
        delete root[key];
      }
    });

    Object.keys(root).forEach(key => {
      // JSON to string
      if (initialStateObject[key]) {
        root[key] = JSON.stringify(root[key]);
      }
    });

    await AsyncStorage.setItem('persist:root', JSON.stringify(root));
  }
};

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      immutableCheck: false,
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
