import auth from '@react-native-firebase/auth'

import { Image, Text, TouchableOpacity, View } from 'react-native'

import { useNavigation } from '@react-navigation/native'
import { StackNavigationProps } from '@routes/routes'
import { useModal } from '@hooks/useModal'
import { useSideMenu } from '@hooks/useSideMenu'
import { useTrackPlayer } from '@hooks/useTrackPlayer'
import { useDispatch, useSelector } from 'react-redux'
import { ReduxProps } from '@storage/index'

import Icon from 'react-native-vector-icons/FontAwesome'

import { UserProps, handleSetUser } from '@storage/modules/user/reducer'

import { Button } from './Button'

export function SideMenu() {
  const { isVisible, handleIsVisible } = useSideMenu()

  const { openModal, closeModal } = useModal()
  const { TrackPlayer } = useTrackPlayer()

  const navigation = useNavigation<StackNavigationProps>()

  const { user } = useSelector<ReduxProps, UserProps>((state) => state.user)

  const dispatch = useDispatch()

  const handleSignOutApp = () => {
    TrackPlayer.reset()
    auth()
      .signOut()
      .then(() => {
        handleIsVisible()
        dispatch(
          handleSetUser({
            user: {
              displayName: '',
              email: '',
              photoURL: '',
              plain: '',
              uid: '',
            },
          }),
        )

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
          <View className="bg-white w-16 h-16 rounded-full overflow-hidden items-center justify-center">
            {user.photoURL ? (
              <Image
                source={{ uri: user.photoURL }}
                alt="user pic"
                className="w-full h-full object-contain"
              />
            ) : (
              <Icon name="user" color={'#9ca3af'} size={35} />
            )}
          </View>

          <View className="ml-4">
            <Text className="font-nunito-bold text-xl text-white">
              {user.displayName}
            </Text>
            <Text className="text-xs font-nunito-regular text-gray-300">
              Sonoriza {user.plain === 'premium' ? 'Premium' : 'Free'}
            </Text>
          </View>
        </View>

        <View className="p-4 pb-8 flex-1">
          <Button icon="gear" title="Gerenciamento de conta" />

          <Button
            icon="thumbs-o-up"
            title="Avaliar o aplicativo"
            className="mt-5"
          />

          <Button icon="question" title="Sobre" className="mt-5" />

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
            <Text className="font-nunito-bold text-white">DESCONECTAR</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}
