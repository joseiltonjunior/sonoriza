import { BottomMenu } from '@components/BottomMenu/Index'
import { ControlCurrentMusic } from '@components/ControlCurrentMusic'

import bad from '@assets/bad.json'

import { useNavigation } from '@react-navigation/native'
import { StackNavigationProps } from '@routes/routes'
import { ReduxProps } from '@storage/index'
import { CurrentMusicProps } from '@storage/modules/currentMusic/reducer'
import {
  Text,
  TouchableOpacity,
  View,
  ImageBackground,
  ActivityIndicator,
  Dimensions,
} from 'react-native'
import { FlatList } from 'react-native-gesture-handler'
import AnimatedLottieView from 'lottie-react-native'
import { useSelector } from 'react-redux'

import Icon from 'react-native-vector-icons/Ionicons'
import colors from 'tailwindcss/colors'

import { useCallback, useEffect, useState } from 'react'

import { UserProps } from '@storage/modules/user/reducer'
import { useFirebaseServices } from '@hooks/useFirebaseServices'

import { PlaylistProps } from '@utils/Types/playlistProps'
import { Loading } from '@components/Loading'

export function Playlists() {
  const [isLoading, setIsLoading] = useState(false)
  const [playlists, setPlaylists] = useState<PlaylistProps[]>([])

  const size = Dimensions.get('window').width * 0.7

  const { handleGetPlaylistByUserId } = useFirebaseServices()

  const { user } = useSelector<ReduxProps, UserProps>((state) => state.user)

  const navigation = useNavigation<StackNavigationProps>()

  const { isCurrentMusic } = useSelector<ReduxProps, CurrentMusicProps>(
    (state) => state.currentMusic,
  )

  const handleSearchMyPlaylists = useCallback(async () => {
    setIsLoading(true)

    const response = await handleGetPlaylistByUserId(user.uid)

    setPlaylists(response)

    setIsLoading(false)
  }, [handleGetPlaylistByUserId, user.uid])

  useEffect(() => {
    handleSearchMyPlaylists()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (isLoading) {
    return <Loading />
  }

  return (
    <View className="flex-1 relative bg-gray-700">
      <View className="px-4 flex-1">
        <View className="items-center justify-center py-4 mt-10">
          <TouchableOpacity
            onPress={() => {
              navigation.goBack()
            }}
            className="absolute left-0 p-2 rounded-full"
          >
            <Icon name="chevron-back-outline" size={30} color="#fff" />
          </TouchableOpacity>
          <Text className="text-lg font-bold text-white">Playlists</Text>
        </View>

        <FlatList
          className={`mt-4`}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item) => item.id.toString()}
          data={playlists}
          ListEmptyComponent={() => (
            <View className="bg-gray-700 flex-1 items-center justify-center p-8">
              <AnimatedLottieView
                source={bad}
                autoPlay
                resizeMode="contain"
                style={{ width: size, height: size }}
              />
              <Text className="font-nunito-bold text-lg text-white text-center">
                Ops! Parece que você ainda não tem nenhuma playlist criada ou
                salva.
              </Text>
            </View>
          )}
          ItemSeparatorComponent={() => <View className="h-3" />}
          renderItem={({ item, index }) => (
            <View
              className={`flex-row gap-4 justify-between items-center ${
                isCurrentMusic ? 'mb-32' : 'mb-16'
              }`}
            >
              <TouchableOpacity
                key={index}
                className="flex-row items-center gap-2 flex-1 overflow-hidden"
                onPress={() => {
                  navigation.navigate('EditPlaylist', item)
                }}
              >
                <View className="w-20 h-20 bg-purple-600 rounded-xl overflow-hidden items-center justify-center">
                  <ImageBackground
                    source={{ uri: item.imageUrl }}
                    alt="artwork"
                    className="h-full w-full items-center justify-center"
                  />
                </View>
                <View>
                  <Text className="font-bold text-white">{item.title}</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                className="p-2"
                onPress={() => console.log('options playlist')}
              >
                <Icon name="ellipsis-vertical" size={24} color={colors.white} />
              </TouchableOpacity>
            </View>
          )}
        />
        {isLoading && (
          <View
            className={`absolute bottom-0 ${
              isCurrentMusic ? 'mb-32' : 'mb-16'
            } items-center w-full`}
          >
            <View className={`bg-gray-700 rounded-full`}>
              <ActivityIndicator color={colors.gray[300]} size={'large'} />
            </View>
          </View>
        )}
      </View>
      <View className="absolute bottom-0 w-full">
        {isCurrentMusic && <ControlCurrentMusic music={isCurrentMusic} />}
        <BottomMenu />
      </View>
    </View>
  )
}
