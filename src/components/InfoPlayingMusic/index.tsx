import { RoundedCarousel } from '@components/RoundedCarousel'
import { useBottomModal } from '@hooks/useBottomModal'

import { MusicProps } from '@utils/Types/musicProps'
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native'
import { useFirebaseServices } from '@hooks/useFirebaseServices'
import { useFavorites } from '@hooks/useFavorites'
// import { usePlaylistModal } from '@hooks/usePlaylistModal'
import { useDispatch, useSelector } from 'react-redux'
import {
  TrackListOfflineProps,
  removeTrackOffline,
  setTrackListOffline,
} from '@storage/modules/trackListOffline/reducer'

import RNFS from 'react-native-fs'
import { ReduxProps } from '@storage/index'
import { useMemo, useState } from 'react'
import { NetInfoProps } from '@storage/modules/netInfo/reducer'
import colors from 'tailwindcss/colors'

interface InfoPlayingMusicProps {
  currentMusic?: MusicProps
  isCloseModal?: boolean
}

export function InfoPlayingMusic({
  currentMusic,
  isCloseModal,
}: InfoPlayingMusicProps) {
  const [isLoading, setIsLoading] = useState(false)

  const { closeModal } = useBottomModal()

  const { trackListOffline } = useSelector<ReduxProps, TrackListOfflineProps>(
    (state) => state.trackListOffline,
  )

  const { status } = useSelector<ReduxProps, NetInfoProps>(
    (state) => state.netInfo,
  )

  const { handleFavoriteMusic } = useFirebaseServices()

  const { isFavoriteMusic } = useFavorites()

  const dispatch = useDispatch()

  async function downloadResource(url: string) {
    if (!currentMusic) return

    setIsLoading(true)

    try {
      const filePath = `${RNFS.DocumentDirectoryPath}/${currentMusic.title
        .replaceAll(' ', '-')
        .replace('.', '')
        .toLowerCase()}.mp3`

      const response = RNFS.downloadFile({
        fromUrl: url,
        toFile: filePath,
      })

      await response.promise

      if ((await response.promise).statusCode === 200) {
        dispatch(
          setTrackListOffline({
            newMusic: { ...currentMusic, url: `file://${filePath}` },
          }),
        )
      } else {
        console.log(
          `Erro ao baixar o recurso. Código de status: ${
            (await response.promise).statusCode
          }`,
        )
      }

      setIsLoading(false)
    } catch (error) {
      setIsLoading(false)
      console.log('Erro ao baixar o recurso:', error)
    }
  }

  async function removeDownload(music: MusicProps) {
    const pathWithoutFileScheme = music.url.replace('file://', '')
    setIsLoading(true)

    try {
      await RNFS.unlink(pathWithoutFileScheme)
      dispatch(removeTrackOffline({ newMusic: music }))
      setIsLoading(false)
    } catch (error) {
      setIsLoading(false)
      console.log('Erro ao remover o download:', error)
    }
  }

  const isOffline = useMemo(() => {
    const find = trackListOffline.find((item) => item.id === currentMusic?.id)

    return find
  }, [currentMusic?.id, trackListOffline])

  return (
    <View className="py-4">
      <View className="px-4">
        <Text
          className="text-center text-white font-nunito-bold text-lg"
          numberOfLines={1}
        >
          {currentMusic?.title}
        </Text>
        <Text className="text-center font-nunito-regular text-gray-200">
          {currentMusic?.album}
        </Text>
      </View>
      <View className="py-4 border-b border-gray-300/10">
        {currentMusic?.artists && (
          <RoundedCarousel
            artists={currentMusic.artists}
            roundedSmall
            onAction={closeModal}
          />
        )}
      </View>

      {status && (
        <>
          <TouchableOpacity
            activeOpacity={0.6}
            className="flex-row px-4 py-3"
            onPress={() => {
              if (currentMusic) {
                if (isCloseModal) closeModal()
                handleFavoriteMusic(currentMusic)
              }
            }}
          >
            <Text className="ml-4 font-nunito-medium text-base text-gray-300">
              {isFavoriteMusic
                ? 'Remover dos favoritos'
                : 'Adicionar aos favoritos'}
            </Text>
          </TouchableOpacity>

          {/* <TouchableOpacity
            activeOpacity={0.6}
            className="flex-row px-4 py-3"
            onPress={() => {
              closeModal()
              openModal()
            }}
          >
            <Text className="ml-4 font-nunito-medium text-base">
              Adicionar à playlist
            </Text>
          </TouchableOpacity> */}
        </>
      )}

      <TouchableOpacity
        activeOpacity={0.6}
        className="flex-row px-4 py-3"
        onPress={() => {
          if (!isOffline && currentMusic) {
            downloadResource(currentMusic.url)
          } else if (isOffline) {
            removeDownload(isOffline)
          }
        }}
      >
        <View className="flex-row items-center justify-between flex-1">
          <Text className="ml-4 font-nunito-medium text-base text-gray-300">
            {isOffline
              ? 'Remover da playlist offline'
              : 'Adicionar à playlist offline'}
          </Text>
          {isLoading && <ActivityIndicator color={colors.purple[600]} />}
        </View>
      </TouchableOpacity>
    </View>
  )
}
