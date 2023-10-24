import AnimatedLottieView from 'lottie-react-native'
import { Alert, Dimensions, LogBox, View } from 'react-native'

import splash from '@assets/splash.json'
import { useCallback, useEffect } from 'react'

import { PERMISSIONS, request } from 'react-native-permissions'
import { useNavigation } from '@react-navigation/native'
import { StackNavigationProps } from '@routes/routes'

import crashlytics from '@react-native-firebase/crashlytics'
import auth from '@react-native-firebase/auth'

const size = Dimensions.get('window').width * 0.9

export function SplashScreen() {
  const navigation = useNavigation<StackNavigationProps>()

  const handleStoragePermission = useCallback(async () => {
    try {
      const result = await request(
        PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE &&
          PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
      )
      const user = auth().currentUser

      setTimeout(() => {
        if (user) {
          navigation.reset({
            index: 0,
            routes: [{ name: 'Home' }],
          })
        } else {
          navigation.reset({
            index: 0,
            routes: [{ name: 'SignIn' }],
          })
        }
      }, 2000)

      if (result !== 'granted') {
        Alert.alert(
          'Permissão necessária',
          'Por favor, conceda permissão para acessar suas músicas.',
        )
      }
    } catch (error) {
      const err = error as Error
      crashlytics().recordError(err)
      console.error('Erro ao solicitar permissão:', error)
    }
  }, [navigation])

  useEffect(() => {
    LogBox.ignoreLogs(['new NativeEventEmitter'])

    handleStoragePermission()
  }, [handleStoragePermission])

  return (
    <View className="flex-1 items-center justify-center bg-gray-950">
      <AnimatedLottieView
        source={splash}
        autoPlay
        loop
        resizeMode="contain"
        style={{ width: size, height: size }}
      />
    </View>
  )
}
