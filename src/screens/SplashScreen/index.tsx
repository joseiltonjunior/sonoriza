import AnimatedLottieView from 'lottie-react-native'
import { Dimensions, View } from 'react-native'

import splash from '@assets/splash.json'
import { useEffect } from 'react'

import { useNavigation } from '@react-navigation/native'
import { StackNavigationProps } from '@routes/routes'

import sonorizaIcon from '@assets/icon.png'

import TrackPlayer, {
  AppKilledPlaybackBehavior,
  Capability,
} from 'react-native-track-player'

import { ReduxProps } from '@storage/index'
import { useDispatch, useSelector } from 'react-redux'
import { UserProps, handleSetUser } from '@storage/modules/user/reducer'
import { useNetInfo } from '@react-native-community/netinfo'

import {
  TrackPlayerProps,
  setIsInitialized,
} from '@storage/modules/trackPlayer/reducer'
import { useFirebaseServices } from '@hooks/useFirebaseServices'
import ImmersiveMode from 'react-native-immersive-mode'

const size = Dimensions.get('window').width * 0.9

export function SplashScreen() {
  const navigation = useNavigation<StackNavigationProps>()
  const { handleFetchDataUser } = useFirebaseServices()

  const { isConnected } = useNetInfo()

  const dispatch = useDispatch()

  const { user } = useSelector<ReduxProps, UserProps>((state) => state.user)
  const { isInitialized } = useSelector<ReduxProps, TrackPlayerProps>(
    (state) => state.trackPlayer,
  )

  const handleInitializePlayer = async () => {
    await TrackPlayer.setupPlayer()

    dispatch(setIsInitialized({ isInitialized: true }))

    TrackPlayer.updateOptions({
      android: {
        appKilledPlaybackBehavior: AppKilledPlaybackBehavior.ContinuePlayback,
      },

      icon: sonorizaIcon,

      capabilities: [
        Capability.Play,
        Capability.Pause,
        Capability.SkipToNext,
        Capability.SkipToPrevious,
        Capability.SeekTo,
      ],
      compactCapabilities: [
        Capability.Play,
        Capability.Pause,
        Capability.SkipToNext,
      ],
    })
  }

  const handleVerifyUser = async () => {
    if (!user.uid) {
      navigation.reset({
        index: 0,
        routes: [{ name: 'SignIn' }],
      })
    } else {
      const userResponse = await handleFetchDataUser(user.uid)

      dispatch(
        handleSetUser({
          user: userResponse,
        }),
      )
      navigation.reset({
        index: 0,
        routes: [{ name: 'Home' }],
      })
    }
  }

  useEffect(() => {
    if (isConnected === null) return
    if (!isInitialized) {
      handleInitializePlayer()
    }
    handleVerifyUser()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnected, isInitialized])

  useEffect(() => {
    ImmersiveMode.fullLayout(true)
    ImmersiveMode.setBarTranslucent(true)
  }, [])

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
