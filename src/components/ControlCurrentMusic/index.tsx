import { MusicProps } from '@utils/Types/musicProps'

import { Text, TouchableOpacity, View } from 'react-native'
import IconAntDesign from 'react-native-vector-icons/AntDesign'
import { useTrackPlayer } from '@hooks/useTrackPlayer'
import { useNavigation } from '@react-navigation/native'
import { StackNavigationProps } from '@routes/routes'

interface ControlCurrentMusicProps {
  music?: MusicProps
}

export function ControlCurrentMusic({ music }: ControlCurrentMusicProps) {
  const {
    TrackPlayer,
    isPlaying,
    setIsPlaying,
    currentMusic,
    getCurrentMusic,
  } = useTrackPlayer()

  const navigation = useNavigation<StackNavigationProps>()

  return (
    <View className="bg-purple-600 flex-row items-center justify-between py-2 px-6 ">
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
        <IconAntDesign name={isPlaying ? 'pause' : 'caretright'} size={25} />
      </TouchableOpacity>

      <TouchableOpacity
        activeOpacity={0.5}
        className="w-8/12"
        onPress={() => navigation.navigate('Music')}
      >
        <Text numberOfLines={1} className="font-baloo-bold">
          {currentMusic?.title || music?.title}
        </Text>
        <Text className="font-baloo-regular text-sm ">
          {currentMusic?.artist || music?.artist}
        </Text>
      </TouchableOpacity>

      <View className="flex-row gap-4">
        <TouchableOpacity>
          <IconAntDesign name="heart" size={22} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            TrackPlayer.skipToNext()
            getCurrentMusic()
          }}
        >
          <IconAntDesign name="stepforward" size={22} />
        </TouchableOpacity>
      </View>
    </View>
  )
}
