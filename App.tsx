/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import 'react-native-gesture-handler'
import React from 'react'
import { NavigationContainer } from '@react-navigation/native'

import { StatusBar } from 'react-native'

import { Routes } from '@routes/routes'

import '@config/ReactotronConfig'

function App(): JSX.Element {
  return (
    <>
      <NavigationContainer>
        <StatusBar backgroundColor={'#202022'} />
        <Routes />
      </NavigationContainer>
    </>
  )
}

export default App
