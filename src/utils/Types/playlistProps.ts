import { MusicProps } from './musicProps'

export interface PlaylistProps {
  id: string
  title: string
  created_at: string
  musics: MusicProps[]
  cover?: string
}
