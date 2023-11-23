import { useNavigation } from '@react-navigation/native'
import { StackNavigationProps } from '@routes/routes'
import { ReduxProps } from '@storage/index'
import { NetInfoProps } from '@storage/modules/netInfo/reducer'
import { Text, TouchableOpacity, View } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import { useSelector } from 'react-redux'

export function BottomMenu() {
  const navigation = useNavigation<StackNavigationProps>()
  const { status } = useSelector<ReduxProps, NetInfoProps>(
    (state) => state.netInfo,
  )

  return (
    <View className="bg-gray-950/90 px-8 flex-row justify-between border-t border-purple-600/30">
      <TouchableOpacity
        activeOpacity={0.6}
        className="items-center py-2"
        onPress={() => navigation.navigate('Home')}
      >
        <Icon name="home" size={22} />
        <Text className="font-nunito-regular text-xs mt-1">Início</Text>
      </TouchableOpacity>

      <TouchableOpacity
        activeOpacity={0.6}
        disabled={!status}
        className="items-center py-2"
        onPress={() => navigation.navigate('Search')}
      >
        <Icon name="search" size={22} />
        <Text className="font-nunito-regular text-xs mt-1">Busca</Text>
      </TouchableOpacity>

      <TouchableOpacity
        activeOpacity={0.6}
        className="items-center py-2"
        onPress={() => navigation.navigate('Favorites')}
      >
        <Icon name="heart-outline" size={22} />
        <Text className="font-nunito-regular text-xs mt-1">Favoritos</Text>
      </TouchableOpacity>
    </View>
  )
}
