import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { Track } from 'react-native-track-player'

export interface QueueProps {
  queue: Track[]
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
