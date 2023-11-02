import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

import { MusicProps } from '@utils/Types/musicProps'

export interface TrackListRemoteProps {
  trackListRemote: MusicProps[]
}

const initialState: TrackListRemoteProps = {
  trackListRemote: [],
}

const trackListSlice = createSlice({
  name: 'trackListRemote',
  initialState,
  reducers: {
    handleTrackListRemote(state, action: PayloadAction<TrackListRemoteProps>) {
      state.trackListRemote = action.payload.trackListRemote
    },
  },
})

export const { handleTrackListRemote } = trackListSlice.actions

export default trackListSlice.reducer
