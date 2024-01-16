import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

interface NewNotificationProps {
  notificationId: string
}

export interface HistoricNotificationsProps {
  historic: NewNotificationProps[]
}

const initialState: HistoricNotificationsProps = {
  historic: [],
}

const historicNotificationSlice = createSlice({
  name: 'historicNotifications',
  initialState,
  reducers: {
    setHistoricNotification: (
      state,
      action: PayloadAction<NewNotificationProps>,
    ) => {
      const { notificationId } = action.payload
      const existingIndex = state.historic.findIndex(
        (item) => item.notificationId === notificationId,
      )

      if (existingIndex !== -1) {
        state.historic[existingIndex] = action.payload
      } else {
        state.historic.unshift(action.payload)
      }
    },
  },
})

export const { setHistoricNotification } = historicNotificationSlice.actions

export default historicNotificationSlice.reducer
