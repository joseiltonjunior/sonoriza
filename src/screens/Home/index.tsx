import RNFS from 'react-native-fs'
import { useCallback, useEffect } from 'react'
import { FlatList, Image, Text, TouchableOpacity, View } from 'react-native'

import { useDispatch, useSelector } from 'react-redux'

import { useNavigation } from '@react-navigation/native'
import { StackNavigationProps } from '@routes/routes'
import { ReduxProps } from '@storage/index'

import firestore from '@react-native-firebase/firestore'
import crashlytics from '@react-native-firebase/crashlytics'

import {
  TrackListProps,
  handleTrackList,
} from '@storage/modules/trackList/reducer'
import {
  MusicPlayerSettingsProps,
  handleInitializedMusicPlayer,
} from '@storage/modules/musicPlayerSettings/reducer'
import { BottomMenu } from '@components/BottomMenu/Index'
import { ControlCurrentMusic } from '@components/ControlCurrentMusic'
import { useTrackPlayer } from '@hooks/useTrackPlayer'

export function Home() {
  const navigation = useNavigation<StackNavigationProps>()

  const dispatch = useDispatch()

  const { isInitialized } = useSelector<ReduxProps, MusicPlayerSettingsProps>(
    (state) => state.musicPlayerSettings,
  )

  const { trackList } = useSelector<ReduxProps, TrackListProps>(
    (state) => state.trackList,
  )

  const { getCurrentMusic, TrackPlayer, currentMusic } = useTrackPlayer()

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
        genre: 'Gênero Desconhecido',
        date: 'Data Desconhecida',
        artwork: 'https://avatars.githubusercontent.com/u/47725788?v=4',
        duration: 0,
      }))

      dispatch(handleTrackList({ trackList: tracksFormatted }))
    } catch (error) {
      console.error('Erro ao buscar músicas MP3:', error)
    }
  }, [dispatch])

  const handleInitializePlayer = useCallback(async () => {
    await TrackPlayer.setupPlayer()
      .then(async () => {
        dispatch(handleInitializedMusicPlayer({ isInitialized: true }))
      })
      .catch((err) => console.error(err))
  }, [TrackPlayer, dispatch])

  const handleGetMusicsDatabase = useCallback(async () => {
    console.log('entrou')
    await firestore()
      .collection('musics')
      .get()
      .then((querySnapshot) => {
        const musicsResponse = querySnapshot.docs.map((doc) => ({
          url: doc.data().url,
        }))

        console.log(musicsResponse, 'uai')
      })
      .catch((err) => {
        console.log(err)
        crashlytics().recordError(err)
      })
  }, [])

  useEffect(() => {
    if (isInitialized) {
      getCurrentMusic()
    }
  }, [getCurrentMusic, isInitialized])

  useEffect(() => {
    handleGetMusicsDatabase()
    handleSearchMp3Music()
  }, [handleGetMusicsDatabase, handleSearchMp3Music])

  useEffect(() => {
    if (!isInitialized) {
      handleInitializePlayer()
    }
  }, [handleInitializePlayer, isInitialized])

  return (
    <>
      <View className="flex-1 bg-gray-950">
        <View className="p-4">
          <Text className="text-white text-2xl font-baloo-bold">Início</Text>
        </View>

        <View className="px-4">
          <FlatList
            showsVerticalScrollIndicator={false}
            data={trackList}
            ItemSeparatorComponent={() => <View className="h-2" />}
            renderItem={({ item, index }) => (
              <TouchableOpacity
                key={index}
                className="flex-row items-center gap-4 "
                onPress={() => {
                  TrackPlayer.add(trackList)
                  TrackPlayer.skip(index)
                  TrackPlayer.play()

                  navigation.navigate('Music')
                }}
              >
                <Image
                  source={{ uri: item.artwork }}
                  alt="artwork"
                  className="w-16 h-16 bg-gray-500 rounded-xl"
                />
                <View>
                  <Text className="font-baloo-bold">{item.title}</Text>
                  <Text className="font-baloo-regular">{item.album}</Text>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
      </View>
      {currentMusic && <ControlCurrentMusic music={currentMusic} />}
      <BottomMenu />
    </>
  )
}
