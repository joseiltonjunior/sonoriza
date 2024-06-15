import { BottomMenu } from '@components/BottomMenu/Index'
import { ControlCurrentMusic } from '@components/ControlCurrentMusic'
import { useTrackPlayer } from '@hooks/useTrackPlayer'
import { useNavigation, useRoute } from '@react-navigation/native'
import { RouteParamsProps, StackNavigationProps } from '@routes/routes'
import { ReduxProps } from '@storage/index'
import { CurrentMusicProps } from '@storage/modules/currentMusic/reducer'
import {
  Text,
  TouchableOpacity,
  View,
  ImageBackground,
  ActivityIndicator,
} from 'react-native'
import { FlatList } from 'react-native-gesture-handler'
import AnimatedLottieView from 'lottie-react-native'
import { useSelector } from 'react-redux'
import IconFather from 'react-native-vector-icons/Feather'
import Icon from 'react-native-vector-icons/Ionicons'
import colors from 'tailwindcss/colors'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { MusicProps } from '@utils/Types/musicProps'
import { UserProps } from '@storage/modules/user/reducer'
import { useFirebaseServices } from '@hooks/useFirebaseServices'
import { HistoricProps } from '@storage/modules/historic/reducer'

import playing from '@assets/playing.json'
import { TrackListOfflineProps } from '@storage/modules/trackListOffline/reducer'
import { Loading } from '@components/Loading'
import { InfoPlayingMusic } from '@components/InfoPlayingMusic'

import { useBottomModal } from '@hooks/useBottomModal'

export function MoreMusic() {
  const { params } = useRoute<RouteParamsProps<'MoreMusic'>>()
  const { type, title, artistFlow } = params

  const [page, setPage] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [isEndList, setIsEndList] = useState(false)

  const { openModal } = useBottomModal()
  const [listMusics, setListMusics] = useState<MusicProps[]>([])

  const { handleGetFavoritesMusics, handleGetMusicsById } =
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

  const handleGetMusicsByArtist = useCallback(async () => {
    if (!artistFlow || isLoading || isEndList) return

    setIsLoading(true)

    await handleGetMusicsById(artistFlow, page)
      .then((result) => {
        setPage((prev) => prev + 1)
        setListMusics((prev) => [...prev, ...result])

        if (result.length < 10 || artistFlow.length <= 10) {
          setIsEndList(true)
        }
      })
      .catch((err) => console.log(err, 'hmm'))
      .finally(() => setIsLoading(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEndList, isLoading, user.favoritesMusics, page])

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
      .catch((err) => console.log(err, 'err'))
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

  const verifyType = useMemo(() => {
    switch (type) {
      case 'offline':
        return handlePaginatedOffline

      case 'artist':
        return handleGetMusicsByArtist

      default:
        return handleGetMusics
    }
  }, [handleGetMusics, handleGetMusicsByArtist, handlePaginatedOffline, type])

  useEffect(() => {
    let updatedListMusics = [] as MusicProps[]

    if (
      type === 'favorites' &&
      user.favoritesMusics &&
      user.favoritesMusics.length > 0
    ) {
      handleGetMusics()
    } else if (type === 'historic') {
      updatedListMusics = historic
    } else if (type === 'offline') {
      updatedListMusics = trackListOffline.slice(0, 10)
    } else if (type === 'artist') {
      handleGetMusicsByArtist()
    }

    setListMusics(updatedListMusics)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, user.favoritesMusics])

  if (listMusics.length === 0) {
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
          <Text className="text-lg font-bold text-white">{title}</Text>
        </View>

        <FlatList
          className={`mt-4`}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item) => item.id.toString()}
          data={listMusics}
          onEndReached={verifyType}
          onEndReachedThreshold={0.2}
          ItemSeparatorComponent={() => <View className="h-3" />}
          renderItem={({ item, index }) => (
            <View
              className={`flex-row gap-4 justify-between items-center ${
                index + 1 === listMusics.length &&
                `${isCurrentMusic ? 'mb-32' : 'mb-16'}`
              }`}
            >
              <TouchableOpacity
                key={index}
                className="flex-row items-center gap-2 flex-1 overflow-hidden"
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

              <TouchableOpacity
                className="p-2"
                onPress={() =>
                  openModal({
                    children: (
                      <InfoPlayingMusic musicSelected={item} isCloseModal />
                    ),
                  })
                }
              >
                <Icon name="ellipsis-vertical" size={24} color={colors.white} />
              </TouchableOpacity>

              {/* {type === 'favorites' && (
                <TouchableOpacity
                  onPress={() => {
                    handleFavoriteMusic(item)
                  }}
                  activeOpacity={0.6}
                  className="p-4"
                >
                  <Icon name={'heart'} color={colors.white} size={22} />
                </TouchableOpacity>
              )} */}
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
