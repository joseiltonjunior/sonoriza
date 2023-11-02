import { useNavigation } from '@react-navigation/native'
import { StackNavigationProps } from '@routes/routes'
import { ReduxProps } from '@storage/index'
import {
  CurrentMusicProps,
  handleChangeStateCurrentMusic,
  handleSetCurrentMusic,
} from '@storage/modules/currentMusic/reducer'
import { MusicProps, TrackPlayerMusicProps } from '@utils/Types/musicProps'
import { useCallback } from 'react'
import TrackPlayer, { State, useProgress } from 'react-native-track-player'
import { useDispatch, useSelector } from 'react-redux'

interface HandleMusicSelectedProps {
  musicSelected: MusicProps
  indexSelected: number
  listMusics: MusicProps[]
}

export function useTrackPlayer() {
  const dispatch = useDispatch()
  const navigation = useNavigation<StackNavigationProps>()

  const { isCurrentMusic } = useSelector<ReduxProps, CurrentMusicProps>(
    (state) => state.currentMusic,
  )

  const getCurrentMusic = useCallback(async () => {
    const trackIndex = (await TrackPlayer.getCurrentTrack()) as number

    const trackObject = (await TrackPlayer.getTrack(
      trackIndex,
    )) as TrackPlayerMusicProps

    if (!trackObject) return

    dispatch(handleSetCurrentMusic({ isCurrentMusic: trackObject }))
  }, [dispatch])

  const handleMusicSelected = useCallback(
    async ({
      indexSelected,
      listMusics,
      musicSelected,
    }: HandleMusicSelectedProps) => {
      if (isCurrentMusic?.title.includes(musicSelected.title)) {
        navigation.navigate('Music')
        return
      }

      const { artists, genres, ...rest } = musicSelected

      const currentTrackPlayerMusic = {
        ...rest,
        artist: artists[0].name,
        genre: genres[0],
      }

      const trackPlayerMusics = listMusics.map(
        ({ artists, genres, ...rest }) => ({
          ...rest,
          artist: artists[0].name,
          genre: genres[0],
        }),
      )

      TrackPlayer.reset()
      TrackPlayer.add(trackPlayerMusics)
      TrackPlayer.skip(indexSelected)
      TrackPlayer.play()
      navigation.navigate('Music')
      dispatch(
        handleSetCurrentMusic({ isCurrentMusic: currentTrackPlayerMusic }),
      )
      dispatch(handleChangeStateCurrentMusic(State.Playing))
    },
    [dispatch, isCurrentMusic?.title, navigation],
  )

  return {
    getCurrentMusic,
    TrackPlayer,
    handleMusicSelected,
    useProgress,
  }
}
