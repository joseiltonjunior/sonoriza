import NetInfo from '@react-native-community/netinfo'
import { store } from '@storage/index'
import { api } from './api'
import { hasStoredSession } from './session'

const HEARTBEAT_INTERVAL_MS = 5 * 60 * 1000
const HEARTBEAT_MIN_GAP_MS = 15 * 1000

let isAppActive = false
let isPlaybackActive = false
let heartbeatInterval: ReturnType<typeof setInterval> | null = null
let heartbeatInFlight = false
let lastHeartbeatAt = 0

async function shouldRunHeartbeat() {
  const { user } = store.getState().user

  if (!hasStoredSession(user)) {
    return false
  }

  const netInfo = await NetInfo.fetch()

  if (!netInfo.isConnected) {
    return false
  }

  return isAppActive || isPlaybackActive
}

async function sendSessionHeartbeat(force = false) {
  const now = Date.now()

  if (!force && now - lastHeartbeatAt < HEARTBEAT_MIN_GAP_MS) {
    return
  }

  if (heartbeatInFlight) {
    return
  }

  heartbeatInFlight = true

  try {
    const canRun = await shouldRunHeartbeat()

    if (!canRun) {
      stopSessionHeartbeat()
      return
    }

    await api.post('/sessions/heartbeat')
    lastHeartbeatAt = Date.now()
  } catch (error) {
    console.log('heartbeat error', error)
  } finally {
    heartbeatInFlight = false
  }
}

function requestSessionHeartbeat(force = false) {
  sendSessionHeartbeat(force).catch(() => undefined)
}

function startSessionHeartbeat() {
  if (heartbeatInterval) {
    return
  }

  requestSessionHeartbeat(true)

  heartbeatInterval = setInterval(() => {
    requestSessionHeartbeat()
  }, HEARTBEAT_INTERVAL_MS)
}

export function stopSessionHeartbeat() {
  if (!heartbeatInterval) {
    return
  }

  clearInterval(heartbeatInterval)
  heartbeatInterval = null
}

export async function syncSessionHeartbeat() {
  const canRun = await shouldRunHeartbeat()

  if (canRun) {
    startSessionHeartbeat()
    return
  }

  stopSessionHeartbeat()
}

export function setHeartbeatAppActive(nextIsActive: boolean) {
  isAppActive = nextIsActive
  syncSessionHeartbeat().catch(() => undefined)
}

export function setHeartbeatPlaybackActive(nextIsActive: boolean) {
  isPlaybackActive = nextIsActive
  syncSessionHeartbeat().catch(() => undefined)
}
