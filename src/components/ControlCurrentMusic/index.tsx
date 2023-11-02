import { TrackPlayerMusicProps } from '@utils/Types/musicProps'

import { Text, TouchableOpacity, View } from 'react-native'
import IconAntDesign from 'react-native-vector-icons/AntDesign'
import { useTrackPlayer } from '@hooks/useTrackPlayer'
import { useNavigation } from '@react-navigation/native'
import { StackNavigationProps } from '@routes/routes'
import { useDispatch, useSelector } from 'react-redux'
import { ReduxProps } from '@storage/index'
import {
  CurrentMusicProps,
  handleChangeStateCurrentMusic,
} from '@storage/modules/currentMusic/reducer'
import { State } from 'react-native-track-player'
import colors from 'tailwindcss/colors'

interface ControlCurrentMusicProps {
  music?: TrackPlayerMusicProps
}

export function ControlCurrentMusic({ music }: ControlCurrentMusicProps) {
  const { TrackPlayer, getCurrentMusic } = useTrackPlayer()

  const { isCurrentMusic, state } = useSelector<ReduxProps, CurrentMusicProps>(
    (state) => state.currentMusic,
  )

  const dispatch = useDispatch()
  const navigation = useNavigation<StackNavigationProps>()

  return (
    <View className="bg-purple-600 flex-row items-center justify-between py-2 px-6">
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
        <IconAntDesign
          name={state === State.Playing ? 'pause' : 'caretright'}
          size={25}
          color={colors.white}
        />
      </TouchableOpacity>

      <TouchableOpacity
        activeOpacity={0.8}
        className="w-8/12"
        onPress={() => navigation.navigate('Music')}
      >
        <Text numberOfLines={1} className="font-nunito-bold text-white">
          {isCurrentMusic?.title || music?.title}
        </Text>
        <Text className="font-nunito-regular text-white text-xs">
          {isCurrentMusic?.artist}
        </Text>
      </TouchableOpacity>

      <View className="flex-row gap-6">
        <TouchableOpacity activeOpacity={0.6}>
          <IconAntDesign name="hearto" size={22} color={colors.white} />
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
