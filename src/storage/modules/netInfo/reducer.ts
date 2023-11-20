import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface NetInfoProps {
  netInfo: { status: boolean; ignoreAlert: boolean }
}

const initialState: NetInfoProps = {
  netInfo: {
    status: true,
    ignoreAlert: false,
  },
}

const netInfoSlice = createSlice({
  name: 'netInfo',
  initialState,
  reducers: {
    handleSetNetStatus(state, action: PayloadAction<boolean>) {
      state.netInfo.status = action.payload
    },

    handleIgnoreAlert(state, action: PayloadAction<boolean>) {
      state.netInfo.ignoreAlert = action.payload
    },
  },
})

export const { handleSetNetStatus, handleIgnoreAlert } = netInfoSlice.actions

export default netInfoSlice.reducer
