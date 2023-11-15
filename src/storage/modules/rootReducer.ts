import { combineReducers } from '@reduxjs/toolkit'

import trackListRemote from './trackListRemote/reducer'
import user from './user/reducer'

import currentMusic from './currentMusic/reducer'
import musicalGenres from './musicalGenres/reducer'
import artists from './artists/reducer'

import queue from './queue/reducer'
import historic from './historic/reducer'

export default combineReducers({
  trackListRemote,
  user,
  currentMusic,
  musicalGenres,
  artists,
  queue,
  historic,
})
