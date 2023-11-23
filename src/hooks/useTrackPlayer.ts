import { useNavigation } from '@react-navigation/native'
import { StackNavigationProps } from '@routes/routes'
import { ReduxProps } from '@storage/index'
import {
  CurrentMusicProps,
  handleChangeStateCurrentMusic,
  handleSetCurrentMusic,
} from '@storage/modules/currentMusic/reducer'
import { handleSetHistoric } from '@storage/modules/historic/reducer'
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

  const handleGetQueue = async () => {
    try {
      const queue = await TrackPlayer.getQueue()
      dispatch(handleSetQueue({ queue }))
    } catch (error) {}
  }

  const handleMusicSelected = async ({
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

    const indexSelected = listMusics.findIndex(
      (item) => item.id === musicSelected.id,
    )

    dispatch(handleSetCurrentMusic({ isCurrentMusic: musicSelected }))
    dispatch(handleChangeStateCurrentMusic(State.Playing))

    await TrackPlayer.reset()
    await TrackPlayer.add(listMusics)
    await TrackPlayer.skip(indexSelected)
    await TrackPlayer.play()

    dispatch(handleSetHistoric({ music: musicSelected }))
    handleGetQueue()
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
