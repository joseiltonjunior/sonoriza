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
import { useModal } from '@hooks/useModal'
import { FormDataProps } from '@utils/Types/userProps'

import { api } from '@services/api'
import axios from 'axios'

const schema = z
  .object({
    name: z.string().min(6, '* mínimo 10 caracteres'),
    email: z.string().email('* e-mail inválido'),
    password: z
      .string()
      .min(6, '* mínimo 6 caracteres')
      .refine(
        (value) => /^(?=.*[A-Za-z])(?=.*\d)/.test(value),
        '* deve conter letras e números',
      ),
    confirmPassword: z.string().min(6, '* mínimo 6 caracteres'),
  })
  .refine(
    (values) => {
      return values.password === values.confirmPassword
    },
    {
      message: '* as senhas não coincidem',
      path: ['confirmPassword'],
    },
  )

export function Register() {
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

  const { closeModal, openModal } = useModal()

  const [isLoading, setIsLoading] = useState(false)
  const [keyboardOffset, setKeyboardOffset] = useState(32)

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

  function handleRegisterWithEmail(data: FormDataProps) {
    Keyboard.dismiss()
    setIsLoading(true)

    api
      .post('/accounts', {
        email: data.email,
        name: data.name,
        password: data.password,
      })
      .then(async () => {
        navigation.navigate('ConfirmCode', { email: data.email })
      })
      .catch((error) => {
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
      .finally(() => {
        setIsLoading(false)
      })
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
            className="items-center mt-4"
            style={{ width: 200, objectFit: 'contain' }}
          />

          <Text className="text-gray-300 font-nunito-regular">
            Bem vindo(a)!
          </Text>

          <View className="w-full mt-20 px-4">
            <Input
              icon="user"
              name="name"
              keyboardType="default"
              control={control}
              error={errors.name}
              placeholder="Nome"
            />
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
            <Input
              icon="lock"
              name="confirmPassword"
              keyboardType="default"
              control={control}
              error={errors.confirmPassword}
              placeholder="Confirme a senha"
              password
            />

            <Button
              isLoading={isLoading}
              title="Cadastrar"
              className="w-full ml-auto mr-auto mt-6"
              onPress={handleSubmit(handleRegisterWithEmail)}
            />

            <TouchableOpacity
              className="ml-auto mr-auto mt-6 flex-row"
              onPress={() => navigation.navigate('SignIn')}
            >
              <Text className="font-nunito-regular text-gray-300">
                JÁ POSSUI UMA CONTA?
              </Text>
              <Text className="font-nunito-bold text-gray-300 ml-1 underline">
                ENTRAR
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}
