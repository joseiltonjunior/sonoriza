import { usePlaylistModal } from '@hooks/usePlaylistModal'
import { ReduxProps } from '@storage/index'
import { UserProps } from '@storage/modules/user/reducer'
import React, { useCallback, useEffect, useMemo, useState } from 'react'

import Icon from 'react-native-vector-icons/Ionicons'

import {
  TouchableOpacity,
  View,
  Text,
  Modal as ModalView,
  FlatList,
  ImageBackground,
} from 'react-native'
import { useSelector } from 'react-redux'
import colors from 'tailwindcss/colors'

import { useNavigation } from '@react-navigation/native'
import { StackNavigationProps } from '@routes/routes'
import { PlaylistProps } from '@utils/Types/playlistProps'

export function PlaylistModal() {
  const [playlists, setPlaylists] = useState<PlaylistProps[]>([])

  const {
    closeModal,
    modalState: { visible, music },
  } = usePlaylistModal()

  const navigation = useNavigation<StackNavigationProps>()
  const { user } = useSelector<ReduxProps, UserProps>((state) => state.user)

  // const handleSearchMyPlaylists = useMemo(async () => {
  //   const playlist = user.playlists ?? []

  //   setPlaylists(playlist)
  // }, [])

  const handleUserFavoriteTracks = (musics: number) => {
    if (musics > 1) {
      return `${musics} faixas`
    }

    return `${musics} faixa`
  }

  // useEffect(() => {
  //   handleSearchMyPlaylists()
  // }, [visible])

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
                  // handleFavoriteMusic(music)
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
                  {handleUserFavoriteTracks(user.favoritesMusics?.length ?? 0)}
                </Text>
              </View>
            </TouchableOpacity>
            <FlatList
              className="mt-2"
              keyExtractor={(item) => item.id}
              data={playlists}
              ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
              renderItem={({ item }) => (
                <TouchableOpacity
                  className="flex-row items-center"
                  activeOpacity={0.6}
                  onPress={() => {
                    if (music) {
                      // handleFavoriteMusic(music)
                      closeModal()
                    }
                  }}
                >
                  <View className="h-12 w-12 bg-white rounded-md items-center justify-center overflow-hidden">
                    <ImageBackground
                      className="h-12 w-12"
                      source={{ uri: item.artworkURL }}
                      width={28}
                      height={28}
                    />
                  </View>
                  <View className="ml-2">
                    <Text className="text-white font-nunito-bold">
                      {item.title}
                    </Text>
                    <Text className="text-gray-400 font-nunito-regular">
                      {handleUserFavoriteTracks(item.musics?.length ?? 0)}
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
            />
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
