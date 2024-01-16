import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface NewsNotificationsProps {
  newsNotifications: boolean
}

const initialState: NewsNotificationsProps = {
  newsNotifications: false,
}

const notificationsSlice = createSlice({
  name: 'newsNotifications',
  initialState,
  reducers: {
    setNewsNotifications: (
      state,
      action: PayloadAction<NewsNotificationsProps>,
    ) => {
      state.newsNotifications = action.payload.newsNotifications
    },
  },
})

export const { setNewsNotifications } = notificationsSlice.actions

export default notificationsSlice.reducer
