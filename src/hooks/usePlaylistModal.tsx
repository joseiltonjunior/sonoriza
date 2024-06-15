import { MusicProps } from '@utils/Types/musicProps'
import React, { createContext, useContext, useState } from 'react'

interface PlaylistModalInfoProps {
  music?: MusicProps
}
interface PlaylistModalProps extends PlaylistModalInfoProps {
  visible: boolean
}

interface PlaylistModalContextData {
  modalState: PlaylistModalProps
  openModal({ music }: PlaylistModalInfoProps): void
  closeModal(): void
}

const PlaylistModalContext = createContext<PlaylistModalContextData>(
  {} as PlaylistModalContextData,
)

export function PlaylistModalProvider({ children }: React.PropsWithChildren) {
  const [modalState, setState] = useState<PlaylistModalProps>({
    visible: false,
  })

  const openModal = ({ music }: PlaylistModalInfoProps) => {
    setState({ visible: true, music })
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
