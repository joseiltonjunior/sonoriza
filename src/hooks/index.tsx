import { ModalProvider } from '@hooks/useModal'
import { SideMenuProvider } from '@hooks/useSideMenu'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { store, persistor } from '@storage/index'

import '@config/ReactotronConfig'
import { BottomModalProvider } from './useBottomModal'
import { PlaylistModalProvider } from './usePlaylistModal'
import { ToastProvider } from './useToast'

export function Hooks({ children }: React.PropsWithChildren) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <BottomModalProvider>
          <ModalProvider>
            <ToastProvider>
              <PlaylistModalProvider>
                <SideMenuProvider>{children}</SideMenuProvider>
              </PlaylistModalProvider>
            </ToastProvider>
          </ModalProvider>
        </BottomModalProvider>
      </PersistGate>
    </Provider>
  )
}
