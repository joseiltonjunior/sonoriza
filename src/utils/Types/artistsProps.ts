import { MusicProps } from './musicProps'

export interface ArtistsDataProps {
  id: string
  title: string
  photoURL: string
  musics: MusicProps[]
  like: number
}
