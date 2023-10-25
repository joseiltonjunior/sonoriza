import { ModalProvider } from '@hooks/useModal'
import { SideMenuProvider } from '@hooks/useSideMenu'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { store, persistor } from '@storage/index'

import '@config/ReactotronConfig'

export function Hooks({ children }: React.PropsWithChildren) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ModalProvider>
          <SideMenuProvider>{children}</SideMenuProvider>
        </ModalProvider>
      </PersistGate>
    </Provider>
  )
}
