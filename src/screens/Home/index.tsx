import { ScrollView, Text, View, Dimensions, BackHandler } from 'react-native'
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
import { useCallback, useEffect, useMemo } from 'react'

import TrackPlayer, { Event, State } from 'react-native-track-player'

import { useTrackPlayer } from '@hooks/useTrackPlayer'
import { HistoricProps } from '@storage/modules/historic/reducer'
import { ListCarousel } from '@components/ListCarousel'

import { useNetwork } from '@hooks/useNetwork'
import { TrackListOfflineProps } from '@storage/modules/trackListOffline/reducer'

import { useNetInfo } from '@react-native-community/netinfo'
import { UserProps } from '@storage/modules/user/reducer'
import { useFirebaseServices } from '@hooks/useFirebaseServices'

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

export function Home() {
  const { historic } = useSelector<ReduxProps, HistoricProps>(
    (state) => state.historic,
  )

  const size = Dimensions.get('window').width * 0.7

  const dispatch = useDispatch()

  const { getCurrentMusic } = useTrackPlayer()

  const {
    handleGetFavoritesMusics,
    handleGetFavoritesArtists,
    handleGetReleases,
    handleGetInspiredMixes,
    handleGetMusicsNewUser,
    handleGetArtistsNewUser,
    handleGetNotifications,
  } = useFirebaseServices()

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

  const topMusicalGenres = useMemo(() => {
    const filterGenres = shuffleArray(
      favoriteMusics.map((music) => music.genre),
    )

    const excludeDuplicates = [...new Set(filterGenres)]

    return excludeDuplicates.slice(0, 5)
  }, [favoriteMusics])

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
        let musics = [] as MusicProps[]

        if (user?.favoritesMusics && user.favoritesMusics) {
          const result = await handleGetFavoritesMusics(user.favoritesMusics)
          musics = result
          dispatch(handleSetFavoriteMusics({ favoriteMusics: result }))
        } else {
          const result = await handleGetMusicsNewUser()
          musics = result
          dispatch(handleSetFavoriteMusics({ favoriteMusics: result }))
        }

        if (user?.favoritesArtists) {
          const result = await handleGetFavoritesArtists(user.favoritesArtists)

          dispatch(setFavoriteArtists({ favoriteArtists: result }))
        } else {
          const result = await handleGetArtistsNewUser()

          dispatch(setFavoriteArtists({ favoriteArtists: result }))
        }

        const excludesMusics = musics.map((item) => item.id)

        const filterGenres = shuffleArray(musics.map((music) => music.genre))

        const excludeGenres = [...new Set(filterGenres)]

        const responseInspiredMixes = await handleGetInspiredMixes(
          excludeGenres,
          excludesMusics,
        )

        dispatch(
          setInspiredMixes({
            musics: responseInspiredMixes,
          }),
        )

        const responseReleses = await handleGetReleases()

        dispatch(handleSetReleases({ releases: responseReleses }))

        dispatch(handleSetNetStatus(true))
      } else {
        dispatch(handleSetNetStatus(false))
      }
    } catch (error) {
      console.log(error)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    dispatch,
    favoriteMusics,
    isConnected,
    topMusicalGenres,
    user.favoritesArtists,
    user.favoritesMusics,
  ])

  const handleFetchNoticationsDB = useCallback(async () => {
    await handleGetNotifications()
      .then((response) => {
        if (JSON.stringify(response) !== JSON.stringify(notifications)) {
          dispatch(setNewsNotifications({ newsNotifications: true }))
        }

        dispatch(setNotification({ notifications: response }))
      })
      .catch((err) => console.log(err, 'err'))
  }, [dispatch, handleGetNotifications, notifications])

  useEffect(() => {
    if (isConnected === null) return
    if (isConnected) {
      handleFetchNoticationsDB()
      handleGetDataUser()
    } else if (!isConnected) {
      dispatch(handleSetNetStatus(false))
      if (!ignoreAlert) {
        openModalErrNetwork()
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async () => {
      handleFetchNoticationsDB()
    })

    return unsubscribe
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (user.plan === 'free') {
    return (
      <View className="bg-gray-700 flex-1 items-center justify-center p-8">
        <AnimatedLottieView
          source={splash}
          autoPlay
          resizeMode="contain"
          style={{ width: size, height: size }}
        />
        <Text className="font-nunito-bold text-lg text-white text-center">
          Acesso não autorizado. Por favor, regularize o seu plano para
          continuar.
        </Text>
        <Button
          title="Sair da aplicação"
          className="mt-8 rounded-md w-full"
          onPress={() => {
            BackHandler.exitApp()
          }}
        />
      </View>
    )
  }

  return (
    <>
      <ScrollView className="bg-gray-700" showsVerticalScrollIndicator={false}>
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
                user.favoritesMusics
                  ? 'Mixes inspirador por'
                  : 'Explore novas possibilidades'
              }
              description={
                user.favoritesMusics
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
                user?.favoritesMusics
                  ? 'Os seus top gêneros musicais'
                  : 'Explore por gêneros musicais'
              }
              className={`mt-14`}
            >
              <MusicalGenres musicalGenres={topMusicalGenres} />
            </Section>
          )}

          {/* {isConnected && releases.length > 0 && (
            <Section title="Lançamento para você" className={`mt-14`}>
              <ReleasesCarousel releases={releases} />
            </Section>
          )} */}

          {isConnected && favoriteArtists.length > 0 && (
            <Section
              title={
                user.favoritesArtists
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
