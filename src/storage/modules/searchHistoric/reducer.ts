import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

interface SearchProps {
  photoURL: string
  name: string
  id: string
}

export interface SearchHistoricProps {
  historic: SearchProps[]
}

const initialState: SearchHistoricProps = {
  historic: [],
}

const searchHistoricSlice = createSlice({
  name: 'searchHistoric',
  initialState,
  reducers: {
    clearSearchHistoric() {
      return {
        historic: [],
      }
    },

    removeSearchHistoric(state, action: PayloadAction<SearchProps>) {
      const { name } = action.payload
      const filter = state.historic.filter((item) => item.name !== name)

      return {
        historic: filter,
      }
    },

    setSearchHistoric(state, action: PayloadAction<SearchProps>) {
      const newSearch = action.payload
      const existingIndex = state.historic.findIndex(
        (item) => item.name === newSearch.name,
      )

      let newHistoric

      if (existingIndex !== -1) {
        newHistoric = [
          newSearch,
          ...state.historic.slice(0, existingIndex),
          ...state.historic.slice(existingIndex + 1),
        ]
      } else {
        newHistoric = [newSearch, ...state.historic]
      }

      newHistoric = newHistoric.slice(0, 6)

      return {
        ...state,
        historic: newHistoric,
      }
    },
  },
})

export const { setSearchHistoric, removeSearchHistoric, clearSearchHistoric } =
  searchHistoricSlice.actions

export default searchHistoricSlice.reducer
