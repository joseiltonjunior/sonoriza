import { usePlaylistModal } from '@hooks/usePlaylistModal'
import React from 'react'

import { TouchableOpacity, View, Text, Modal as ModalView } from 'react-native'

export function PlaylistModal() {
  const {
    closeModal,
    modalState: { visible },
  } = usePlaylistModal()

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

          {/* <View className="flex-row items-center h-12">
            <TextInput
              placeholderTextColor={'#9ca3af'}
              className="placeholder:text-base border border-gray-700 text-gray-700 bg-transparent flex-1 rounded-l-md pl-4"
              placeholder="Nomeie a sua playlist aqui"
            />
            <TouchableOpacity className="bg-purple-600 h-full justify-center px-2 rounded-r-md">
              <Text className="font-nunito-bold text-white">Salvar</Text>
            </TouchableOpacity>
          </View> */}

          <View className="mt-4 mb-8">
            <TouchableOpacity
              className="flex-row items-center"
              activeOpacity={0.6}
            >
              <View className="h-12 w-12 bg-white rounded-md" />
              <View className="ml-2">
                <Text className="text-white font-nunito-bold">
                  Mais queridas
                </Text>
                <Text className="text-gray-400 font-nunito-regular">
                  1 faixa
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              className="flex-row items-center mt-2"
              activeOpacity={0.6}
            >
              <View className="h-12 w-12 bg-white rounded-md" />
              <View className="ml-2">
                <Text className="text-white font-nunito-bold">Melhores</Text>
                <Text className="text-gray-400 font-nunito-regular">
                  10 faixas
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          <Text className="font-nunito-bold mb-2 text-purple-600">
            NOVA PLAYLIST
          </Text>
        </View>
      </View>
    </ModalView>
  )
}
