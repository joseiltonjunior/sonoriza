import { BottomMenu } from '@components/BottomMenu/Index'
import { ControlCurrentMusic } from '@components/ControlCurrentMusic'
import { useTrackPlayer } from '@hooks/useTrackPlayer'
import { useNavigation, useRoute } from '@react-navigation/native'
import { RouteParamsProps, StackNavigationProps } from '@routes/routes'
import { ReduxProps } from '@storage/index'
import { CurrentMusicProps } from '@storage/modules/currentMusic/reducer'
import { Text, TouchableOpacity, View, ImageBackground } from 'react-native'
import { FlatList } from 'react-native-gesture-handler'
import AnimatedLottieView from 'lottie-react-native'
import { useSelector } from 'react-redux'
import IconFather from 'react-native-vector-icons/Feather'
import Icon from 'react-native-vector-icons/Ionicons'
import colors from 'tailwindcss/colors'

import { useCallback, useEffect, useState } from 'react'
import { MusicProps } from '@utils/Types/musicProps'
import { UserProps } from '@storage/modules/user/reducer'
import { useFirebaseServices } from '@hooks/useFirebaseServices'
import { HistoricProps } from '@storage/modules/historic/reducer'

import playing from '@assets/playing.json'
import { TrackListOfflineProps } from '@storage/modules/trackListOffline/reducer'
import { Loading } from '@components/Loading'

export function MoreMusic() {
  const { params } = useRoute<RouteParamsProps<'MoreMusic'>>()
  const { type, title } = params

  const [page, setPage] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [isEndList, setIsEndList] = useState(false)

  const [listMusics, setListMusics] = useState<MusicProps[]>([])

  const { handleGetFavoritesMusics, handleFavoriteMusic } =
    useFirebaseServices()

  const { trackListOffline } = useSelector<ReduxProps, TrackListOfflineProps>(
    (state) => state.trackListOffline,
  )

  const { historic } = useSelector<ReduxProps, HistoricProps>(
    (state) => state.historic,
  )

  const { user } = useSelector<ReduxProps, UserProps>((state) => state.user)

  const { handleMusicSelected } = useTrackPlayer()

  const navigation = useNavigation<StackNavigationProps>()

  const { isCurrentMusic } = useSelector<ReduxProps, CurrentMusicProps>(
    (state) => state.currentMusic,
  )

  const handleGetMusics = useCallback(async () => {
    if (!user.favoritesMusics || isLoading || isEndList) return

    setIsLoading(true)

    await handleGetFavoritesMusics(user.favoritesMusics, page)
      .then((result) => {
        setPage((prev) => prev + 1)
        setListMusics((prev) => [...prev, ...result])

        if (result.length < 10) {
          setIsEndList(true)
        }
      })
      .finally(() => setIsLoading(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEndList, isLoading, user.favoritesMusics, page])

  const handlePaginatedOffline = useCallback(async () => {
    if (!trackListOffline || isEndList) return
    setIsLoading(true)

    const startIndex = page * 10

    const paginated = trackListOffline.slice(startIndex, startIndex + 10)

    setListMusics((prev) => [...prev, ...paginated])

    setPage((prev) => prev + 1)
    setIsLoading(false)
  }, [isEndList, page, trackListOffline])

  useEffect(() => {
    let updatedListMusics = [] as MusicProps[]

    if (
      type === 'favorites' &&
      user.favoritesMusics &&
      user.favoritesMusics.length > 0
    ) {
      handleGetMusics()
      return
    } else if (type === 'historic') {
      updatedListMusics = historic
    } else if (type === 'offline') {
      updatedListMusics = trackListOffline.slice(0, 10)
    }

    setListMusics(updatedListMusics)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, user.favoritesMusics])

  if (listMusics.length === 0) {
    return <Loading />
  }

  return (
    <View className="flex-1 relative bg-gray-700">
      <View className="px-4 flex-1 mt-2">
        <View className="items-center justify-center py-4">
          <TouchableOpacity
            onPress={() => {
              navigation.goBack()
            }}
            className="absolute left-0 p-2 rounded-full"
          >
            <Icon name="chevron-back-outline" size={30} color="#fff" />
          </TouchableOpacity>
          <Text className="text-lg font-bold text-white">{title}</Text>
        </View>

        <FlatList
          className={`${isCurrentMusic ? 'mb-32' : 'mb-20'} ${
            isLoading && 'm-0'
          } mt-4`}
          showsVerticalScrollIndicator={false}
          data={listMusics}
          onEndReached={
            type !== 'offline' ? handleGetMusics : handlePaginatedOffline
          }
          onEndReachedThreshold={0.1}
          ItemSeparatorComponent={() => <View className="h-3" />}
          renderItem={({ item, index }) => (
            <View className={`flex-row justify-between items-center`}>
              <TouchableOpacity
                key={index}
                className="flex-row items-center gap-2 max-w-[200px] "
                onPress={() => {
                  handleMusicSelected({
                    musicSelected: item,

                    listMusics,
                  })
                }}
              >
                <View className="w-20 h-20 bg-purple-600 rounded-xl overflow-hidden items-center justify-center">
                  {item.artwork ? (
                    <ImageBackground
                      source={{ uri: item.artwork }}
                      alt="artwork"
                      className="h-full w-full items-center justify-center"
                    >
                      {item.title === isCurrentMusic?.title && (
                        <View className="bg-white/90 rounded-full p-1">
                          <AnimatedLottieView
                            source={playing}
                            autoPlay
                            loop
                            style={{ width: 30, height: 30 }}
                          />
                        </View>
                      )}
                    </ImageBackground>
                  ) : (
                    <IconFather name="music" size={28} color={colors.white} />
                  )}
                </View>
                <View>
                  <Text className="font-bold text-white">{item.title}</Text>
                  <Text className="font-regular text-gray-300">
                    {item.artists[0].name}
                  </Text>
                </View>
              </TouchableOpacity>
              {type === 'favorites' && (
                <TouchableOpacity
                  onPress={() => {
                    handleFavoriteMusic(item)
                  }}
                  activeOpacity={0.6}
                  className="p-4"
                >
                  <Icon name={'heart'} color={colors.white} size={22} />
                </TouchableOpacity>
              )}
            </View>
          )}
        />
        {isLoading && (
          <Text
            className={`${
              isCurrentMusic ? 'mb-32' : 'mb-20'
            } mt-4 text-center font-nunito-bold text-gray-300`}
          >
            Carregando...
          </Text>
        )}
      </View>
      <View className="absolute bottom-0 w-full">
        {isCurrentMusic && <ControlCurrentMusic music={isCurrentMusic} />}
        <BottomMenu />
      </View>
    </View>
  )
}
