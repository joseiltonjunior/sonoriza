import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface ConfigProps {
  config: {
    isLocal?: boolean
  }
}

const initialState: ConfigProps = {
  config: {
    isLocal: false,
  },
}

const configSlice = createSlice({
  name: 'config',
  initialState,
  reducers: {
    handleChangeConfig(state, action: PayloadAction<ConfigProps>) {
      state.config = action.payload.config
    },
  },
})

export const { handleChangeConfig } = configSlice.actions

export default configSlice.reducer
