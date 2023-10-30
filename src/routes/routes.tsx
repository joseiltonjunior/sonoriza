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

import { MusicProps } from '@utils/Types/musicProps'

type RootStackParamList = {
  Home: undefined
  SplashScreen: undefined
  Music: undefined
  SignIn: undefined
  Register: undefined
  MoreMusic: {
    musics: MusicProps[]
    title: string
  }
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
        cardStyleInterpolator: ({ current, layouts }) => {
          return {
            cardStyle: {
              transform: [
                {
                  translateX: current.progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: [layouts.screen.width, 0],
                  }),
                },
              ],
            },
          }
        },
      }}
    >
      <Stack.Screen name="SplashScreen" component={SplashScreen} />
      <Stack.Screen name="SignIn" component={SignIn} />
      <Stack.Screen name="Register" component={Register} />
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Music" component={Music} />
      <Stack.Screen name="MoreMusic" component={MoreMusic} />
    </Stack.Navigator>
  )
}
