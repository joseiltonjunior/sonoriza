import { combineReducers } from '@reduxjs/toolkit'

import musicPlayerSettings from './musicPlayerSettings/reducer'
import trackList from './trackList/reducer'
import user from './user/reducer'
import config from './config/reducer'

export default combineReducers({
  musicPlayerSettings,
  trackList,
  user,
  config,
})
