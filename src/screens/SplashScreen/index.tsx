import AnimatedLottieView from 'lottie-react-native'
import { Alert, Dimensions, LogBox, View } from 'react-native'
import RNFS from 'react-native-fs'

import splash from '@assets/splash.json'
import { useCallback, useEffect } from 'react'

import { PERMISSIONS, request } from 'react-native-permissions'
import { useNavigation } from '@react-navigation/native'
import { StackNavigationProps } from '@routes/routes'

import crashlytics from '@react-native-firebase/crashlytics'
import auth from '@react-native-firebase/auth'
import { handleTrackListLocal } from '@storage/modules/trackListLocal/reducer'
import { useDispatch } from 'react-redux'

const size = Dimensions.get('window').width * 0.9

export function SplashScreen() {
  const navigation = useNavigation<StackNavigationProps>()
  const dispatch = useDispatch()

  const handleSearchMp3Music = useCallback(async () => {
    try {
      const downloadFolder = await RNFS.readDir(RNFS.DownloadDirectoryPath)
      const musicFolder = await RNFS.readDir(
        `${RNFS.ExternalStorageDirectoryPath}/Music`,
      )

      const allTracks = [...downloadFolder, ...musicFolder]

      const filterMp3 = allTracks.filter((arquivo) => {
        return arquivo.isFile() && arquivo.name.endsWith('.mp3')
      })

      const tracksFormatted = filterMp3.map((music) => ({
        url: `file://${music.path}`,
        title: music.name.replace('.mp3', ''),
        artist: 'Artista Desconhecido',
        album: 'Álbum Desconhecido',
        genre: '',
        date: '',
        artwork: '',
        duration: 0,
      }))

      dispatch(handleTrackListLocal({ trackListLocal: tracksFormatted }))
      const user = auth().currentUser

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
    } catch (error) {
      console.error('Erro ao buscar músicas MP3:', error)
    }
  }, [dispatch, navigation])

  const handleStoragePermission = useCallback(async () => {
    try {
      const result = await request(
        PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE &&
          PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
      )

      if (result !== 'granted') {
        Alert.alert(
          'Permissão necessária',
          'Por favor, conceda permissão para acessar suas músicas.',
        )
      }

      handleSearchMp3Music()
    } catch (error) {
      const err = error as Error
      crashlytics().recordError(err)
    }
  }, [handleSearchMp3Music])

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
