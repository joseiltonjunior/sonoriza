import { combineReducers } from '@reduxjs/toolkit'

import musicPlayerSettings from './musicPlayerSettings/reducer'
import trackListLocal from './trackListLocal/reducer'
import trackListRemote from './trackListRemote/reducer'
import user from './user/reducer'
import config from './config/reducer'

export default combineReducers({
  musicPlayerSettings,
  trackListLocal,
  trackListRemote,
  user,
  config,
})
