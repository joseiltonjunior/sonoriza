import { useEffect } from 'react'
import { AppState, AppStateStatus } from 'react-native'
import { useSelector } from 'react-redux'
import { ReduxProps } from '@storage/index'
import { UserProps } from '@storage/modules/user/reducer'
import {
  setHeartbeatAppActive,
  stopSessionHeartbeat,
  syncSessionHeartbeat,
} from '@services/sessionHeartbeat'
import { hasStoredSession } from '@services/session'
import { useNetInfo } from '@react-native-community/netinfo'

function isAppActive(status: AppStateStatus) {
  return status === 'active'
}

function requestHeartbeatSync() {
  syncSessionHeartbeat().catch(() => undefined)
}

export function SessionHeartbeatProvider({
  children,
}: React.PropsWithChildren) {
  const { user } = useSelector<ReduxProps, UserProps>((state) => state.user)
  const { isConnected } = useNetInfo()

  useEffect(() => {
    setHeartbeatAppActive(isAppActive(AppState.currentState))

    const subscription = AppState.addEventListener('change', (nextState) => {
      setHeartbeatAppActive(isAppActive(nextState))
    })

    return () => {
      subscription.remove()
      setHeartbeatAppActive(false)
    }
  }, [])

  useEffect(() => {
    if (!hasStoredSession(user)) {
      stopSessionHeartbeat()
      return
    }

    requestHeartbeatSync()
  }, [user])

  useEffect(() => {
    if (isConnected === null) {
      return
    }

    if (!isConnected) {
      stopSessionHeartbeat()
      return
    }

    requestHeartbeatSync()
  }, [isConnected])

  return children
}
