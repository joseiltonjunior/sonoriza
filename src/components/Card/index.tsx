import React, { useMemo } from 'react'
import IconFather from 'react-native-vector-icons/Feather'
import IconFontAwesome from 'react-native-vector-icons/FontAwesome'
import AnimatedLottieView from 'lottie-react-native'
import animation from '@assets/playing.json'

import {
  Image,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
} from 'react-native'
import { twMerge } from 'tailwind-merge'
import colors from 'tailwindcss/colors'
import { useSelector } from 'react-redux'
import { ReduxProps } from '@storage/index'
import { CurrentMusicProps } from '@storage/modules/currentMusic/reducer'

import { State } from 'react-native-track-player'

interface CardProps extends TouchableOpacityProps {
  artwork: string
  album: string
  title: string
}

export function Card({ album, artwork, title, className, ...rest }: CardProps) {
  const { isCurrentMusic, state } = useSelector<ReduxProps, CurrentMusicProps>(
    (state) => state.currentMusic,
  )

  const handleStateMusic = useMemo(() => {
    switch (state) {
      case State.Playing:
        if (title !== isCurrentMusic?.title) {
          return 'play-not-current'
        }
        return 'play-current'

      case State.Paused:
      case State.Ended:
        return 'paused'

      default:
        return 'paused'
    }
  }, [isCurrentMusic?.title, state, title])

  return (
    <TouchableOpacity
      {...rest}
      activeOpacity={0.8}
      className={twMerge('', className)}
    >
      <View>
        <View className="w-full h-[150px] bg-gray-950 rounded-md overflow-hidden items-center justify-center">
          {artwork.length ? (
            <Image
              source={{ uri: artwork }}
              alt="artwork"
              className="w-full h-full object-cover"
            />
          ) : (
            <IconFather name="music" size={30} color={colors.white} />
          )}

          <View className="bg-white shadow-lg shadow-black h-6 w-6 p-1 rounded-full m-2 mt-auto items-center justify-center absolute bottom-0 left-0">
            {handleStateMusic === 'play-not-current' && (
              <IconFontAwesome name="play" color={colors.gray[950]} size={12} />
            )}

            {handleStateMusic === 'paused' && (
              <IconFontAwesome name="play" color={colors.gray[950]} size={12} />
            )}

            {handleStateMusic === 'play-current' && (
              <AnimatedLottieView
                source={animation}
                autoPlay
                loop
                style={{ width: 35, height: 35 }}
              />
            )}
          </View>
        </View>

        <View className="mt-1">
          <Text
            className="font-nunito-bold text-white text-center"
            numberOfLines={1}
          >
            {title}
          </Text>
          <Text
            className="font-nunito-medium text-xs text-gray-300 text-center"
            numberOfLines={1}
          >
            {album}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  )
}
