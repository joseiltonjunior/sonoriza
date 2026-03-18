import { UserDataProps } from './userProps'

export interface authSessionResponseProps {
  access_token: string
  refresh_token: string
  user: UserDataProps
}
