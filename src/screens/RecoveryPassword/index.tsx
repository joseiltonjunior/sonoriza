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
import { WEB_CLIENT_ID } from '@env'

import { GoogleSignin } from '@react-native-google-signin/google-signin'

import logo from '@assets/logo.png'
import { Button } from '@components/Button'
import { useState } from 'react'

import auth from '@react-native-firebase/auth'

import { StackNavigationProps } from '@routes/routes'
import { useNavigation } from '@react-navigation/native'

import { useModal } from '@hooks/useModal'

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

  const { closeModal, openModal } = useModal()

  GoogleSignin.configure({
    webClientId: WEB_CLIENT_ID,
  })

  function handleRecoveryPassword(data: FormDataProps) {
    Keyboard.dismiss()
    setIsLoading(true)
    auth()
      .sendPasswordResetEmail(data.email)
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
      .finally(() => {
        setIsLoading(false)
      })
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

          <Text>Redefinição de senha</Text>

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
              <Text className="underline">VOLTAR</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </>
  )
}
