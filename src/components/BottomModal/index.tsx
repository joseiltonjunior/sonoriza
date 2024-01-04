import { useBottomModal } from '@hooks/useBottomModal'

import { View, Modal, TouchableOpacity } from 'react-native'

export function BottomModal() {
  const {
    closeModal,
    modalState: { visible, children },
  } = useBottomModal()

  return (
    <Modal animationType="slide" transparent visible={visible}>
      <TouchableOpacity
        activeOpacity={1}
        onPress={closeModal}
        className="h-screen w-screen bg-gray-950/60 absolute"
      />
      <View className="flex-1 ">
        <View className="mt-auto bg-gray-700 rounded-t-2xl shadow-2xl shadow-white">
          {children}
        </View>
      </View>
    </Modal>
  )
}
