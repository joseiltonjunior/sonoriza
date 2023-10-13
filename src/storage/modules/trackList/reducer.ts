import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { MusicProps } from '@utils/Types/musicProps'

export interface TrackListProps {
  trackList: MusicProps[]
}

const initialState: TrackListProps = {
  trackList: [],
}

const trackListSlice = createSlice({
  name: 'trackList',
  initialState,
  reducers: {
    handleTrackList(state, action: PayloadAction<TrackListProps>) {
      state.trackList = action.payload.trackList
    },
  },
})

export const { handleTrackList } = trackListSlice.actions

export default trackListSlice.reducer
