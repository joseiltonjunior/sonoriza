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
import { handleSetUser } from '@storage/modules/user/reducer'

import { UserDataProps } from '@utils/Types/userProps'

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

  const { closeModal, openModal } = useModal()

  const dispatch = useDispatch()

  GoogleSignin.configure({
    webClientId: WEB_CLIENT_ID,
  })

  async function handleFetchDataUser(userUid: string) {
    firestore()
      .collection('users')
      .doc(userUid)
      .get()
      .then(async (querySnapshot) => {
        const user = querySnapshot.data() as UserDataProps

        dispatch(
          handleSetUser({
            user,
          }),
        )

        navigation.reset({
          index: 0,
          routes: [{ name: 'Home' }],
        })
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  async function handleSignInWithGoogle() {
    setIsLoading(true)
    try {
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true })

      const { idToken } = await GoogleSignin.signIn()
      const googleCredential = auth.GoogleAuthProvider.credential(idToken)
      const response = await auth().signInWithCredential(googleCredential)

      const { uid } = response.user
      handleFetchDataUser(uid)
    } catch (error) {
      setIsLoading(false)
      openModal({
        title: 'Atenção',
        description:
          'Para acessar o Sonoriza, basta realizar um rápido cadastro, que levará menos de 1 minuto.',
        twoActions: {
          actionCancel() {
            closeModal()
          },
          textCancel: 'AGORA NÃO',
          actionConfirm() {
            navigation.navigate('Register')
          },
          textConfirm: 'VAMOS LÁ',
        },
      })
    }
  }

  function handleSignInWithEmail(data: FormDataProps) {
    Keyboard.dismiss()
    setIsLoading(true)
    auth()
      .signInWithEmailAndPassword(data.email, data.password)
      .then(async (result) => {
        const { uid } = result.user
        handleFetchDataUser(uid)
      })
      .catch(() => {
        setError('email', { message: '* credenciais inválidas' })
        setError('password', { message: '* credenciais inválidas' })
        setIsLoading(false)
      })
  }

  return (
    <>
      <ScrollView>
        <View className="p-4 items-center h-full ">
          <Image
            source={logo}
            alt="logo"
            className="items-center mt-14"
            style={{ width: 200, objectFit: 'contain' }}
          />

          <Text>Bem vindo(a), de volta!</Text>

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
