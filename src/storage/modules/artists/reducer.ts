import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface ArtistsProps {
  artists: {
    name: string
    photoURL: string
  }[]
}

const initialState: ArtistsProps = {
  artists: [],
}

const artistisSlice = createSlice({
  name: 'artistis',
  initialState,
  reducers: {
    handleSetArtists(state, action: PayloadAction<ArtistsProps>) {
      state.artists = action.payload.artists
    },
  },
})

export const { handleSetArtists } = artistisSlice.actions

export default artistisSlice.reducer
