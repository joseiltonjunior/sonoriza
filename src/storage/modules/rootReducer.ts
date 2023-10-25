import { combineReducers } from '@reduxjs/toolkit'

import musicPlayerSettings from './musicPlayerSettings/reducer'
import trackList from './trackList/reducer'
import sideMenu from './sideMenu/reducer'

export default combineReducers({
  musicPlayerSettings,
  trackList,
  sideMenu,
})
