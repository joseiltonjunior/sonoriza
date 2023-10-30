import { ViewProps, TouchableOpacity, Text, View } from 'react-native'

interface SectionProps extends ViewProps {
  title: string
  onPress(): void
}

export function Section({ onPress, title, children, ...rest }: SectionProps) {
  return (
    <View {...rest}>
      <View className="flex-row items-center justify-between mb-3">
        <Text className="text-xl font-nunito-bold text-white">{title}</Text>
        <TouchableOpacity activeOpacity={0.6} onPress={onPress}>
          <Text className="text-gray-300 mr-4 font-nunito-medium">
            Ver mais
          </Text>
        </TouchableOpacity>
      </View>
      {children}
    </View>
  )
}
