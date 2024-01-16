import { useSideMenu } from '@hooks/useSideMenu'
import { useNetInfo } from '@react-native-community/netinfo'
import { useNavigation } from '@react-navigation/native'
import { StackNavigationProps } from '@routes/routes'
import { ReduxProps } from '@storage/index'
import {
  NewsNotificationsProps,
  setNewsNotifications,
} from '@storage/modules/newsNotifications/reducer'
import { Text, TouchableOpacity, View } from 'react-native'

import Icon from 'react-native-vector-icons/Ionicons'
import Octicon from 'react-native-vector-icons/Octicons'
import { useDispatch, useSelector } from 'react-redux'
import colors from 'tailwindcss/colors'

interface HeaderProps {
  title: string
}

export function Header({ title }: HeaderProps) {
  const navigation = useNavigation<StackNavigationProps>()

  const { handleIsVisible } = useSideMenu()

  const { isConnected } = useNetInfo()

  const dispatch = useDispatch()

  const { newsNotifications } = useSelector<ReduxProps, NewsNotificationsProps>(
    (state) => state.newsNotifications,
  )

  return (
    <View className="p-4 flex-row items-center justify-between">
      <Text className="text-white text-3xl font-nunito-bold">{title}</Text>

      <View className="flex-row">
        {isConnected && (
          <TouchableOpacity
            activeOpacity={0.6}
            onPress={() => {
              dispatch(setNewsNotifications({ newsNotifications: false }))
              navigation.navigate('Notifications')
            }}
          >
            <Icon
              name="notifications-outline"
              size={26}
              color={colors.gray[300]}
            />
            {newsNotifications && (
              <View className="absolute -right-1 -top-1">
                <Octicon name="dot-fill" color={colors.gray[300]} />
              </View>
            )}
          </TouchableOpacity>
        )}
        <TouchableOpacity
          onPress={handleIsVisible}
          activeOpacity={0.6}
          className="ml-4"
        >
          <Icon name="person-outline" size={26} color={colors.gray[300]} />
        </TouchableOpacity>
      </View>
    </View>
  )
}
