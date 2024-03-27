import { ReduxProps } from '@storage/index'

import { launchImageLibrary } from 'react-native-image-picker'

import storage from '@react-native-firebase/storage'
import firestore from '@react-native-firebase/firestore'

import { UserProps, handleSetUser } from '@storage/modules/user/reducer'
import {
  ActivityIndicator,
  Image,
  Keyboard,
  Text,
  TextInput,
  View,
} from 'react-native'
import { useDispatch, useSelector } from 'react-redux'

import Icon from 'react-native-vector-icons/Ionicons'
import colors from 'tailwindcss/colors'
import { TouchableOpacity } from 'react-native-gesture-handler'

import { useNavigation } from '@react-navigation/native'
import { StackNavigationProps } from '@routes/routes'
import { useCallback, useEffect, useState } from 'react'

export function EditProfile() {
  const { user } = useSelector<ReduxProps, UserProps>((state) => state.user)

  const [isLoading, setIsLoading] = useState(false)

  const [name, setName] = useState('')
  const [photo, setPhoto] = useState('')

  const dispatch = useDispatch()

  const navigation = useNavigation<StackNavigationProps>()

  const handleImageLibrary = () => {
    launchImageLibrary(
      { mediaType: 'photo', maxWidth: 500, maxHeight: 500 },
      (response) => {
        if (response.assets) {
          const uri = response.assets[0].uri

          if (uri) {
            setPhoto(uri)
          }
        }
      },
    )
  }

  const handleEditUser = useCallback(async () => {
    try {
      let imageUrl = ''

      Keyboard.dismiss()

      if (photo.length < 1 && user.photoURL) {
        imageUrl = user.photoURL
      } else {
        setIsLoading(true)
        const storageRef = storage().ref(`${user.uid}.jpg`)

        const response = await fetch(photo)
        const blob = await response.blob()

        await storageRef.put(blob)

        const responseUrl = await storageRef.getDownloadURL()

        imageUrl = responseUrl
      }

      const userDocRef = firestore().collection('users').doc(user.uid)

      const data = {
        name,
        photoURL: imageUrl,
      }

      await userDocRef.update(data)

      dispatch(
        handleSetUser({
          user: { ...user, displayName: name, photoURL: imageUrl },
        }),
      )

      setIsLoading(false)

      navigation.goBack()
    } catch (error) {
      setIsLoading(false)
      console.log(error, 'err')
    }
  }, [dispatch, name, navigation, photo, user])

  useEffect(() => {
    if (user.displayName) {
      setName(user.displayName)
    }
  }, [user.displayName])

  return (
    <View className="relative bg-gray-700 flex-1">
      {isLoading && (
        <View className="absolute flex-1 bg-black/60 w-full h-full z-10 justify-center items-center">
          <ActivityIndicator size={'large'} color={colors.purple[600]} />
        </View>
      )}

      <View className="p-4 mt-10">
        <View className="flex-row items-center justify-between">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            activeOpacity={0.6}
          >
            <Icon name="close" size={26} color={colors.gray[300]} />
          </TouchableOpacity>

          <Text className="font-nunito-bold text-white text-base">
            Editar perfil
          </Text>

          <TouchableOpacity onPress={handleEditUser} activeOpacity={0.6}>
            <Text
              className={`font-nunito-regular ${
                user.displayName === name && !photo
                  ? 'text-gray-300'
                  : 'text-red-600 underline'
              } text-base transition-all duration-150`}
            >
              Salvar
            </Text>
          </TouchableOpacity>
        </View>

        <View className="items-center mt-6">
          <View className="bg-purple-600 rounded-full w-40 h-40 items-center justify-center relative">
            {user.photoURL ? (
              <Image
                source={{ uri: photo.length > 0 ? photo : user.photoURL }}
                alt="user pic"
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              <View className="w-full h-full rounded-full items-center justify-center">
                <Icon name="person" size={80} color={colors.gray[200]} />
              </View>
            )}
            <TouchableOpacity
              activeOpacity={1}
              onPress={handleImageLibrary}
              className="bg-gray-200 p-2 rounded-full absolute left-6 -bottom-2 z-30"
            >
              <Icon name="camera" size={20} color={colors.gray[950]} />
            </TouchableOpacity>
          </View>
          <View className="flex-row items-center border-b border-purple-600/60 w-full mt-8">
            <Text className="font-nunito-bold text-white mr-4 text-base">
              Nome
            </Text>
            <TextInput
              defaultValue={name}
              onChangeText={(t) => {
                setName(t)
              }}
              className="text-gray-300 font-nunito-regular text-base w-full"
            />
          </View>
        </View>
      </View>
    </View>
  )
}
