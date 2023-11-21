import AnimatedLottieView from 'lottie-react-native'
import { BackHandler, Dimensions, View } from 'react-native'

import splash from '@assets/splash.json'
import { useEffect } from 'react'

import { useNavigation } from '@react-navigation/native'
import { StackNavigationProps } from '@routes/routes'

import { useModal } from '@hooks/useModal'
import TrackPlayer, {
  AppKilledPlaybackBehavior,
  Capability,
} from 'react-native-track-player'
import { UserDataProps } from '@utils/Types/userProps'
import { useFirebaseServices } from '@hooks/useFirebaseServices'

import { ReduxProps } from '@storage/index'
import { useDispatch, useSelector } from 'react-redux'
import { UserProps } from '@storage/modules/user/reducer'
import { useNetInfo } from '@react-native-community/netinfo'
import { handleSetNetStatus } from '@storage/modules/netInfo/reducer'
import { handleSetFavoriteArtists } from '@storage/modules/favoriteArtists/reducer'

import { handleSetFavoriteMusics } from '@storage/modules/favoriteMusics/reducer'
import { handleSetReleases } from '@storage/modules/releases/reducer'
import {
  TrackPlayerProps,
  handleInitializedTrackPlayer,
} from '@storage/modules/trackPlayer/reducer'

const size = Dimensions.get('window').width * 0.9

export function SplashScreen() {
  const navigation = useNavigation<StackNavigationProps>()
  const { closeModal, openModal } = useModal()
  const { isConnected } = useNetInfo()

  const dispatch = useDispatch()

  const { user } = useSelector<ReduxProps, UserProps>((state) => state.user)
  const { isInitialized } = useSelector<ReduxProps, TrackPlayerProps>(
    (state) => state.trackPlayer,
  )

  const {
    handleGetFavoritesMusics,
    handleGetFavoritesArtists,
    handleGetReleases,
  } = useFirebaseServices()

  const handleInitializePlayer = async () => {
    await TrackPlayer.setupPlayer()

    dispatch(handleInitializedTrackPlayer({ isInitialized: true }))

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

  const handleGetDataUser = async (user: UserDataProps) => {
    try {
      if (isConnected) {
        if (user?.favoritesMusics) {
          const result = await handleGetFavoritesMusics(user.favoritesMusics)
          dispatch(handleSetFavoriteMusics({ favoriteMusics: result }))
        }

        if (user?.favoritesArtists) {
          const result = await handleGetFavoritesArtists(user.favoritesArtists)

          dispatch(handleSetFavoriteArtists({ favoriteArtists: result }))
        }

        const responseReleses = await handleGetReleases()

        dispatch(handleSetReleases({ releases: responseReleses }))

        dispatch(handleSetNetStatus(true))

        navigation.reset({
          index: 0,
          routes: [{ name: 'Home' }],
        })
      } else {
        dispatch(handleSetNetStatus(false))

        navigation.reset({
          index: 0,
          routes: [{ name: 'Home' }],
        })
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleVerifyUser = async () => {
    try {
      if (user.uid) {
        handleGetDataUser(user)
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
  }

  useEffect(() => {
    if (isConnected === null) return
    if (!isInitialized) {
      handleInitializePlayer()
    }
    handleVerifyUser()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnected, isInitialized])

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
