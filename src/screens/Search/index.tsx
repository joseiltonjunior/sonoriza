import { BottomMenu } from '@components/BottomMenu/Index'
import { ControlCurrentMusic } from '@components/ControlCurrentMusic'

import { useFirebaseServices } from '@hooks/useFirebaseServices'
import { useSideMenu } from '@hooks/useSideMenu'
import { useTrackPlayer } from '@hooks/useTrackPlayer'
import { useNavigation } from '@react-navigation/native'
import { StackNavigationProps } from '@routes/routes'
import { ReduxProps } from '@storage/index'
import { CurrentMusicProps } from '@storage/modules/currentMusic/reducer'
import { ArtistsDataProps } from '@utils/Types/artistsProps'
import { MusicProps } from '@utils/Types/musicProps'

import { useEffect, useState } from 'react'
import {
  Dimensions,
  FlatList,
  Image,
  Text,
  TextInput,
  View,
} from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import Icon from 'react-native-vector-icons/Ionicons'
import { useSelector } from 'react-redux'
import colors from 'tailwindcss/colors'

export function Search() {
  const { handleIsVisible } = useSideMenu()

  const { handleGetMusicalGenres, handleGetArtistsByFilter } =
    useFirebaseServices()

  const { isCurrentMusic } = useSelector<ReduxProps, CurrentMusicProps>(
    (state) => state.currentMusic,
  )

  const [musicalGenres, setMusicalGenres] = useState<string[]>([])

  const [filter, setFilter] = useState('')

  const navigation = useNavigation<StackNavigationProps>()

  const screenWidth = Dimensions.get('window').width

  const { handleMusicSelected } = useTrackPlayer()
  const { handleGetMusicsByFilter } = useFirebaseServices()

  const [musicsFiltered, setMusicsFiltered] = useState<MusicProps[]>([])
  const [artistsFiltered, setArtistsFiltered] = useState<ArtistsDataProps[]>([])

  const handleFilterData = async (filter: string) => {
    if (filter.length > 2) {
      const response = await handleGetMusicsByFilter(filter)
      const responseArtists = await handleGetArtistsByFilter(filter)
      setMusicsFiltered(response)
      setArtistsFiltered(responseArtists)
    } else {
      setArtistsFiltered([])
      setMusicsFiltered([])
    }
  }

  const handleGetData = async () => {
    try {
      const resultMusicalGenres = await handleGetMusicalGenres()
      setMusicalGenres(resultMusicalGenres.map((item) => item.name))
    } catch (error) {}
  }

  useEffect(() => {
    handleGetData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <View className="flex-1 bg-gray-700">
      <View className="flex-1">
        <View className="p-4 flex-row items-center justify-between">
          <Text className="text-white text-3xl font-nunito-bold">Busca</Text>

          <TouchableOpacity onPress={handleIsVisible} activeOpacity={0.6}>
            <Icon name="settings-outline" size={26} />
          </TouchableOpacity>
        </View>

        <View className="p-4">
          <View className="bg-gray-950 rounded-xl overflow-hidden px-4 flex-row items-center justify-between">
            <View className="flex-row items-center">
              <Icon name="search" size={22} />
              <TextInput
                value={filter}
                className="ml-2 w-10/12 bg-transparent"
                placeholder="Artistas, faixas, podcasts..."
                onChangeText={(e) => {
                  setFilter(e)
                  handleFilterData(e)
                }}
              />
            </View>
            {filter && (
              <TouchableOpacity
                className="ml-auto"
                onPress={() => {
                  setArtistsFiltered([])
                  setMusicsFiltered([])
                  setFilter('')
                }}
              >
                <Icon name="close-circle" size={22} className="" />
              </TouchableOpacity>
            )}
          </View>

          <FlatList
            className="mt-4"
            showsVerticalScrollIndicator={false}
            data={artistsFiltered}
            ItemSeparatorComponent={() => <View className="h-3" />}
            renderItem={({ item, index }) => (
              <View className={`flex-row items-center justify-between `}>
                <TouchableOpacity
                  key={index}
                  className="flex-row items-center gap-4 flex-1"
                  onPress={() => {
                    navigation.navigate('Artist', { artistId: item.id })
                  }}
                >
                  <View className="w-20 h-20 bg-purple-600 rounded-full overflow-hidden items-center justify-center">
                    <Image
                      source={{ uri: item.photoURL }}
                      alt="artwork"
                      className="h-full w-full"
                    />
                  </View>
                  <View>
                    <Text className="font-nunito-bold text-white text-base">
                      {item.name}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            )}
          />

          <FlatList
            className="mt-4"
            showsVerticalScrollIndicator={false}
            data={musicsFiltered}
            ItemSeparatorComponent={() => <View className="h-3" />}
            renderItem={({ item, index }) => (
              <View className={`flex-row justify-between items-center `}>
                <TouchableOpacity
                  key={index}
                  className="flex-row items-center gap-2 max-w-[200px] "
                  onPress={() => {
                    handleMusicSelected({
                      musicSelected: item,
                      listMusics: [item],
                    })
                  }}
                >
                  <View className="w-20 h-20 bg-purple-600 rounded-xl overflow-hidden items-center justify-center">
                    {item.artwork ? (
                      <Image
                        source={{ uri: item.artwork }}
                        alt="artwork"
                        className="h-full w-full items-center justify-center"
                      />
                    ) : (
                      <Icon name="music" size={28} color={colors.white} />
                    )}
                  </View>
                  <View>
                    <Text className="font-bold text-white">{item.title}</Text>
                    <Text className="font-regular text-gray-300">
                      {item.artists[0].name}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            )}
          />

          {artistsFiltered.length === 0 &&
            musicsFiltered.length === 0 &&
            musicalGenres && (
              <>
                <Text className="font-nunito-bold text-lg text-white mb-2">
                  Navegar por todas as seções
                </Text>
                <FlatList
                  data={musicalGenres}
                  showsVerticalScrollIndicator={false}
                  numColumns={2}
                  horizontal={false}
                  columnWrapperStyle={{ gap: 12 }}
                  ItemSeparatorComponent={() => <View className="h-3" />}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={{ width: (screenWidth - 48) / 2 }}
                      className="bg-purple-600 rounded-lg px-2 items-center justify-center h-[60px]"
                      activeOpacity={0.8}
                      onPress={() =>
                        navigation.navigate('GenreSelected', { type: item })
                      }
                    >
                      <Text className="font-nunito-bold text-center text-white text-base leading-5">
                        {item}
                      </Text>
                    </TouchableOpacity>
                  )}
                />
              </>
            )}
        </View>
      </View>

      <View className="absolute bottom-0 w-full">
        {isCurrentMusic && <ControlCurrentMusic music={isCurrentMusic} />}
        <BottomMenu />
      </View>
    </View>
  )
}
