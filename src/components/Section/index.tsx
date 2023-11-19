import { ViewProps, TouchableOpacity, Text, View } from 'react-native'
import { twMerge } from 'tailwind-merge'

interface SectionProps extends ViewProps {
  title: string
  description?: string
  onPress?: () => void
}

export function Section({
  onPress,
  title,
  children,
  className,
  description,
  ...rest
}: SectionProps) {
  return (
    <View {...rest} className={twMerge(className)}>
      <View className="flex-row items-center justify-between mb-3">
        <View>
          <Text className="text-lg font-nunito-bold text-white ml-4">
            {title}
          </Text>
          {description && (
            <Text className="text-sm font-nunito-regular text-gray-300 ml-4">
              {description}
            </Text>
          )}
        </View>
        {onPress && (
          <TouchableOpacity activeOpacity={0.6} onPress={onPress}>
            <Text className="text-gray-300 mr-4 font-nunito-medium">
              Ver mais
            </Text>
          </TouchableOpacity>
        )}
      </View>
      {children}
    </View>
  )
}
