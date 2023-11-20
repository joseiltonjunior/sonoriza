import { BottomMenu } from '@components/BottomMenu/Index'
import { ControlCurrentMusic } from '@components/ControlCurrentMusic'
import { useFirebaseServices } from '@hooks/useFirebaseServices'
import { useTrackPlayer } from '@hooks/useTrackPlayer'
import { useNavigation, useRoute } from '@react-navigation/native'
import { RouteParamsProps, StackNavigationProps } from '@routes/routes'
import { ReduxProps } from '@storage/index'
import { CurrentMusicProps } from '@storage/modules/currentMusic/reducer'

import { MusicProps } from '@utils/Types/musicProps'

import { useCallback, useEffect, useState } from 'react'
import { FlatList, Image, Text, View } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'

import Icon from 'react-native-vector-icons/Ionicons'
import { useSelector } from 'react-redux'

export function GenreSelected() {
  const { params } = useRoute<RouteParamsProps<'GenreSelected'>>()
  const { type } = params

  const [musics, setMusics] = useState<MusicProps[]>([])

  const navigation = useNavigation<StackNavigationProps>()

  const { isCurrentMusic } = useSelector<ReduxProps, CurrentMusicProps>(
    (state) => state.currentMusic,
  )

  const { handleGetMusicsByGenre } = useFirebaseServices()
  const { handleMusicSelected } = useTrackPlayer()

  const handleGetMusics = useCallback(async () => {
    try {
      const response = await handleGetMusicsByGenre(type)
      setMusics(response)
    } catch (error) {
      console.log(error, 'err')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type])

  useEffect(() => {
    handleGetMusics()
  }, [handleGetMusics])

  return (
    <View className="flex-1 bg-gray-700">
      <View className="px-4 flex-1 mt-2">
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

        {musics && (
          <FlatList
            className="mt-4"
            showsVerticalScrollIndicator={false}
            data={musics}
            ItemSeparatorComponent={() => <View className="h-3" />}
            renderItem={({ item, index }) => (
              <TouchableOpacity
                key={index}
                className={`flex-row items-center gap-2 ${
                  index + 1 === musics.length && 'mb-32'
                }`}
                onPress={() => {
                  handleMusicSelected({
                    listMusics: musics,
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
      <View className="absolute bottom-0 w-full">
        {isCurrentMusic && <ControlCurrentMusic music={isCurrentMusic} />}
        <BottomMenu />
      </View>
    </View>
  )
}
