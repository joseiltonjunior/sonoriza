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
}

const schema = z.object({
  email: z.string().email('* e-mail inválido'),
})

export function RecoveryPassword() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormDataProps>({
    resolver: zodResolver(schema),
  })

  const navigation = useNavigation<StackNavigationProps>()

  const [isLoading, setIsLoading] = useState(false)

  function handleRecoveryPassword(data: FormDataProps) {
    Keyboard.dismiss()
    setIsLoading(true)
    console.log('recovery password')
    setIsLoading(false)
  }

  return (
    <>
      <ScrollView className="bg-gray-700">
        <View className="p-4 items-center h-full ">
          <Image
            source={logo}
            alt="logo"
            className="items-center mt-[136]"
            style={{ width: 200, objectFit: 'contain' }}
          />

          <Text className="font-nunito-regular text-gray-300">
            Redefinição de senha
          </Text>

          <View className="w-full mt-20 px-4">
            <Input
              icon="mail"
              name="email"
              keyboardType="email-address"
              control={control}
              error={errors.email}
              placeholder="E-mail"
              autoCapitalize="none"
            />

            <Button
              isLoading={isLoading}
              title="Enviar"
              className="w-full ml-auto mr-auto rounded-xl"
              onPress={handleSubmit(handleRecoveryPassword)}
            />

            <TouchableOpacity
              className="ml-auto mr-auto mt-8"
              onPress={() => navigation.goBack()}
            >
              <Text className="underline font-nunito-regular text-white">
                VOLTAR
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </>
  )
}
