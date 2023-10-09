import { useNavigation, useRoute } from '@react-navigation/native'
import { RouteParamsProps, StackNavigationProps } from '@routes/routes'

import { useState } from 'react'
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native'

import TrackPlayer from 'react-native-track-player'
import Icon from 'react-native-vector-icons/AntDesign'

export function Music() {
  const { params } = useRoute<RouteParamsProps<'Music'>>()
  const [isPlaying, setPlaying] = useState(true)

  const { title, artist, artwork } = params

  const navigation = useNavigation<StackNavigationProps>()

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
          source={{ uri: artwork }}
          alt=""
          className="w-72 h-72 object-cover rounded-3xl"
        />
        <Text className="font-bold text-2xl mt-4">{title}</Text>
        <Text>{artist}</Text>
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
