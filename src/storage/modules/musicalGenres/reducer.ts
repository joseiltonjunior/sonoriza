import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

import { MusicalGenresDataProps } from '@utils/Types/musicalGenresProps'

export interface MusicalGenresProps {
  musicalGenres: MusicalGenresDataProps[]
}

const initialState: MusicalGenresProps = {
  musicalGenres: [],
}

const musicalGenresSlice = createSlice({
  name: 'musicalGenres',
  initialState,
  reducers: {
    handleSetMusicalGenres(state, action: PayloadAction<MusicalGenresProps>) {
      state.musicalGenres = action.payload.musicalGenres
    },
  },
})

export const { handleSetMusicalGenres } = musicalGenresSlice.actions

export default musicalGenresSlice.reducer
