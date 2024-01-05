import { ReduxProps } from '@storage/index'

import { UserProps, handleSetUser } from '@storage/modules/user/reducer'
import { Image, Text, View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'

import auth from '@react-native-firebase/auth'

import Icon from 'react-native-vector-icons/Ionicons'
import colors from 'tailwindcss/colors'
import { TouchableOpacity } from 'react-native-gesture-handler'

import { useNavigation } from '@react-navigation/native'
import { StackNavigationProps } from '@routes/routes'
import { useModal } from '@hooks/useModal'
import { useTrackPlayer } from '@hooks/useTrackPlayer'

import { handleSetFavoriteMusics } from '@storage/modules/favoriteMusics/reducer'
import { setFavoriteArtists } from '@storage/modules/favoriteArtists/reducer'
import { setInspiredMixes } from '@storage/modules/inspiredMixes/reducer'
import { handleSetReleases } from '@storage/modules/releases/reducer'
import { handleClearHistoric } from '@storage/modules/historic/reducer'
import { clearSearchHistoric } from '@storage/modules/searchHistoric/reducer'
import { useSideMenu } from '@hooks/useSideMenu'
import { Button } from '@components/SideMenu/Button'

export function Profile() {
  const { user } = useSelector<ReduxProps, UserProps>((state) => state.user)

  const { openModal, closeModal } = useModal()
  const { TrackPlayer } = useTrackPlayer()

  const { handleIsVisible } = useSideMenu()

  const dispatch = useDispatch()

  const navigation = useNavigation<StackNavigationProps>()

  const handleSignOutApp = () => {
    TrackPlayer.stop()
    auth()
      .signOut()
      .then(() => {
        handleIsVisible()
        dispatch(setFavoriteArtists({ favoriteArtists: [] }))
        dispatch(handleSetFavoriteMusics({ favoriteMusics: [] }))
        dispatch(handleClearHistoric())
        dispatch(clearSearchHistoric())
        dispatch(
          setInspiredMixes({
            musics: [],
          }),
        )
        dispatch(handleSetReleases({ releases: [] }))
        dispatch(
          handleSetUser({
            user: {
              displayName: '',
              email: '',
              photoURL: '',
              plan: '',
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

  function handleRecoveryPassword() {
    if (!user.email) return

    auth()
      .sendPasswordResetEmail(user.email)
      .then(() => {
        openModal({
          title: 'Recuperação de Senha Enviada',
          description:
            'Enviamos um e-mail de recuperação de senha para você. Por favor, verifique sua caixa de entrada e siga as instruções para redefinir sua senha.',
          singleAction: {
            title: 'Entendi',
            action() {
              closeModal()
            },
          },
        })
      })
      .catch(() => {
        openModal({
          title: 'Erro ao Enviar Recuperação de Senha',
          description:
            'Ops... Encontramos um problema ao enviar o e-mail de recuperação de senha. Verifique se o endereço de e-mail fornecido é válido e tente novamente. Se o problema persistir, entre em contato com o suporte.',
          singleAction: {
            title: 'Entendi',
            action() {
              closeModal()
            },
          },
        })
      })
  }

  return (
    <View className="bg-gray-700  flex-1 p-4">
      <View className="flex-row items-center justify-between ">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          activeOpacity={0.6}
        >
          <Icon
            name="chevron-back-outline"
            size={26}
            color={colors.gray[300]}
          />
        </TouchableOpacity>

        <Text className="font-nunito-bold text-white text-base">Perfil</Text>

        <TouchableOpacity
          onPress={() => navigation.navigate('EditProfile')}
          activeOpacity={0.6}
        >
          <Icon name="create-outline" size={26} color={colors.gray[300]} />
        </TouchableOpacity>
      </View>

      <View className="items-center flex-1 mt-6">
        <View className="bg-purple-600 rounded-full w-40 h-40 items-center justify-center overflow-hidden">
          {user.photoURL ? (
            <Image
              source={{ uri: user.photoURL }}
              alt="user pic"
              className="w-full h-full object-cover"
            />
          ) : (
            <Icon name="person" size={80} color={colors.gray[200]} />
          )}
        </View>
        <Text className="font-nunito-bold text-2xl mt-4">
          {user.displayName}
        </Text>
        <Text className="font-nunito-regular">{user.email}</Text>

        <View className="border-t mt-6 pt-6 border-purple-600/60 w-full items-center px-10">
          <Button
            icon="lock-closed"
            title="Redefinir senha"
            onPress={handleRecoveryPassword}
          />
        </View>
      </View>

      <TouchableOpacity
        className="ml-auto mr-auto mb-8 bg-purple-600 h-14 items-center justify-center px-6 rounded-full"
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
  )
}
