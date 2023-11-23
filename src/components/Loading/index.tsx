import { ActivityIndicator, View } from 'react-native'
import colors from 'tailwindcss/colors'

export function Loading() {
  return (
    <View className="bg-gray-700 absolute w-screen h-full items-center justify-center">
      <ActivityIndicator color={colors.gray[300]} size={'large'} />
    </View>
  )
}
