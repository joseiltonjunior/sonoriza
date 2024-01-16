import { useNavigation } from '@react-navigation/native'
import { StackNavigationProps } from '@routes/routes'
import { ReduxProps } from '@storage/index'
import { NotificationsProps } from '@storage/modules/notifications/reducer'
import { FlatList, Image, Text, TouchableOpacity, View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import Icon from 'react-native-vector-icons/Ionicons'
import { differenceInDays, differenceInMonths } from 'date-fns'
import { ControlCurrentMusic } from '@components/ControlCurrentMusic'
import { BottomMenu } from '@components/BottomMenu/Index'
import { CurrentMusicProps } from '@storage/modules/currentMusic/reducer'
import {
  HistoricNotificationsProps,
  setHistoricNotification,
} from '@storage/modules/historicNotifications/reducer'
import colors from 'tailwindcss/colors'

export function Notifications() {
  const { notifications } = useSelector<ReduxProps, NotificationsProps>(
    (state) => state.notifications,
  )

  const navigation = useNavigation<StackNavigationProps>()

  const dispatch = useDispatch()

  const { isCurrentMusic } = useSelector<ReduxProps, CurrentMusicProps>(
    (state) => state.currentMusic,
  )

  const { historic } = useSelector<ReduxProps, HistoricNotificationsProps>(
    (state) => state.historicNotifications,
  )

  const handleDate = (date: string) => {
    const actualDate = new Date()
    const oldDate = new Date(date)

    const days = differenceInDays(actualDate, oldDate)
    const months = differenceInMonths(actualDate, oldDate)

    if (days > 30) {
      let string = ''
      if (months === 1) {
        string = `mês`
      } else {
        string = 'mêses'
      }

      return `${months} ${string}`
    }

    let formatDays = ''
    if (days === 1) {
      formatDays = 'dia'
    } else {
      formatDays = 'dias'
    }

    if (days === 0) {
      return `hoje`
    }

    return `${days} ${formatDays}`
  }

  const handleFormatName = (name: string) => {
    switch (name) {
      case 'album':
        return 'Álbum'

      case 'artist':
        return 'Artista'

      default:
        return ''
    }
  }

  const handleCheckNotification = (id: string) => {
    const exist = historic.find((item) => item.notificationId === id)

    return !!exist
  }

  return (
    <View className="bg-gray-700 flex-1">
      <View className="items-center justify-center py-4">
        <TouchableOpacity
          onPress={() => {
            navigation.goBack()
          }}
          className="absolute left-0  p-2 rounded-full"
        >
          <Icon name="chevron-back-outline" size={30} color="#fff" />
        </TouchableOpacity>
        <Text className="text-lg font-nunito-bold text-white">
          Notificações
        </Text>
      </View>

      <FlatList
        data={notifications}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            className=" border-b border-gray-300/30 p-4 "
            onPress={() => {
              dispatch(
                setHistoricNotification({
                  notificationId: item.id,
                }),
              )
              if (item.type === 'album') {
                navigation.navigate('Album', {
                  artistId: item.artistId,
                  album: item.title,
                })
              } else if (item.type === 'artist') {
                navigation.navigate('Artist', { artistId: item.artistId })
              }
            }}
          >
            <View className="flex-row items-center">
              <View className="flex-1">
                <View className="flex-row items-center">
                  <Image
                    source={{ uri: item.imageUrl }}
                    alt="cover"
                    className="w-14 h-14 rounded-md"
                  />
                  <View className="flex-1 ml-4">
                    <Text className="font-nunito-bold text-base text-white">
                      {item.title}
                    </Text>
                    {item.body && (
                      <Text className="font-nunito-regular text-gray-300">
                        {item.body}
                      </Text>
                    )}
                  </View>
                </View>

                <View className="flex-row mt-2 items-center">
                  <Text className="font-nunito-regular text-gray-300 text-xs uppercase">
                    {handleDate(item.createdAt)} - NOVO{' '}
                    {handleFormatName(item.type)}
                  </Text>
                </View>
              </View>
              {!handleCheckNotification(item.id) && (
                <Icon name="ellipse" size={10} color={colors.gray[300]} />
              )}
            </View>
          </TouchableOpacity>
        )}
      />

      <View className="absolute bottom-0 w-full">
        {isCurrentMusic && <ControlCurrentMusic music={isCurrentMusic} />}
        <BottomMenu />
      </View>
    </View>
  )
}
