import { useCallback, useEffect } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'

import { useDispatch, useSelector } from 'react-redux'

import { ReduxProps } from '@storage/index'

import firestore from '@react-native-firebase/firestore'
import crashlytics from '@react-native-firebase/crashlytics'

import {
  MusicPlayerSettingsProps,
  handleInitializedMusicPlayer,
} from '@storage/modules/musicPlayerSettings/reducer'
import { BottomMenu } from '@components/BottomMenu/Index'
import { ControlCurrentMusic } from '@components/ControlCurrentMusic'
import { useTrackPlayer } from '@hooks/useTrackPlayer'

import IconAnt from 'react-native-vector-icons/AntDesign'

import { useSideMenu } from '@hooks/useSideMenu'
import { MusicProps } from '@utils/Types/musicProps'

import { ConfigProps } from '@storage/modules/config/reducer'
import { BoxCarousel } from '@components/BoxCarousel'
import { TrackListLocalProps } from '@storage/modules/trackListLocal/reducer'
import {
  TrackListRemoteProps,
  handleTrackListRemote,
} from '@storage/modules/trackListRemote/reducer'
import { CurrentMusicProps } from '@storage/modules/currentMusic/reducer'

export function Home() {
  const dispatch = useDispatch()

  const { isInitialized } = useSelector<ReduxProps, MusicPlayerSettingsProps>(
    (state) => state.musicPlayerSettings,
  )

  const { trackListLocal } = useSelector<ReduxProps, TrackListLocalProps>(
    (state) => state.trackListLocal,
  )

  const { isCurrentMusic } = useSelector<ReduxProps, CurrentMusicProps>(
    (state) => state.currentMusic,
  )

  const { trackListRemote } = useSelector<ReduxProps, TrackListRemoteProps>(
    (state) => state.trackListRemote,
  )

  const { config } = useSelector<ReduxProps, ConfigProps>(
    (state) => state.config,
  )

  const { handleIsVisible } = useSideMenu()

  const { getCurrentMusic, TrackPlayer } = useTrackPlayer()

  const handleInitializePlayer = useCallback(async () => {
    await TrackPlayer.setupPlayer()
      .then(async () => {
        dispatch(handleInitializedMusicPlayer({ isInitialized: true }))
      })
      .catch((err) => console.error(err))
  }, [TrackPlayer, dispatch])

  const handleGetMusicsDatabase = useCallback(async () => {
    await firestore()
      .collection('musics')
      .get()
      .then(async (querySnapshot) => {
        const musicsResponse = querySnapshot.docs.map((doc) => ({
          url: doc.data().url,
          artwork: doc.data().artwork,
          artist: doc.data().artist,
          title: doc.data().title,
        })) as MusicProps[]

        dispatch(handleTrackListRemote({ trackListRemote: musicsResponse }))
      })
      .catch((err) => {
        crashlytics().recordError(err)
      })
  }, [dispatch])

  useEffect(() => {
    if (isInitialized) {
      getCurrentMusic()
    }
  }, [getCurrentMusic, isInitialized])

  useEffect(() => {
    if (config.isExplorer && trackListRemote.length === 0) {
      handleGetMusicsDatabase()
    }
  }, [config.isExplorer, handleGetMusicsDatabase, trackListRemote.length])

  useEffect(() => {
    if (!isInitialized) {
      handleInitializePlayer()
    }
  }, [handleInitializePlayer, isInitialized])

  return (
    <>
      <View className="flex-1 bg-gray-950">
        <View className="p-4 flex-row items-center justify-between">
          <Text className="text-white text-2xl font-baloo-bold">Início</Text>
          <TouchableOpacity onPress={handleIsVisible} activeOpacity={0.6}>
            <IconAnt name="setting" size={26} />
          </TouchableOpacity>
        </View>

        <View className="px-4">
          {config.isExplorer && trackListRemote.length > 0 && (
            <>
              <View className="flex-row items-center justify-between mb-3">
                <Text className="text-base font-bold text-white">
                  Explore novas possibilidades
                </Text>
                <TouchableOpacity activeOpacity={0.6}>
                  <Text className="text-gray-300">Ver mais</Text>
                </TouchableOpacity>
              </View>
              <BoxCarousel
                musics={trackListRemote}
                currentMusic={isCurrentMusic}
              />
            </>
          )}

          {config.isLocal && trackListLocal.length > 0 && (
            <>
              <View className="flex-row items-center justify-between mt-8 mb-3">
                <Text className="text-base font-bold text-white">
                  Suas músicas locais
                </Text>
                <TouchableOpacity activeOpacity={0.6}>
                  <Text className="text-gray-300">Ver mais</Text>
                </TouchableOpacity>
              </View>

              <BoxCarousel
                musics={trackListLocal}
                currentMusic={isCurrentMusic}
              />
            </>
          )}
        </View>
      </View>
      {isCurrentMusic && <ControlCurrentMusic music={isCurrentMusic} />}
      <BottomMenu />
    </>
  )
}
