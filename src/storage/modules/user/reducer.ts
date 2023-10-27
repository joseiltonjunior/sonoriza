import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { DataSaveDatabase } from '@screens/Register'

export interface UserProps {
  user: DataSaveDatabase
}

const initialState: UserProps = {
  user: {
    email: '',
    displayName: '',
    photoURL: '',
    uid: '',
  },
}

const userDataSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    handleSaveUser(state, action: PayloadAction<UserProps>) {
      state.user = action.payload.user
    },
  },
})

export const { handleSaveUser } = userDataSlice.actions

export default userDataSlice.reducer
