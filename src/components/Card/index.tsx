import React from 'react'
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
  artist: string
  title: string
}

export function Card({
  artist,
  artwork,
  title,
  className,
  ...rest
}: CardProps) {
  const { isCurrentMusic, state } = useSelector<ReduxProps, CurrentMusicProps>(
    (state) => state.currentMusic,
  )

  return (
    <TouchableOpacity
      {...rest}
      activeOpacity={0.6}
      className={twMerge('', className)}
    >
      <View>
        <View className="w-full h-32 bg-purple-600 rounded-md overflow-hidden items-center justify-center">
          {artwork.length ? (
            <Image
              source={{ uri: artwork }}
              alt="artwork"
              className="w-full h-full object-contain"
            />
          ) : (
            <>
              {title !== isCurrentMusic?.title && (
                <IconFather name="music" size={30} color={colors.gray[200]} />
              )}
            </>
          )}

          {title !== isCurrentMusic?.title && (
            <View className="bg-white/90 h-6 w-6 p-1 rounded-full m-2 mt-auto items-center justify-center absolute bottom-0 left-0">
              <IconFontAwesome name="play" color={colors.gray[950]} size={12} />
            </View>
          )}

          {state === State.Paused && title === isCurrentMusic?.title && (
            <View className="bg-white/90 h-6 w-6 p-1 rounded-full m-2 mt-auto items-center justify-center absolute bottom-0 left-0">
              <IconFontAwesome name="play" color={colors.gray[950]} size={12} />
            </View>
          )}

          {state === State.Playing && title === isCurrentMusic?.title && (
            <View className="bg-white/90 h-12 w-12 p-1 rounded-full items-center justify-center absolute">
              <AnimatedLottieView
                source={animation}
                autoPlay
                loop
                style={{ width: 50, height: 50 }}
              />
            </View>
          )}
        </View>

        <View className="mt-auto pt-2">
          <Text
            className="font-bold text-md text-white text-center"
            numberOfLines={1}
          >
            {title}
          </Text>
          <Text
            className="font-bold text-xs text-gray-300 text-center"
            numberOfLines={1}
          >
            {artist}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  )
}
