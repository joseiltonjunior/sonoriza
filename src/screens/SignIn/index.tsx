import { Input } from '@components/Input'
import {
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'

import logo from '@assets/logo.png'
import { Button } from '@components/Button'
import { useCallback, useRef, useState } from 'react'

import { StackNavigationProps } from '@routes/routes'
import { useFocusEffect, useNavigation } from '@react-navigation/native'

import { useDispatch } from 'react-redux'
import { handleSetUser } from '@storage/modules/user/reducer'
import { api } from '@services/api'
import { authSessionResponseProps } from '@utils/Types/authSessionProps'

import installations from '@react-native-firebase/installations'
import messaging from '@react-native-firebase/messaging'
import DeviceInfo from 'react-native-device-info'

interface FormDataProps {
  email: string
  password: string
}

const schema = z.object({
  email: z.string().email('* e-mail inválido'),
  password: z.string().min(6, '* mínimo 6 caracteres'),
})

export function SignIn() {
  const {
    control,
    setError,
    handleSubmit,
    formState: { errors },
  } = useForm<FormDataProps>({
    resolver: zodResolver(schema),
  })

  const navigation = useNavigation<StackNavigationProps>()
  const scrollRef = useRef<ScrollView>(null)

  const [isLoading, setIsLoading] = useState(false)
  const [keyboardOffset, setKeyboardOffset] = useState(32)

  const dispatch = useDispatch()

  useFocusEffect(
    useCallback(() => {
      setKeyboardOffset(32)

      const keyboardShowSubscription = Keyboard.addListener(
        'keyboardDidShow',
        (event) => {
          setKeyboardOffset(event.endCoordinates.height + 32)

          requestAnimationFrame(() => {
            scrollRef.current?.scrollToEnd({ animated: true })
          })
        },
      )

      const keyboardHideSubscription = Keyboard.addListener(
        'keyboardDidHide',
        () => {
          setKeyboardOffset(32)
        },
      )

      return () => {
        keyboardShowSubscription.remove()
        keyboardHideSubscription.remove()
        setKeyboardOffset(32)
      }
    }, []),
  )

  async function getDevicePayload() {
    const [deviceKey, deviceName, manufacturer] = await Promise.all([
      installations().getId(),
      DeviceInfo.getDeviceName(),
      DeviceInfo.getManufacturer(),
    ])

    let fcmToken: string | null = null

    try {
      fcmToken = await messaging().getToken()
    } catch {
      fcmToken = null
    }

    return {
      deviceKey,
      platform: 'MOBILE',
      deviceName,
      manufacturer,
      model: DeviceInfo.getModel(),
      osName: DeviceInfo.getSystemName(),
      osVersion: DeviceInfo.getSystemVersion(),
      appVersion: DeviceInfo.getVersion(),
      fcmToken,
    }
  }

  async function handleSignInWithEmail(data: FormDataProps) {
    Keyboard.dismiss()
    setIsLoading(true)

    const device = await getDevicePayload()

    try {
      const authResponse = await api
        .post('/sessions', {
          email: data.email,
          password: data.password,
          device,
        })
        .then((response) => response.data as authSessionResponseProps)

      const {
        access_token: accessToken,
        refresh_token: refreshToken,
        user,
      } = authResponse

      setIsLoading(false)
      dispatch(
        handleSetUser({
          user: {
            name: user.name,
            email: user.email,
            photoUrl: user.photoUrl,
            role: user.role,
            id: user.id,
            accountStatus: user.accountStatus,
            accessToken,
            refreshToken,
          },
        }),
      )

      navigation.reset({
        index: 0,
        routes: [
          {
            name: 'Home',
            params: undefined,
          },
        ],
      })
    } catch (error) {
      setError('email', { message: '* credenciais inválidas' })
      setError('password', { message: '* credenciais inválidas' })
      setIsLoading(false)
    }
  }

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-gray-700"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        ref={scrollRef}
        className="flex-1 bg-gray-700"
        contentContainerStyle={{ flexGrow: 1, paddingBottom: keyboardOffset }}
        keyboardDismissMode="none"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View className="items-center p-4 pt-24">
          <Image
            source={logo}
            alt="logo"
            className="items-center mt-14"
            style={{ width: 200, objectFit: 'contain' }}
          />

          <Text className="text-gray-300 font-nunito-regular">
            Bem vindo(a), de volta!
          </Text>

          <View className="mt-12 w-full px-4">
            <Input
              icon="mail"
              name="email"
              keyboardType="email-address"
              control={control}
              error={errors.email}
              placeholder="E-mail"
              autoCapitalize="none"
            />
            <Input
              icon="lock"
              name="password"
              keyboardType="default"
              control={control}
              error={errors.password}
              placeholder="Senha"
              password
            />

            <Button
              isLoading={isLoading}
              title="Entrar"
              className="mt-6 ml-auto mr-auto w-full"
              onPress={handleSubmit(handleSignInWithEmail)}
            />

            <TouchableOpacity
              className="ml-auto mr-auto mt-6 flex-row"
              onPress={() => navigation.navigate('Register')}
            >
              <Text className="font-nunito-regular text-gray-300">
                NÃO TEM UMA CONTA?
              </Text>
              <Text className="ml-1 font-nunito-bold text-gray-300 underline">
                INSCREVA-SE
              </Text>
            </TouchableOpacity>

            {/* <TouchableOpacity
              disabled
              className="ml-auto mr-auto mt-8"
              onPress={() => navigation.navigate('RecoveryPassword')}
            >
              <Text className="font-nunito-regular text-gray-300">
                REDEFINIR SENHA
              </Text>
            </TouchableOpacity> */}
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}
