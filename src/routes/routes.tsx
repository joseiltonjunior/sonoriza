import React from 'react'
import {
  createStackNavigator,
  StackNavigationProp,
} from '@react-navigation/stack'

import { RouteProp } from '@react-navigation/native'
import { useSelector } from 'react-redux'

import { Home } from '@screens/Home'
import { SplashScreen } from '@screens/SplashScreen'
import { Music } from '@screens/Music'
import { SignIn } from '@screens/SignIn'
import { Register } from '@screens/Register'
import { MoreMusic } from '@screens/MoreMusic'
import { MoreArtists } from '@screens/MoreArtists'
import { Artist } from '@screens/Artist'
import { GenreSelected } from '@screens/GenreSelected'
import { Favorites } from '@screens/Favorites'
import { Queue } from '@screens/Queue'
import { Search } from '@screens/Search'
import { RecoveryPassword } from '@screens/RecoveryPassword'
import { Album } from '@screens/Album'
import { Profile } from '@screens/Profile'
import { EditProfile } from '@screens/EditProfile'
import { Explorer } from '@screens/Explorer'
import { EditPlaylist } from '@screens/EditPlaylist'

import { Notifications } from '@screens/Notifications'
import { Playlists } from '@screens/Playlists'
import { PlaylistProps } from '@utils/Types/playlistProps'
import { NewPlaylist } from '@screens/NewPlaylist'
import { MusicProps } from '@utils/Types/musicProps'
import { ConfirmCode } from '@screens/ConfirmCode'
import { ReduxProps } from '@storage/index'
import { UserProps } from '@storage/modules/user/reducer'
import { hasStoredSession } from '@services/session'

type RootStackParamList = {
  Home: undefined
  SplashScreen: undefined
  Music: undefined
  SignIn: undefined
  Register: undefined
  Artist: {
    artistId: string
  }
  MoreArtists: {
    type: 'favorites' | 'default'
    title: string
  }
  MoreMusic: {
    type: 'favorites' | 'default' | 'historic' | 'offline' | 'artist'
    title: string
    artistFlow?: string[]
    artistId?: string
  }
  GenreSelected: {
    id: string
    title: string
  }
  Favorites: undefined
  Queue: undefined
  Search: undefined
  RecoveryPassword: undefined
  Album: {
    album: string
    artistId: string
  }
  Profile: undefined
  EditProfile: undefined
  Notifications: undefined
  Explorer: undefined
  EditPlaylist: PlaylistProps
  Playlists: undefined
  NewPlaylist: MusicProps
  ConfirmCode: {
    email: string
  }
}

export type StackNavigationProps = StackNavigationProp<RootStackParamList>
export type RouteParamsProps<T extends keyof RootStackParamList> = RouteProp<
  RootStackParamList,
  T
>

const Stack = createStackNavigator<RootStackParamList>()

function renderPublicRoutes() {
  return (
    <Stack.Group>
      <Stack.Screen name="SignIn" component={SignIn} />
      <Stack.Screen name="Register" component={Register} />
      <Stack.Screen name="ConfirmCode" component={ConfirmCode} />
      <Stack.Screen name="RecoveryPassword" component={RecoveryPassword} />
    </Stack.Group>
  )
}

function renderPrivateRoutes() {
  return (
    <Stack.Group>
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Music" component={Music} />
      <Stack.Screen name="MoreMusic" component={MoreMusic} />
      <Stack.Screen name="MoreArtists" component={MoreArtists} />
      <Stack.Screen name="Artist" component={Artist} />
      <Stack.Screen name="GenreSelected" component={GenreSelected} />
      <Stack.Screen name="Favorites" component={Favorites} />
      <Stack.Screen name="Queue" component={Queue} />
      <Stack.Screen name="Search" component={Search} />
      <Stack.Screen name="Album" component={Album} />
      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name="EditProfile" component={EditProfile} />
      <Stack.Screen name="Notifications" component={Notifications} />
      <Stack.Screen name="Explorer" component={Explorer} />
      <Stack.Screen name="EditPlaylist" component={EditPlaylist} />
      <Stack.Screen name="Playlists" component={Playlists} />
      <Stack.Screen name="NewPlaylist" component={NewPlaylist} />
    </Stack.Group>
  )
}

export function Routes() {
  const { user } = useSelector<ReduxProps, UserProps>((state) => state.user)

  const isAuthenticated = hasStoredSession(user)

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: '#202024' },
        cardStyleInterpolator: ({ current: { progress } }) => ({
          cardStyle: {
            opacity: progress,
          },
        }),
      }}
    >
      <Stack.Screen name="SplashScreen" component={SplashScreen} />
      {isAuthenticated ? renderPrivateRoutes() : renderPublicRoutes()}
    </Stack.Navigator>
  )
}
