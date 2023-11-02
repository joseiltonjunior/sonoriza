import { ArtistsDataProps } from './artistsProps'

export interface MusicProps {
  url: string
  title: string
  artists: ArtistsDataProps[]
  genres: string[]
  album: string
  date: string
  artwork: string
  duration: number
  id: string
}

export interface TrackPlayerMusicProps {
  url: string
  title: string
  artist: string
  genre: string
  album: string
  date: string
  artwork: string
  duration: number
  id: string
}
