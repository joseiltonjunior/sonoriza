import AnimatedLottieView from 'lottie-react-native'
import { BackHandler, Dimensions, LogBox, View } from 'react-native'

import splash from '@assets/splash.json'
import { useCallback, useEffect } from 'react'

import { useNavigation } from '@react-navigation/native'
import { StackNavigationProps } from '@routes/routes'

import auth from '@react-native-firebase/auth'
import { useModal } from '@hooks/useModal'

import { useDispatch, useSelector } from 'react-redux'
import { ReduxProps } from '@storage/index'
import { UserProps } from '@storage/modules/user/reducer'
import { handleSetArtists } from '@storage/modules/artists/reducer'
import { handleSetMusicalGenres } from '@storage/modules/musicalGenres/reducer'
import { handleTrackListRemote } from '@storage/modules/trackListRemote/reducer'
import { useFirebaseServices } from '@hooks/useFirebaseServices'

const size = Dimensions.get('window').width * 0.9

export function SplashScreen() {
  const navigation = useNavigation<StackNavigationProps>()
  const { closeModal, openModal } = useModal()
  const dispatch = useDispatch()

  const { handleGetArtists, handleGetMusicalGenres, handleGetMusicsDatabase } =
    useFirebaseServices()

  const { user: userProvider } = useSelector<ReduxProps, UserProps>(
    (state) => state.user,
  )

  const handleVerifyUser = useCallback(async () => {
    try {
      const user = auth().currentUser
      if (user) {
        if (userProvider.plain === 'premium') {
          const responseArtists = await handleGetArtists()
          const responseGenres = await handleGetMusicalGenres()
          const responseMusics = await handleGetMusicsDatabase()

          dispatch(handleSetArtists({ artists: responseArtists }))
          dispatch(handleSetMusicalGenres({ musicalGenres: responseGenres }))
          dispatch(handleTrackListRemote({ trackListRemote: responseMusics }))
        }

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
  }, [
    closeModal,
    dispatch,
    handleGetArtists,
    handleGetMusicalGenres,
    handleGetMusicsDatabase,
    navigation,
    openModal,
    userProvider.plain,
  ])

  useEffect(() => {
    handleVerifyUser()
    LogBox.ignoreLogs(['new NativeEventEmitter'])
  }, [handleVerifyUser])

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
