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

interface ReleaseProps extends TouchableOpacityProps {
  artwork: string
  name: string
}

export function Release({ artwork, name, className, ...rest }: ReleaseProps) {
  return (
    <TouchableOpacity
      {...rest}
      activeOpacity={0.8}
      className={twMerge('', className)}
    >
      <View>
        <View className="w-full h-[120px] bg-gray-950 rounded-md overflow-hidden items-center justify-center">
          {artwork.length ? (
            <Image
              source={{ uri: artwork }}
              alt="artwork"
              className="w-full h-full object-cover"
            />
          ) : (
            <IconFather name="music" size={30} color={colors.white} />
          )}
        </View>

        <View className="mt-1">
          <Text
            className="font-nunito-bold text-white text-center"
            numberOfLines={1}
          >
            {name}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  )
}
