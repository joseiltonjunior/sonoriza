import React, { createContext, useContext, useState } from 'react'

interface PlaylistModalProps {
  visible: boolean
}

interface PlaylistModalContextData {
  modalState: PlaylistModalProps
  openModal(): void
  closeModal(): void
}

const PlaylistModalContext = createContext<PlaylistModalContextData>(
  {} as PlaylistModalContextData,
)

export function PlaylistModalProvider({ children }: React.PropsWithChildren) {
  const [modalState, setState] = useState<PlaylistModalProps>({
    visible: false,
  })

  const openModal = () => {
    setState({ visible: true })
  }

  const closeModal = () => {
    setState({ visible: false })
  }

  return (
    <PlaylistModalContext.Provider
      value={{ modalState, closeModal, openModal }}
    >
      {children}
    </PlaylistModalContext.Provider>
  )
}

export function usePlaylistModal(): PlaylistModalContextData {
  const context = useContext(PlaylistModalContext)

  if (!context) {
    throw new Error(
      'usePlaylistModal must be used within an PlaylistModalProvider',
    )
  }

  return context
}
