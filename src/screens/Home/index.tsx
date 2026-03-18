import {
  ScrollView,
  Text,
  View,
  Dimensions,
  BackHandler,
  RefreshControl,
} from 'react-native'
import AnimatedLottieView from 'lottie-react-native'
import splash from '@assets/access-denied.json'
import bad from '@assets/bad.json'
import { useDispatch, useSelector } from 'react-redux'

import {
  handleSetNetStatus,
  NetInfoProps,
} from '@storage/modules/netInfo/reducer'
import {
  setFavoriteArtists,
  FavoriteArtistsProps,
} from '@storage/modules/favoriteArtists/reducer'

import {
  handleSetFavoriteMusics,
  FavoriteMusicsProps,
} from '@storage/modules/favoriteMusics/reducer'
import { handleSetReleases } from '@storage/modules/releases/reducer'

import { ReduxProps } from '@storage/index'

import { BottomMenu } from '@components/BottomMenu/Index'
import { ControlCurrentMusic } from '@components/ControlCurrentMusic'

import { BoxCarousel } from '@components/BoxCarousel'

import { CurrentMusicProps } from '@storage/modules/currentMusic/reducer'

import { RoundedCarousel } from '@components/RoundedCarousel'

import { Section } from '@components/Section'

import { MusicalGenres } from '@components/MusicalGenres'
import { useCallback, useEffect, useMemo, useState } from 'react'

import TrackPlayer, { Event, State } from 'react-native-track-player'

import { useTrackPlayer } from '@hooks/useTrackPlayer'
import { HistoricProps } from '@storage/modules/historic/reducer'
import { ListCarousel } from '@components/ListCarousel'

import { useNetwork } from '@hooks/useNetwork'
import { TrackListOfflineProps } from '@storage/modules/trackListOffline/reducer'

import { useNetInfo } from '@react-native-community/netinfo'
import { handleSetUser, UserProps } from '@storage/modules/user/reducer'

import {
  InspiredMixesProps,
  setInspiredMixes,
} from '@storage/modules/inspiredMixes/reducer'
import { shuffleArray } from '@utils/Types/shuffleArray'
import { MusicProps } from '@utils/Types/musicProps'
import { Button } from '@components/Button'

import {
  NotificationsProps,
  setNotification,
} from '@storage/modules/notifications/reducer'

import { setNewsNotifications } from '@storage/modules/newsNotifications/reducer'
import { Header } from '@components/Header'

import messaging from '@react-native-firebase/messaging'
import { api } from '@services/api'
import { MusicalGenresDataProps } from '@utils/Types/musicalGenresProps'
import { UserDataProps } from '@utils/Types/userProps'

export function Home() {
  const { historic } = useSelector<ReduxProps, HistoricProps>(
    (state) => state.historic,
  )

  const size = Dimensions.get('window').width * 0.7

  const dispatch = useDispatch()

  const [topMusicalGenres, setTopMusicalGenres] = useState<
    MusicalGenresDataProps[]
  >([])
  const [isRefreshing, setIsRefreshing] = useState(false)

  const { getCurrentMusic } = useTrackPlayer()

  const { openModalErrNetwork } = useNetwork()

  const { isConnected } = useNetInfo()

  const { isCurrentMusic } = useSelector<ReduxProps, CurrentMusicProps>(
    (state) => state.currentMusic,
  )

  const { ignoreAlert } = useSelector<ReduxProps, NetInfoProps>(
    (state) => state.netInfo,
  )

  const { notifications } = useSelector<ReduxProps, NotificationsProps>(
    (state) => state.notifications,
  )

  const { favoriteArtists } = useSelector<ReduxProps, FavoriteArtistsProps>(
    (state) => state.favoriteArtists,
  )

  const { musics: inspiredMixes } = useSelector<ReduxProps, InspiredMixesProps>(
    (state) => state.inspiredMixes,
  )

  const { user } = useSelector<ReduxProps, UserProps>((state) => state.user)

  const { favoriteMusics } = useSelector<ReduxProps, FavoriteMusicsProps>(
    (state) => state.favoriteMusics,
  )

  const { trackListOffline } = useSelector<ReduxProps, TrackListOfflineProps>(
    (state) => state.trackListOffline,
  )

  const handleGetCurrentMusic = async () => {
    await getCurrentMusic()
  }

  const handleFilterHistoricOffline = useMemo(() => {
    const historicOffline = trackListOffline.filter((item) =>
      historic.find((track) => track.id === item.id),
    )

    return historicOffline
  }, [historic, trackListOffline])

  const handleGetDataUser = useCallback(async () => {
    try {
      if (isConnected) {
        const userData = await api
          .get('/me')
          .then((response) => response.data as UserDataProps)
        const recommendationData = await api
          .get(`/me/recommendations/musics`)
          .then((response) => response.data)

        if (userData.favoriteMusics) {
          dispatch(
            handleSetFavoriteMusics({
              favoriteMusics: userData.favoriteMusics,
            }),
          )
        }

        if (userData.favoriteArtists) {
          dispatch(
            setFavoriteArtists({ favoriteArtists: userData.favoriteArtists }),
          )
        }

        if (userData.favoriteMusics && userData.favoriteArtists) {
          dispatch(
            handleSetUser({
              user: {
                ...user,
                favoriteArtists: userData.favoriteArtists,
                favoriteMusics: userData.favoriteMusics,
                favoriteGenres: userData.favoriteGenres,
              },
            }),
          )
        }

        if (recommendationData.data) {
          const inspiredMixes = recommendationData.data as MusicProps[]
          const basedOnGenres = recommendationData.basedOnGenres

          dispatch(
            setInspiredMixes({
              musics: inspiredMixes,
            }),
          )

          if (userData.favoriteGenres) {
            setTopMusicalGenres(basedOnGenres)
          }
        }

        dispatch(handleSetNetStatus(true))        
      } else {
        dispatch(handleSetNetStatus(false))
      }
    } catch (error) {
      console.log(error, 'home')
    }
  }, [
    dispatch,
    topMusicalGenres,
    isConnected,
    user.favoriteArtists,
    user.favoriteMusics,
  ])

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true)

    try {
      await handleGetDataUser()
    } finally {
      setIsRefreshing(false)
    }
  }, [handleGetDataUser])

  // const handleFetchNoticationsDB = useCallback(async () => {
  //   await handleGetNotifications()
  //     .then((response) => {
  //       if (JSON.stringify(response) !== JSON.stringify(notifications)) {
  //         dispatch(setNewsNotifications({ newsNotifications: true }))
  //       }

  //       dispatch(setNotification({ notifications: response }))
  //     })
  //     .catch((err) => console.log(err, 'err'))
  // }, [dispatch, handleGetNotifications, notifications])

  useEffect(() => {
    if (isConnected === null) return
    if (isConnected) {
      // handleFetchNoticationsDB()
      handleGetDataUser()
    } else if (!isConnected) {
      dispatch(handleSetNetStatus(false))
      if (!ignoreAlert) {
        openModalErrNetwork()
      }
    }
  }, [ignoreAlert, isConnected])

  useEffect(() => {
    handleGetCurrentMusic()
    const playbackStateListener = TrackPlayer.addEventListener(
      Event.PlaybackState,
      ({ state }) => {
        if (
          [State.Paused, State.Playing, State.Buffering, State.Ended].includes(
            state,
          )
        ) {
          handleGetCurrentMusic()
        }
      },
    )

    return () => {
      playbackStateListener.remove()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // useEffect(() => {
  //   const unsubscribe = messaging().onMessage(async () => {
  //     handleFetchNoticationsDB()
  //   })

  //   return unsubscribe
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [])

  return (
    <>
      <ScrollView
        className="bg-gray-700"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
        }
      >
        <Header title="Início" />

        <View className={isCurrentMusic ? 'pb-32' : 'pb-16'}>
          {!isConnected &&
            handleFilterHistoricOffline.length === 0 &&
            trackListOffline.length === 0 && (
              <View className="flex-1  items-center justify-center p-8">
                <AnimatedLottieView
                  source={bad}
                  autoPlay
                  loop
                  resizeMode="contain"
                  style={{ width: size, height: size }}
                />
                <Text className="text-white font-nunito-bold text-center text-base">
                  Ops, parece que você está desconectado e ainda não baixou
                  nenhuma música. Quando estiver online, não se esqueça de
                  baixar algumas músicas para que você possa aproveitá-las mesmo
                  quando estiver sem conexão à internet.
                </Text>
                <Button
                  title="ATÉ LOGO"
                  className="mt-12"
                  onPress={() => BackHandler.exitApp()}
                />
              </View>
            )}

          {isConnected && historic.length > 0 && (
            <Section title="Tocados recentemente">
              <BoxCarousel musics={historic} />
            </Section>
          )}

          {!isConnected && handleFilterHistoricOffline.length > 0 && (
            <Section title="Tocados recentemente">
              <BoxCarousel musics={handleFilterHistoricOffline} />
            </Section>
          )}

          {!isConnected && trackListOffline.length > 0 && (
            <Section
              title="Mixes Offline"
              description="Explore mixes mesmo sem conexão à internet"
              className={`mt-14`}
            >
              <ListCarousel musics={trackListOffline.slice(0, 10)} />
            </Section>
          )}

          {isConnected && inspiredMixes.length > 0 && (
            <Section
              title={
                user.favoriteMusics
                  ? 'Mixes inspirador por'
                  : 'Explore novas possibilidades'
              }
              description={
                user.favoriteMusics
                  ? 'Descrubra faixas similiares aos seus hits favoritos'
                  : ''
              }
              className={`${historic.length > 0 && 'mt-14'}`}
            >
              <ListCarousel musics={inspiredMixes.slice(0, 15)} />
            </Section>
          )}

          {isConnected && topMusicalGenres.length > 0 && (
            <Section
              title={
                user?.favoriteGenres
                  ? 'Os seus top gêneros musicais'
                  : 'Explore por gêneros musicais'
              }
              className={`mt-14`}
            >
              <MusicalGenres musicalGenres={topMusicalGenres} />
            </Section>
          )}

          {isConnected &&
            user.favoriteArtists &&
            user.favoriteArtists.length > 0 && (
              <Section
                title={
                  user.favoriteArtists
                    ? 'Artistas que você ama'
                    : 'Explore por artistas'
                }
                className="mt-14"
              >
                <RoundedCarousel artists={favoriteArtists} />
              </Section>
            )}
        </View>
      </ScrollView>

      <View className="absolute bottom-0 w-full">
        {isCurrentMusic && <ControlCurrentMusic music={isCurrentMusic} />}
        <BottomMenu />
      </View>
    </>
  )
}
