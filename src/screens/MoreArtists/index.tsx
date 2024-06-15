import { BottomMenu } from '@components/BottomMenu/Index'
import { ControlCurrentMusic } from '@components/ControlCurrentMusic'

import { useNavigation, useRoute } from '@react-navigation/native'
import { RouteParamsProps, StackNavigationProps } from '@routes/routes'
import { ReduxProps } from '@storage/index'
import { CurrentMusicProps } from '@storage/modules/currentMusic/reducer'
import {
  Text,
  TouchableOpacity,
  View,
  Image,
  ActivityIndicator,
} from 'react-native'
import { FlatList } from 'react-native-gesture-handler'
import { useDispatch, useSelector } from 'react-redux'

import Icon from 'react-native-vector-icons/Ionicons'

import { useCallback, useEffect, useState } from 'react'
import { ArtistsDataProps } from '@utils/Types/artistsProps'

import { UserProps } from '@storage/modules/user/reducer'
import { useFirebaseServices } from '@hooks/useFirebaseServices'
import colors from 'tailwindcss/colors'

import { Loading } from '@components/Loading'
import { setFavoriteArtists } from '@storage/modules/favoriteArtists/reducer'

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

  const dispatch = useDispatch()

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
        if (
          result.length < 10 ||
          (user.favoritesArtists && user.favoritesArtists.length <= 10)
        ) {
          setIsEndList(true)
        }
      })
      .finally(() => setIsLoading(false))
      .catch((e) => console.log(e))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, isLoading, isEndList, page])

  const handleChangeFavoriteArtist = async (artist: ArtistsDataProps) => {
    await handleFavoriteArtist(artist)
    const filter = listArtists.filter((item) => item.id !== artist.id)
    setListArtists(filter)
    dispatch(setFavoriteArtists({ favoriteArtists: filter }))
  }

  useEffect(() => {
    handleGetArtists()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (listArtists.length === 0) {
    return <Loading />
  }

  return (
    <View className="flex-1 bg-gray-700">
      <View className="px-4 flex-1">
        <View className="items-center justify-center py-4 mt-10">
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
          className={`mt-4 `}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item) => item.id.toString()}
          data={listArtists}
          onEndReached={handleGetArtists}
          onEndReachedThreshold={0.3}
          renderItem={({ item, index }) => (
            <View
              className={`flex-row items-center justify-between ${
                index + 1 === listArtists.length &&
                `${isCurrentMusic ? 'mb-32' : 'mb-16'}`
              }`}
            >
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
                    handleChangeFavoriteArtist(item)
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
          <View
            className={`absolute bottom-0 ${
              isCurrentMusic ? 'mb-32' : 'mb-16'
            } items-center w-full`}
          >
            <View className={`bg-gray-700 rounded-full`}>
              <ActivityIndicator color={colors.gray[300]} size={'large'} />
            </View>
          </View>
        )}
      </View>

      <View className="absolute bottom-0 w-full ">
        {isCurrentMusic && <ControlCurrentMusic music={isCurrentMusic} />}
        <BottomMenu />
      </View>
    </View>
  )
}
