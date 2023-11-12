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
  roundedSmall?: boolean
}

export function Rounded({
  artist,
  artwork,
  className,
  roundedSmall,
  ...rest
}: RoundedProps) {
  return (
    <TouchableOpacity
      {...rest}
      activeOpacity={0.6}
      className={twMerge('items-center', className)}
    >
      <View>
        <View
          className={`${
            roundedSmall ? 'w-[110px] h-[110px]' : 'w-[140px] h-[140px]'
          } bg-gray-950 rounded-full overflow-hidden items-center justify-center`}
        >
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
