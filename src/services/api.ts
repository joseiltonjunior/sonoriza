import axios from 'axios'
import { BASE_API_URL } from '@env'
import { store } from '@storage/index'
import { resetToSignIn } from '@routes/navigationRef'
import { handleSetUser } from '@storage/modules/user/reducer'

export const api = axios.create({
  baseURL: BASE_API_URL,
  timeout: 10000,
})

api.interceptors.request.use((config) => {
  const state = store.getState()
  const token = state.user.user.isAuthenticated

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      store.dispatch(
        handleSetUser({
          user: {
            name: '',
            email: '',
            photoUrl: '',
            role: 'USER',
            id: '',
            isActive: false,
            isAuthenticated: null,
          },
        }),
      )

      resetToSignIn()
    }

    return Promise.reject(error)
  },
)
