import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

import { MusicProps } from '@utils/Types/musicProps'

export interface TrackListOfflineProps {
  trackListOffline: MusicProps[]
}

export interface AddOfflineMusicProps {
  newMusic: MusicProps
}

const initialState: TrackListOfflineProps = {
  trackListOffline: [],
}

const trackListSlice = createSlice({
  name: 'trackListOffline',
  initialState,
  reducers: {
    handleTrackListOffline(state, action: PayloadAction<AddOfflineMusicProps>) {
      state.trackListOffline.push(action.payload.newMusic)
    },
  },
})

export const { handleTrackListOffline } = trackListSlice.actions

export default trackListSlice.reducer
