import { Image, Text, TouchableOpacity, View } from 'react-native'
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
import { useCallback, useEffect, useState } from 'react'
import { useFirebaseServices } from '@hooks/useFirebaseServices'
import { MusicProps } from '@utils/Types/musicProps'

interface ControlCurrentMusicProps {
  music?: MusicProps
}

export function ControlCurrentMusic({ music }: ControlCurrentMusicProps) {
  const [colorBackground, setColorBackground] = useState('#9333ea')

  const { TrackPlayer } = useTrackPlayer()

  const { handleGetColorByMusicId } = useFirebaseServices()

  const { isCurrentMusic, state } = useSelector<ReduxProps, CurrentMusicProps>(
    (state) => state.currentMusic,
  )

  const dispatch = useDispatch()
  const navigation = useNavigation<StackNavigationProps>()

  const handleGetBackgroundColor = useCallback(
    async (id: string) => {
      await handleGetColorByMusicId(id).then((result) => {
        setColorBackground(result.name)
      })
    },
    [handleGetColorByMusicId],
  )

  useEffect(() => {
    if (isCurrentMusic?.id) {
      handleGetBackgroundColor(isCurrentMusic.id)
    }
  }, [handleGetBackgroundColor, isCurrentMusic?.id])

  return (
    <View
      style={{ backgroundColor: colorBackground }}
      className="flex-row items-center justify-between py-2 px-2 rounded-lg mx-2 mb-2 shadow shadow-gray-500"
    >
      <TouchableOpacity
        activeOpacity={0.8}
        className="flex-row items-center w-9/12"
        onPress={() => navigation.navigate('Music')}
      >
        <Image
          source={{ uri: isCurrentMusic?.artwork }}
          alt="thumb track"
          className="w-12 h-12 rounded-md"
        />
        <View className="ml-2 flex-1">
          <Text numberOfLines={1} className="font-nunito-bold text-white ">
            {isCurrentMusic?.title || music?.title}
          </Text>
          <Text className="font-nunito-regular text-white text-xs">
            {isCurrentMusic?.artists && isCurrentMusic.artists[0].name}
          </Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity activeOpacity={0.6}>
        <IconAntDesign name={'hearto'} size={26} color={colors.white} />
      </TouchableOpacity>

      <TouchableOpacity
        activeOpacity={0.6}
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
          size={30}
          color={colors.white}
        />
      </TouchableOpacity>
    </View>
  )
}
