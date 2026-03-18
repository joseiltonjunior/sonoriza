import { ArtistsDataProps } from './artistsProps'
import { MusicalGenresDataProps } from './musicalGenresProps'
import { MusicProps } from './musicProps'

export interface FormDataProps {
  name: string
  email: string
  password: string
  confirmPassword: string
}

export interface UserDataProps {
  email: string | null
  name: string | null
  photoUrl: string | null
  id: string
  role: 'USER' | 'ADMIN'
  accountStatus: 'PENDING_VERIFICATION' | 'ACTIVE' | 'SUSPENDED'
  favoriteArtists?: ArtistsDataProps[]
  favoriteMusics?: MusicProps[]
  favoriteGenres?: MusicalGenresDataProps[]
  accessToken?: string | null
  refreshToken?: string | null
}
