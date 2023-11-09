import { useTrackPlayer } from '@hooks/useTrackPlayer'
import { useNavigation } from '@react-navigation/native'
import { StackNavigationProps } from '@routes/routes'
import { ReduxProps } from '@storage/index'
import { CurrentMusicProps } from '@storage/modules/currentMusic/reducer'

import { MusicProps } from '@utils/Types/musicProps'
import { useCallback, useEffect, useState } from 'react'
import AnimatedLottieView from 'lottie-react-native'
import {
  FlatList,
  ImageBackground,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { State, Track } from 'react-native-track-player'

import Icon from 'react-native-vector-icons/AntDesign'
import IconFather from 'react-native-vector-icons/Feather'
import IconMaterial from 'react-native-vector-icons/MaterialIcons'

import { useSelector } from 'react-redux'
import colors from 'tailwindcss/colors'

import animation from '@assets/playing.json'
import { TrackListRemoteProps } from '@storage/modules/trackListRemote/reducer'

export function Queue() {
  const navigation = useNavigation<StackNavigationProps>()
  const { trackListRemote } = useSelector<ReduxProps, TrackListRemoteProps>(
    (state) => state.trackListRemote,
  )

  const [queue, setQueue] = useState<Track[]>([])

  const { isCurrentMusic, state } = useSelector<ReduxProps, CurrentMusicProps>(
    (state) => state.currentMusic,
  )

  const { handleMusicSelected, TrackPlayer } = useTrackPlayer()

  const handleStateMusic = useCallback(
    (title: string) => {
      switch (state) {
        case State.Playing:
          if (title !== isCurrentMusic?.title) {
            return 'play-not-current'
          }
          return 'play-current'

        case State.Paused:
        case State.Ended:
          return 'paused'

        default:
          return 'paused'
      }
    },
    [isCurrentMusic?.title, state],
  )

  const handleRemoveToQueue = async (index: number) => {
    try {
      await TrackPlayer.remove(index)
    } catch (error) {
      console.log(error, 'err')
    }
  }

  const handleGetQueue = useCallback(async () => {
    const response = await TrackPlayer.getQueue()
    if (response.length > 0) setQueue(response)
  }, [TrackPlayer])

  useEffect(() => {
    handleGetQueue()
  }, [handleGetQueue])

  return (
    <View className="p-4">
      <View className="flex-row items-center justify-center mt-2">
        <TouchableOpacity
          onPress={() => {
            navigation.goBack()
          }}
          className="absolute left-0"
        >
          <Icon name="left" size={25} color="#fff" />
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
                  listMusics: trackListRemote,
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
                    {item.title &&
                      handleStateMusic(item.title) === 'play-current' && (
                        <View className="bg-white/80 h-8 w-8 rounded-xl">
                          <AnimatedLottieView
                            source={animation}
                            autoPlay
                            loop
                            style={{ width: 35, height: 35 }}
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
                handleGetQueue()
              }}
            >
              <IconMaterial
                name={'playlist-remove'}
                color={colors.purple[600]}
                size={30}
              />
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  )
}
