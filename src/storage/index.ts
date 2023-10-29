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
import { TrackListLocalProps } from './modules/trackListLocal/reducer'
import { UserProps } from './modules/user/reducer'
import { ConfigProps } from './modules/config/reducer'
import { TrackListRemoteProps } from './modules/trackListRemote/reducer'
import { CurrentMusicProps } from './modules/currentMusic/reducer'

export interface ReduxProps {
  musicPlayerSettings: MusicPlayerSettingsProps
  trackListLocal: TrackListLocalProps
  trackListRemote: TrackListRemoteProps
  user: UserProps
  config: ConfigProps
  currentMusic: CurrentMusicProps
}

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  blacklist: ['musicPlayerSettings', 'currentMusic'],
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
