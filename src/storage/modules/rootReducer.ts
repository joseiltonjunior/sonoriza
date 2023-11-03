import { combineReducers } from '@reduxjs/toolkit'

import trackListLocal from './trackListLocal/reducer'
import trackListRemote from './trackListRemote/reducer'
import user from './user/reducer'
import config from './config/reducer'
import currentMusic from './currentMusic/reducer'
import musicalGenres from './musicalGenres/reducer'
import artists from './artists/reducer'

export default combineReducers({
  trackListLocal,
  trackListRemote,
  user,
  config,
  currentMusic,
  musicalGenres,
  artists,
})
