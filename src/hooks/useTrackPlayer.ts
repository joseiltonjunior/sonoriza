import { handleSetCurrentMusic } from '@storage/modules/currentMusic/reducer'
import { MusicProps } from '@utils/Types/musicProps'
import { useCallback } from 'react'
import TrackPlayer, { useProgress } from 'react-native-track-player'
import { useDispatch } from 'react-redux'

export function useTrackPlayer() {
  const dispatch = useDispatch()

  const getCurrentMusic = useCallback(async () => {
    const trackIndex = (await TrackPlayer.getCurrentTrack()) as number

    const trackObject = (await TrackPlayer.getTrack(trackIndex)) as MusicProps

    dispatch(handleSetCurrentMusic({ isCurrentMusic: trackObject }))
  }, [dispatch])

  return {
    getCurrentMusic,

    TrackPlayer,

    useProgress,
  }
}
