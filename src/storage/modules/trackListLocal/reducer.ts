import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { TrackPlayerMusicProps } from '@utils/Types/musicProps'

export interface TrackListLocalProps {
  trackListLocal: TrackPlayerMusicProps[]
}

const initialState: TrackListLocalProps = {
  trackListLocal: [],
}

const trackListSlice = createSlice({
  name: 'trackListLocal',
  initialState,
  reducers: {
    handleTrackListLocal(state, action: PayloadAction<TrackListLocalProps>) {
      state.trackListLocal = action.payload.trackListLocal
    },
  },
})

export const { handleTrackListLocal } = trackListSlice.actions

export default trackListSlice.reducer
