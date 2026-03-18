import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { PlaylistProps } from '@utils/Types/playlistProps'

export interface PLaylistPropsReducer {
  playlist: PlaylistProps[]
}

const initialState: PLaylistPropsReducer = {
  playlist: [],
}

const playlistSlice = createSlice({
  name: 'playlist',
  initialState,
  reducers: {
    setPlaylistUser(state, action: PayloadAction<PLaylistPropsReducer>) {
      state.playlist = action.payload.playlist
    },
  },
})

export const { setPlaylistUser } = playlistSlice.actions

export default playlistSlice.reducer
