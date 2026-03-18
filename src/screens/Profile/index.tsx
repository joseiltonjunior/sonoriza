import { ReduxProps } from '@storage/index'

import { UserProps, handleSetUser } from '@storage/modules/user/reducer'
import { Image, Text, View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'

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

import { Button } from '@components/SideMenu/Button'
import { useNetInfo } from '@react-native-community/netinfo'

export function Profile() {
  const { user } = useSelector<ReduxProps, UserProps>((state) => state.user)

  const { openModal, closeModal } = useModal()
  const { TrackPlayer } = useTrackPlayer()

  const { isConnected } = useNetInfo()

  const dispatch = useDispatch()

  const navigation = useNavigation<StackNavigationProps>()

  const handleSignOutApp = () => {
    TrackPlayer.stop()
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
          name: '',
          email: '',
          photoUrl: '',
          accountStatus: 'SUSPENDED',
          role: 'USER',
          id: '',
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
  }

  function handleRecoveryPassword() {
    if (!user.email) return

    console.log('recovery password')
  }

  return (
    <View className="bg-gray-700  flex-1 p-4">
      <View className="flex-row items-center justify-between mt-10">
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

        {!isConnected ? (
          <View className="w-[26px]" />
        ) : (
          <TouchableOpacity
            disabled={!isConnected}
            onPress={() => navigation.navigate('EditProfile')}
            activeOpacity={0.6}
          >
            <Icon name="create-outline" size={26} color={colors.gray[300]} />
          </TouchableOpacity>
        )}
      </View>

      <View className="items-center flex-1 mt-6">
        <View className="bg-purple-600 rounded-full w-40 h-40 items-center justify-center overflow-hidden">
          {user.photoUrl ? (
            <Image
              source={{ uri: user.photoUrl }}
              alt="user pic"
              className="w-full h-full object-cover"
            />
          ) : (
            <Icon name="person" size={80} color={colors.gray[200]} />
          )}
        </View>
        <Text className="font-nunito-bold text-2xl mt-4 text-white">
          {user.name}
        </Text>
        <Text className="font-nunito-regular text-gray-300">{user.email}</Text>

        <View className="border-t mt-6 pt-6 border-purple-600/60 w-full items-center px-10">
          {isConnected && (
            <Button
              disabled={!isConnected}
              icon="lock-closed"
              title="Redefinir senha"
              onPress={handleRecoveryPassword}
            />
          )}
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
