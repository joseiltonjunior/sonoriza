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

export function MoreArtists() {
  const { params } = useRoute<RouteParamsProps<'MoreArtists'>>()
  const { listArtists } = params

  const navigation = useNavigation<StackNavigationProps>()

  const { isCurrentMusic } = useSelector<ReduxProps, CurrentMusicProps>(
    (state) => state.currentMusic,
  )

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
          <Text className="text-lg font-nunito-bold text-white">
            Explore por artistas
          </Text>
        </View>

        <FlatList
          className="mt-4"
          showsVerticalScrollIndicator={false}
          data={listArtists}
          ItemSeparatorComponent={() => <View className="h-3" />}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              key={index}
              className="flex-row items-center gap-4"
              onPress={() => {
                navigation.navigate('Artist', { artist: item })
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
          )}
        />
      </View>

      {isCurrentMusic && <ControlCurrentMusic music={isCurrentMusic} />}
      <BottomMenu />
    </View>
  )
}
