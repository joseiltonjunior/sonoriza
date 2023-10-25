import auth from '@react-native-firebase/auth'

import { Text, TouchableOpacity, View } from 'react-native'

import { useNavigation } from '@react-navigation/native'
import { StackNavigationProps } from '@routes/routes'
import { useModal } from '@hooks/useModal'
import { useSideMenu } from '@hooks/useSideMenu'
import { useTrackPlayer } from '@hooks/useTrackPlayer'

export function SideMenu() {
  const { isVisible, handleIsVisible } = useSideMenu()

  const { openModal, closeModal } = useModal()
  const { TrackPlayer } = useTrackPlayer()

  const navigation = useNavigation<StackNavigationProps>()

  const handleSignOutApp = () => {
    TrackPlayer.reset()
    auth()
      .signOut()
      .then(() => {
        handleIsVisible()
        closeModal()
        navigation.reset({
          index: 0,
          routes: [
            {
              name: 'SignIn',
              params: undefined,
            },
          ],
        })
      })
  }

  return (
    <View
      style={{ display: isVisible ? 'flex' : 'none' }}
      className="absolute h-full w-full"
    >
      <TouchableOpacity
        className="bg-black/70 absolute w-full h-full"
        activeOpacity={1}
        onPress={() => {
          handleIsVisible()
        }}
      />
      <View className="bg-gray-950 w-10/12 flex-1 ">
        <View className="flex-row items-center border-b border-gray-400/60 p-4">
          <View className="bg-gray-200 w-16 h-16 rounded-full" />
          <View className="ml-4">
            <Text className="font-bold text-xl">User Name</Text>
            <Text className="text-xs">Sonoriza Premium</Text>
          </View>
        </View>

        <View className="p-4 pb-12 flex-1">
          <TouchableOpacity
            className="flex-row items-center"
            activeOpacity={0.6}
          >
            <View className="bg-gray-200 w-10 h-10 rounded-full" />
            <Text className="ml-2">Gerenciamento de conta</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-row items-center mt-4"
            activeOpacity={0.6}
          >
            <View className="bg-gray-200 w-10 h-10 rounded-full" />
            <Text className="ml-2">Avaliar o aplicativo</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-row items-center mt-4"
            activeOpacity={0.6}
          >
            <View className="bg-gray-200 w-10 h-10 rounded-full" />
            <Text className="ml-2">Sobre</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="ml-auto mr-auto mt-auto bg-purple-600 h-14 items-center justify-center px-6 rounded-full"
            activeOpacity={0.6}
            onPress={() => {
              openModal({
                title: 'Atenção',
                description: 'Tem certeza de que deseja sair do aplicativo?',
                twoActions: {
                  actionCancel() {
                    closeModal()
                  },
                  textCancel: 'Voltar',
                  actionConfirm() {
                    handleSignOutApp()
                  },
                  textConfirm: 'Sair',
                },
              })
            }}
          >
            <Text className="font-bold">DESCONECTAR</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}
