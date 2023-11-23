import { ModalProvider } from '@hooks/useModal'
import { SideMenuProvider } from '@hooks/useSideMenu'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { store, persistor } from '@storage/index'

import '@config/ReactotronConfig'
import { BottomModalProvider } from './useBottomModal'
import { PlaylistModalProvider } from './usePlaylistModal'

export function Hooks({ children }: React.PropsWithChildren) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <BottomModalProvider>
          <ModalProvider>
            <PlaylistModalProvider>
              <SideMenuProvider>{children}</SideMenuProvider>
            </PlaylistModalProvider>
          </ModalProvider>
        </BottomModalProvider>
      </PersistGate>
    </Provider>
  )
}
