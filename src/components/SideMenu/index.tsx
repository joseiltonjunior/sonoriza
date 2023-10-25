import { ReduxProps } from '@storage/index'
import {
  SideMenuProps,
  handleIsVisibleSidemenu,
} from '@storage/modules/sideMenu/reducer'

import auth from '@react-native-firebase/auth'

import { Text, TouchableOpacity, View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigation } from '@react-navigation/native'
import { StackNavigationProps } from '@routes/routes'

export function SideMenu() {
  const { isVisible } = useSelector<ReduxProps, SideMenuProps>(
    (state) => state.sideMenu,
  )

  const dispatch = useDispatch()
  const navigation = useNavigation<StackNavigationProps>()

  const handleSignOutApp = () => {
    auth()
      .signOut()
      .then(() => {
        dispatch(handleIsVisibleSidemenu({ isVisible: false }))
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
          dispatch(handleIsVisibleSidemenu({ isVisible: false }))
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
            onPress={handleSignOutApp}
          >
            <Text className="font-bold">DESCONECTAR</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}
