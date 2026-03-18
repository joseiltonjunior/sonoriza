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

import { ReduxProps, store } from '@storage/index'
import { useDispatch, useSelector } from 'react-redux'
import { UserProps, handleSetUser } from '@storage/modules/user/reducer'
import { useNetInfo } from '@react-native-community/netinfo'

import {
  TrackPlayerProps,
  setIsInitialized,
} from '@storage/modules/trackPlayer/reducer'

import ImmersiveMode from 'react-native-immersive-mode'
import { api } from '@services/api'
import { UserDataProps } from '@utils/Types/userProps'
import {
  clearStoredSessionAndRedirect,
  ensureValidAccessToken,
  hasStoredSession,
} from '@services/session'

const size = Dimensions.get('window').width * 0.9

export function SplashScreen() {
  const navigation = useNavigation<StackNavigationProps>()

  const { isConnected } = useNetInfo()

  const dispatch = useDispatch()

  const { user } = useSelector<ReduxProps, UserProps>((state) => state.user)
  const { isInitialized } = useSelector<ReduxProps, TrackPlayerProps>(
    (state) => state.trackPlayer,
  )

  const handleInitializePlayer = async () => {
    await TrackPlayer.setupPlayer()

    TrackPlayer.updateOptions({
      progressUpdateEventInterval: 1,
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

    dispatch(setIsInitialized({ isInitialized: true }))
  }

  const handleVerifyUser = async () => {
    if (!hasStoredSession(user)) {
      navigation.reset({
        index: 0,
        routes: [{ name: 'SignIn' }],
      })

      return
    }

    if (!isConnected) {
      navigation.reset({
        index: 0,
        routes: [{ name: 'Home' }],
      })

      return
    }

    const accessToken = await ensureValidAccessToken()

    if (!accessToken) {
      await clearStoredSessionAndRedirect()

      return
    }

    try {
      const userResponse = await api
        .get('/me')
        .then((response) => response.data as UserDataProps)

      const latestUser = store.getState().user.user

      dispatch(
        handleSetUser({
          user: {
            ...latestUser,
            photoUrl: userResponse.photoUrl,
            name: userResponse.name,
            role: userResponse.role,
            email: userResponse.email,
            accountStatus: userResponse.accountStatus,
            id: userResponse.id,
            favoriteArtists: userResponse.favoriteArtists,
            favoriteMusics: userResponse.favoriteMusics,
            favoriteGenres: userResponse.favoriteGenres,
          },
        }),
      )

      navigation.reset({
        index: 0,
        routes: [{ name: 'Home' }],
      })
    } catch (error) {
      console.log('Error fetching user data:', error)

      const currentUser = store.getState().user.user

      if (!hasStoredSession(currentUser)) {
        return
      }

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
