import { useTrackPlayer } from '@hooks/useTrackPlayer'
import { useNavigation } from '@react-navigation/native'
import { StackNavigationProps } from '@routes/routes'
import { ProgressBar } from '@react-native-community/progress-bar-android'

import { useCallback, useEffect, useState } from 'react'

import AnimatedLottieView from 'lottie-react-native'
import animation from '@assets/music-loading.json'

import {
  ImageBackground,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'

import Icon from 'react-native-vector-icons/AntDesign'
import FatherIcons from 'react-native-vector-icons/Feather'
import { useDispatch, useSelector } from 'react-redux'
import { ReduxProps } from '@storage/index'
import {
  CurrentMusicProps,
  handleChangeStateCurrentMusic,
} from '@storage/modules/currentMusic/reducer'
import { State } from 'react-native-track-player'

export function Music() {
  const navigation = useNavigation<StackNavigationProps>()

  const { getCurrentMusic, TrackPlayer, useProgress } = useTrackPlayer()

  const progress = useProgress()
  const dispatch = useDispatch()

  const [actualProgress, setActualProgress] = useState<number>(0)

  const { isCurrentMusic, state } = useSelector<ReduxProps, CurrentMusicProps>(
    (state) => state.currentMusic,
  )

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

  useEffect(() => {
    calculateProgressPercentage()
  }, [calculateProgressPercentage])

  return (
    <ScrollView className="p-2  flex-1 bg-gray-950 px-4">
      <View className="flex-row items-center justify-center mt-2  relative">
        <TouchableOpacity
          onPress={() => {
            navigation.reset({
              index: 0,
              routes: [
                {
                  name: 'Home',
                  params: undefined,
                },
              ],
            })
          }}
          className="absolute left-0"
        >
          <Icon name="back" size={30} color="#fff" />
        </TouchableOpacity>
        <View className="flex-col items-center">
          <Text className="text-white font-baloo-regular">
            Tocando do artista
          </Text>
          <Text className="text-white font-baloo-bold">
            {isCurrentMusic?.artist}
          </Text>
        </View>
      </View>

      <View className="flex-1 items-center mt-12">
        <View className="w-full h-[360px] overflow-hidden rounded-lg bg-purple-600 items-center justify-center">
          {isCurrentMusic?.artwork ? (
            <ImageBackground
              source={{ uri: isCurrentMusic.artwork }}
              alt=""
              className="w-full h-full object-cover items-center justify-center"
            >
              {actualProgress === 0 && (
                <AnimatedLottieView
                  source={animation}
                  autoPlay
                  loop
                  style={{ width: 150, height: 150 }}
                />
              )}
            </ImageBackground>
          ) : (
            <FatherIcons name="music" size={200} color="#fff" />
          )}
        </View>

        <View className="pt-8 flex-row items-center gap-8">
          <TouchableOpacity activeOpacity={0.5} className="">
            <FatherIcons name="share-2" size={22} color={'#fff'} />
          </TouchableOpacity>

          <TouchableOpacity
            className="border border-white rounded-full p-3"
            activeOpacity={0.5}
          >
            <FatherIcons name="more-vertical" size={30} color={'#fff'} />
          </TouchableOpacity>

          <TouchableOpacity activeOpacity={0.5} className="">
            <Icon name="heart" size={22} color={'#fff'} />
          </TouchableOpacity>
        </View>

        <View className="mt-4 w-full items-center">
          <Text>{formatTime(progress.position)}</Text>
          <ProgressBar
            styleAttr="Horizontal"
            indeterminate={false}
            progress={actualProgress}
            color="#fff"
            style={{ width: '90%' }}
          />
        </View>

        <Text
          className="font-baloo-bold text-xl mt-4 px-4 text-center"
          numberOfLines={1}
        >
          {isCurrentMusic?.title}
        </Text>
        <Text className="font-baloo-regular">{isCurrentMusic?.artist}</Text>
      </View>

      <View className="flex-row justify-around mt-8 items-center px-12">
        <TouchableOpacity
          onPress={() => {
            TrackPlayer.skipToPrevious()
            getCurrentMusic()
            setActualProgress(0)
            TrackPlayer.play()
            dispatch(handleChangeStateCurrentMusic(State.Playing))
          }}
          className=" p-2 rounded-full "
        >
          <Icon name="stepbackward" size={25} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            if (state === State.Playing) {
              TrackPlayer.pause()
              dispatch(handleChangeStateCurrentMusic(State.Paused))
            } else {
              TrackPlayer.play()
              dispatch(handleChangeStateCurrentMusic(State.Playing))
            }
          }}
        >
          <Icon
            name={
              actualProgress > 0 && state === State.Playing
                ? 'pause'
                : 'caretright'
            }
            size={40}
            color={'#fff'}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            TrackPlayer.skipToNext()
            TrackPlayer.play()
            getCurrentMusic()
            setActualProgress(0)
            dispatch(handleChangeStateCurrentMusic(State.Playing))
          }}
          className=" p-2 rounded-full "
        >
          <Icon name="stepforward" size={25} color="#fff" />
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}
