import { useTrackPlayer } from '@hooks/useTrackPlayer'
import { useNavigation } from '@react-navigation/native'
import { StackNavigationProps } from '@routes/routes'
import { ProgressBar } from '@react-native-community/progress-bar-android'

import { useCallback, useEffect, useState } from 'react'

import AnimatedLottieView from 'lottie-react-native'
import animation from '@assets/music-loading.json'

import {
  Image,
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

import { useBottomModal } from '@hooks/useBottomModal'
// import { useFirebaseServices } from '@hooks/useFirebaseServices'
// import { RoundedCarousel } from '@components/RoundedCarousel'

export function Music() {
  const navigation = useNavigation<StackNavigationProps>()

  const { getCurrentMusic, TrackPlayer, useProgress } = useTrackPlayer()

  const { openModal } = useBottomModal()

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
    <ScrollView
      className="p-2 flex-1 px-4"
      // style={{ backgroundColor: dominantColor }}
    >
      <View className="flex-row items-center justify-center mt-2  relative">
        <TouchableOpacity
          onPress={() => {
            navigation.goBack()
          }}
          className="absolute left-0"
        >
          <Icon name="back" size={30} color="#fff" />
        </TouchableOpacity>
        <View className="flex-col items-center">
          <Text className="text-gray-300 font-nunito-light">
            Tocando do artista
          </Text>
          <Text className="text-white font-nunito-bold">
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
            <FatherIcons
              name="more-vertical"
              size={30}
              color={'#fff'}
              onPress={() =>
                openModal({
                  children: (
                    <View>
                      <View className="items-center">
                        <Text
                          className="font-nunito-bold text-xl text-white"
                          numberOfLines={1}
                        >
                          {isCurrentMusic?.title}
                        </Text>
                        <Text className="text-gray-300 font-nunito-regular">
                          {isCurrentMusic?.album}
                        </Text>
                        <Image
                          source={{ uri: isCurrentMusic?.artwork }}
                          alt="artist pic"
                          className="w-28 h-28 rounded-full my-2"
                        />

                        <Text className="text-gray-300 font-nunito-regular">
                          {isCurrentMusic?.artist}
                        </Text>
                      </View>
                    </View>
                  ),
                })
              }
            />
          </TouchableOpacity>

          <TouchableOpacity activeOpacity={0.5} className="">
            <Icon name="hearto" size={22} color={'#fff'} />
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
          className="font-nunito-bold text-white text-xl mt-4 px-4 text-center"
          numberOfLines={1}
        >
          {isCurrentMusic?.title}
        </Text>
        <Text className="font-nunito-regular text-gray-300">
          {isCurrentMusic?.artist}
          {isCurrentMusic?.album && ` - ${isCurrentMusic.album}`}
        </Text>
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
