import { BottomMenu } from '@components/BottomMenu/Index'

import { ControlCurrentMusic } from '@components/ControlCurrentMusic'

import { useNavigation } from '@react-navigation/native'
import { StackNavigationProps } from '@routes/routes'
import { ReduxProps } from '@storage/index'
import { CurrentMusicProps } from '@storage/modules/currentMusic/reducer'
import { UserProps } from '@storage/modules/user/reducer'

import { Text, View, TouchableOpacity } from 'react-native'

import { useSelector } from 'react-redux'

import Icon from 'react-native-vector-icons/Ionicons'
import { useSideMenu } from '@hooks/useSideMenu'
import { TrackListOfflineProps } from '@storage/modules/trackListOffline/reducer'
import { NetInfoProps } from '@storage/modules/netInfo/reducer'
import colors from 'tailwindcss/colors'

export function Favorites() {
  const { isCurrentMusic } = useSelector<ReduxProps, CurrentMusicProps>(
    (state) => state.currentMusic,
  )

  const { trackListOffline } = useSelector<ReduxProps, TrackListOfflineProps>(
    (state) => state.trackListOffline,
  )

  const { status } = useSelector<ReduxProps, NetInfoProps>(
    (state) => state.netInfo,
  )

  const { user } = useSelector<ReduxProps, UserProps>((state) => state.user)

  const navigation = useNavigation<StackNavigationProps>()

  const { handleIsVisible } = useSideMenu()

  return (
    <View className="flex-1 bg-gray-700">
      <View className="p-4 flex-row items-center justify-between">
        <Text className="text-white text-3xl font-nunito-bold">Favoritos</Text>

        <TouchableOpacity onPress={handleIsVisible} activeOpacity={0.6}>
          <Icon name="settings-outline" size={26} color={colors.gray[300]} />
        </TouchableOpacity>
      </View>

      <View className="flex-1 w-screen">
        <TouchableOpacity
          activeOpacity={0.6}
          className="flex-row justify-between items-center px-4 py-2"
          onPress={() =>
            navigation.navigate('MoreMusic', {
              type: 'offline',
              title: 'Músicas baixadas',
            })
          }
        >
          <Text className="font-nunito-medium text-lg text-white">
            Músicas baixadas
          </Text>
          <Text className="font-nunito-regular text-gray-300">
            {trackListOffline.length}
          </Text>
        </TouchableOpacity>

        {status && (
          <>
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() =>
                navigation.navigate('MoreArtists', {
                  type: 'favorites',
                  title: 'Artistas',
                })
              }
              className="flex-row justify-between items-center px-4 py-2"
            >
              <Text className="font-nunito-medium text-lg text-white">
                Artistas
              </Text>
              <Text className="font-nunito-regular text-gray-300">
                {user.favoritesArtists?.length}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() =>
                navigation.navigate('MoreMusic', {
                  type: 'favorites',
                  title: 'Mais queridas',
                })
              }
              className="flex-row justify-between items-center px-4 py-2"
            >
              <Text className="font-nunito-medium text-lg text-white">
                Mais queridas
              </Text>
              <Text className="font-nunito-regular text-gray-300">
                {user.favoritesMusics?.length}
              </Text>
            </TouchableOpacity>
          </>
        )}

        {/* <TouchableOpacity
          disabled
          activeOpacity={0.6}
          className="flex-row justify-between items-center px-4 py-2"
        >
          <Text className="font-nunito-medium text-lg text-white">
            Playlists
          </Text>
          <Text className="font-nunito-regular text-gray-300">0</Text>
        </TouchableOpacity> */}
      </View>

      {isCurrentMusic && <ControlCurrentMusic music={isCurrentMusic} />}
      <BottomMenu />
    </View>
  )
}
