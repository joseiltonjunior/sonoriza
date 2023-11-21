import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

import { MusicProps } from '@utils/Types/musicProps'

export interface FavoriteMusicsProps {
  favoriteMusics: MusicProps[]
}

const initialState: FavoriteMusicsProps = {
  favoriteMusics: [],
}

const favoriteMusicsSlice = createSlice({
  name: 'favoriteMusics',
  initialState,
  reducers: {
    handleSetFavoriteMusics(state, action: PayloadAction<FavoriteMusicsProps>) {
      state.favoriteMusics = action.payload.favoriteMusics
    },
  },
})

export const { handleSetFavoriteMusics } = favoriteMusicsSlice.actions

export default favoriteMusicsSlice.reducer
