import { Input } from '@components/Input'
import {
  Image,
  Keyboard,
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
import { useState } from 'react'

import { StackNavigationProps } from '@routes/routes'
import { useNavigation } from '@react-navigation/native'

import { useDispatch } from 'react-redux'
import { handleSetUser } from '@storage/modules/user/reducer'
import { api } from '@services/api'

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

  const [isLoading, setIsLoading] = useState(false)

  const dispatch = useDispatch()

  async function handleSignInWithEmail(data: FormDataProps) {
    Keyboard.dismiss()
    setIsLoading(true)

    try {
      const authResponse = await api.post('/sessions', {
        email: data.email,
        password: data.password,
      })

      setIsLoading(false)
      dispatch(
        handleSetUser({
          user: {
            name: authResponse.data.user.name,
            email: authResponse.data.user.email,
            photoUrl: authResponse.data.user.photoUrl,
            role: authResponse.data.user.role,
            id: authResponse.data.user.id,
            isActive: authResponse.data.user.isActive,
            isAuthenticated: authResponse.data.access_token,
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
    <>
      <ScrollView className="bg-gray-700">
        <View className="p-4 pt-24 items-center h-full ">
          <Image
            source={logo}
            alt="logo"
            className="items-center mt-14"
            style={{ width: 200, objectFit: 'contain' }}
          />

          <Text className="text-gray-300 font-nunito-regular">
            Bem vindo(a), de volta!
          </Text>

          <View className="w-full mt-12 px-4">
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
              className="w-full ml-auto mr-auto mt-6"
              onPress={handleSubmit(handleSignInWithEmail)}
            />

            <TouchableOpacity
              className="ml-auto mr-auto mt-6 flex-row"
              onPress={() => navigation.navigate('Register')}
            >
              <Text className="font-nunito-regular text-gray-300">
                NÃO TEM UMA CONTA?
              </Text>
              <Text className="font-nunito-bold text-gray-300 ml-1 underline">
                INSCREVA-SE
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="ml-auto mr-auto mt-8"
              onPress={() => navigation.navigate('RecoveryPassword')}
            >
              <Text className="text-gray-300 font-nunito-regular">
                REDEFINIR SENHA
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </>
  )
}
