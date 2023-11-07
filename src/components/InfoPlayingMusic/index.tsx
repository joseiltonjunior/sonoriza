import { RoundedCarousel } from '@components/RoundedCarousel'
import { useBottomModal } from '@hooks/useBottomModal'

import { MusicProps } from '@utils/Types/musicProps'
import { Text, TouchableOpacity, View } from 'react-native'
import { useFirebaseServices } from '@hooks/useFirebaseServices'
import { useFavorites } from '@hooks/useFavorites'
import { usePlaylistModal } from '@hooks/usePlaylistModal'

interface InfoPlayingMusicProps {
  currentMusic?: MusicProps
}

export function InfoPlayingMusic({ currentMusic }: InfoPlayingMusicProps) {
  const { closeModal } = useBottomModal()
  const { openModal } = usePlaylistModal()

  const { handleFavoriteMusic } = useFirebaseServices()

  const { isFavoriteMusic } = useFavorites()

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
    </View>
  )
}
