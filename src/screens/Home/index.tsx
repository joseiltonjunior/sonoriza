import RNFS from 'react-native-fs'
import { useCallback, useEffect, useState } from 'react'
import { FlatList, Image, Text, TouchableOpacity, View } from 'react-native'

import TrackPlayer from 'react-native-track-player'

import { MusicProps } from '@utils/Types/musicProps'
import { useNavigation } from '@react-navigation/native'
import { StackNavigationProps } from '@routes/routes'

export function Home() {
  const [trackList, setTrackList] = useState<MusicProps[]>()

  const navigation = useNavigation<StackNavigationProps>()

  const handleSearchMp3Music = useCallback(async () => {
    try {
      const musicas = await RNFS.readDir(RNFS.DownloadDirectoryPath)

      if (!musicas) {
        console.log('Nenhum arquivo encontrado no diretório de downloads.')
      }

      const musicasMP3 = musicas.filter((arquivo) => {
        return arquivo.isFile() && arquivo.name.endsWith('.mp3')
      })

      const tracksDownloadFolter = musicasMP3.map((musica, index) => ({
        url: `file://${musicasMP3[index].path}`,
        title: musica.name.replace('.mp3', ''),
        artist: 'Artista Desconhecido',
        album: 'Álbum Desconhecido',
        genre: 'Gênero Desconhecido',
        date: 'Data Desconhecida',
        artwork: 'https://avatars.githubusercontent.com/u/47725788?v=4',
        duration: 0,
      }))

      setTrackList(tracksDownloadFolter)
      TrackPlayer.add(tracksDownloadFolter)
    } catch (error) {
      console.log('Erro ao buscar músicas MP3:', error)
    }
  }, [])

  useEffect(() => {
    handleSearchMp3Music()
  }, [handleSearchMp3Music])

  return (
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
                TrackPlayer.reset()
                TrackPlayer.add(item)
                TrackPlayer.play()

                navigation.navigate('Music', item)
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

      {/* <View>
        <Text>Controlls</Text>
      </View> */}
    </View>
  )
}
