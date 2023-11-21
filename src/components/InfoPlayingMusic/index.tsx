import { RoundedCarousel } from '@components/RoundedCarousel'
import { useBottomModal } from '@hooks/useBottomModal'

import { MusicProps } from '@utils/Types/musicProps'
import { Text, TouchableOpacity, View } from 'react-native'
import { useFirebaseServices } from '@hooks/useFirebaseServices'
import { useFavorites } from '@hooks/useFavorites'
import { usePlaylistModal } from '@hooks/usePlaylistModal'
import { useDispatch, useSelector } from 'react-redux'
import {
  TrackListOfflineProps,
  handleTrackListOffline,
} from '@storage/modules/trackListOffline/reducer'

import RNFS from 'react-native-fs'
import { ReduxProps } from '@storage/index'
import { useMemo } from 'react'
import { NetInfoProps } from '@storage/modules/netInfo/reducer'

interface InfoPlayingMusicProps {
  currentMusic?: MusicProps
}

export function InfoPlayingMusic({ currentMusic }: InfoPlayingMusicProps) {
  const { closeModal } = useBottomModal()
  const { openModal } = usePlaylistModal()

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
          handleTrackListOffline({
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
    } catch (error) {
      console.log('Erro ao baixar o recurso:', error)
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
                handleFavoriteMusic(currentMusic)
              }
            }}
          >
            <Text className="ml-4 font-nunito-medium text-base">
              {isFavoriteMusic
                ? 'Remover dos favoritos'
                : 'Adicionar aos favoritos'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
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
          </TouchableOpacity>
        </>
      )}

      <TouchableOpacity
        activeOpacity={0.6}
        className="flex-row px-4 py-3"
        onPress={() => {
          if (!isOffline && currentMusic) {
            downloadResource(currentMusic.url)
          }
        }}
      >
        <Text className="ml-4 font-nunito-medium text-base">
          {isOffline
            ? 'Remover da playlist offline'
            : 'Adicionar à playlist offline'}
        </Text>
      </TouchableOpacity>
    </View>
  )
}
