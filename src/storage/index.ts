import { configureStore } from '@reduxjs/toolkit'
import rootReducer from './modules/rootReducer'
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { MusicPlayerSettingsProps } from './modules/musicPlayerSettings/reducer'
import { TrackListProps } from './modules/trackList/reducer'

export interface ReduxProps {
  musicPlayerSettings: MusicPlayerSettingsProps
  trackList: TrackListProps
}

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  blacklist: ['musicPlayerSettings'],
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
})

const persistor = persistStore(store)

export { store, persistor }
