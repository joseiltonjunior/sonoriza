import { BottomMenu } from '@components/BottomMenu/Index'
import { ControlCurrentMusic } from '@components/ControlCurrentMusic'

import { useFirebaseServices } from '@hooks/useFirebaseServices'
import { useSideMenu } from '@hooks/useSideMenu'
import { useTrackPlayer } from '@hooks/useTrackPlayer'
import { useNavigation } from '@react-navigation/native'
import { StackNavigationProps } from '@routes/routes'
import { ReduxProps } from '@storage/index'
import { CurrentMusicProps } from '@storage/modules/currentMusic/reducer'
import {
  SearchHistoricProps,
  removeSearchHistoric,
  setSearchHistoric,
} from '@storage/modules/searchHistoric/reducer'
import { ArtistsDataProps } from '@utils/Types/artistsProps'
import { MusicProps } from '@utils/Types/musicProps'

import { useEffect, useState } from 'react'
import { Image, ScrollView, Text, TextInput, View } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import Icon from 'react-native-vector-icons/Ionicons'
import { useDispatch, useSelector } from 'react-redux'
import colors from 'tailwindcss/colors'

import { Section } from '@components/Section'
import { MusicalGenres } from '@components/MusicalGenres'

export function Search() {
  const { handleIsVisible } = useSideMenu()

  const { handleGetMusicalGenres, handleGetArtistsByFilter } =
    useFirebaseServices()

  const { isCurrentMusic } = useSelector<ReduxProps, CurrentMusicProps>(
    (state) => state.currentMusic,
  )

  const { historic } = useSelector<ReduxProps, SearchHistoricProps>(
    (state) => state.searchHistoric,
  )

  const [musicalGenres, setMusicalGenres] = useState<string[]>([])

  const [filter, setFilter] = useState('')

  const navigation = useNavigation<StackNavigationProps>()

  const dispatch = useDispatch()

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
      <ScrollView className="flex-1">
        <View className="p-4 flex-row items-center justify-between">
          <Text className="text-white text-3xl font-nunito-bold">Busca</Text>

          <TouchableOpacity onPress={handleIsVisible} activeOpacity={0.6}>
            <Icon name="settings-outline" size={26} color={colors.gray[300]} />
          </TouchableOpacity>
        </View>

        <View className="p-4">
          <View className="bg-gray-950 rounded-xl overflow-hidden px-4 flex-row items-center justify-between">
            <View className="flex-row items-center">
              <Icon name="search" size={22} color={colors.gray[300]} />
              <TextInput
                value={filter}
                placeholderTextColor={colors.gray[300]}
                className="ml-2 w-10/12 bg-transparent text-white "
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
                <Icon name="close-circle" size={22} color={colors.gray[300]} />
              </TouchableOpacity>
            )}
          </View>

          {!filter && historic.length > 0 && (
            <View className="mt-4">
              <Text className="font-nunito-medium text-white">
                Buscas recentes
              </Text>
              {historic.map((item) => (
                <View
                  key={item.name}
                  className="flex-row items-center justify-between mt-2"
                >
                  <TouchableOpacity
                    className="flex-row items-center w-80"
                    onPress={() => {
                      if (item.music) {
                        handleMusicSelected({
                          musicSelected: item.music,
                          listMusics: [item.music],
                        })
                        return
                      }
                      navigation.navigate('Artist', { artistId: item.id })
                    }}
                  >
                    <Image
                      source={{ uri: item.photoURL }}
                      alt="pic"
                      className={`w-12 h-12 ${
                        item.photoURL.includes('artists')
                          ? 'rounded-full'
                          : 'rounded-md'
                      }`}
                    />
                    <Text className="ml-2 font-nunito-bold text-gray-300">
                      {item.name}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    className="p-2"
                    onPress={() => dispatch(removeSearchHistoric(item))}
                  >
                    <Icon name="trash" size={20} color={colors.gray[300]} />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}

          <View className="mt-2">
            {artistsFiltered.map((item) => (
              <TouchableOpacity
                key={item.id}
                className="flex-row items-center flex-1 mt-2"
                onPress={() => {
                  dispatch(
                    setSearchHistoric({
                      name: item.name,
                      photoURL: item.photoURL,
                      id: item.id,
                    }),
                  )
                  navigation.navigate('Artist', { artistId: item.id })
                }}
              >
                <View className="w-16 h-16 bg-purple-600 rounded-full overflow-hidden items-center justify-center">
                  <Image
                    source={{ uri: item.photoURL }}
                    alt="artwork"
                    className="h-full w-full"
                  />
                </View>

                <Text className="font-nunito-bold text-white text-base ml-2">
                  {item.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View className="mt-2">
            {musicsFiltered.map((item) => (
              <TouchableOpacity
                key={item.id}
                className="flex-row items-center max-w-[200px] mt-2 "
                onPress={() => {
                  dispatch(
                    setSearchHistoric({
                      name: item.title,
                      photoURL: item.artwork,
                      id: item.id,
                      music: item,
                    }),
                  )
                  handleMusicSelected({
                    musicSelected: item,
                    listMusics: [item],
                  })
                }}
              >
                <View className="w-16 h-16 bg-purple-600 rounded-xl overflow-hidden items-center justify-center">
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
                <View className="ml-2">
                  <Text className="font-bold text-white">{item.title}</Text>
                  <Text className="font-regular text-gray-300">
                    {item.artists[0].name}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {artistsFiltered.length === 0 &&
          musicsFiltered.length === 0 &&
          musicalGenres.length > 0 && (
            <Section title=" Explore por gêneros musicais" className="mt-4">
              <MusicalGenres musicalGenres={musicalGenres} />
            </Section>
          )}
      </ScrollView>

      <View className="absolute bottom-0 w-full">
        {isCurrentMusic && <ControlCurrentMusic music={isCurrentMusic} />}
        <BottomMenu />
      </View>
    </View>
  )
}
