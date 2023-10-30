import React from 'react'

import {
  Image,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
} from 'react-native'
import { twMerge } from 'tailwind-merge'

interface RoundedProps extends TouchableOpacityProps {
  artwork: string
  artist: string
}

export function Rounded({ artist, artwork, className, ...rest }: RoundedProps) {
  return (
    <TouchableOpacity
      {...rest}
      activeOpacity={0.6}
      className={twMerge('', className)}
    >
      <View>
        <View className="w-full h-[150px] bg-purple-600 rounded-full overflow-hidden items-center justify-center">
          <Image
            source={{ uri: artwork }}
            alt="artwork"
            className="w-full h-full object-cover"
          />
        </View>

        <View className="mt-auto pt-2">
          <Text
            className="font-nunito-bold text-base text-white text-center"
            numberOfLines={1}
          >
            {artist}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  )
}
