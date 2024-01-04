import { ImageBackground, Text, TouchableOpacity, View } from 'react-native'
import IconAntDesign from 'react-native-vector-icons/Ionicons'
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

import AnimatedLottieView from 'lottie-react-native'
import animation from '@assets/music-loading.json'

import { MusicProps } from '@utils/Types/musicProps'

import { useFirebaseServices } from '@hooks/useFirebaseServices'
import { useFavorites } from '@hooks/useFavorites'
import { useCallback, useEffect, useState } from 'react'

interface ControlCurrentMusicProps {
  music?: MusicProps
}

export function ControlCurrentMusic({ music }: ControlCurrentMusicProps) {
  const { TrackPlayer } = useTrackPlayer()

  const [fontColor, setFontColor] = useState('#fff')

  const { isCurrentMusic, state } = useSelector<ReduxProps, CurrentMusicProps>(
    (state) => state.currentMusic,
  )

  const { handleFavoriteMusic } = useFirebaseServices()

  const { isFavoriteMusic } = useFavorites(music)

  const dispatch = useDispatch()
  const navigation = useNavigation<StackNavigationProps>()

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

  return (
    <View
      style={{ backgroundColor: isCurrentMusic?.color }}
      className="flex-row items-center justify-between p-2 mx-2 mb-2 rounded-xl"
    >
      <TouchableOpacity
        activeOpacity={0.8}
        className="flex-row items-center w-9/12"
        onPress={() => navigation.navigate('Music')}
      >
        <ImageBackground
          source={{ uri: isCurrentMusic?.artwork }}
          alt="thumb track"
          className="w-10 h-10 rounded-md items-center justify-center overflow-hidden"
        >
          {state === State.Buffering && (
            <AnimatedLottieView
              source={animation}
              autoPlay
              loop
              style={{ width: 35, height: 35 }}
            />
          )}
        </ImageBackground>
        <View className="ml-2 flex-1">
          <Text
            numberOfLines={1}
            className="font-nunito-bold text-white "
            style={{ color: fontColor }}
          >
            {isCurrentMusic?.title || music?.title}
          </Text>
          <Text
            className="font-nunito-regular text-white text-xs"
            style={{ color: fontColor }}
          >
            {isCurrentMusic?.artists && isCurrentMusic.artists[0].name}
          </Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        activeOpacity={0.6}
        onPress={() => {
          if (isCurrentMusic) {
            handleFavoriteMusic(isCurrentMusic)
          }
        }}
      >
        <IconAntDesign
          name={isFavoriteMusic ? 'heart-sharp' : 'heart-outline'}
          size={26}
          color={fontColor}
        />
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
          name={state === State.Playing ? 'pause' : 'play'}
          size={30}
          color={fontColor}
        />
      </TouchableOpacity>
    </View>
  )
}
