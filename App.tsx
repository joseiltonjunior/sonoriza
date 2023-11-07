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
import { BottomModal } from '@components/BottomModal'
import { PlaylistModal } from '@components/PlaylistModal'

function App(): JSX.Element {
  return (
    <Hooks>
      <NavigationContainer>
        <StatusBar backgroundColor={'#202024'} />
        <Routes />
        <SideMenu />
        <Modal />
        <BottomModal />
        <PlaylistModal />
      </NavigationContainer>
    </Hooks>
  )
}

export default App
