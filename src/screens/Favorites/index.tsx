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

export function Favorites() {
  const { isCurrentMusic } = useSelector<ReduxProps, CurrentMusicProps>(
    (state) => state.currentMusic,
  )

  const { user } = useSelector<ReduxProps, UserProps>((state) => state.user)

  const navigation = useNavigation<StackNavigationProps>()

  const { handleIsVisible } = useSideMenu()

  return (
    <View className="flex-1">
      <View className="p-4 flex-row items-center justify-between">
        <Text className="text-white text-3xl font-nunito-bold">Favoritos</Text>

        <TouchableOpacity onPress={handleIsVisible} activeOpacity={0.6}>
          <Icon name="settings-outline" size={26} />
        </TouchableOpacity>
      </View>

      <View className="flex-1 w-screen">
        <TouchableOpacity
          disabled
          activeOpacity={0.6}
          className="flex-row justify-between items-center px-4 py-2"
        >
          <Text className="font-nunito-medium text-lg text-white">
            Músicas baixadas
          </Text>
          <Text className="font-nunito-regular text-gray-300">0</Text>
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

        <TouchableOpacity
          disabled
          activeOpacity={0.6}
          className="flex-row justify-between items-center px-4 py-2"
        >
          <Text className="font-nunito-medium text-lg text-white">
            Playlists
          </Text>
          <Text className="font-nunito-regular text-gray-300">0</Text>
        </TouchableOpacity>

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
        {/* {musics && (
          <Section
            title="Suas músicas favoritas"
            onPress={() =>
              navigation.navigate('MoreMusic', {
                listMusics: musics,
                title: 'Suas músicas favoritas',
              })
            }
          >
            <BoxCarousel musics={musics} />
          </Section>
        )} */}

        {/* {artists && (
          <Section
            title="Seus artistas favoritos"
            className="mt-12"
            onPress={() =>
              navigation.navigate('MoreArtists', {
                listArtists: artists,
                title: 'Seus artistas favoritos',
              })
            }
          >
            <RoundedCarousel artists={artists} />
          </Section>
        )} */}
      </View>

      {isCurrentMusic && <ControlCurrentMusic music={isCurrentMusic} />}
      <BottomMenu />
    </View>
  )
}
