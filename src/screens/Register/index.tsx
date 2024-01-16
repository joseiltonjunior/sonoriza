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
import { useDispatch } from 'react-redux'
import { handleSetUser } from '@storage/modules/user/reducer'
import { FormDataProps, UserDataProps } from '@utils/Types/userProps'
import { useFirebaseServices } from '@hooks/useFirebaseServices'

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

  const { closeModal, openModal } = useModal()

  const [isLoading, setIsLoading] = useState(false)

  const { handleSaveUser, handleRequestPermissionNotifications } =
    useFirebaseServices()

  const dispatch = useDispatch()

  GoogleSignin.configure({
    webClientId: WEB_CLIENT_ID,
  })

  async function handleSaveInDatabase({
    email,
    displayName,
    photoURL,
    uid,
    plan,
  }: UserDataProps) {
    try {
      await handleSaveUser({ displayName, email, photoURL, plan, uid })
      await handleRequestPermissionNotifications(uid)
      setIsLoading(false)
      dispatch(
        handleSetUser({
          user: {
            displayName,
            email,
            photoURL,
            uid,
            plan,
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
      setIsLoading(false)
      openModal({
        title: 'Atenção',
        description:
          'Desculpe, não foi possível concluir o cadastro neste momento. Por favor, tente novamente.',
        singleAction: {
          action() {
            closeModal()
          },
          title: 'OK',
        },
      })
    }
  }

  function handleRegisterWithEmail(data: FormDataProps) {
    Keyboard.dismiss()
    setIsLoading(true)

    auth()
      .createUserWithEmailAndPassword(data.email, data.password)
      .then((result) => {
        const { email, photoURL, uid } = result.user

        const name = data.name

        result.user
          .updateProfile({
            displayName: name,
          })
          .then(() => {
            handleSaveInDatabase({
              displayName: name,
              email,
              photoURL,
              uid,
              plan: 'free',
            })
          })
      })
      .catch((error) => {
        setIsLoading(false)
        if (error.code === 'auth/email-already-in-use') {
          setError('email', { message: '* E-mail já está em uso!' })
        }

        if (error.code === 'auth/invalid-email') {
          setError('email', { message: '* E-mail inválido!' })
        }
      })
  }

  return (
    <>
      <ScrollView className="bg-gray-700">
        <View className="p-4 items-center h-full ">
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
    </>
  )
}
