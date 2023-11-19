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

export function Home() {
  const [musicalGenres, setMusicalGenres] = useState<string[]>([])
  const [musics, setMusics] = useState<MusicProps[]>([])
  const [artists, setArtists] = useState<ArtistsDataProps[]>([])

  const { historic } = useSelector<ReduxProps, HistoricProps>(
    (state) => state.historic,
  )

  const { getCurrentMusic } = useTrackPlayer()

  const { handleGetFavoritesMusics, handleGetFavoritesArtists } =
    useFirebaseServices()

  const { user } = useSelector<ReduxProps, UserProps>((state) => state.user)

  const { isCurrentMusic } = useSelector<ReduxProps, CurrentMusicProps>(
    (state) => state.currentMusic,
  )

  const handleSetMusicalGenres = (musics: MusicProps[]) => {
    const filterGenres = musics.map((music) => music.genre)
    const exludeDuplicates = [...new Set(filterGenres)]
    setMusicalGenres(exludeDuplicates)
  }

  const handleGetDataUser = async (user: UserDataProps) => {
    try {
      if (user?.favoritesMusics) {
        const result = await handleGetFavoritesMusics(user.favoritesMusics)
        handleSetMusicalGenres(result)
        setMusics(result)
      }

      if (user?.favoritesArtists) {
        const result = await handleGetFavoritesArtists(user.favoritesArtists)
        setArtists(result)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const { handleIsVisible } = useSideMenu()

  const handleGetCurrentMusic = () => {
    getCurrentMusic()
  }

  useEffect(() => {
    if (user) {
      handleGetDataUser(user)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

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
      <ScrollView className="flex-1 bg-gray-950">
        <View className="p-4 flex-row items-center justify-between">
          <Text className="text-white text-3xl font-nunito-bold">Início</Text>

          <TouchableOpacity onPress={handleIsVisible} activeOpacity={0.6}>
            <Icon name="settings-outline" size={26} />
          </TouchableOpacity>
        </View>

        <View>
          {historic.length > 0 && (
            <Section title="Tocados recentemente">
              <BoxCarousel musics={historic} />
            </Section>
          )}

          {musics && (
            <Section
              title="Mixes inspirador por"
              description="Descubra faixas similares aos seus hits favoritos"
              className={`${historic.length > 0 && 'mt-14'}`}
            >
              <ListCarousel musics={musics} />
            </Section>
          )}

          {musicalGenres && (
            <Section title="Os seus top gêneros musicais" className={`mt-14`}>
              <MusicalGenres musicalGenres={musicalGenres} />
            </Section>
          )}

          {artists && (
            <Section title="Artistas que você ama" className="mt-14">
              <RoundedCarousel artists={artists} />
            </Section>
          )}
        </View>
      </ScrollView>
      {isCurrentMusic && <ControlCurrentMusic music={isCurrentMusic} />}
      <BottomMenu />
    </>
  )
}
