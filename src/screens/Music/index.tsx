import { useNavigation } from '@react-navigation/native'
import { StackNavigationProps } from '@routes/routes'
import { MusicProps } from '@utils/Types/musicProps'

import { useCallback, useEffect, useState } from 'react'
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native'

import TrackPlayer from 'react-native-track-player'
import Icon from 'react-native-vector-icons/AntDesign'

export function Music() {
  const [isPlaying, setPlaying] = useState(true)
  const [music, setMusic] = useState<MusicProps>()

  const navigation = useNavigation<StackNavigationProps>()

  const handleGetCurrentMusic = useCallback(async () => {
    const trackIndex = await TrackPlayer.getCurrentTrack()
    if (trackIndex) {
      const trackObject = await TrackPlayer.getTrack(trackIndex)

      const currentTrack = trackObject as MusicProps

      setMusic(currentTrack)
    }
  }, [])

  useEffect(() => {
    handleGetCurrentMusic()
  }, [handleGetCurrentMusic])

  return (
    <ScrollView className="p-2  flex-1 bg-gray-950">
      <View className="flex-row items-center justify-center mt-2 relative">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="absolute left-4"
        >
          <Icon name="back" size={30} color="#fff" />
        </TouchableOpacity>
        <Text className="text-white font-bold text-2xl text-center">
          Spotifree
        </Text>
      </View>

      <View className="flex-1 items-center mt-12">
        <Image
          source={{ uri: music?.artwork }}
          alt=""
          className="w-72 h-72 object-cover rounded-3xl"
        />
        <Text className="font-bold text-2xl mt-4">{music?.title}</Text>
        <Text>{music?.artist}</Text>
      </View>
      <View className="flex-1 h-1 bg-gray-500 mx-12 mt-8 rounded-2xl"></View>
      <View className="flex-row justify-around mt-4 items-center px-12">
        <TouchableOpacity
          onPress={() => TrackPlayer.skipToPrevious()}
          className=" p-2 rounded-full "
        >
          <Icon name="stepbackward" size={30} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            if (isPlaying) {
              TrackPlayer.pause()
              setPlaying(false)
            } else {
              TrackPlayer.play()
              setPlaying(true)
            }
          }}
          className="bg-white p-4 rounded-full "
        >
          <Icon
            name={isPlaying ? 'pause' : 'caretright'}
            size={30}
            color={'#202024'}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => TrackPlayer.skipToNext()}
          className=" p-2 rounded-full "
        >
          <Icon name="stepforward" size={30} color="#fff" />
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}
