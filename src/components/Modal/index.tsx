import { useModal } from '@hooks/useModal'
import React from 'react'
import { TouchableOpacity, View, Text, Modal as ModalView } from 'react-native'

export function Modal() {
  const {
    closeModal,
    modalState: { visible, description, title, singleAction, twoActions },
  } = useModal()

  return (
    <ModalView animationType="slide" transparent visible={visible}>
      <TouchableOpacity
        activeOpacity={1}
        onPress={closeModal}
        className="h-full w-screen bg-gray-950/80 absolute"
      />

      <View className="flex-1 justify-center p-4">
        <View className="bg-gray-100 rounded-lg p-4">
          <Text className="font-bold text-purple-600 text-xl text-center">
            {title}
          </Text>
          <Text className="text-gray-700 font-medium text-base mt-4 text-center">
            {description}
          </Text>

          <View className="flex-row mt-8">
            {twoActions && (
              <>
                <TouchableOpacity
                  activeOpacity={0.6}
                  onPress={twoActions.actionConfirm}
                  className="flex-1 border border-purple-600 h-12 rounded-lg items-center justify-center"
                >
                  <Text className="text-purple-600 font-bold">
                    {twoActions.textConfirm.toUpperCase()}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.6}
                  onPress={twoActions.actionCancel}
                  className="flex-1 bg-purple-600 h-12 rounded-lg items-center justify-center ml-4"
                >
                  <Text className="text-white font-bold">
                    {twoActions.textCancel.toUpperCase()}
                  </Text>
                </TouchableOpacity>
              </>
            )}

            {singleAction && (
              <TouchableOpacity
                activeOpacity={0.6}
                onPress={singleAction.action}
                className="flex-1 bg-purple-600 h-12 rounded-lg items-center justify-center"
              >
                <Text className="text-white font-bold text-base">
                  {singleAction.title.toUpperCase()}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </ModalView>
  )
}
