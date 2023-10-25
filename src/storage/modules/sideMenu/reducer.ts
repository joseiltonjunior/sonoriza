import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface SideMenuProps {
  isVisible: boolean
}

const initialState: SideMenuProps = {
  isVisible: false,
}

const sideMenuSlice = createSlice({
  name: 'sideMenu',
  initialState,
  reducers: {
    handleIsVisibleSidemenu(state, action: PayloadAction<SideMenuProps>) {
      state.isVisible = action.payload.isVisible
    },
  },
})

export const { handleIsVisibleSidemenu } = sideMenuSlice.actions

export default sideMenuSlice.reducer
