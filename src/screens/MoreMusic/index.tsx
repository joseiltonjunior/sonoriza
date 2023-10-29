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

export function MoreMusic() {
  const { params } = useRoute<RouteParamsProps<'MoreMusic'>>()
  const { musics, title } = params

  const { handleMusicSelected } = useTrackPlayer()

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
              navigation.navigate('Home')
            }}
            className="absolute left-0"
          >
            <Icon name="back" size={30} color="#fff" />
          </TouchableOpacity>
          <Text className="text-base font-bold text-white">{title}</Text>
        </View>

        <FlatList
          className="mt-4"
          showsVerticalScrollIndicator={false}
          data={musics}
          ItemSeparatorComponent={() => <View className="h-3" />}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              key={index}
              className="flex-row items-center gap-2 "
              onPress={() => {
                handleMusicSelected({
                  indexSelected: index,
                  listMusics: musics,
                  musicSelected: item,
                })
              }}
            >
              <View className="w-16 h-16 bg-purple-600 rounded-xl overflow-hidden items-center justify-center">
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
                <Text className="font-baloo-bold">{item.title}</Text>
                <Text className="font-baloo-regular">{item.artist}</Text>
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
