import { MusicProps } from '@utils/Types/musicProps'
import { useCallback, useState } from 'react'
import TrackPlayer from 'react-native-track-player'

export function useTrackPlayer() {
  const [currentMusic, setCurrentMusic] = useState<MusicProps>()

  const getCurrentMusic = useCallback(async () => {
    const trackIndex = await TrackPlayer.getCurrentTrack()
    if (trackIndex) {
      const trackObject = await TrackPlayer.getTrack(trackIndex)

      const currentTrack = trackObject as MusicProps

      setCurrentMusic(currentTrack)
    }
  }, [])

  return { getCurrentMusic, currentMusic, TrackPlayer }
}
