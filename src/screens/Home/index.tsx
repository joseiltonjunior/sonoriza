import RNFS from 'react-native-fs'
import { useCallback, useEffect } from 'react'
import { FlatList, Image, Text, TouchableOpacity, View } from 'react-native'

import TrackPlayer from 'react-native-track-player'
import { useDispatch, useSelector } from 'react-redux'

import { useNavigation } from '@react-navigation/native'
import { StackNavigationProps } from '@routes/routes'
import { ReduxProps } from '@storage/index'

import {
  TrackListProps,
  handleTrackList,
} from '@storage/modules/trackList/reducer'
import {
  MusicPlayerSettingsProps,
  handleInitializedMusicPlayer,
} from '@storage/modules/musicPlayerSettings/reducer'

export function Home() {
  const navigation = useNavigation<StackNavigationProps>()

  const dispatch = useDispatch()

  const { isInitialized } = useSelector<ReduxProps, MusicPlayerSettingsProps>(
    (state) => state.musicPlayerSettings,
  )

  const { trackList } = useSelector<ReduxProps, TrackListProps>(
    (state) => state.trackList,
  )

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
  }, [dispatch])

  useEffect(() => {
    handleSearchMp3Music()
  }, [handleSearchMp3Music])

  useEffect(() => {
    if (!isInitialized) {
      handleInitializePlayer()
    }
  }, [handleInitializePlayer, isInitialized])

  return (
    <>
      <View className="p-2  flex-1 bg-gray-950">
        <Text className="text-white font-bold text-2xl text-center mt-4">
          Spotifree
        </Text>

        <View className="mt-8 px-3 ">
          <FlatList
            showsVerticalScrollIndicator={false}
            data={trackList}
            ItemSeparatorComponent={() => <View className="h-3" />}
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
                  <Text>{item.title}</Text>
                  <Text>{item.album}</Text>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
      </View>
      <View className="bg-purple-600 h-20">
        <TouchableOpacity onPress={() => navigation.navigate('Music')}>
          <Text>current music</Text>
        </TouchableOpacity>
      </View>
    </>
  )
}
