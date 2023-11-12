import { useTrackPlayer } from '@hooks/useTrackPlayer'
import { useNavigation } from '@react-navigation/native'
import { StackNavigationProps } from '@routes/routes'
import AnimatedLottieView from 'lottie-react-native'
import { ReduxProps } from '@storage/index'
import {
  CurrentMusicProps,
  handleSetCurrentMusic,
} from '@storage/modules/currentMusic/reducer'

import { MusicProps } from '@utils/Types/musicProps'

import playing from '@assets/playing.json'

import {
  FlatList,
  ImageBackground,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'

import Icon from 'react-native-vector-icons/Ionicons'
import IconFather from 'react-native-vector-icons/Feather'
import IconMaterial from 'react-native-vector-icons/MaterialIcons'

import { useDispatch, useSelector } from 'react-redux'
import colors from 'tailwindcss/colors'

import { QueueProps, handleSetQueue } from '@storage/modules/queue/reducer'
import { ControlCurrentMusic } from '@components/ControlCurrentMusic'
import { BottomMenu } from '@components/BottomMenu/Index'
import { useCallback } from 'react'

export function Queue() {
  const navigation = useNavigation<StackNavigationProps>()

  const { isCurrentMusic } = useSelector<ReduxProps, CurrentMusicProps>(
    (state) => state.currentMusic,
  )

  const { queue } = useSelector<ReduxProps, QueueProps>((state) => state.queue)

  const dispatch = useDispatch()

  const { handleMusicSelected, TrackPlayer } = useTrackPlayer()

  const handleGetQueue = useCallback(async () => {
    try {
      const queue = await TrackPlayer.getQueue()
      dispatch(handleSetQueue({ queue }))
    } catch (error) {}
  }, [TrackPlayer, dispatch])

  const handleRemoveToQueue = async (index: number) => {
    try {
      await TrackPlayer.remove(index)
      if (queue.length === 1) {
        dispatch(handleSetCurrentMusic({ isCurrentMusic: undefined }))
        navigation.reset({
          index: 0,
          routes: [{ name: 'Home' }],
        })
      } else {
        handleGetQueue()
      }
    } catch (error) {}
  }

  return (
    <View className="flex-1 bg-gray-950">
      <View className="px-4 flex-1 mt-4">
        <View className="flex-row items-center justify-center">
          <TouchableOpacity
            onPress={() => {
              navigation.goBack()
            }}
            className="absolute left-0 p-2 rounded-full"
          >
            <Icon name="chevron-back-outline" size={25} color="#fff" />
          </TouchableOpacity>

          <Text className="text-white font-nunito-bold text-lg">Tocando</Text>
        </View>

        <FlatList
          className="mt-8"
          showsVerticalScrollIndicator={false}
          data={queue}
          ItemSeparatorComponent={() => <View className="h-3" />}
          renderItem={({ item, index }) => (
            <View className="flex-row justify-between items-center">
              <TouchableOpacity
                className="flex-row items-center gap-2 max-w-[200px] "
                onPress={() => {
                  handleMusicSelected({
                    musicSelected: item as MusicProps,
                    indexSelected: index,
                    listMusics: queue as MusicProps[],
                  })
                }}
              >
                <View className="w-20 h-20 bg-purple-600 rounded-xl overflow-hidden items-center justify-center">
                  {item.artwork ? (
                    <ImageBackground
                      source={{ uri: item.artwork }}
                      alt="artwork"
                      className="h-full w-full items-center justify-center"
                    >
                      {item.title === isCurrentMusic?.title && (
                        <View className="bg-white/90 rounded-full p-1">
                          <AnimatedLottieView
                            source={playing}
                            autoPlay
                            loop
                            style={{ width: 30, height: 30 }}
                          />
                        </View>
                      )}
                    </ImageBackground>
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
                activeOpacity={0.6}
                onPress={() => {
                  handleRemoveToQueue(index)
                }}
              >
                <IconMaterial
                  name={'playlist-remove'}
                  color={colors.gray[300]}
                  size={30}
                />
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
