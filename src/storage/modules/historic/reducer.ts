import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

import { MusicProps } from '@utils/Types/musicProps'

interface AddMusicProps {
  music: MusicProps
}

export interface HistoricProps {
  historic: MusicProps[]
}

const initialState: HistoricProps = {
  historic: [],
}

const historicSlice = createSlice({
  name: 'historic',
  initialState,
  reducers: {
    handleClearHistoric: () => {
      return {
        historic: [],
      }
    },

    handleSetHistoric: (state, action: PayloadAction<AddMusicProps>) => {
      const { music } = action.payload
      const existingIndex = state.historic.findIndex(
        (item) => item.id === music.id,
      )

      let newHistoric

      if (existingIndex !== -1) {
        newHistoric = [
          music,
          ...state.historic.slice(0, existingIndex),
          ...state.historic.slice(existingIndex + 1),
        ]
      } else {
        newHistoric = [music, ...state.historic]
      }

      newHistoric = newHistoric.slice(0, 30)

      return {
        ...state,
        historic: newHistoric,
      }
    },
  },
})

export const { handleSetHistoric, handleClearHistoric } = historicSlice.actions

export default historicSlice.reducer
