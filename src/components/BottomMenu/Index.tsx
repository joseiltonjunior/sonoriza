import { useNavigation } from '@react-navigation/native'
import { StackNavigationProps } from '@routes/routes'
import { Text, TouchableOpacity, View } from 'react-native'
import Icon from 'react-native-vector-icons/Feather'

export function BottomMenu() {
  const navigation = useNavigation<StackNavigationProps>()

  return (
    <View className="bg-gray-950 px-8 flex-row justify-between">
      <TouchableOpacity
        className="items-center py-2"
        onPress={() => navigation.navigate('Home')}
      >
        <Icon name="home" size={22} />
        <Text className="font-regular text-xs mt-1">Início</Text>
      </TouchableOpacity>

      <TouchableOpacity className="items-center py-2">
        <Icon name="heart" size={22} />
        <Text className="font-regular text-xs mt-1">Favoritos</Text>
      </TouchableOpacity>

      <TouchableOpacity className="items-center py-2">
        <Icon name="search" size={22} />
        <Text className="font-regular text-xs mt-1">Busca</Text>
      </TouchableOpacity>
    </View>
  )
}
