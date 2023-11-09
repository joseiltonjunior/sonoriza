import { BottomMenu } from '@components/BottomMenu/Index'
import { ControlCurrentMusic } from '@components/ControlCurrentMusic'

import { useNavigation, useRoute } from '@react-navigation/native'
import { RouteParamsProps, StackNavigationProps } from '@routes/routes'
import { ReduxProps } from '@storage/index'
import { CurrentMusicProps } from '@storage/modules/currentMusic/reducer'
import { Text, TouchableOpacity, View, Image } from 'react-native'
import { FlatList } from 'react-native-gesture-handler'
import { useSelector } from 'react-redux'

import Icon from 'react-native-vector-icons/AntDesign'

import { useEffect, useState } from 'react'
import { ArtistsDataProps } from '@utils/Types/artistsProps'
import { ArtistsProps } from '@storage/modules/artists/reducer'
import { UserProps } from '@storage/modules/user/reducer'
import { useFirebaseServices } from '@hooks/useFirebaseServices'
import colors from 'tailwindcss/colors'

export function MoreArtists() {
  const [listArtists, setListArtists] = useState<ArtistsDataProps[]>()
  const { params } = useRoute<RouteParamsProps<'MoreArtists'>>()
  const { type, title } = params

  const { artists } = useSelector<ReduxProps, ArtistsProps>(
    (state) => state.artists,
  )

  const { handleGetFavoritesArtists, handleFavoriteArtist } =
    useFirebaseServices()

  const { user } = useSelector<ReduxProps, UserProps>((state) => state.user)

  const navigation = useNavigation<StackNavigationProps>()

  const { isCurrentMusic } = useSelector<ReduxProps, CurrentMusicProps>(
    (state) => state.currentMusic,
  )

  const handleGetArtists = async (ids: string[]) => {
    await handleGetFavoritesArtists(ids).then((result) => {
      setListArtists(result)
    })
  }

  useEffect(() => {
    if (type === 'default') {
      setListArtists(artists)
    } else if (user.favoritesArtists && user.favoritesArtists.length > 0) {
      handleGetArtists(user.favoritesArtists)
    } else {
      setListArtists([])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, user.favoritesArtists])

  return (
    <View className="flex-1 bg-gray-950">
      <View className="px-4 flex-1 mt-2">
        <View className="items-center justify-center py-4">
          <TouchableOpacity
            onPress={() => {
              navigation.goBack()
            }}
            className="absolute left-0"
          >
            <Icon name="left" size={25} color="#fff" />
          </TouchableOpacity>
          <Text className="text-lg font-nunito-bold text-white">{title}</Text>
        </View>

        <FlatList
          className="mt-4"
          showsVerticalScrollIndicator={false}
          data={listArtists}
          ItemSeparatorComponent={() => <View className="h-3" />}
          renderItem={({ item, index }) => (
            <View className="flex-row items-center justify-between">
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
        />
      </View>

      {isCurrentMusic && <ControlCurrentMusic music={isCurrentMusic} />}
      <BottomMenu />
    </View>
  )
}
