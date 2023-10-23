import {
  ActivityIndicator,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
} from 'react-native'

import colors from 'tailwindcss/colors'

interface ButtonProps extends TouchableOpacityProps {
  title: string
  isLoading?: boolean
}

export function Button({ title, isLoading, ...rest }: ButtonProps) {
  return (
    <TouchableOpacity
      {...rest}
      className="bg-purple-600 px-4 justify-center h-14 items-center rounded-full"
    >
      {isLoading ? (
        <ActivityIndicator size="small" color={colors.white} />
      ) : (
        <Text className="font-bold text-white text-base">{title}</Text>
      )}
    </TouchableOpacity>
  )
}
