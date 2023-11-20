import { ScrollView, Text, TouchableOpacity, View } from 'react-native'

import { useSelector } from 'react-redux'

import { ReduxProps } from '@storage/index'

import { BottomMenu } from '@components/BottomMenu/Index'
import { ControlCurrentMusic } from '@components/ControlCurrentMusic'

import Icon from 'react-native-vector-icons/Ionicons'

import { useSideMenu } from '@hooks/useSideMenu'

import { BoxCarousel } from '@components/BoxCarousel'

import { CurrentMusicProps } from '@storage/modules/currentMusic/reducer'

import { RoundedCarousel } from '@components/RoundedCarousel'
import { UserProps } from '@storage/modules/user/reducer'

import { Section } from '@components/Section'

import { MusicalGenres } from '@components/MusicalGenres'
import { useEffect, useState } from 'react'

import TrackPlayer, { Event, State } from 'react-native-track-player'

import { useTrackPlayer } from '@hooks/useTrackPlayer'
import { HistoricProps } from '@storage/modules/historic/reducer'
import { ListCarousel } from '@components/ListCarousel'
import { useFirebaseServices } from '@hooks/useFirebaseServices'
import { MusicProps } from '@utils/Types/musicProps'
import { UserDataProps } from '@utils/Types/userProps'
import { ArtistsDataProps } from '@utils/Types/artistsProps'
import { ReleasesProps } from '@utils/Types/releasesProps'
import { ReleasesCarousel } from '@components/ReleasesCarousel'
import { useNetwork } from '@hooks/useNetwork'
import { TrackListOfflineProps } from '@storage/modules/trackListOffline/reducer'
import { NetInfoProps } from '@storage/modules/netInfo/reducer'

export function Home() {
  const [topMusicalGenres, setTopMusicalGenres] = useState<string[]>([])
  const [musics, setMusics] = useState<MusicProps[]>([])
  const [artists, setArtists] = useState<ArtistsDataProps[]>([])
  const [releases, setReleases] = useState<ReleasesProps[]>([])

  const { historic } = useSelector<ReduxProps, HistoricProps>(
    (state) => state.historic,
  )

  const { getCurrentMusic } = useTrackPlayer()

  const { openModalErr } = useNetwork()

  const {
    handleGetFavoritesMusics,
    handleGetFavoritesArtists,
    handleGetReleases,
  } = useFirebaseServices()

  const { user } = useSelector<ReduxProps, UserProps>((state) => state.user)

  const { isCurrentMusic } = useSelector<ReduxProps, CurrentMusicProps>(
    (state) => state.currentMusic,
  )

  const { netInfo } = useSelector<ReduxProps, NetInfoProps>(
    (state) => state.netInfo,
  )

  const { trackListOffline } = useSelector<ReduxProps, TrackListOfflineProps>(
    (state) => state.trackListOffline,
  )

  const handleTopMusicalGenres = (musics: MusicProps[]) => {
    const filterGenres = musics.map((music) => music.genre)
    const exludeDuplicates = [...new Set(filterGenres)]
    setTopMusicalGenres(exludeDuplicates)
  }

  const handleGetDataUser = async (user: UserDataProps) => {
    try {
      if (user?.favoritesMusics) {
        const result = await handleGetFavoritesMusics(user.favoritesMusics)
        handleTopMusicalGenres(result)
        setMusics(result)
      }

      if (user?.favoritesArtists) {
        const result = await handleGetFavoritesArtists(user.favoritesArtists)
        setArtists(result)
      }

      const responseReleses = await handleGetReleases()
      setReleases(responseReleses)
    } catch (error) {
      console.log(error)
    }
  }

  const { handleIsVisible } = useSideMenu()

  const handleGetCurrentMusic = () => {
    getCurrentMusic()
  }

  const handleVerifyNetInfo = async () => {
    if (user && netInfo.status) {
      handleGetDataUser(user)
    } else if (!netInfo.ignoreAlert) {
      openModalErr()
    }
  }

  useEffect(() => {
    handleVerifyNetInfo()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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

          {!netInfo.status && (
            <Section
              title="Mixes Offline"
              description="Explore mixes mesmo sem conexão à internet"
              className={`mt-14`}
            >
              <ListCarousel musics={trackListOffline.slice(0, 10)} />
            </Section>
          )}

          {musics.length > 0 && (
            <Section
              title="Mixes inspirador por"
              className={`${historic.length > 0 && 'mt-14'}`}
            >
              <ListCarousel musics={musics.slice(0, 12)} />
            </Section>
          )}

          {topMusicalGenres.length > 0 && (
            <Section title="Os seus top gêneros musicais" className={`mt-14`}>
              <MusicalGenres musicalGenres={topMusicalGenres.slice(0, 5)} />
            </Section>
          )}

          {releases.length > 0 && (
            <Section title="Lançamento para você" className={`mt-14`}>
              <ReleasesCarousel releases={releases} />
            </Section>
          )}

          {artists.length > 0 && (
            <Section title="Artistas que você ama" className="mt-14">
              <RoundedCarousel artists={artists} />
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
