import React from 'react'
import {
  createStackNavigator,
  StackNavigationProp,
} from '@react-navigation/stack'

import { RouteProp } from '@react-navigation/native'

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
    type: 'favorites' | 'default' | 'historic' | 'offline'
    title: string
  }
  GenreSelected: {
    type: string
  }
  Favorites: undefined
  Queue: undefined
  Search: undefined
}

export type StackNavigationProps = StackNavigationProp<RootStackParamList>
export type RouteParamsProps<T extends keyof RootStackParamList> = RouteProp<
  RootStackParamList,
  T
>

const Stack = createStackNavigator<RootStackParamList>()

export function Routes() {
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
      <Stack.Screen name="SignIn" component={SignIn} />
      <Stack.Screen name="Register" component={Register} />
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Music" component={Music} />
      <Stack.Screen name="MoreMusic" component={MoreMusic} />
      <Stack.Screen name="MoreArtists" component={MoreArtists} />
      <Stack.Screen name="Artist" component={Artist} />
      <Stack.Screen name="GenreSelected" component={GenreSelected} />
      <Stack.Screen name="Favorites" component={Favorites} />
      <Stack.Screen name="Queue" component={Queue} />
      <Stack.Screen name="Search" component={Search} />
    </Stack.Navigator>
  )
}
