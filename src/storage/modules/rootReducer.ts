import { combineReducers } from '@reduxjs/toolkit'

import trackListOffline from './trackListOffline/reducer'
import user from './user/reducer'

import currentMusic from './currentMusic/reducer'

import queue from './queue/reducer'
import historic from './historic/reducer'

import releases from './releases/reducer'
import favoriteMusics from './favoriteMusics/reducer'
import favoriteArtists from './favoriteArtists/reducer'

import trackPlayer from './trackPlayer/reducer'

import netInfo from './netInfo/reducer'
import searchHistoric from './searchHistoric/reducer'
import inspiredMixes from './inspiredMixes/reducer'
import notifications from './notifications/reducer'
import newsNotifications from './newsNotifications/reducer'
import historicNotifications from './historicNotifications/reducer'

export default combineReducers({
  user,
  currentMusic,
  queue,
  historic,
  trackListOffline,
  netInfo,
  trackPlayer,
  favoriteArtists,
  releases,
  favoriteMusics,
  searchHistoric,
  inspiredMixes,
  newsNotifications,
  notifications,
  historicNotifications,
})
