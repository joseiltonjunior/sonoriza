import { useTrackPlayer } from '@hooks/useTrackPlayer'
import { useNavigation } from '@react-navigation/native'
import { StackNavigationProps } from '@routes/routes'
import { ProgressBar } from '@react-native-community/progress-bar-android'
import Carousel from 'react-native-reanimated-carousel'

import { useCallback, useEffect, useMemo, useState } from 'react'

import AnimatedLottieView from 'lottie-react-native'
import animation from '@assets/music-loading.json'

import {
  Dimensions,
  ImageBackground,
  NativeSyntheticEvent,
  NativeTouchEvent,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'

import Icon from 'react-native-vector-icons/Ionicons'

import FatherIcons from 'react-native-vector-icons/Feather'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { useDispatch, useSelector } from 'react-redux'
import { ReduxProps } from '@storage/index'
import {
  CurrentMusicProps,
  handleSetCurrentMusic,
} from '@storage/modules/currentMusic/reducer'
import { RepeatMode, State as StatePlayer } from 'react-native-track-player'

import { useBottomModal } from '@hooks/useBottomModal'

import { InfoPlayingMusic } from '@components/InfoPlayingMusic'

import { QueueProps } from '@storage/modules/queue/reducer'
import { MusicProps } from '@utils/Types/musicProps'

import { DynamicBackgroundColor } from '@components/DynamicBackgroundColor'

import { useFavorites } from '@hooks/useFavorites'
import { useFirebaseServices } from '@hooks/useFirebaseServices'
import { useNetInfo } from '@react-native-community/netinfo'

export function Music() {
  const navigation = useNavigation<StackNavigationProps>()

  const { isConnected } = useNetInfo()
  const { TrackPlayer, useProgress } = useTrackPlayer()

  const size = Dimensions.get('window').width * 1

  const { openModal } = useBottomModal()

  const { duration, position } = useProgress()

  const [fontColor, setFontColor] = useState('#fff')

  const [changeProgress, setChangeProgress] = useState<number>(0)

  const [repeatMode, setRepeatMode] = useState<number>(0)

  const [currentPosition, setCurrentPosition] = useState<number>(0)

  const [isSeek, setIsSeek] = useState(false)

  const { isCurrentMusic, state } = useSelector<ReduxProps, CurrentMusicProps>(
    (state) => state.currentMusic,
  )

  const { queue } = useSelector<ReduxProps, QueueProps>((state) => state.queue)

  const dispatch = useDispatch()

  const { isFavoriteMusic } = useFavorites(isCurrentMusic)

  const { handleFavoriteMusic } = useFirebaseServices()

  const havePrevious = useMemo(() => {
    const currentIndex = queue.findIndex(
      (item) => item.id === isCurrentMusic?.id,
    )
    if (currentIndex === 0) return true
    return false
  }, [isCurrentMusic?.id, queue])

  const haveNext = useMemo(() => {
    const currentIndex = queue.findIndex(
      (item) => item.id === isCurrentMusic?.id,
    )
    if (currentIndex + 1 === queue.length) return true
    return false
  }, [isCurrentMusic?.id, queue])

  const currentIndex = useMemo(() => {
    const index = queue.findIndex(
      (item) => item.title === isCurrentMusic?.title,
    )
    return index < 0 ? 0 : index
  }, [isCurrentMusic?.title, queue])

  const calculateProgressPercentage = useCallback(() => {
    if (duration > 0) {
      const percentage = position / duration

      setChangeProgress(percentage)
    }
    return 0
  }, [duration, position])

  const handleChangeProgress = useCallback(
    (event: NativeSyntheticEvent<NativeTouchEvent>) => {
      const { locationX } = event.nativeEvent
      const value = locationX / 330

      const newPosition = value * duration
      setCurrentPosition(newPosition)
      setChangeProgress(value)
      setIsSeek(true)
    },
    [duration],
  )

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = Math.floor(seconds % 60)
    const formattedSeconds =
      remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds
    return `${minutes}:${formattedSeconds}`
  }

  const handleSkipToPrevius = async () => {
    const currentIndex = queue.findIndex(
      (item) => item.id === isCurrentMusic?.id,
    )
    if (currentIndex === 0) return
    const trackSelect = queue[currentIndex - 1] as MusicProps

    dispatch(handleSetCurrentMusic({ isCurrentMusic: trackSelect }))

    await TrackPlayer.skipToPrevious()
    await TrackPlayer.play()
  }

  const handleSkipToNext = async () => {
    const currentIndex = queue.findIndex(
      (item) => item.id === isCurrentMusic?.id,
    )

    if (currentIndex === queue.length - 1) return
    const trackSelect = queue[currentIndex + 1] as MusicProps

    dispatch(handleSetCurrentMusic({ isCurrentMusic: trackSelect }))

    await TrackPlayer.skipToNext()
    await TrackPlayer.play()
  }

  function calculateLuminosity(r: number, g: number, b: number): number {
    return 0.299 * r + 0.587 * g + 0.114 * b
  }

  const determineFontColor = useCallback(
    (r: number, g: number, b: number): '#fff' | '#312e38' => {
      const luminosity = calculateLuminosity(r, g, b)

      const threshold = 150

      return luminosity > threshold ? '#312e38' : '#fff'
    },
    [],
  )

  function hexToRgb(hex: string): { r: number; g: number; b: number } {
    hex = hex.replace(/^#/, '')

    const bigint = parseInt(hex, 16)

    const r = (bigint >> 16) & 255
    const g = (bigint >> 8) & 255
    const b = bigint & 255

    return { r, g, b }
  }

  const handleSeek = async (event: NativeSyntheticEvent<NativeTouchEvent>) => {
    const { locationX } = event.nativeEvent
    const value = locationX / 330
    const newPosition = value * duration
    setCurrentPosition(0)
    setIsSeek(false)
    TrackPlayer.seekTo(newPosition)
  }

  const handleVerifyRepeatMode = async () => {
    const mode = await TrackPlayer.getRepeatMode()
    setRepeatMode(mode)
  }

  const handleIconsRepeatMode = useMemo(() => {
    switch (repeatMode) {
      case 1:
        return 'repeat-once'

      case 2:
        return 'repeat'

      default:
        return 'repeat-off'
    }
  }, [repeatMode])

  const handleRepeatMode = useCallback(async () => {
    switch (repeatMode) {
      case 0:
        TrackPlayer.setRepeatMode(RepeatMode.Track)

        setRepeatMode(1)
        break

      case 1:
        TrackPlayer.setRepeatMode(RepeatMode.Queue)

        setRepeatMode(2)
        break

      case 2:
        TrackPlayer.setRepeatMode(RepeatMode.Off)

        setRepeatMode(0)
        break

      default:
    }
  }, [TrackPlayer, repeatMode])

  useEffect(() => {
    handleVerifyRepeatMode()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (isCurrentMusic?.color) {
      const backgroundColor = isCurrentMusic.color
      const { r, g, b } = hexToRgb(backgroundColor)
      const fontColor = determineFontColor(r, g, b)

      setFontColor(fontColor)
    }
  }, [determineFontColor, isCurrentMusic?.color])

  useEffect(() => {
    if (!isSeek) {
      calculateProgressPercentage()
    }
  }, [calculateProgressPercentage, isSeek])

  // useFocusEffect(() => {
  //   ImmersiveMode.setBarTranslucent(true)

  //   return () => {
  //     ImmersiveMode.setBarTranslucent(false)
  //   }
  // })

  return (
    <View className="flex-1 -mt-8">
      <DynamicBackgroundColor color={isCurrentMusic?.color}>
        <View className="flex-row items-center justify-between m-4 mt-[70px]">
          <TouchableOpacity
            onPress={() => {
              navigation.goBack()
            }}
            className="p-2 rounded-full"
          >
            <Icon name="chevron-back-outline" size={30} color={fontColor} />
          </TouchableOpacity>
          <View className="flex-col items-center">
            <Text
              className="text-gray-300 font-nunito-regular"
              style={{ color: fontColor }}
            >
              Tocando do artista
            </Text>
            <Text
              className="text-white font-nunito-bold text-base"
              style={{ color: fontColor }}
            >
              {isCurrentMusic?.artists && isCurrentMusic.artists[0].name}
            </Text>
          </View>
          <View className="w-10" />
        </View>

        <View className="items-center mx-8 mt-4">
          <Carousel
            loop={false}
            width={size}
            height={380}
            onScrollEnd={(index) => {
              TrackPlayer.skip(index)
            }}
            data={queue}
            defaultIndex={currentIndex}
            scrollAnimationDuration={500}
            renderItem={({ item }) => (
              <View className="px-2 my-auto mx-auto">
                <View className="w-[350px] h-[350px] overflow-hidden rounded-lg bg-purple-600 items-center justify-center shadow-lg shadow-gray-950">
                  {item?.artwork ? (
                    <ImageBackground
                      source={{ uri: item.artwork }}
                      alt=""
                      className="w-full h-full object-cover items-center justify-center"
                    >
                      {state === StatePlayer.Buffering && (
                        <AnimatedLottieView
                          source={animation}
                          autoPlay
                          loop
                          style={{ width: 120, height: 120 }}
                        />
                      )}
                    </ImageBackground>
                  ) : (
                    <FatherIcons name="music" size={200} color={fontColor} />
                  )}
                </View>
              </View>
            )}
          />

          <View className="flex-row items-center gap-6 mt-2">
            <View className="h-8 w-8" />
            {isConnected ? (
              <TouchableOpacity
                style={{ borderColor: fontColor }}
                className={`rounded-full p-2 border`}
                activeOpacity={0.5}
              >
                <Icon
                  name="ellipsis-vertical"
                  size={24}
                  color={fontColor}
                  onPress={() =>
                    openModal({
                      children: (
                        <InfoPlayingMusic currentMusic={isCurrentMusic} />
                      ),
                    })
                  }
                />
              </TouchableOpacity>
            ) : (
              <View className="h-8 w-8" />
            )}

            {isConnected && (
              <TouchableOpacity
                onPress={() => {
                  if (isCurrentMusic) {
                    handleFavoriteMusic(isCurrentMusic)
                  }
                }}
              >
                <Icon
                  name={isFavoriteMusic ? 'heart-sharp' : 'heart-outline'}
                  size={28}
                  color={fontColor}
                />
              </TouchableOpacity>
            )}
          </View>

          <View className="mt-4 w-[330px] items-center">
            <View className="flex-row justify-between w-full">
              <Text
                className="font-nunito-regular text-xs text-white"
                style={{ color: fontColor }}
              >
                {formatTime(currentPosition !== 0 ? currentPosition : position)}
              </Text>
              <Text
                className="font-nunito-regular text-xs text-white"
                style={{ color: fontColor }}
              >
                {formatTime(duration)}
              </Text>
            </View>

            <View className="w-full items-center relative overflow-hidden">
              <ProgressBar
                styleAttr="Horizontal"
                indeterminate={false}
                progress={changeProgress}
                color={fontColor}
                style={{
                  width: 330,
                  zIndex: 1000,
                  height: 20,
                }}
                onTouchEnd={handleSeek}
                onTouchMove={handleChangeProgress}
              />
              <View
                className="absolute top-[2px] w-4 h-4 rounded-full"
                style={{
                  left: `${changeProgress * 100}%`,
                  backgroundColor: fontColor,
                }}
              />
            </View>
          </View>

          <View className="overflow-hidden mt-4 w-full items-center justify-center">
            <Text
              className="font-nunito-bold text-white text-xl"
              numberOfLines={1}
              style={{ color: fontColor }}
            >
              {isCurrentMusic?.title}
            </Text>
            <Text
              className="font-nunito-regular text-gray-100"
              numberOfLines={1}
              style={{ color: fontColor }}
            >
              {isCurrentMusic?.artists && isCurrentMusic.artists[0].name}
              {isCurrentMusic?.album && ` - ${isCurrentMusic.album}`}
            </Text>
          </View>
        </View>

        <View className="flex-row justify-between  items-center mx-8 mt-4 ">
          <View className="p-2 rounded-full h-11 w-11"></View>
          <View className="flex-row items-center flex-1 justify-between mx-12">
            <TouchableOpacity
              disabled={havePrevious}
              onPress={handleSkipToPrevius}
              className="p-2 rounded-full"
            >
              <Icon name="play-skip-back" size={25} color={fontColor} />
            </TouchableOpacity>
            <TouchableOpacity
              style={{ borderColor: fontColor }}
              className="rounded-full p-2"
              onPress={() => {
                if (state === StatePlayer.Playing) {
                  TrackPlayer.pause()
                } else {
                  TrackPlayer.play()
                }
              }}
            >
              <Icon
                name={state === StatePlayer.Paused ? 'play' : 'pause'}
                size={50}
                color={fontColor}
              />
            </TouchableOpacity>

            <TouchableOpacity
              disabled={haveNext}
              onPress={handleSkipToNext}
              className="p-2 rounded-full"
            >
              <Icon name="play-skip-forward" size={25} color={fontColor} />
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            onPress={handleRepeatMode}
            className="p-2 rounded-full relative"
          >
            <MaterialCommunityIcons
              name={handleIconsRepeatMode}
              size={25}
              color={fontColor}
            />
          </TouchableOpacity>
        </View>
        <View className="m-4">
          <TouchableOpacity
            className="w-8 h-8 ml-auto"
            onPress={() => navigation.navigate('Queue')}
          >
            <MaterialIcons name="queue-music" size={30} color={fontColor} />
          </TouchableOpacity>
        </View>
      </DynamicBackgroundColor>
    </View>
  )
}
