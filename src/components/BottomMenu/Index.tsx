import { useNavigation } from '@react-navigation/native'
import { StackNavigationProps } from '@routes/routes'
import { ReduxProps } from '@storage/index'
import { NetInfoProps } from '@storage/modules/netInfo/reducer'
import { Text, TouchableOpacity, View } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import { useSelector } from 'react-redux'
import colors from 'tailwindcss/colors'

export function BottomMenu() {
  const navigation = useNavigation<StackNavigationProps>()
  const { status } = useSelector<ReduxProps, NetInfoProps>(
    (state) => state.netInfo,
  )

  return (
    <View className="bg-gray-950/90 px-8 flex-row justify-between border-t border-purple-600/30">
      <TouchableOpacity
        activeOpacity={0.6}
        className="items-center py-2 px-4"
        onPress={() => navigation.navigate('Home')}
      >
        <Icon name="home" size={22} color={colors.gray[400]} />
        <Text className="font-nunito-regular text-xs text-gray-400">
          Início
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        activeOpacity={0.6}
        disabled={!status}
        className="items-center py-2 px-4"
        onPress={() => navigation.navigate('Search')}
      >
        <Icon
          name="search"
          size={22}
          color={status ? colors.gray[400] : colors.gray[600]}
        />
        <Text
          className={`font-nunito-regular text-xs ${
            status ? 'text-gray-400' : 'text-gray-600'
          }`}
        >
          Busca
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        activeOpacity={0.6}
        className="items-center py-2 px-4"
        onPress={() => navigation.navigate('Favorites')}
      >
        <Icon name="heart-outline" size={22} color={colors.gray[400]} />
        <Text className="font-nunito-regular text-xs text-gray-400">
          Favoritos
        </Text>
      </TouchableOpacity>
    </View>
  )
}
