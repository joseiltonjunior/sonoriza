import { Image, Linking, Text, TouchableOpacity, View } from 'react-native'

import { useNavigation } from '@react-navigation/native'
import { StackNavigationProps } from '@routes/routes'

import { useSideMenu } from '@hooks/useSideMenu'

import { useSelector } from 'react-redux'
import { ReduxProps } from '@storage/index'

import Icon from 'react-native-vector-icons/Ionicons'

import { UserProps } from '@storage/modules/user/reducer'

import { Button } from './Button'
import { useCallback } from 'react'
import { useModal } from '@hooks/useModal'

export function SideMenu() {
  const { isVisible, handleIsVisible } = useSideMenu()

  const { openModal, closeModal } = useModal()

  const navigation = useNavigation<StackNavigationProps>()

  const { user } = useSelector<ReduxProps, UserProps>((state) => state.user)

  const handleOpenSonorizaTV = useCallback(async () => {
    const url = `https://sonoriza-tv.vercel.app/`

    const supported = await Linking.canOpenURL(url)

    if (supported) {
      await Linking.openURL(url)
    } else {
      openModal({
        title: 'Atenção',
        description:
          'Desculpe, não foi possível abrir o link neste momento. Por favor, tente novamente.',
        singleAction: {
          action() {
            closeModal()
          },
          title: 'OK',
        },
      })
    }
  }, [closeModal, openModal])

  const handleOpenSonorizaInstagram = useCallback(async () => {
    const url = `https://www.instagram.com/co.sonoriza/`

    const supported = await Linking.canOpenURL(url)

    if (supported) {
      await Linking.openURL(url)
    } else {
      openModal({
        title: 'Atenção',
        description:
          'Desculpe, não foi possível abrir o link neste momento. Por favor, tente novamente.',
        singleAction: {
          action() {
            closeModal()
          },
          title: 'OK',
        },
      })
    }
  }, [closeModal, openModal])

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
      <View className="bg-gray-700 w-10/12 flex-1 ">
        <View className="flex-row items-center border-b border-purple-600/60 p-4">
          <View className="bg-white w-16 h-16 rounded-full overflow-hidden items-center justify-center">
            {user.photoURL ? (
              <Image
                source={{ uri: user.photoURL }}
                alt="user pic"
                className="w-full h-full object-contain"
              />
            ) : (
              <Icon name="person" color={'#9ca3af'} size={35} />
            )}
          </View>

          <View className="ml-4">
            <Text className="font-nunito-bold text-xl text-white">
              {user.displayName}
            </Text>
            <Text className="text-xs font-nunito-regular text-gray-300">
              Sonoriza {user.plan === 'premium' ? 'Premium' : 'Free'}
            </Text>
          </View>
        </View>

        <View className="p-4 pb-8 flex-1">
          <Button
            icon="settings-sharp"
            title="Gerenciamento de conta"
            onPress={() => {
              handleIsVisible()
              navigation.navigate('Profile')
            }}
          />

          {/* <Button icon="star" title="Avaliar o aplicativo" className="mt-5" /> */}

          <Button
            icon="logo-instagram"
            title="Sonoriza notícias"
            className="mt-5"
            onPress={handleOpenSonorizaInstagram}
          />

          <Button
            icon="sonoriza-tv"
            title="Sonoriza TV"
            className="mt-5"
            onPress={handleOpenSonorizaTV}
          />
        </View>
      </View>
    </View>
  )
}
