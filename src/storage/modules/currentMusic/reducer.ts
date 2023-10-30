import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

import { State } from 'react-native-track-player'

import { MusicProps } from '@utils/Types/musicProps'

export interface CurrentMusicProps {
  isCurrentMusic?: MusicProps
  state?: State
}

const initialState: CurrentMusicProps = {
  state: State.Paused,
}

const currentMusicSlice = createSlice({
  name: 'currentMusic',
  initialState,
  reducers: {
    handleSetCurrentMusic(state, action: PayloadAction<CurrentMusicProps>) {
      state.isCurrentMusic = action.payload.isCurrentMusic
    },

    handleChangeStateCurrentMusic(state, action: PayloadAction<State>) {
      state.state = action.payload
    },
  },
})

export const { handleSetCurrentMusic, handleChangeStateCurrentMusic } =
  currentMusicSlice.actions

export default currentMusicSlice.reducer
