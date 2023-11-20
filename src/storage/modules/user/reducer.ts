import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { UserDataProps } from '@utils/Types/userProps'

export interface UserProps {
  user: UserDataProps
}

const initialState: UserProps = {
  user: {
    email: '',
    displayName: '',
    photoURL: '',
    uid: '',
    plan: '',
  },
}

const userDataSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    handleSetUser(state, action: PayloadAction<UserProps>) {
      state.user = action.payload.user
    },
  },
})

export const { handleSetUser } = userDataSlice.actions

export default userDataSlice.reducer
