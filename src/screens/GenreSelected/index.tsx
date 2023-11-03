import { BottomMenu } from '@components/BottomMenu/Index'
import { ControlCurrentMusic } from '@components/ControlCurrentMusic'
import { useTrackPlayer } from '@hooks/useTrackPlayer'
import { useNavigation, useRoute } from '@react-navigation/native'
import { RouteParamsProps, StackNavigationProps } from '@routes/routes'
import { ReduxProps } from '@storage/index'
import { CurrentMusicProps } from '@storage/modules/currentMusic/reducer'
import { TrackListRemoteProps } from '@storage/modules/trackListRemote/reducer'

import { useMemo } from 'react'
import { FlatList, Image, Text, View } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'

import Icon from 'react-native-vector-icons/AntDesign'
import { useSelector } from 'react-redux'

export function GenreSelected() {
  const { params } = useRoute<RouteParamsProps<'GenreSelected'>>()
  const { type } = params

  const navigation = useNavigation<StackNavigationProps>()

  const { isCurrentMusic } = useSelector<ReduxProps, CurrentMusicProps>(
    (state) => state.currentMusic,
  )

  const { trackListRemote } = useSelector<ReduxProps, TrackListRemoteProps>(
    (state) => state.trackListRemote,
  )

  const { handleMusicSelected } = useTrackPlayer()

  const listMusics = useMemo(() => {
    const filter = trackListRemote.filter((music) => music.genre.includes(type))
    return filter
  }, [trackListRemote, type])

  return (
    <View className="flex-1 bg-gray-950">
      <View className="px-4 flex-1 mt-2">
        <View className="py-4">
          <TouchableOpacity
            onPress={() => {
              navigation.goBack()
            }}
            className="absolute"
          >
            <Icon name="back" size={30} color="#fff" />
          </TouchableOpacity>
          <Text className="text-lg font-nunito-bold text-white ml-auto mr-auto">
            {type}
          </Text>
        </View>

        {listMusics && (
          <FlatList
            className="mt-4"
            showsVerticalScrollIndicator={false}
            data={listMusics}
            ItemSeparatorComponent={() => <View className="h-3" />}
            renderItem={({ item, index }) => (
              <TouchableOpacity
                key={index}
                className="flex-row items-center gap-2 "
                onPress={() => {
                  handleMusicSelected({
                    indexSelected: index,
                    listMusics,
                    musicSelected: item,
                  })
                }}
              >
                <View className="w-20 h-20 bg-purple-600 rounded-xl overflow-hidden items-center justify-center">
                  <Image
                    source={{ uri: item.artwork }}
                    alt="artwork"
                    className="h-full w-full"
                  />
                </View>
                <View>
                  <Text className="font-bold text-white">{item.title}</Text>
                  <Text className="font-regular text-gray-300">
                    {item.artists[0].name}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
          />
        )}
      </View>
      {isCurrentMusic && <ControlCurrentMusic music={isCurrentMusic} />}
      <BottomMenu />
    </View>
  )
}
