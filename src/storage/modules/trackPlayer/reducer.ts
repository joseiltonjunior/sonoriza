import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface TrackPlayerProps {
  isInitialized: boolean
}

const initialState: TrackPlayerProps = {
  isInitialized: false,
}

const trackPlayerSlice = createSlice({
  name: 'trackPlayer',
  initialState,
  reducers: {
    handleInitializedTrackPlayer(
      state,
      action: PayloadAction<TrackPlayerProps>,
    ) {
      state.isInitialized = action.payload.isInitialized
    },
  },
})

export const { handleInitializedTrackPlayer } = trackPlayerSlice.actions

export default trackPlayerSlice.reducer
