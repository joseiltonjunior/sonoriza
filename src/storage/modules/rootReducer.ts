import { combineReducers } from '@reduxjs/toolkit'

import trackListRemote from './trackListRemote/reducer'
import user from './user/reducer'

import currentMusic from './currentMusic/reducer'
import musicalGenres from './musicalGenres/reducer'
import artists from './artists/reducer'

import queue from './queue/reducer'

export default combineReducers({
  trackListRemote,
  user,
  currentMusic,
  musicalGenres,
  artists,
  queue,
})
