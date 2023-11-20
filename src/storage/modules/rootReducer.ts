import { combineReducers } from '@reduxjs/toolkit'

import trackListOffline from './trackListOffline/reducer'
import user from './user/reducer'

import currentMusic from './currentMusic/reducer'

import queue from './queue/reducer'
import historic from './historic/reducer'

import musicalGenres from './musicalGenres/reducer'

export default combineReducers({
  user,
  currentMusic,
  queue,
  historic,
  trackListOffline,
  musicalGenres,
})
