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
  isActive: boolean
  favoritesArtists?: string[]
  favoritesMusics?: string[]
  isAuthenticated?: string | null
}
