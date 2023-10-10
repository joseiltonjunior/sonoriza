/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import 'react-native-gesture-handler'
import React from 'react'
import { NavigationContainer } from '@react-navigation/native'

import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { store, persistor } from '@storage/index'

import { StatusBar } from 'react-native'

import { Routes } from '@routes/routes'

import '@config/ReactotronConfig'

function App(): JSX.Element {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <NavigationContainer>
          <StatusBar backgroundColor={'#202024'} />
          <Routes />
        </NavigationContainer>
      </PersistGate>
    </Provider>
  )
}

export default App
