import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface MusicPlayerSettingsProps {
  isInitialized: boolean
}

const initialState: MusicPlayerSettingsProps = {
  isInitialized: false,
}

const musicPlayerSlice = createSlice({
  name: 'musicPlayerSettings',
  initialState,
  reducers: {
    handleInitializedMusicPlayer(
      state,
      action: PayloadAction<MusicPlayerSettingsProps>,
    ) {
      state.isInitialized = action.payload.isInitialized
    },
  },
})

export const { handleInitializedMusicPlayer } = musicPlayerSlice.actions

export default musicPlayerSlice.reducer
