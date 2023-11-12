import { ScrollView, Text, TouchableOpacity, View } from 'react-native'

import { useSelector } from 'react-redux'

import { ReduxProps } from '@storage/index'

import { BottomMenu } from '@components/BottomMenu/Index'
import { ControlCurrentMusic } from '@components/ControlCurrentMusic'

import Icon from 'react-native-vector-icons/Ionicons'

import { useSideMenu } from '@hooks/useSideMenu'

import { BoxCarousel } from '@components/BoxCarousel'

import { CurrentMusicProps } from '@storage/modules/currentMusic/reducer'

import { useNavigation } from '@react-navigation/native'
import { StackNavigationProps } from '@routes/routes'

import { RoundedCarousel } from '@components/RoundedCarousel'
import { UserProps } from '@storage/modules/user/reducer'

import { Section } from '@components/Section'

import { TrackListRemoteProps } from '@storage/modules/trackListRemote/reducer'
import { ArtistsProps } from '@storage/modules/artists/reducer'
import { MusicalGenresProps } from '@storage/modules/musicalGenres/reducer'
import { MusicalGenres } from '@components/MusicalGenres'
import { useEffect } from 'react'

import TrackPlayer, { Event, State } from 'react-native-track-player'

import { useTrackPlayer } from '@hooks/useTrackPlayer'

export function Home() {
  const navigation = useNavigation<StackNavigationProps>()

  const { trackListRemote } = useSelector<ReduxProps, TrackListRemoteProps>(
    (state) => state.trackListRemote,
  )

  const { getCurrentMusic } = useTrackPlayer()

  const { user } = useSelector<ReduxProps, UserProps>((state) => state.user)

  const { isCurrentMusic } = useSelector<ReduxProps, CurrentMusicProps>(
    (state) => state.currentMusic,
  )

  const { artists } = useSelector<ReduxProps, ArtistsProps>(
    (state) => state.artists,
  )

  const { musicalGenres } = useSelector<ReduxProps, MusicalGenresProps>(
    (state) => state.musicalGenres,
  )

  const { handleIsVisible } = useSideMenu()

  const handleGetCurrentMusic = () => {
    getCurrentMusic()
  }

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

        {user.plain === 'premium' && (
          <View>
            {musicalGenres && (
              <Section title="Explore por gêneros musicais">
                <MusicalGenres musicalGenres={musicalGenres} />
              </Section>
            )}

            {trackListRemote && (
              <Section
                title="Explore novas possibilidades"
                className="mt-12"
                onPress={() =>
                  navigation.navigate('MoreMusic', {
                    type: 'default',
                    title: 'Explore novas possibilidades',
                  })
                }
              >
                <BoxCarousel musics={trackListRemote} />
              </Section>
            )}

            {artists && (
              <Section
                title="Explore por artistas"
                className="mt-12"
                onPress={() =>
                  navigation.navigate('MoreArtists', {
                    type: 'default',
                    title: 'Explore por artistas',
                  })
                }
              >
                <RoundedCarousel artists={artists} />
              </Section>
            )}
          </View>
        )}
      </ScrollView>
      {isCurrentMusic && <ControlCurrentMusic music={isCurrentMusic} />}
      <BottomMenu />
    </>
  )
}
