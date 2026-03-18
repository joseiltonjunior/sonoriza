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

  function handleSignInWithEmail(data: FormDataProps) {
    Keyboard.dismiss()
    setIsLoading(true)
    console.log(data)
  }

  return (
    <>
      <ScrollView className="bg-gray-700">
        <View className="p-4 items-center h-full ">
          <Image
            source={logo}
            alt="logo"
            className="items-center mt-14"
            style={{ width: 200, objectFit: 'contain' }}
          />

          <Text>Bem vindo(a), de volta!</Text>

          <View className="w-full mt-12 px-4">
            <View className="flex-row overflow-hidden items-center my-6">
              <View className="h-[1px] flex-1 bg-white" />
              <Text className="font-bold mx-2">OU</Text>
              <View className="h-[1px] flex-1 bg-white" />
            </View>

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
              <Text>NÃO TEM UMA CONTA?</Text>
              <Text className="font-bold ml-1 underline">INSCREVA-SE</Text>
            </TouchableOpacity>

            <TouchableOpacity className="ml-auto mr-auto mt-8">
              <Text>REDEFINIR SENHA</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </>
  )
}
