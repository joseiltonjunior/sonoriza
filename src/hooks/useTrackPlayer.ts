import { useNavigation } from '@react-navigation/native'
import { StackNavigationProps } from '@routes/routes'
import { ReduxProps } from '@storage/index'
import {
  CurrentMusicProps,
  handleChangeStateCurrentMusic,
  handleSetCurrentMusic,
} from '@storage/modules/currentMusic/reducer'
import { handleSetQueue } from '@storage/modules/queue/reducer'
import { MusicProps } from '@utils/Types/musicProps'

import TrackPlayer, {
  State,
  useProgress,
  Capability,
  Track,
} from 'react-native-track-player'
import { useDispatch, useSelector } from 'react-redux'

export type TrackProps = Track

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

  const getCurrentMusic = async () => {
    try {
      const currentMusic = await TrackPlayer.getActiveTrack()

      const isCurrentMusic = currentMusic as MusicProps
      dispatch(handleSetCurrentMusic({ isCurrentMusic }))

      const State = await TrackPlayer.getPlaybackState()
      dispatch(handleChangeStateCurrentMusic(State.state))

      const queue = await TrackPlayer.getQueue()
      dispatch(handleSetQueue({ queue }))
    } catch (error) {}
  }

  const handleMusicSelected = async ({
    indexSelected,
    listMusics,
    musicSelected,
  }: HandleMusicSelectedProps) => {
    if (
      isCurrentMusic?.title &&
      isCurrentMusic.title.includes(musicSelected.title)
    ) {
      navigation.navigate('Music')
      await TrackPlayer.play()

      return
    }

    await TrackPlayer.reset()
    await TrackPlayer.add(listMusics)
    await TrackPlayer.skip(indexSelected)
    await TrackPlayer.play()
    dispatch(handleSetCurrentMusic({ isCurrentMusic: musicSelected }))
  }

  return {
    getCurrentMusic,
    TrackPlayer,
    handleMusicSelected,
    useProgress,
    Capability,
    State,
  }
}
