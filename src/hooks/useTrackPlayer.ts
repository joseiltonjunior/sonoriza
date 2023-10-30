import { useNavigation } from '@react-navigation/native'
import { StackNavigationProps } from '@routes/routes'
import { ReduxProps } from '@storage/index'
import {
  CurrentMusicProps,
  handleChangeStateCurrentMusic,
  handleSetCurrentMusic,
} from '@storage/modules/currentMusic/reducer'
import { MusicProps } from '@utils/Types/musicProps'
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

    const trackObject = (await TrackPlayer.getTrack(trackIndex)) as MusicProps

    dispatch(handleSetCurrentMusic({ isCurrentMusic: trackObject }))
  }, [dispatch])

  const handleMusicSelected = useCallback(
    async ({
      indexSelected,
      listMusics,
      musicSelected,
    }: HandleMusicSelectedProps) => {
      if (isCurrentMusic?.title === musicSelected.title) {
        navigation.navigate('Music')
        return
      }

      TrackPlayer.reset()
      TrackPlayer.add(listMusics)
      TrackPlayer.skip(indexSelected)
      TrackPlayer.play()
      navigation.navigate('Music')
      dispatch(handleSetCurrentMusic({ isCurrentMusic: musicSelected }))
      dispatch(handleChangeStateCurrentMusic(State.Playing))
    },
    [isCurrentMusic?.title, dispatch, navigation],
  )

  return {
    getCurrentMusic,

    TrackPlayer,
    handleMusicSelected,
    useProgress,
  }
}
