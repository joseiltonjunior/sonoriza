import { ReduxProps } from '@storage/index'

import { launchImageLibrary } from 'react-native-image-picker'

import storage from '@react-native-firebase/storage'
import firestore from '@react-native-firebase/firestore'

import { UserProps } from '@storage/modules/user/reducer'
import {
  ActivityIndicator,
  Image,
  Keyboard,
  Text,
  TextInput,
  View,
} from 'react-native'
import { useSelector } from 'react-redux'

import Icon from 'react-native-vector-icons/Ionicons'
import colors from 'tailwindcss/colors'
import { TouchableOpacity } from 'react-native-gesture-handler'

import { useNavigation, useRoute } from '@react-navigation/native'
import { RouteParamsProps, StackNavigationProps } from '@routes/routes'
import { useCallback, useState } from 'react'
import { MusicComponent } from '@components/MusicComponent'

export function NewPlaylist() {
  const { user } = useSelector<ReduxProps, UserProps>((state) => state.user)
  const { params: music } = useRoute<RouteParamsProps<'NewPlaylist'>>()

  const [isLoading, setIsLoading] = useState(false)

  const [name, setName] = useState('')
  const [photo, setPhoto] = useState('')

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

  const handleSaveNewPlaylist = useCallback(async () => {
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

      setIsLoading(false)

      navigation.goBack()
    } catch (error) {
      setIsLoading(false)
      console.log(error, 'err')
    }
  }, [name, navigation, photo, user])

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
            Nova Playlist
          </Text>

          <TouchableOpacity onPress={handleSaveNewPlaylist} activeOpacity={0.6}>
            <Text
              className={`font-nunito-regular text-gray-300 text-base transition-all duration-150`}
            >
              Salvar
            </Text>
          </TouchableOpacity>
        </View>

        <View className="items-center mt-6">
          <View className="bg-purple-600 rounded-full w-40 h-40 items-center justify-center relative">
            <Image
              source={{ uri: photo.length > 0 ? photo : music.artwork }}
              alt="playlist artwork"
              className="w-full h-full object-cover rounded-md"
            />

            <TouchableOpacity
              activeOpacity={1}
              onPress={handleImageLibrary}
              className="bg-gray-200 p-2 rounded-full absolute left-8 -bottom-4 z-30"
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

          <View className="mt-8 w-full">
            <MusicComponent music={music} />
          </View>
        </View>
      </View>
    </View>
  )
}
