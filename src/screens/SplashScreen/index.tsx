import AnimatedLottieView from 'lottie-react-native'
import { BackHandler, Dimensions, View } from 'react-native'

import splash from '@assets/splash.json'
import { useCallback, useEffect } from 'react'

import { useNavigation } from '@react-navigation/native'
import { StackNavigationProps } from '@routes/routes'

import auth from '@react-native-firebase/auth'
import { useModal } from '@hooks/useModal'
import TrackPlayer, {
  AppKilledPlaybackBehavior,
  Capability,
} from 'react-native-track-player'

const size = Dimensions.get('window').width * 0.9

export function SplashScreen() {
  const navigation = useNavigation<StackNavigationProps>()
  const { closeModal, openModal } = useModal()

  const handleInitializePlayer = async () => {
    await TrackPlayer.setupPlayer()

    TrackPlayer.updateOptions({
      android: {
        appKilledPlaybackBehavior: AppKilledPlaybackBehavior.ContinuePlayback,
      },

      capabilities: [
        Capability.Play,
        Capability.Pause,
        Capability.SkipToNext,
        Capability.SkipToPrevious,
      ],
      compactCapabilities: [Capability.Play, Capability.Pause],
    })
  }

  const handleVerifyUser = useCallback(async () => {
    try {
      const user = auth().currentUser
      if (user) {
        handleInitializePlayer()
        setTimeout(() => {
          navigation.reset({
            index: 0,
            routes: [{ name: 'Home', params: {} }],
          })
        }, 2000)
      } else {
        navigation.reset({
          index: 0,
          routes: [{ name: 'SignIn' }],
        })
      }
    } catch (error) {
      openModal({
        title: 'Atenção',
        description:
          'Estamos enfrentando dificuldades na conexão com o servidor. Por favor, tente novamente em instantes.',
        singleAction: {
          title: 'OK',
          action() {
            closeModal()
            BackHandler.exitApp()
          },
        },
      })
    }
  }, [closeModal, navigation, openModal])

  useEffect(() => {
    handleVerifyUser()
  }, [handleVerifyUser])

  return (
    <View className="flex-1 items-center justify-center bg-gray-700">
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
