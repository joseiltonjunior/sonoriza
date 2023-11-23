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
    setTrackListOffline(state, action: PayloadAction<AddOfflineMusicProps>) {
      state.trackListOffline.push(action.payload.newMusic)
    },

    removeTrackOffline(state, action: PayloadAction<AddOfflineMusicProps>) {
      const filter = state.trackListOffline.filter(
        (music) => music.id !== action.payload.newMusic.id,
      )
      state.trackListOffline = filter
    },
  },
})

export const { setTrackListOffline, removeTrackOffline } =
  trackListSlice.actions

export default trackListSlice.reducer
