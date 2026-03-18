import { ReduxProps } from '@storage/index'

import { Asset, launchImageLibrary } from 'react-native-image-picker'

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
import { api } from '@services/api'
import { UploadObjectResponseProps } from '@utils/Types/uploadProps'

export function EditPlaylist() {
  const { user } = useSelector<ReduxProps, UserProps>((state) => state.user)
  const { params: playlist } = useRoute<RouteParamsProps<'EditPlaylist'>>()

  const [isLoading, setIsLoading] = useState(false)

  const [name, setName] = useState(playlist.title)
  const [photo, setPhoto] = useState<Asset | null>(null)

  const navigation = useNavigation<StackNavigationProps>()

  const handleImageLibrary = () => {
    launchImageLibrary(
      { mediaType: 'photo', maxWidth: 500, maxHeight: 500 },
      (response) => {
        if (response.assets) {
          const asset = response.assets[0]

          if (asset) {
            setPhoto(asset)
          }
        }
      },
    )
  }

  const slugify = (value: string) =>
    value
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\.[^/.]+$/, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')

  const handleEditPlaylist = useCallback(async () => {
    try {
      setIsLoading(true)
      Keyboard.dismiss()

      if (!photo?.uri) {
        return
      }

      console.log('subir img playlist')

      // const formData = new FormData()

      // formData.append('files', {
      //   uri: photo.uri,
      // } as any)

      // formData.append('folder', 'playlist')
      // formData.append('slug', slugify(name))

      // const objectPathSigned = await api
      //   .post('/uploads', formData)
      //   .then((res) => res.data.files as UploadObjectResponseProps)

      // await api.patch(`/me`, {
      //   name,
      //   photoUrl: objectPathSigned.signedUrl,
      // })

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
            Editar Playlist
          </Text>

          <TouchableOpacity onPress={handleEditPlaylist} activeOpacity={0.6}>
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
              source={{
                uri:
                  photo?.uri && photo.uri?.length > 0
                    ? photo.uri
                    : playlist.artworkURL,
              }}
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
            <Text className="text-white font-nunito-bold text-base">
              {playlist.musics.length > 0
                ? 'Musicas da playlist'
                : 'A playlist está vázia'}
            </Text>

            {playlist.musics.map((item, index) => (
              <MusicComponent key={index} music={item} />
            ))}
          </View>
        </View>
      </View>
    </View>
  )
}
