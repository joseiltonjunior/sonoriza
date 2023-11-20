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

import { UserProps } from './modules/user/reducer'

import { CurrentMusicProps } from './modules/currentMusic/reducer'

import { QueueProps } from './modules/queue/reducer'
import { HistoricProps } from './modules/historic/reducer'
import { TrackListOfflineProps } from './modules/trackListOffline/reducer'
import { MusicalGenresProps } from './modules/musicalGenres/reducer'
import { NetInfoProps } from './modules/netInfo/reducer'

export interface ReduxProps {
  user: UserProps
  currentMusic: CurrentMusicProps
  queue: QueueProps
  historic: HistoricProps
  trackListOffline: TrackListOfflineProps
  musicalGenres: MusicalGenresProps
  netInfo: NetInfoProps
}

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  blacklist: ['currentMusic', 'netInfo'],
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
