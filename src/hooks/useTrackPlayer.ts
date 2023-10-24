import { MusicProps } from '@utils/Types/musicProps'
import { useCallback, useState } from 'react'
import TrackPlayer, { State, useProgress } from 'react-native-track-player'

export function useTrackPlayer() {
  const [currentMusic, setCurrentMusic] = useState<MusicProps>()
  const [isPlaying, setIsPlaying] = useState(true)

  const getCurrentMusic = useCallback(async () => {
    const trackIndex = (await TrackPlayer.getCurrentTrack()) as number

    const trackObject = (await TrackPlayer.getTrack(trackIndex)) as MusicProps

    setCurrentMusic(trackObject)
  }, [])

  const getStatePlayer = useCallback(async () => {
    const state = await TrackPlayer.getState()
    if (state === State.Playing) {
      setIsPlaying(true)
    } else {
      setIsPlaying(false)
    }
  }, [])

  return {
    getCurrentMusic,
    currentMusic,
    TrackPlayer,
    isPlaying,
    getStatePlayer,
    setIsPlaying,
    useProgress,
  }
}
