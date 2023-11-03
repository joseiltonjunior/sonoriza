import AnimatedLottieView from 'lottie-react-native'
import { BackHandler, Dimensions, LogBox, View } from 'react-native'

import splash from '@assets/splash.json'
import { useEffect } from 'react'

import { useNavigation } from '@react-navigation/native'
import { StackNavigationProps } from '@routes/routes'

import auth from '@react-native-firebase/auth'
import { useModal } from '@hooks/useModal'

import { useDispatch } from 'react-redux'

import { useFirebaseServices } from '@hooks/useFirebaseServices'
import { handleTrackListRemote } from '@storage/modules/trackListRemote/reducer'
import { handleSetArtists } from '@storage/modules/artists/reducer'
import { handleSetMusicalGenres } from '@storage/modules/musicalGenres/reducer'

import { useTrackPlayer } from '@hooks/useTrackPlayer'
import { AppKilledPlaybackBehavior } from 'react-native-track-player'

const size = Dimensions.get('window').width * 0.9

export function SplashScreen() {
  const navigation = useNavigation<StackNavigationProps>()
  const { closeModal, openModal } = useModal()
  const dispatch = useDispatch()

  const { TrackPlayer, Capability } = useTrackPlayer()

  const { handleGetArtists, handleGetMusicalGenres, handleGetMusicsDatabase } =
    useFirebaseServices()

  const handleVerifyUser = async () => {
    try {
      const user = auth().currentUser
      if (user) {
        const artists = await handleGetArtists()
        const trackListRemote = await handleGetMusicsDatabase()
        const musicalGenres = await handleGetMusicalGenres()

        dispatch(handleTrackListRemote({ trackListRemote }))
        dispatch(handleSetArtists({ artists }))
        dispatch(handleSetMusicalGenres({ musicalGenres }))

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

  const handleInitializePlayer = async () => {
    try {
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
    } catch (err) {}
  }

  useEffect(() => {
    handleVerifyUser()
    LogBox.ignoreLogs(['new NativeEventEmitter'])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    handleInitializePlayer()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
