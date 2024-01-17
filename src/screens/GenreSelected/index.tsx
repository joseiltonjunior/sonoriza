import { BottomMenu } from '@components/BottomMenu/Index'
import { ControlCurrentMusic } from '@components/ControlCurrentMusic'
import { Loading } from '@components/Loading'
import { useFirebaseServices } from '@hooks/useFirebaseServices'

import { useNavigation, useRoute } from '@react-navigation/native'
import { RouteParamsProps, StackNavigationProps } from '@routes/routes'
import { ReduxProps } from '@storage/index'
import { CurrentMusicProps } from '@storage/modules/currentMusic/reducer'
import { ArtistsDataProps } from '@utils/Types/artistsProps'

import { useCallback, useEffect, useState } from 'react'
import { ActivityIndicator, FlatList, Image, Text, View } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'

import Icon from 'react-native-vector-icons/Ionicons'
import { useSelector } from 'react-redux'
import colors from 'tailwindcss/colors'

export function GenreSelected() {
  const { params } = useRoute<RouteParamsProps<'GenreSelected'>>()
  const { type } = params

  const [page, setPage] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [isEndList, setIsEndList] = useState(false)

  const [artists, setArtists] = useState<ArtistsDataProps[]>([])

  const navigation = useNavigation<StackNavigationProps>()

  const { isCurrentMusic } = useSelector<ReduxProps, CurrentMusicProps>(
    (state) => state.currentMusic,
  )

  const { handleGetArtistsByGenre } = useFirebaseServices()

  const handleGetArtistsData = useCallback(async () => {
    if (isLoading || isEndList) return
    setIsLoading(true)
    try {
      const response = await handleGetArtistsByGenre(type, page)

      setPage((prev) => prev + 1)
      setArtists((prev) => [...prev, ...response])

      if (response.length < 10) {
        setIsEndList(true)
      }

      setIsLoading(false)
    } catch (error) {
      setIsLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, isLoading, isEndList])

  useEffect(() => {
    handleGetArtistsData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (artists.length === 0) {
    return <Loading />
  }

  return (
    <View className="flex-1 bg-gray-700">
      <View className="px-4 flex-1">
        <View className="py-4">
          <TouchableOpacity
            onPress={() => {
              navigation.goBack()
            }}
            className="absolute p-2"
          >
            <Icon name="chevron-back-outline" size={30} color="#fff" />
          </TouchableOpacity>
          <Text className="text-lg  my-auto font-nunito-bold text-white ml-auto mr-auto mt-2">
            {type}
          </Text>
        </View>

        {artists && (
          <FlatList
            className={` mt-4`}
            showsVerticalScrollIndicator={false}
            data={artists}
            keyExtractor={(item) => item.id.toString()}
            onEndReached={handleGetArtistsData}
            onEndReachedThreshold={0.2}
            ItemSeparatorComponent={() => <View className="h-3" />}
            renderItem={({ item, index }) => (
              <TouchableOpacity
                key={index}
                className={`flex-row items-center gap-2 ${
                  index + 1 === artists.length &&
                  `${isCurrentMusic ? 'mb-32' : 'mb-16'}`
                }`}
                onPress={() => {
                  navigation.navigate('Artist', { artistId: item.id })
                }}
              >
                <View className="w-20 h-20 bg-purple-600 rounded-xl overflow-hidden items-center justify-center">
                  <Image
                    source={{ uri: item.photoURL }}
                    alt="photo artist"
                    className="h-full w-full"
                  />
                </View>
                <View>
                  <Text className="font-bold text-white">{item.name}</Text>
                </View>
              </TouchableOpacity>
            )}
          />
        )}
        {isLoading && (
          <View
            className={`absolute bottom-0 ${
              isCurrentMusic ? 'mb-32' : 'mb-16'
            } items-center w-full`}
          >
            <View className={`bg-gray-700 p-2 rounded-md`}>
              <ActivityIndicator color={colors.gray[300]} size={'large'} />
            </View>
          </View>
        )}
      </View>
      <View className="absolute bottom-0 w-full">
        {isCurrentMusic && <ControlCurrentMusic music={isCurrentMusic} />}
        <BottomMenu />
      </View>
    </View>
  )
}
