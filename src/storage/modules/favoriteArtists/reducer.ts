import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { ArtistsDataProps } from '@utils/Types/artistsProps'

export interface FavoriteArtistsProps {
  favoriteArtists: ArtistsDataProps[]
}

const initialState: FavoriteArtistsProps = {
  favoriteArtists: [],
}

const favoriteArtistsSlice = createSlice({
  name: 'favoriteArtists',
  initialState,
  reducers: {
    handleSetFavoriteArtists(
      state,
      action: PayloadAction<FavoriteArtistsProps>,
    ) {
      state.favoriteArtists = action.payload.favoriteArtists
    },
  },
})

export const { handleSetFavoriteArtists } = favoriteArtistsSlice.actions

export default favoriteArtistsSlice.reducer
