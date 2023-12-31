import TrackPlayer, { Event } from 'react-native-track-player'

export const PlaybackService = async function () {
  TrackPlayer.addEventListener(Event.RemotePlay, () => {
    TrackPlayer.play()
  })

  TrackPlayer.addEventListener(Event.RemoteSeek, (e) => {
    TrackPlayer.seekTo(e.position)
  })

  TrackPlayer.addEventListener(Event.RemotePause, () => {
    TrackPlayer.pause()
  })

  TrackPlayer.addEventListener(Event.RemoteNext, () => {
    TrackPlayer.skipToNext()
  })

  TrackPlayer.addEventListener(Event.RemotePrevious, () => {
    TrackPlayer.skipToPrevious()
  })

  TrackPlayer.addEventListener(Event.RemoteStop, () => {
    TrackPlayer.reset()
  })

  TrackPlayer.addEventListener(Event.PlaybackError, (error) => {
    console.log('Playback error', error)
  })
}
