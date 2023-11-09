import { TrackProps } from '@hooks/useTrackPlayer'
import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface QueueProps {
  queue: TrackProps[]
}

const initialState: QueueProps = {
  queue: [],
}

const queueSlice = createSlice({
  name: 'queue',
  initialState,
  reducers: {
    handleSetQueue(state, action: PayloadAction<QueueProps>) {
      state.queue = action.payload.queue
    },
  },
})

export const { handleSetQueue } = queueSlice.actions

export default queueSlice.reducer
