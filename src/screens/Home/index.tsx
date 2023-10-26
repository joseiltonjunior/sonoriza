import RNFS from 'react-native-fs'
import { useCallback, useEffect, useMemo, useState } from 'react'
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

import IconAnt from 'react-native-vector-icons/AntDesign'
import IconFather from 'react-native-vector-icons/Feather'

import { useSideMenu } from '@hooks/useSideMenu'
import { MusicProps } from '@utils/Types/musicProps'
import colors from 'tailwindcss/colors'
import { ConfigProps } from '@storage/modules/config/reducer'

export function Home() {
  const navigation = useNavigation<StackNavigationProps>()

  const dispatch = useDispatch()

  const { isInitialized } = useSelector<ReduxProps, MusicPlayerSettingsProps>(
    (state) => state.musicPlayerSettings,
  )

  const { trackList } = useSelector<ReduxProps, TrackListProps>(
    (state) => state.trackList,
  )

  const { config } = useSelector<ReduxProps, ConfigProps>(
    (state) => state.config,
  )

  const [musicDatabase, setMusicDatabase] = useState<MusicProps[]>([])

  const { handleIsVisible } = useSideMenu()

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
        genre: '',
        date: '',
        artwork: '',
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
    await firestore()
      .collection('musics')
      .get()
      .then(async (querySnapshot) => {
        const musicsResponse = querySnapshot.docs.map((doc) => ({
          url: doc.data().url,
          artwork: doc.data().artwork,
          artist: doc.data().artist,
          title: doc.data().title,
        })) as MusicProps[]

        setMusicDatabase(musicsResponse)
      })
      .catch((err) => {
        crashlytics().recordError(err)
      })
  }, [])

  const handleVerifyConfig = useMemo(() => {
    let musicArray: MusicProps[] = []

    if (config.isExplorer && config.isLocal) {
      musicArray = [...musicDatabase, ...trackList]
    } else if (config.isExplorer && !config.isLocal) {
      musicArray = musicDatabase
    } else if (!config.isExplorer && config.isLocal) {
      musicArray = trackList
    }

    return musicArray
  }, [config.isExplorer, config.isLocal, musicDatabase, trackList])

  useEffect(() => {
    if (isInitialized) {
      getCurrentMusic()
    }
  }, [getCurrentMusic, isInitialized])

  useEffect(() => {
    // handleVerifyConfig()
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
        <View className="p-4 flex-row items-center justify-between">
          <Text className="text-white text-2xl font-baloo-bold">Início</Text>
          <TouchableOpacity onPress={handleIsVisible} activeOpacity={0.6}>
            <IconAnt name="setting" size={26} />
          </TouchableOpacity>
        </View>

        <View className="px-4">
          <FlatList
            showsVerticalScrollIndicator={false}
            data={handleVerifyConfig}
            ItemSeparatorComponent={() => <View className="h-2" />}
            renderItem={({ item, index }) => (
              <TouchableOpacity
                key={index}
                className="flex-row items-center gap-4 "
                onPress={() => {
                  TrackPlayer.reset()
                  TrackPlayer.add(handleVerifyConfig)
                  TrackPlayer.skip(index)
                  TrackPlayer.play()

                  navigation.navigate('Music')
                }}
              >
                <View className="w-16 h-16 bg-purple-600 rounded-xl overflow-hidden items-center justify-center">
                  {item.artwork ? (
                    <Image
                      source={{ uri: item.artwork }}
                      alt="artwork"
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <IconFather
                      name="music"
                      size={30}
                      color={colors.gray[200]}
                    />
                  )}
                </View>
                <View>
                  <Text className="font-baloo-bold">{item.title}</Text>
                  <Text className="font-baloo-regular">{item.artist}</Text>
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
