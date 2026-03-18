import { Input } from '@components/Input'
import { Image, Keyboard, ScrollView, Text, View } from 'react-native'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'

import logo from '@assets/logo.png'
import { Button } from '@components/Button'
import { useState } from 'react'

import { RouteParamsProps, StackNavigationProps } from '@routes/routes'
import { useNavigation, useRoute } from '@react-navigation/native'
import { useModal } from '@hooks/useModal'
import { useDispatch } from 'react-redux'
import { handleSetUser } from '@storage/modules/user/reducer'

import { api } from '@services/api'
import axios from 'axios'
import { ConfirmCodeDataProps } from '@utils/Types/confirmCodeProps'
import { authSessionResponseProps } from '@utils/Types/authSessionProps'

const schema = z.object({
  code: z.string().min(6, '* mínimo 06 caracteres'),
})

export function ConfirmCode() {
  const {
    control,
    setError,
    handleSubmit,
    formState: { errors },
  } = useForm<ConfirmCodeDataProps>({
    resolver: zodResolver(schema),
  })

  const { params } = useRoute<RouteParamsProps<'ConfirmCode'>>()
  const { email } = params

  const navigation = useNavigation<StackNavigationProps>()

  const { closeModal, openModal } = useModal()

  const [isLoading, setIsLoading] = useState(false)

  const dispatch = useDispatch()

  function handleConfirmCode(data: ConfirmCodeDataProps) {
    Keyboard.dismiss()
    setIsLoading(true)

    api
      .post('/accounts/verify', {
        email,
        code: data.code,
      })
      .then(async (response) => {
        const { access_token, refresh_token, user } =
          response.data as authSessionResponseProps

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
              accessToken: access_token,
              refreshToken: refresh_token,
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
      })
      .catch((error) => {
        setIsLoading(false)

        let message =
          'Desculpe, não foi possível concluir o cadastro neste momento. Por favor, tente novamente.'

        if (axios.isAxiosError(error)) {
          message =
            error.response?.data?.error ||
            error.response?.data?.message ||
            message
        } else {
          console.log('register unknown error:', error)
        }

        openModal({
          title: 'Atenção',
          description: message,
          singleAction: {
            action() {
              closeModal()
            },
            title: 'OK',
          },
        })
      })
  }

  return (
    <>
      <ScrollView className="bg-gray-700">
        <View className="p-4 pt-24 items-center h-full ">
          <Image
            source={logo}
            alt="logo"
            className="items-center mt-4"
            style={{ width: 200, objectFit: 'contain' }}
          />

          <Text className="text-gray-300 font-nunito-regular">
            Bem vindo(a)!
          </Text>

          <View className="w-full mt-20 px-4">
            <Input
              icon="lock"
              name="code"
              keyboardType="default"
              control={control}
              error={errors.code}
              placeholder="Confirme seu código"
            />

            <Button
              isLoading={isLoading}
              title="Confirmar"
              className="w-full ml-auto mr-auto mt-6"
              onPress={handleSubmit(handleConfirmCode)}
            />
          </View>
        </View>
      </ScrollView>
    </>
  )
}
