import { usePlaylistModal } from '@hooks/usePlaylistModal'
import { ReduxProps } from '@storage/index'
import { UserProps } from '@storage/modules/user/reducer'
import React, { useMemo } from 'react'

import Icon from 'react-native-vector-icons/Ionicons'

import { TouchableOpacity, View, Text, Modal as ModalView } from 'react-native'
import { useSelector } from 'react-redux'
import colors from 'tailwindcss/colors'
import { useFirebaseServices } from '@hooks/useFirebaseServices'
import { useNavigation } from '@react-navigation/native'
import { StackNavigationProps } from '@routes/routes'

export function PlaylistModal() {
  const {
    closeModal,
    modalState: { visible, music },
  } = usePlaylistModal()

  const { handleFavoriteMusic } = useFirebaseServices()
  const navigation = useNavigation<StackNavigationProps>()

  const { user } = useSelector<ReduxProps, UserProps>((state) => state.user)

  const handleUserFavoriteTracks = useMemo(() => {
    const favorites = user.favoritesMusics

    if (!favorites) return ''

    if (favorites.length > 1) {
      return `${favorites?.length} faixas`
    }

    return `${favorites?.length} faixa`
  }, [user.favoritesMusics])

  return (
    <ModalView animationType="slide" transparent visible={visible}>
      <TouchableOpacity
        activeOpacity={1}
        onPress={closeModal}
        className="h-full w-screen bg-gray-950/80 absolute"
      />

      <View className="flex-1 justify-center p-4">
        <View className="bg-gray-950 rounded-md p-4">
          <Text className="font-nunito-bold text-base mb-2 text-white">
            Escolher uma playlist
          </Text>

          <View className="mt-4 mb-8">
            <TouchableOpacity
              className="flex-row items-center"
              activeOpacity={0.6}
              onPress={() => {
                if (music) {
                  handleFavoriteMusic(music)
                  closeModal()
                }
              }}
            >
              <View className="h-12 w-12 bg-white rounded-md items-center justify-center">
                <Icon name="heart" color={colors.purple[600]} size={28} />
              </View>
              <View className="ml-2">
                <Text className="text-white font-nunito-bold">
                  Mais queridas
                </Text>
                <Text className="text-gray-400 font-nunito-regular">
                  {handleUserFavoriteTracks}
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            activeOpacity={0.6}
            onPress={() => {
              if (music) {
                navigation.navigate('NewPlaylist', music)
                closeModal()
              }
            }}
          >
            <Text className="font-nunito-bold mb-2 text-purple-600">
              NOVA PLAYLIST
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ModalView>
  )
}
