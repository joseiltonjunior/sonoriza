import { useTrackPlayer } from '@hooks/useTrackPlayer'
import { useNavigation } from '@react-navigation/native'
import { StackNavigationProps } from '@routes/routes'
import { ProgressBar } from '@react-native-community/progress-bar-android'
import Carousel from 'react-native-reanimated-carousel'

import { useCallback, useEffect, useState } from 'react'

import AnimatedLottieView from 'lottie-react-native'
import animation from '@assets/music-loading.json'

import {
  Dimensions,
  ImageBackground,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'

import Icon from 'react-native-vector-icons/AntDesign'
import FatherIcons from 'react-native-vector-icons/Feather'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { useDispatch, useSelector } from 'react-redux'
import { ReduxProps } from '@storage/index'
import {
  CurrentMusicProps,
  handleSetCurrentMusic,
} from '@storage/modules/currentMusic/reducer'
import { State as StatePlayer, Track } from 'react-native-track-player'

import { useBottomModal } from '@hooks/useBottomModal'

import { useFirebaseServices } from '@hooks/useFirebaseServices'

import colors from 'tailwindcss/colors'
import { useFavorites } from '@hooks/useFavorites'
import { InfoPlayingMusic } from '@components/InfoPlayingMusic'

import { MusicProps } from '@utils/Types/musicProps'

export function Music() {
  const navigation = useNavigation<StackNavigationProps>()

  const size = Dimensions.get('window').width * 1

  const { TrackPlayer, useProgress } = useTrackPlayer()

  const { openModal } = useBottomModal()

  const progress = useProgress()
  const dispatch = useDispatch()

  const [actualProgress, setActualProgress] = useState<number>(0)

  const { isCurrentMusic, state } = useSelector<ReduxProps, CurrentMusicProps>(
    (state) => state.currentMusic,
  )

  const [queue, setQueue] = useState<Track[]>([])

  const { isFavoriteMusic } = useFavorites()

  const { handleFavoriteMusic } = useFirebaseServices()

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
    await TrackPlayer.skipToPrevious()

    await TrackPlayer.play()
  }

  const handleSlideThumb = async (index: number) => {
    const trackSelect = queue[index] as MusicProps

    await TrackPlayer.skip(index)
    await TrackPlayer.play()
    dispatch(handleSetCurrentMusic({ isCurrentMusic: trackSelect }))
  }

  const handleSkipToNext = async () => {
    await TrackPlayer.skipToNext()

    await TrackPlayer.play()
  }

  const handleGetQueue = useCallback(async () => {
    const response = await TrackPlayer.getQueue()
    setQueue(response)
  }, [TrackPlayer])

  useEffect(() => {
    handleGetQueue()
  }, [handleGetQueue])

  useEffect(() => {
    calculateProgressPercentage()
  }, [calculateProgressPercentage])

  return (
    <ScrollView
      className="flex-1"
      style={{ backgroundColor: isCurrentMusic?.color }}
    >
      <View className="flex-row items-center justify-center m-4 ">
        <TouchableOpacity
          onPress={() => {
            navigation.goBack()
          }}
          className="absolute left-0"
        >
          <Icon name="left" size={25} color="#fff" />
        </TouchableOpacity>
        <View className="flex-col items-center">
          <Text className="text-gray-100 font-nunito-light">
            Tocando do artista
          </Text>
          <Text className="text-white font-nunito-bold">
            {isCurrentMusic?.artists && isCurrentMusic.artists[0].name}
          </Text>
        </View>
      </View>

      <View className="flex-1 items-center mt-8 mx-4">
        <Carousel
          loop={false}
          width={size}
          height={370}
          data={queue}
          onSnapToItem={(index) => {
            handleSlideThumb(index)
          }}
          defaultIndex={queue.findIndex(
            (item) => item.title === isCurrentMusic?.title,
          )}
          scrollAnimationDuration={500}
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
                  <FatherIcons name="music" size={200} color="#fff" />
                )}
              </View>
            </View>
          )}
        />

        <View className="pt-8 flex-row items-center gap-8">
          <View className="w-[22px]" />

          <TouchableOpacity
            className="border border-white rounded-full p-3"
            activeOpacity={0.5}
          >
            <FatherIcons
              name="more-vertical"
              size={30}
              color={'#fff'}
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
              name={isFavoriteMusic ? 'heart' : 'hearto'}
              size={22}
              color={colors.white}
            />
          </TouchableOpacity>
        </View>

        <View className="mt-4 w-full items-center">
          <View className="flex-row justify-between w-11/12">
            <Text className="font-nunito-regular">
              {formatTime(progress.position)}
            </Text>
            <Text className="font-nunito-regular">
              {formatTime(progress.duration)}
            </Text>
          </View>
          <ProgressBar
            styleAttr="Horizontal"
            indeterminate={false}
            progress={actualProgress}
            color="#fff"
            style={{ width: '90%' }}
          />
        </View>

        <Text
          className="font-nunito-bold text-white text-xl mt-4 px-4 text-center"
          numberOfLines={1}
        >
          {isCurrentMusic?.title}
        </Text>
        <Text className="font-nunito-regular text-gray-100">
          {isCurrentMusic?.artists && isCurrentMusic.artists[0].name}
          {isCurrentMusic?.album && ` - ${isCurrentMusic.album}`}
        </Text>
      </View>

      <View className="flex-row justify-around mt-8 items-center px-12">
        <TouchableOpacity
          onPress={() => handleSkipToPrevius()}
          className=" p-2 rounded-full "
        >
          <Icon name="stepbackward" size={25} color="#fff" />
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
            name={
              actualProgress > 0 && state === StatePlayer.Playing
                ? 'pause'
                : 'caretright'
            }
            size={40}
            color={'#fff'}
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleSkipToNext}
          className="p-2 rounded-full"
        >
          <Icon name="stepforward" size={25} color="#fff" />
        </TouchableOpacity>
      </View>
      <View className="mt-4 mx-4">
        <TouchableOpacity
          className="w-8 h-8 ml-auto"
          activeOpacity={0.6}
          onPress={() => navigation.navigate('Queue')}
        >
          <MaterialIcons name="queue-music" size={30} color="#fff" />
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}
