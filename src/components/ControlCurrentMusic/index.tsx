import { ImageBackground, Text, TouchableOpacity, View } from 'react-native'
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

import AnimatedLottieView from 'lottie-react-native'
import animation from '@assets/music-loading.json'

import { MusicProps } from '@utils/Types/musicProps'

import { useFirebaseServices } from '@hooks/useFirebaseServices'
import { useFavorites } from '@hooks/useFavorites'

interface ControlCurrentMusicProps {
  music?: MusicProps
}

export function ControlCurrentMusic({ music }: ControlCurrentMusicProps) {
  const { TrackPlayer } = useTrackPlayer()

  const { isCurrentMusic, state } = useSelector<ReduxProps, CurrentMusicProps>(
    (state) => state.currentMusic,
  )

  const { handleFavoriteMusic } = useFirebaseServices()

  const { isFavoriteMusic } = useFavorites()

  const dispatch = useDispatch()
  const navigation = useNavigation<StackNavigationProps>()

  return (
    <View
      style={{ backgroundColor: isCurrentMusic?.color }}
      className="flex-row items-center justify-between py-2 px-2 rounded-lg mx-2 mb-2"
    >
      <TouchableOpacity
        activeOpacity={0.8}
        className="flex-row items-center w-9/12"
        onPress={() => navigation.navigate('Music')}
      >
        <ImageBackground
          source={{ uri: isCurrentMusic?.artwork }}
          alt="thumb track"
          className="w-12 h-12 rounded-md items-center justify-center overflow-hidden"
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
          <Text numberOfLines={1} className="font-nunito-bold text-white ">
            {isCurrentMusic?.title || music?.title}
          </Text>
          <Text className="font-nunito-regular text-white text-xs">
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
          name={isFavoriteMusic ? 'heart' : 'hearto'}
          size={26}
          color={colors.white}
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
          name={state === State.Playing ? 'pause' : 'caretright'}
          size={30}
          color={colors.white}
        />
      </TouchableOpacity>
    </View>
  )
}
