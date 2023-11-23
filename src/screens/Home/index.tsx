import { ScrollView, Text, TouchableOpacity, View } from 'react-native'

import { useDispatch, useSelector } from 'react-redux'

import { ReduxProps } from '@storage/index'

import { BottomMenu } from '@components/BottomMenu/Index'
import { ControlCurrentMusic } from '@components/ControlCurrentMusic'

import Icon from 'react-native-vector-icons/Ionicons'

import { useSideMenu } from '@hooks/useSideMenu'

import { BoxCarousel } from '@components/BoxCarousel'

import { CurrentMusicProps } from '@storage/modules/currentMusic/reducer'

import { RoundedCarousel } from '@components/RoundedCarousel'

import { Section } from '@components/Section'

import { MusicalGenres } from '@components/MusicalGenres'
import { useEffect, useMemo } from 'react'

import TrackPlayer, { Event, State } from 'react-native-track-player'

import { useTrackPlayer } from '@hooks/useTrackPlayer'
import { HistoricProps } from '@storage/modules/historic/reducer'
import { ListCarousel } from '@components/ListCarousel'

import { ReleasesCarousel } from '@components/ReleasesCarousel'
import { useNetwork } from '@hooks/useNetwork'
import { TrackListOfflineProps } from '@storage/modules/trackListOffline/reducer'
import {
  NetInfoProps,
  handleSetNetStatus,
} from '@storage/modules/netInfo/reducer'

import { FavoriteArtistsProps } from '@storage/modules/favoriteArtists/reducer'
import { ReleasesProps } from '@storage/modules/releases/reducer'
import { FavoriteMusicsProps } from '@storage/modules/favoriteMusics/reducer'
import { useNetInfo } from '@react-native-community/netinfo'

export function Home() {
  const { historic } = useSelector<ReduxProps, HistoricProps>(
    (state) => state.historic,
  )

  const dispatch = useDispatch()

  const { getCurrentMusic } = useTrackPlayer()

  const { openModalErrNetwork } = useNetwork()

  const { isConnected } = useNetInfo()

  const { isCurrentMusic } = useSelector<ReduxProps, CurrentMusicProps>(
    (state) => state.currentMusic,
  )

  const { ignoreAlert, status } = useSelector<ReduxProps, NetInfoProps>(
    (state) => state.netInfo,
  )

  const { favoriteArtists } = useSelector<ReduxProps, FavoriteArtistsProps>(
    (state) => state.favoriteArtists,
  )

  const { releases } = useSelector<ReduxProps, ReleasesProps>(
    (state) => state.releases,
  )

  const { favoriteMusics } = useSelector<ReduxProps, FavoriteMusicsProps>(
    (state) => state.favoriteMusics,
  )

  const { trackListOffline } = useSelector<ReduxProps, TrackListOfflineProps>(
    (state) => state.trackListOffline,
  )

  const topMusicalGenres = useMemo(() => {
    const filterGenres = favoriteMusics.map((music) => music.genre)
    const excludeDuplicates = [...new Set(filterGenres)]

    return excludeDuplicates
  }, [favoriteMusics])

  const { handleIsVisible } = useSideMenu()

  const handleGetCurrentMusic = () => {
    getCurrentMusic()
  }

  useEffect(() => {
    if (isConnected === null) return
    if (isConnected) {
      dispatch(handleSetNetStatus(true))
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

  return (
    <>
      <ScrollView className="bg-gray-700">
        <View className="p-4 flex-row items-center justify-between">
          <Text className="text-white text-3xl font-nunito-bold">Início</Text>

          <TouchableOpacity onPress={handleIsVisible} activeOpacity={0.6}>
            <Icon name="settings-outline" size={26} />
          </TouchableOpacity>
        </View>

        <View className="pb-32">
          {historic.length > 0 && (
            <Section title="Tocados recentemente">
              <BoxCarousel musics={historic} />
            </Section>
          )}

          {!status && (
            <Section
              title="Mixes Offline"
              description="Explore mixes mesmo sem conexão à internet"
              className={`mt-14`}
            >
              <ListCarousel musics={trackListOffline.slice(0, 10)} />
            </Section>
          )}

          {status && favoriteMusics.length > 0 && (
            <Section
              title="Mixes inspirador por"
              className={`${historic.length > 0 && 'mt-14'}`}
            >
              <ListCarousel musics={favoriteMusics.slice(0, 9)} />
            </Section>
          )}

          {status && topMusicalGenres.length > 0 && (
            <Section title="Os seus top gêneros musicais" className={`mt-14`}>
              <MusicalGenres musicalGenres={topMusicalGenres.slice(0, 5)} />
            </Section>
          )}

          {status && releases.length > 0 && (
            <Section title="Lançamento para você" className={`mt-14`}>
              <ReleasesCarousel releases={releases} />
            </Section>
          )}

          {status && favoriteArtists.length > 0 && (
            <Section title="Artistas que você ama" className="mt-14">
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
