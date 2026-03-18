import { MusicProps } from './musicProps'

export interface PlaylistProps {
  id: string
  title: string
  createdAt: string
  createdFor: {
    id: string
    name: string
  }
  musics: MusicProps[]
  artworkURL: string
  private: boolean
  collaborative: boolean
}
