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
  Text,
  TouchableOpacity,
  View,
} from 'react-native'

import Icon from 'react-native-vector-icons/Ionicons'
import FatherIcons from 'react-native-vector-icons/Feather'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { useDispatch, useSelector } from 'react-redux'
import { ReduxProps } from '@storage/index'
import {
  CurrentMusicProps,
  handleSetCurrentMusic,
} from '@storage/modules/currentMusic/reducer'
import { State as StatePlayer } from 'react-native-track-player'

import { useBottomModal } from '@hooks/useBottomModal'

import { useFirebaseServices } from '@hooks/useFirebaseServices'

import { useFavorites } from '@hooks/useFavorites'
import { InfoPlayingMusic } from '@components/InfoPlayingMusic'

import { QueueProps } from '@storage/modules/queue/reducer'
import { MusicProps } from '@utils/Types/musicProps'

import { DynamicBackgroundColor } from '@components/DynamicBackgroundColor'

export function Music() {
  const navigation = useNavigation<StackNavigationProps>()

  const size = Dimensions.get('window').width * 1

  const { TrackPlayer, useProgress } = useTrackPlayer()

  const { openModal } = useBottomModal()

  const progress = useProgress()

  const [fontColor, setFontColor] = useState('#fff')
  const [actualProgress, setActualProgress] = useState<number>(0)

  const { isCurrentMusic, state } = useSelector<ReduxProps, CurrentMusicProps>(
    (state) => state.currentMusic,
  )

  const [indexCurrentMusic, setIndexCurrentMusic] = useState(0)

  const { queue } = useSelector<ReduxProps, QueueProps>((state) => state.queue)

  const { isFavoriteMusic } = useFavorites()

  const dispatch = useDispatch()

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
    if (progress.duration > 0) {
      const percentage = progress.position / progress.duration
      setActualProgress(percentage)
    }
    return 0
  }, [progress.duration, progress.position])

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

    const indexSelected = queue.findIndex(
      (item) => item.title === trackSelect.title,
    )

    setIndexCurrentMusic(indexSelected)
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

    const indexSelected = queue.findIndex(
      (item) => item.title === trackSelect.title,
    )

    setIndexCurrentMusic(indexSelected)
    dispatch(handleSetCurrentMusic({ isCurrentMusic: trackSelect }))

    await TrackPlayer.skipToNext()
    await TrackPlayer.play()
  }

  const handleSlideThumb = (index: number) => {
    if (index > indexCurrentMusic) {
      handleSkipToNext()
    } else if (index < indexCurrentMusic) {
      handleSkipToPrevius()
    }
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

  useEffect(() => {
    if (isCurrentMusic?.color) {
      const backgroundColor = isCurrentMusic.color
      const { r, g, b } = hexToRgb(backgroundColor)
      const fontColor = determineFontColor(r, g, b)

      setFontColor(fontColor)
    }
  }, [determineFontColor, isCurrentMusic?.color])

  useEffect(() => {
    calculateProgressPercentage()
  }, [calculateProgressPercentage])

  return (
    <DynamicBackgroundColor color={isCurrentMusic?.color}>
      <View className="flex-row items-center justify-center m-4 ">
        <TouchableOpacity
          onPress={() => {
            navigation.goBack()
          }}
          className="absolute left-0 p-2 rounded-full"
        >
          <Icon name="chevron-back-outline" size={30} color={fontColor} />
        </TouchableOpacity>
        <View className="flex-col items-center">
          <Text
            className="text-gray-100 font-nunito-light"
            style={{ color: fontColor }}
          >
            Tocando do artista
          </Text>
          <Text
            className="text-white font-nunito-bold"
            style={{ color: fontColor }}
          >
            {isCurrentMusic?.artists && isCurrentMusic.artists[0].name}
          </Text>
        </View>
      </View>

      <View className="items-center mx-4 mt-8">
        <Carousel
          loop={false}
          width={size}
          height={370}
          data={queue}
          onSnapToItem={(index) => {
            handleSlideThumb(index)
          }}
          defaultIndex={currentIndex}
          scrollAnimationDuration={1000}
          renderItem={({ item }) => (
            <View className="px-4">
              <View className="w-full h-[360px] overflow-hidden rounded-lg bg-purple-600 items-center justify-center shadow-lg shadow-gray-950">
                {item?.artwork ? (
                  <ImageBackground
                    source={{ uri: item.artwork }}
                    alt=""
                    className="w-full h-full object-cover items-center justify-center "
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

        <View className="pt-8 flex-row items-center gap-8">
          <View className="w-[22px]" />

          <TouchableOpacity
            style={{ borderColor: fontColor }}
            className={`border rounded-full p-2`}
            activeOpacity={0.5}
          >
            <Icon
              name="ellipsis-vertical"
              size={30}
              color={fontColor}
              onPress={() =>
                openModal({
                  children: <InfoPlayingMusic currentMusic={isCurrentMusic} />,
                })
              }
            />
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => {
              if (isCurrentMusic) {
                handleFavoriteMusic(isCurrentMusic)
              }
            }}
          >
            <Icon
              name={isFavoriteMusic ? 'heart-sharp' : 'heart-outline'}
              size={22}
              color={fontColor}
            />
          </TouchableOpacity>
        </View>

        <View className="mt-4 w-full items-center">
          <View className="flex-row justify-between w-11/12 px-2">
            <Text
              className="font-nunito-regular text-xs text-white"
              style={{ color: fontColor }}
            >
              {formatTime(progress.position)}
            </Text>
            <Text
              className="font-nunito-regular text-xs text-white"
              style={{ color: fontColor }}
            >
              {formatTime(progress.duration)}
            </Text>
          </View>
          <ProgressBar
            styleAttr="Horizontal"
            indeterminate={false}
            progress={actualProgress}
            color={fontColor}
            style={{ width: '90%' }}
          />
        </View>

        <Text
          className="font-nunito-bold text-white text-xl mt-4 px-4 text-center"
          numberOfLines={1}
          style={{ color: fontColor }}
        >
          {isCurrentMusic?.title}
        </Text>
        <Text
          className="font-nunito-regular text-gray-100"
          style={{ color: fontColor }}
        >
          {isCurrentMusic?.artists && isCurrentMusic.artists[0].name}
          {isCurrentMusic?.album && ` - ${isCurrentMusic.album}`}
        </Text>
      </View>

      <View className="flex-row justify-around  items-center px-20 mt-6">
        <TouchableOpacity
          activeOpacity={0.6}
          disabled={havePrevious}
          onPress={handleSkipToPrevius}
          className="p-2 rounded-full "
        >
          <Icon name="play-skip-back" size={25} color={fontColor} />
        </TouchableOpacity>
        <TouchableOpacity
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
          activeOpacity={0.6}
          disabled={haveNext}
          onPress={handleSkipToNext}
          className="p-2 rounded-full"
        >
          <Icon name="play-skip-forward" size={25} color={fontColor} />
        </TouchableOpacity>
      </View>
      <View className="mt-6 mx-4">
        <TouchableOpacity
          className="w-8 h-8 ml-auto"
          activeOpacity={0.6}
          onPress={() => navigation.navigate('Queue')}
        >
          <MaterialIcons name="queue-music" size={30} color={fontColor} />
        </TouchableOpacity>
      </View>
    </DynamicBackgroundColor>
  )
}
