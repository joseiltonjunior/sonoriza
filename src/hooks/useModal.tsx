import React, { createContext, useContext, useState } from 'react'

interface ModalInfoProps {
  title: string
  description: string

  singleAction?: {
    title: string
    action(): void
  }

  twoActions?: {
    textCancel: string
    actionCancel(): void
    textConfirm: string
    actionConfirm(): void
  }
}

interface ModalStateProps extends ModalInfoProps {
  visible: boolean
}

interface ModalContextData {
  modalState: ModalStateProps
  openModal({
    description,
    title,
    singleAction,
    twoActions,
  }: ModalInfoProps): void
  closeModal(): void
}

const ModalContext = createContext<ModalContextData>({} as ModalContextData)

export function ModalProvider({ children }: React.PropsWithChildren) {
  const [modalState, setState] = useState<ModalStateProps>({
    visible: false,
    description: '',
    title: '',
  })

  const openModal = (payload: ModalStateProps) => {
    setState({ ...payload, visible: true })
  }

  const closeModal = () => {
    setState({ visible: false, description: '', title: '' })
  }

  return (
    <ModalContext.Provider value={{ modalState, closeModal, openModal }}>
      {children}
    </ModalContext.Provider>
  )
}

export function useModal(): ModalContextData {
  const context = useContext(ModalContext)

  if (!context) {
    throw new Error('useModal must be used within an ModalProvider')
  }

  return context
}
