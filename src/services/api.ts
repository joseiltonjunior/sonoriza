import axios from 'axios'
import { BASE_API_URL } from '@env'
import {
  clearStoredSessionAndRedirect,
  ensureValidAccessToken,
} from './session'

export const api = axios.create({
  baseURL: BASE_API_URL,
  timeout: 10000,
})

function normalizeUrlPath(url?: string) {
  if (!url) return ''

  if (url.startsWith('http')) {
    try {
      return new URL(url).pathname
    } catch {
      return url
    }
  }

  return url.startsWith('/') ? url : `/${url}`
}

function isPublicPath(url?: string) {
  const path = normalizeUrlPath(url)

  return (
    path === '/sessions' ||
    path === '/accounts' ||
    path === '/accounts/verify' ||
    path === '/accounts/resend-verification' ||
    path === '/recovery-password'
  )
}

function isRefreshPath(url?: string) {
  return normalizeUrlPath(url) === '/sessions/refresh'
}

api.interceptors.request.use(async (config) => {
  if (isPublicPath(config.url) || isRefreshPath(config.url)) {
    return config
  }

  const token = await ensureValidAccessToken()

  if (token) {
    config.headers = config.headers ?? {}
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error.response?.status
    const originalRequest = error.config as typeof error.config & {
      _retry?: boolean
    }

    if (status !== 401 || !originalRequest) {
      return Promise.reject(error)
    }

    if (isPublicPath(originalRequest.url)) {
      return Promise.reject(error)
    }

    if (isRefreshPath(originalRequest.url) || originalRequest._retry) {
      await clearStoredSessionAndRedirect()
      return Promise.reject(error)
    }

    const newAccessToken = await ensureValidAccessToken({
      forceRefresh: true,
    })

    if (!newAccessToken) {
      await clearStoredSessionAndRedirect()
      return Promise.reject(error)
    }

    originalRequest._retry = true
    originalRequest.headers = originalRequest.headers ?? {}
    originalRequest.headers.Authorization = `Bearer ${newAccessToken}`

    return api.request(originalRequest)
  },
)
