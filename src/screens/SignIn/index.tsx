import { Input } from '@components/Input'
import {
  BackHandler,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { WEB_CLIENT_ID } from '@env'

import {
  GoogleSignin,
  GoogleSigninButton,
} from '@react-native-google-signin/google-signin'

import logo from '@assets/logo.png'
import { Button } from '@components/Button'
import { useState } from 'react'

import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'
import { ModalCustom } from '@components/Modal'
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
    handleSubmit,
    formState: { errors },
  } = useForm<FormDataProps>({
    resolver: zodResolver(schema),
  })

  const navigation = useNavigation<StackNavigationProps>()

  const [isLoading, setIsLoading] = useState(false)

  const [modalError, setModalError] = useState(false)

  GoogleSignin.configure({
    webClientId: WEB_CLIENT_ID,
  })

  async function handleSignInWithGoogle() {
    setIsLoading(true)
    try {
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true })

      const { idToken } = await GoogleSignin.signIn()
      const googleCredential = auth.GoogleAuthProvider.credential(idToken)
      const response = await auth().signInWithCredential(googleCredential)

      const { user } = response

      const userDocRef = firestore().collection('users').doc(user.uid)

      const userDoc = await userDocRef.get()

      setIsLoading(false)
      if (!userDoc.exists) {
        setModalError(true)
        await auth().signOut()

        return
      }

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
      setModalError(true)
      setIsLoading(false)
    }
  }

  function handleSignInWithEmail(form: FormDataProps) {
    console.log(form)
  }

  return (
    <>
      <ModalCustom
        title="Acesso restrito"
        description="Apenas os usuários com planos ativos têm permissão. Por favor, entre em contato com o suporte para regularizar a sua assinatura."
        show={modalError}
        singleAction={{
          title: 'Sair',
          action() {
            setModalError(false)
            BackHandler.exitApp()
          },
        }}
      />
      <ScrollView>
        <View className="p-4 items-center h-full ">
          <Image
            source={logo}
            alt="logo"
            className="items-center mt-32"
            style={{ width: 200, objectFit: 'contain' }}
          />

          <Text>Bem vindo(a), de volta!</Text>

          <View className="w-full mt-12 px-4">
            <View className="ml-auto mr-auto ">
              <GoogleSigninButton
                onPress={handleSignInWithGoogle}
                size={GoogleSigninButton.Size.Wide}
                color={GoogleSigninButton.Color.Light}
              />
            </View>

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
              className="w-48 ml-auto mr-auto mt-2"
              onPress={handleSubmit(handleSignInWithEmail)}
            />

            <TouchableOpacity className="ml-auto mr-auto mt-6">
              <Text>Esqueceu a senha?</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </>
  )
}
