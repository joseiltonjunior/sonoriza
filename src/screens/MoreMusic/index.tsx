import { BottomMenu } from '@components/BottomMenu/Index'
import { ControlCurrentMusic } from '@components/ControlCurrentMusic'
import { useTrackPlayer } from '@hooks/useTrackPlayer'
import { useNavigation, useRoute } from '@react-navigation/native'
import { RouteParamsProps, StackNavigationProps } from '@routes/routes'
import { ReduxProps } from '@storage/index'
import { CurrentMusicProps } from '@storage/modules/currentMusic/reducer'
import { Text, TouchableOpacity, View, Image } from 'react-native'
import { FlatList } from 'react-native-gesture-handler'
import { useSelector } from 'react-redux'
import IconFather from 'react-native-vector-icons/Feather'
import Icon from 'react-native-vector-icons/AntDesign'
import colors from 'tailwindcss/colors'
import { TrackListRemoteProps } from '@storage/modules/trackListRemote/reducer'
import { useEffect, useState } from 'react'
import { MusicProps } from '@utils/Types/musicProps'
import { UserProps } from '@storage/modules/user/reducer'
import { useFirebaseServices } from '@hooks/useFirebaseServices'

export function MoreMusic() {
  const { params } = useRoute<RouteParamsProps<'MoreMusic'>>()
  const { type, title } = params

  const [listMusics, setListMusics] = useState<MusicProps[]>([])

  const { handleGetFavoritesMusics, handleFavoriteMusic } =
    useFirebaseServices()

  const { trackListRemote } = useSelector<ReduxProps, TrackListRemoteProps>(
    (state) => state.trackListRemote,
  )
  const { user } = useSelector<ReduxProps, UserProps>((state) => state.user)

  const { handleMusicSelected } = useTrackPlayer()

  const navigation = useNavigation<StackNavigationProps>()

  const { isCurrentMusic } = useSelector<ReduxProps, CurrentMusicProps>(
    (state) => state.currentMusic,
  )

  const handleGetMusics = async (ids: string[]) => {
    await handleGetFavoritesMusics(ids).then((result) => {
      setListMusics(result)
    })
  }

  useEffect(() => {
    if (type === 'default') {
      setListMusics(trackListRemote)
    } else if (user.favoritesMusics && user.favoritesMusics.length > 0) {
      handleGetMusics(user.favoritesMusics)
    } else {
      setListMusics([])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, user.favoritesMusics])

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
            <Icon name="back" size={30} color="#fff" />
          </TouchableOpacity>
          <Text className="text-lg font-bold text-white">{title}</Text>
        </View>

        <FlatList
          className="mt-4"
          showsVerticalScrollIndicator={false}
          data={listMusics}
          ItemSeparatorComponent={() => <View className="h-3" />}
          renderItem={({ item, index }) => (
            <View className="flex-row justify-between items-center">
              <TouchableOpacity
                key={index}
                className="flex-row items-center gap-2 max-w-[200px] "
                onPress={() => {
                  handleMusicSelected({
                    indexSelected: index,
                    listMusics,
                    musicSelected: item,
                  })
                }}
              >
                <View className="w-20 h-20 bg-purple-600 rounded-xl overflow-hidden items-center justify-center">
                  {item.artwork ? (
                    <Image
                      source={{ uri: item.artwork }}
                      alt="artwork"
                      className="h-full w-full"
                    />
                  ) : (
                    <IconFather name="music" size={28} color={colors.white} />
                  )}
                </View>
                <View>
                  <Text className="font-bold text-white">{item.title}</Text>
                  <Text className="font-regular text-gray-300">
                    {item.artists[0].name}
                  </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  handleFavoriteMusic(item)
                }}
                activeOpacity={0.6}
                className="p-4"
              >
                <Icon name={'heart'} color={colors.white} size={22} />
              </TouchableOpacity>
            </View>
          )}
        />
      </View>

      {isCurrentMusic && <ControlCurrentMusic music={isCurrentMusic} />}
      <BottomMenu />
    </View>
  )
}
