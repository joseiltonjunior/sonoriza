import TrackPlayer, { Event, State } from 'react-native-track-player'
import { api } from './api'
import { setHeartbeatPlaybackActive } from './sessionHeartbeat'

const VIEW_THRESHOLD_SECONDS = 30
const MAX_NATURAL_PROGRESS_STEP_SECONDS = 2.5

type ViewSession = {
  trackId: string | null
  counted: boolean
  accumulatedSeconds: number
  lastPositionSeconds: number | null
}

const viewSession: ViewSession = {
  trackId: null,
  counted: false,
  accumulatedSeconds: 0,
  lastPositionSeconds: null,
}

function resetViewSession(trackId: string | null = null) {
  viewSession.trackId = trackId
  viewSession.counted = false
  viewSession.accumulatedSeconds = 0
  viewSession.lastPositionSeconds = null
}

async function handleRegisterMusicView(trackId: string) {
  try {
    await api.post(`/musics/${trackId}/view`)
  } catch (error) {
    console.log('Erro ao registrar view', error)
  }
}

export const PlaybackService = async function () {
  TrackPlayer.getPlaybackState()
    .then((state) => {
      const isHeartbeatState =
        state.state === State.Playing || state.state === State.Buffering

      setHeartbeatPlaybackActive(isHeartbeatState)
    })
    .catch(() => {
      setHeartbeatPlaybackActive(false)
    })

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
    resetViewSession()
    setHeartbeatPlaybackActive(false)
    TrackPlayer.reset()
  })

  TrackPlayer.addEventListener(Event.PlaybackState, ({ state }) => {
    const isHeartbeatState =
      state === State.Playing || state === State.Buffering

    setHeartbeatPlaybackActive(isHeartbeatState)
  })

  TrackPlayer.addEventListener(Event.PlaybackActiveTrackChanged, (event) => {
    const nextTrack = event.track
    const nextTrackId =
      nextTrack && typeof nextTrack.id === 'string' ? nextTrack.id : null

    resetViewSession(nextTrackId)
  })

  TrackPlayer.addEventListener(Event.PlaybackProgressUpdated, async (event) => {
    const activeTrack = await TrackPlayer.getActiveTrack()
    const trackId =
      activeTrack && typeof activeTrack.id === 'string' ? activeTrack.id : null

    if (!trackId) return

    if (viewSession.trackId !== trackId) {
      resetViewSession(trackId)
    }

    if (viewSession.counted) {
      viewSession.lastPositionSeconds = event.position
      return
    }

    if (viewSession.lastPositionSeconds == null) {
      viewSession.lastPositionSeconds = event.position
      return
    }

    const delta = event.position - viewSession.lastPositionSeconds
    viewSession.lastPositionSeconds = event.position

    if (delta <= 0) return

    // evita contar seek grande para frente como audição real
    if (delta > MAX_NATURAL_PROGRESS_STEP_SECONDS) return

    viewSession.accumulatedSeconds += delta

    if (viewSession.accumulatedSeconds >= VIEW_THRESHOLD_SECONDS) {
      viewSession.counted = true
      await handleRegisterMusicView(trackId)
    }
  })

  TrackPlayer.addEventListener(Event.PlaybackQueueEnded, () => {
    resetViewSession()
    setHeartbeatPlaybackActive(false)
  })

  TrackPlayer.addEventListener(Event.PlaybackError, (error) => {
    resetViewSession()
    setHeartbeatPlaybackActive(false)
    console.log('Playback error', error)
  })
}
