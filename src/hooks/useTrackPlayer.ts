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
import { useState } from 'react'

import TrackPlayer, {
  State,
  useProgress,
  Capability,
  Track,
  AppKilledPlaybackBehavior,
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

  const [isInitialized, setIsInitialized] = useState(false)

  const { isCurrentMusic } = useSelector<ReduxProps, CurrentMusicProps>(
    (state) => state.currentMusic,
  )

  const handleInitializePlayer = async () => {
    await TrackPlayer.setupPlayer()

    TrackPlayer.updateOptions({
      android: {
        appKilledPlaybackBehavior: AppKilledPlaybackBehavior.ContinuePlayback,
      },

      capabilities: [
        Capability.Play,
        Capability.Pause,
        Capability.SkipToNext,
        Capability.SkipToPrevious,
      ],
      compactCapabilities: [Capability.Play, Capability.Pause],
    })

    setIsInitialized(true)
  }

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
    if (!isInitialized) {
      await handleInitializePlayer()
    }

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

    await TrackPlayer.reset()
    await TrackPlayer.add(listMusics)
    await TrackPlayer.skip(indexSelected)
    await TrackPlayer.play()

    dispatch(handleSetCurrentMusic({ isCurrentMusic: musicSelected }))
    dispatch(handleChangeStateCurrentMusic(State.Playing))
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
