import {
  Image,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
} from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import colors from 'tailwindcss/colors'
import { twMerge } from 'tailwind-merge'

import sonorizaIcon from '@assets/sonoriza-icon.png'

interface ButtonsProps extends TouchableOpacityProps {
  title: string
  icon: string
}

export function Button({ title, icon, className, ...rest }: ButtonsProps) {
  return (
    <TouchableOpacity
      {...rest}
      className={twMerge('flex-row items-center', className)}
      activeOpacity={0.6}
    >
      <View className="bg-purple-600 w-8 h-8 rounded-full items-center justify-center">
        {icon.includes('sonoriza-tv') ? (
          <Image source={sonorizaIcon} alt="sonoriza tv" className="w-5 h-5" />
        ) : (
          <Icon name={icon} color={colors.gray[200]} size={20} />
        )}
      </View>
      <Text className="ml-2 font-nunito-bold text-white">{title}</Text>
    </TouchableOpacity>
  )
}
