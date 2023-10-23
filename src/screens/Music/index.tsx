import { useTrackPlayer } from '@hooks/useTrackPlayer'
import { useNavigation } from '@react-navigation/native'
import { StackNavigationProps } from '@routes/routes'
import { ProgressBar } from '@react-native-community/progress-bar-android'

import { useCallback, useEffect, useState } from 'react'
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native'

import Icon from 'react-native-vector-icons/AntDesign'
import FatherIcons from 'react-native-vector-icons/Feather'

export function Music() {
  const navigation = useNavigation<StackNavigationProps>()

  const {
    getCurrentMusic,
    TrackPlayer,
    currentMusic,
    isPlaying,
    setIsPlaying,
    useProgress,
  } = useTrackPlayer()

  const progress = useProgress()

  const [actualProgress, setActualProgress] = useState<number>()

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

  useEffect(() => {
    getCurrentMusic()
  }, [getCurrentMusic])

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
            {currentMusic?.artist}
          </Text>
        </View>
      </View>

      <View className="flex-1 items-center mt-12">
        {currentMusic?.artwork ? (
          <Image
            source={{ uri: currentMusic.artwork }}
            alt=""
            className="w-full h-[360px] object-cover rounded-lg"
          />
        ) : (
          <Icon name="stepbackward" size={30} color="#fff" />
        )}

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
        <Text>{formatTime(progress.position)}</Text>
        <ProgressBar
          styleAttr="Horizontal"
          indeterminate={false}
          progress={actualProgress}
          style={{ width: '90%' }}
        />

        <Text
          className="font-baloo-bold text-xl mt-4 px-4 text-center"
          numberOfLines={1}
        >
          {currentMusic?.title}
        </Text>
        <Text className="font-baloo-regular">{currentMusic?.artist}</Text>
      </View>

      <View className="flex-row justify-around mt-4 items-center px-12">
        <TouchableOpacity
          onPress={() => {
            TrackPlayer.skipToPrevious()
            getCurrentMusic()
          }}
          className=" p-2 rounded-full "
        >
          <Icon name="stepbackward" size={25} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            if (isPlaying) {
              TrackPlayer.pause()
              setIsPlaying(false)
            } else {
              TrackPlayer.play()
              setIsPlaying(true)
            }
          }}
        >
          <Icon
            name={isPlaying ? 'pause' : 'caretright'}
            size={40}
            color={'#fff'}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            TrackPlayer.skipToNext()
            getCurrentMusic()
          }}
          className=" p-2 rounded-full "
        >
          <Icon name="stepforward" size={25} color="#fff" />
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}
