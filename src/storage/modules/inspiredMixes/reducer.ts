import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

import { MusicProps } from '@utils/Types/musicProps'

export interface InspiredMixesProps {
  musics: MusicProps[]
}

const initialState: InspiredMixesProps = {
  musics: [],
}

const favoriteMusicsSlice = createSlice({
  name: 'inspiredMixes',
  initialState,
  reducers: {
    setInspiredMixes(state, action: PayloadAction<InspiredMixesProps>) {
      state.musics = action.payload.musics
    },
  },
})

export const { setInspiredMixes } = favoriteMusicsSlice.actions

export default favoriteMusicsSlice.reducer
