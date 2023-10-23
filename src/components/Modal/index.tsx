import React from 'react'
import {
  TouchableOpacity,
  View,
  ViewProps,
  Text,
  TouchableHighlight,
  Modal,
} from 'react-native'

import colors from 'tailwindcss/colors'

interface ModalProps extends ViewProps {
  show: boolean
  title: string
  description: string

  singleAction?: {
    title: string
    action(): void
  }

  twoActions?: {
    textCancel: string
    actionCancel(): void
    textConfirm: string
    actionConfirm(): void
  }
}

export function ModalCustom({
  show,
  title,
  description,
  twoActions,
  singleAction,
}: ModalProps) {
  return (
    <Modal animationType="slide" transparent visible={show}>
      <View className="flex-1 bg-gray-950/80 justify-center items-center p-4">
        <View className="bg-gray-700 w-full rounded-2xl p-4">
          <Text className="font-bold text-white text-lg text-center">
            {title}
          </Text>
          <Text className="text-gray-400 font-medium text-base mt-4 text-center">
            {description}
          </Text>

          <View className="flex-row mt-8">
            {twoActions && (
              <>
                <TouchableHighlight
                  underlayColor={colors.red[800]}
                  onPress={twoActions.actionCancel}
                  className="flex-1 bg-red-600 h-12 rounded-lg items-center justify-center"
                >
                  <Text className="text-white font-bold text-base">
                    {twoActions.textCancel}
                  </Text>
                </TouchableHighlight>

                <TouchableHighlight
                  underlayColor={colors.green[800]}
                  onPress={twoActions.actionConfirm}
                  className="flex-1 bg-green-600 h-12 rounded-lg items-center justify-center ml-2"
                >
                  <Text className="text-white font-bold text-base">
                    {twoActions.textConfirm}
                  </Text>
                </TouchableHighlight>
              </>
            )}

            {singleAction && (
              <TouchableOpacity
                onPress={singleAction.action}
                className="flex-1 bg-purple-600 h-12 rounded-lg items-center justify-center"
              >
                <Text className="text-white font-bold text-base">
                  {singleAction.title}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </Modal>
  )
}
