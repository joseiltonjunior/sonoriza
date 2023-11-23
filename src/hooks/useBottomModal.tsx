import React, { ReactNode, createContext, useContext, useState } from 'react'

interface BottomModalInfoProps {
  children?: ReactNode
}

interface BottomModalStateProps extends BottomModalInfoProps {
  visible: boolean
}

interface BottomModalContextData {
  modalState: BottomModalStateProps
  openModal({ children }: BottomModalInfoProps): void
  closeModal(): void
}

const BottomModalContext = createContext<BottomModalContextData>(
  {} as BottomModalContextData,
)

export function BottomModalProvider({ children }: React.PropsWithChildren) {
  const [modalState, setState] = useState<BottomModalStateProps>({
    visible: false,
  })

  const openModal = (payload: BottomModalStateProps) => {
    setState({ ...payload, visible: true })
  }

  const closeModal = () => {
    setState({ visible: false })
  }

  return (
    <BottomModalContext.Provider value={{ modalState, closeModal, openModal }}>
      {children}
    </BottomModalContext.Provider>
  )
}

export function useBottomModal(): BottomModalContextData {
  const context = useContext(BottomModalContext)

  if (!context) {
    throw new Error('useModal must be used within an ModalProvider')
  }

  return context
}
