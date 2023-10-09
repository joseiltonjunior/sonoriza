import AnimatedLottieView from 'lottie-react-native'
import { Alert, Dimensions, LogBox, View } from 'react-native'

import splash from '@assets/splash.json'
import { useCallback, useEffect } from 'react'
import TrackPlayer from 'react-native-track-player'
import { PERMISSIONS, request } from 'react-native-permissions'
import { useNavigation } from '@react-navigation/native'
import { StackNavigationProps } from '@routes/routes'

const size = Dimensions.get('window').width * 0.9

export function SplashScreen() {
  const navigation = useNavigation<StackNavigationProps>()

  const requestMusicPermission = useCallback(async () => {
    try {
      const result = await request(
        PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE &&
          PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
      )

      await TrackPlayer.setupPlayer()

      setTimeout(() => {
        navigation.reset({
          index: 0,
          routes: [
            {
              name: 'Home',
              params: undefined,
            },
          ],
        })
      }, 3000)

      if (result !== 'granted') {
        Alert.alert(
          'Permissão necessária',
          'Por favor, conceda permissão para acessar suas músicas.',
        )
      }
    } catch (error) {
      console.error('Erro ao solicitar permissão:', error)
    }
  }, [navigation])

  useEffect(() => {
    LogBox.ignoreLogs(['new NativeEventEmitter'])
    requestMusicPermission()
  }, [requestMusicPermission])

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
