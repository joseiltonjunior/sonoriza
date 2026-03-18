import axios from 'axios'
import { Buffer } from 'buffer'
import { BASE_API_URL } from '@env'
import { resetToSignIn } from '@routes/navigationRef'
import { store } from '@storage/index'
import { setFavoriteArtists } from '@storage/modules/favoriteArtists/reducer'
import { handleSetFavoriteMusics } from '@storage/modules/favoriteMusics/reducer'
import { handleClearHistoric } from '@storage/modules/historic/reducer'
import { clearHistoricNotifications } from '@storage/modules/historicNotifications/reducer'
import { setInspiredMixes } from '@storage/modules/inspiredMixes/reducer'
import { setNotification } from '@storage/modules/notifications/reducer'
import { setPlaylistUser } from '@storage/modules/playlist/reducer'
import { handleSetQueue } from '@storage/modules/queue/reducer'
import { handleSetReleases } from '@storage/modules/releases/reducer'
import { clearSearchHistoric } from '@storage/modules/searchHistoric/reducer'
import { handleSetUser } from '@storage/modules/user/reducer'
import { setNewsNotifications } from '@storage/modules/newsNotifications/reducer'
import { authSessionResponseProps } from '@utils/Types/authSessionProps'
import { UserDataProps } from '@utils/Types/userProps'
import TrackPlayer from 'react-native-track-player'

const ACCESS_TOKEN_REFRESH_THRESHOLD_MS = 10 * 60 * 1000

let refreshPromise: Promise<string | null> | null = null

const emptyUser: UserDataProps = {
  name: '',
  email: '',
  photoUrl: '',
  role: 'USER',
  id: '',
  accountStatus: 'SUSPENDED',
  accessToken: null,
  refreshToken: null,
}

function decodeJwtPayload(token?: string | null) {
  if (!token) return null

  const parts = token.split('.')

  if (parts.length !== 3) return null

  try {
    const normalized = parts[1].replace(/-/g, '+').replace(/_/g, '/')
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=')
    const decoded = Buffer.from(padded, 'base64').toString('utf-8')

    return JSON.parse(decoded) as { exp?: number }
  } catch {
    return null
  }
}

function getTokenExpiration(token?: string | null) {
  const payload = decodeJwtPayload(token)

  if (!payload?.exp) return null

  return payload.exp * 1000
}

export function isTokenExpired(token?: string | null) {
  const expiration = getTokenExpiration(token)

  if (!expiration) return true

  return Date.now() >= expiration
}

export function isTokenNearExpiry(
  token?: string | null,
  thresholdMs = ACCESS_TOKEN_REFRESH_THRESHOLD_MS,
) {
  const expiration = getTokenExpiration(token)

  if (!expiration) return true

  return expiration - Date.now() <= thresholdMs
}

export function hasStoredSession(user: UserDataProps) {
  return Boolean(
    user.id &&
      user.accountStatus === 'ACTIVE' &&
      (user.accessToken || user.refreshToken),
  )
}

export async function clearStoredSession() {
  await TrackPlayer.stop().catch(() => undefined)
  store.dispatch(handleSetQueue({ queue: [] }))
  store.dispatch(setFavoriteArtists({ favoriteArtists: [] }))
  store.dispatch(handleSetFavoriteMusics({ favoriteMusics: [] }))
  store.dispatch(handleClearHistoric())
  store.dispatch(setNotification({ notifications: [] }))
  store.dispatch(setNewsNotifications({ newsNotifications: false }))
  store.dispatch(clearHistoricNotifications())
  store.dispatch(setPlaylistUser({ playlist: [] }))
  store.dispatch(clearSearchHistoric())
  store.dispatch(
    setInspiredMixes({
      musics: [],
    }),
  )
  store.dispatch(handleSetReleases({ releases: [] }))
  store.dispatch(
    handleSetUser({
      user: emptyUser,
    }),
  )
}

export async function clearStoredSessionAndRedirect() {
  await clearStoredSession()
  resetToSignIn()
}

async function runRefreshSession() {
  const currentRefreshToken = store.getState().user.user.refreshToken

  if (!currentRefreshToken || isTokenExpired(currentRefreshToken)) {
    return null
  }

  try {
    const response = await axios.post(
      `${BASE_API_URL}/sessions/refresh`,
      {
        refresh_token: currentRefreshToken,
      },
      {
        timeout: 10000,
      },
    )

    const { access_token: accessToken, refresh_token: refreshToken } =
      response.data as authSessionResponseProps

    if (!accessToken || !refreshToken) {
      return null
    }

    const latestUser = store.getState().user.user

    store.dispatch(
      handleSetUser({
        user: {
          ...latestUser,
          accessToken,
          refreshToken,
        },
      }),
    )

    return accessToken
  } catch {
    return null
  }
}

export async function refreshSession() {
  if (!refreshPromise) {
    refreshPromise = runRefreshSession().finally(() => {
      refreshPromise = null
    })
  }

  return refreshPromise
}

export async function ensureValidAccessToken(options?: {
  forceRefresh?: boolean
}) {
  const currentUser = store.getState().user.user
  const accessToken = currentUser.accessToken
  const refreshToken = currentUser.refreshToken

  if (!hasStoredSession(currentUser)) {
    return null
  }

  if (!accessToken) {
    if (!refreshToken || isTokenExpired(refreshToken)) {
      return null
    }

    return await refreshSession()
  }

  if (options?.forceRefresh) {
    if (!refreshToken || isTokenExpired(refreshToken)) {
      return null
    }

    return await refreshSession()
  }

  if (isTokenExpired(accessToken)) {
    if (!refreshToken || isTokenExpired(refreshToken)) {
      return null
    }

    return await refreshSession()
  }

  if (isTokenNearExpiry(accessToken)) {
    if (!refreshToken || isTokenExpired(refreshToken)) {
      return accessToken
    }

    const refreshedAccessToken = await refreshSession()

    return refreshedAccessToken ?? accessToken
  }

  return accessToken
}
