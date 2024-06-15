import { useNavigation } from '@react-navigation/native'
import { StackNavigationProps } from '@routes/routes'
import { Text, TouchableOpacity, View, ViewProps } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'

interface HeaderSecondaryProps extends ViewProps {
  title: string
}

export function HeaderSecondary({ title }: HeaderSecondaryProps) {
  const navigation = useNavigation<StackNavigationProps>()

  return (
    <View className="px-4 mt-12">
      <View className="flex-row items-center justify-center">
        <TouchableOpacity
          onPress={() => {
            navigation.goBack()
          }}
          className="absolute left-0 p-2 rounded-full"
        >
          <Icon name="chevron-back-outline" size={30} color="#fff" />
        </TouchableOpacity>

        <Text className="text-white font-nunito-bold text-lg">{title}</Text>
      </View>
    </View>
  )
}
