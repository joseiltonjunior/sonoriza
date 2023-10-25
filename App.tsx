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
import { SideMenu } from '@components/SideMenu'
import { Modal } from '@components/Modal'
import { Hooks } from '@hooks/index'

function App(): JSX.Element {
  return (
    <Hooks>
      <NavigationContainer>
        <StatusBar backgroundColor={'#202024'} />
        <Routes />
        <SideMenu />
        <Modal />
      </NavigationContainer>
    </Hooks>
  )
}

export default App
