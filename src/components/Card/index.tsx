import React from 'react'
import IconFather from 'react-native-vector-icons/Feather'

import {
  Image,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
} from 'react-native'
import { twMerge } from 'tailwind-merge'
import colors from 'tailwindcss/colors'

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
            <IconFather name="music" size={30} color={colors.gray[200]} />
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
