import { BottomMenu } from '@components/BottomMenu/Index'
import { ControlCurrentMusic } from '@components/ControlCurrentMusic'

import { useNavigation, useRoute } from '@react-navigation/native'
import { RouteParamsProps, StackNavigationProps } from '@routes/routes'
import { ReduxProps } from '@storage/index'
import { CurrentMusicProps } from '@storage/modules/currentMusic/reducer'
import { Text, TouchableOpacity, View, Image } from 'react-native'
import { FlatList } from 'react-native-gesture-handler'
import { useSelector } from 'react-redux'

import Icon from 'react-native-vector-icons/Ionicons'

import { useCallback, useEffect, useState } from 'react'
import { ArtistsDataProps } from '@utils/Types/artistsProps'

import { UserProps } from '@storage/modules/user/reducer'
import { useFirebaseServices } from '@hooks/useFirebaseServices'
import colors from 'tailwindcss/colors'

import { Loading } from '@components/Loading'

export function MoreArtists() {
  const [listArtists, setListArtists] = useState<ArtistsDataProps[]>([])
  const { params } = useRoute<RouteParamsProps<'MoreArtists'>>()
  const { type, title } = params

  const [page, setPage] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [isEndList, setIsEndList] = useState(false)

  const { handleGetFavoritesArtists, handleFavoriteArtist } =
    useFirebaseServices()

  const { user } = useSelector<ReduxProps, UserProps>((state) => state.user)

  const navigation = useNavigation<StackNavigationProps>()

  const { isCurrentMusic } = useSelector<ReduxProps, CurrentMusicProps>(
    (state) => state.currentMusic,
  )

  const handleGetArtists = useCallback(async () => {
    if (!user.favoritesArtists || isLoading || isEndList) return

    setIsLoading(true)
    await handleGetFavoritesArtists(user.favoritesArtists, page)
      .then((result) => {
        setPage((prev) => prev + 1)
        setListArtists((prev) => [...prev, ...result])
        if (result.length < 10) {
          setIsEndList(true)
        }
      })
      .finally(() => setIsLoading(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, isLoading, isEndList, page])

  useEffect(() => {
    handleGetArtists()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (listArtists.length === 0) {
    return <Loading />
  }

  return (
    <View className="flex-1 bg-gray-700">
      <View className="px-4 flex-1 mt-2">
        <View className="items-center justify-center py-4">
          <TouchableOpacity
            onPress={() => {
              navigation.goBack()
            }}
            className="absolute left-0  p-2 rounded-full"
          >
            <Icon name="chevron-back-outline" size={30} color="#fff" />
          </TouchableOpacity>
          <Text className="text-lg font-nunito-bold text-white">{title}</Text>
        </View>

        <FlatList
          className={`mt-4 ${isCurrentMusic ? 'mb-32' : 'mb-20'} ${
            isLoading && 'm-0'
          }`}
          showsVerticalScrollIndicator={false}
          data={listArtists}
          onEndReached={handleGetArtists}
          onEndReachedThreshold={0.1}
          renderItem={({ item, index }) => (
            <View className={`flex-row items-center justify-between`}>
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
              {type === 'favorites' && (
                <TouchableOpacity
                  onPress={() => {
                    handleFavoriteArtist(item)
                  }}
                  activeOpacity={0.6}
                  className="p-4"
                >
                  <Icon name={'heart'} color={colors.white} size={22} />
                </TouchableOpacity>
              )}
            </View>
          )}
          ItemSeparatorComponent={() => <View className="h-3" />}
        />
        {isLoading && (
          <Text
            className={`${
              isCurrentMusic ? 'mb-32' : 'mb-20'
            } mt-4 text-center font-nunito-bold text-gray-300`}
          >
            Carregando...
          </Text>
        )}
      </View>

      <View className="absolute bottom-0 w-full ">
        {isCurrentMusic && <ControlCurrentMusic music={isCurrentMusic} />}
        <BottomMenu />
      </View>
    </View>
  )
}
