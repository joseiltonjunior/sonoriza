import { ModalProvider } from '@hooks/useModal'
import { SideMenuProvider } from '@hooks/useSideMenu'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { store, persistor } from '@storage/index'

import '@config/ReactotronConfig'
import { BottomModalProvider } from './useBottomModal'
import { PlaylistModalProvider } from './usePlaylistModal'
import { ToastProvider } from './useToast'
import { SessionHeartbeatProvider } from './SessionHeartbeatProvider'

export function Hooks({ children }: React.PropsWithChildren) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <SessionHeartbeatProvider>
          <BottomModalProvider>
            <ModalProvider>
              <ToastProvider>
                <PlaylistModalProvider>
                  <SideMenuProvider>{children}</SideMenuProvider>
                </PlaylistModalProvider>
              </ToastProvider>
            </ModalProvider>
          </BottomModalProvider>
        </SessionHeartbeatProvider>
      </PersistGate>
    </Provider>
  )
}
