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

import iconGoogle from '@assets/icon-google.png'

import { GoogleSignin } from '@react-native-google-signin/google-signin'

import logo from '@assets/logo.png'
import { Button } from '@components/Button'
import { useState } from 'react'

import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'

import { StackNavigationProps } from '@routes/routes'
import { useNavigation } from '@react-navigation/native'
import { useModal } from '@hooks/useModal'
import { useDispatch } from 'react-redux'
import { handleSaveUser } from '@storage/modules/user/reducer'

interface FormDataProps {
  name: string
  email: string
  password: string
  confirmPassword: string
}

export interface UserDataProps {
  email: string | null
  displayName: string | null
  photoURL: string | null
  uid: string
  plain: string | null
}

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

  const dispatch = useDispatch()

  GoogleSignin.configure({
    webClientId: WEB_CLIENT_ID,
  })

  async function handleSaveInDatabase({
    email,
    displayName,
    photoURL,
    uid,
    plain,
  }: UserDataProps) {
    const userRef = firestore().collection('users').doc(uid)

    userRef
      .get()
      .then((doc) => {
        if (doc.exists) {
          setIsLoading(false)
          openModal({
            title: 'Atenção',
            description:
              'Você já possui uma conta cadastrada. Por favor, faça login.',
            singleAction: {
              action() {
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
              },
              title: 'OK',
            },
          })
        } else {
          firestore()
            .collection('users')
            .doc(uid)
            .set({
              email,
              displayName,
              photoURL,
              uid,
              plain,
            })
            .then(() => {
              dispatch(
                handleSaveUser({
                  user: {
                    displayName,
                    email,
                    photoURL,
                    uid,
                    plain,
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

          setIsLoading(false)
        }
      })
      .catch(() => {
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
      })
  }

  async function handleSignInWithGoogle() {
    setIsLoading(true)
    try {
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true })

      const { idToken } = await GoogleSignin.signIn()

      const googleCredential = auth.GoogleAuthProvider.credential(idToken)
      const response = await auth().signInWithCredential(googleCredential)

      const { uid, email, displayName, photoURL } = response.user

      handleSaveInDatabase({ displayName, email, photoURL, uid, plain: 'free' })
    } catch (error) {
      openModal({
        title: 'Atenção',
        description:
          'Desculpe, não foi possível acessar a aplicação nesse momento. Por favor, tente novamente.',
        singleAction: {
          action() {
            closeModal()
          },
          title: 'OK',
        },
      })
      setIsLoading(false)
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
              plain: 'free',
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
      <ScrollView>
        <View className="p-4 items-center h-full ">
          <Image
            source={logo}
            alt="logo"
            className="items-center mt-4"
            style={{ width: 200, objectFit: 'contain' }}
          />

          <Text>Bem vindo(a)!</Text>

          <View className="w-full mt-12 px-4">
            <TouchableOpacity
              onPress={handleSignInWithGoogle}
              className="bg-gray-100 w-full rounded-full h-12 items-center justify-center flex-row"
            >
              <Image
                source={iconGoogle}
                alt="google icon"
                width={20}
                height={20}
                style={{ width: 24, objectFit: 'contain' }}
              />
              <Text className="text-gray-500 font-bold ml-6">
                ENTRAR COM O GOOGLE
              </Text>
            </TouchableOpacity>

            <View className="flex-row overflow-hidden items-center my-6">
              <View className="h-[1px] flex-1 bg-white" />
              <Text className="font-bold mx-2">OU</Text>
              <View className="h-[1px] flex-1 bg-white" />
            </View>

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
              <Text>JÁ POSSUI UMA CONTA?</Text>
              <Text className="font-bold ml-1 underline">ENTRAR</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </>
  )
}
