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
import { ReleasesProps } from './modules/releases/reducer'
import { FavoriteArtistsProps } from './modules/favoriteArtists/reducer'
import { FavoriteMusicsProps } from './modules/favoriteMusics/reducer'
import { NetInfoProps } from './modules/netInfo/reducer'
import { TrackPlayerProps } from './modules/trackPlayer/reducer'
import { SearchHistoricProps } from './modules/searchHistoric/reducer'
import { InspiredMixesProps } from './modules/inspiredMixes/reducer'
import { NotificationsProps } from './modules/notifications/reducer'
import { NewsNotificationsProps } from './modules/newsNotifications/reducer'
import { HistoricNotificationsProps } from './modules/historicNotifications/reducer'

export interface ReduxProps {
  user: UserProps
  currentMusic: CurrentMusicProps
  queue: QueueProps
  historic: HistoricProps
  trackListOffline: TrackListOfflineProps

  releases: ReleasesProps
  favoriteMusics: FavoriteMusicsProps
  favoriteArtists: FavoriteArtistsProps

  netInfo: NetInfoProps
  trackPlayer: TrackPlayerProps

  searchHistoric: SearchHistoricProps
  inspiredMixes: InspiredMixesProps

  notifications: NotificationsProps
  newsNotifications: NewsNotificationsProps
  historicNotifications: HistoricNotificationsProps
}

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  blacklist: ['currentMusic', 'netInfo', 'trackPlayer'],
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      immutableCheck: false,
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
})

const persistor = persistStore(store)

export { store, persistor }
