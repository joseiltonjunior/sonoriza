import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { NotificationsDataProps } from '@utils/Types/notificationsProps'

export interface NotificationsProps {
  notifications: NotificationsDataProps[]
}

const initialState: NotificationsProps = {
  notifications: [],
}

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    setNotification: (state, action: PayloadAction<NotificationsProps>) => {
      state.notifications = action.payload.notifications
    },
  },
})

export const { setNotification } = notificationsSlice.actions

export default notificationsSlice.reducer
