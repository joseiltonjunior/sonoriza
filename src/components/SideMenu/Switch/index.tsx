import {
  Text,
  View,
  Switch as SwitchComponent,
  SwitchProps,
} from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
import colors from 'tailwindcss/colors'

interface CustomSwitchProps extends SwitchProps {
  icon: string
  title: string
}

export function Switch({ icon, title, value, ...rest }: CustomSwitchProps) {
  return (
    <View className="flex-row items-center mt-5">
      <View className="bg-purple-600 w-8 h-8 rounded-full items-center justify-center">
        <Icon name={icon} color={colors.gray[200]} size={20} />
      </View>
      <Text className="ml-2 text-gray-300">{title}</Text>
      <SwitchComponent
        {...rest}
        trackColor={{ false: colors.gray[500], true: colors.purple[200] }}
        thumbColor={value ? colors.purple[600] : colors.gray[200]}
        className="ml-auto"
        value={value}
      />
    </View>
  )
}
