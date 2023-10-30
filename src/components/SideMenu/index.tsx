import auth from '@react-native-firebase/auth'

import { Image, Text, TouchableOpacity, View } from 'react-native'

import { useNavigation } from '@react-navigation/native'
import { StackNavigationProps } from '@routes/routes'
import { useModal } from '@hooks/useModal'
import { useSideMenu } from '@hooks/useSideMenu'
import { useTrackPlayer } from '@hooks/useTrackPlayer'
import { useDispatch, useSelector } from 'react-redux'
import { ReduxProps } from '@storage/index'
import RNFS from 'react-native-fs'

import Icon from 'react-native-vector-icons/FontAwesome'

import { UserProps, handleSaveUser } from '@storage/modules/user/reducer'

import { Switch } from './Switch'
import { Button } from './Button'
import {
  ConfigProps,
  handleChangeConfig,
} from '@storage/modules/config/reducer'
import { useCallback } from 'react'
import { handleTrackListLocal } from '@storage/modules/trackListLocal/reducer'
import { PERMISSIONS, request } from 'react-native-permissions'

export function SideMenu() {
  const { isVisible, handleIsVisible } = useSideMenu()

  const { openModal, closeModal } = useModal()
  const { TrackPlayer } = useTrackPlayer()

  const navigation = useNavigation<StackNavigationProps>()

  const { user } = useSelector<ReduxProps, UserProps>((state) => state.user)

  const dispatch = useDispatch()

  const { config } = useSelector<ReduxProps, ConfigProps>(
    (state) => state.config,
  )

  const handleSignOutApp = () => {
    TrackPlayer.reset()
    auth()
      .signOut()
      .then(() => {
        handleIsVisible()
        dispatch(
          handleSaveUser({
            user: {
              displayName: '',
              email: '',
              photoURL: '',
              plain: '',
              uid: '',
            },
          }),
        )
        dispatch(handleChangeConfig({ config: { isLocal: false } }))
        dispatch(handleTrackListLocal({ trackListLocal: [] }))
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
      })
  }

  const handleSearchMp3Music = useCallback(async () => {
    try {
      const downloadFolder = await RNFS.readDir(RNFS.DownloadDirectoryPath)
      const musicFolder = await RNFS.readDir(
        `${RNFS.ExternalStorageDirectoryPath}/Music`,
      )

      const allTracks = [...downloadFolder, ...musicFolder]

      const filterMp3 = allTracks.filter((arquivo) => {
        return arquivo.isFile() && arquivo.name.endsWith('.mp3')
      })

      const tracksFormatted = filterMp3.map((music) => ({
        url: `file://${music.path}`,
        title: music.name.replace('.mp3', ''),
        artist: 'Artista Desconhecido',
        album: 'Álbum Desconhecido',
        genre: '',
        date: '',
        artwork: '',
        duration: 0,
      }))

      dispatch(handleTrackListLocal({ trackListLocal: tracksFormatted }))
    } catch (error) {
      openModal({
        title: 'Atenção',
        description: 'Ocorreu um erro ao tentar buscar músicas locais.',
        singleAction: {
          title: 'OK',
          action() {
            closeModal()
          },
        },
      })
    }
  }, [closeModal, dispatch, openModal])

  const handleStoragePermission = useCallback(async () => {
    try {
      const result = await request(
        PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE &&
          PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
      )

      if (result !== 'granted') {
        openModal({
          title: 'Permissão necessária',
          description:
            'Por favor, conceda permissão para acessar suas músicas locais.',
          twoActions: {
            textCancel: 'CANCELAR',
            actionCancel() {
              closeModal()
            },
            textConfirm: 'PERMITIR',
            actionConfirm() {
              handleStoragePermission()
            },
          },
        })

        return
      }

      dispatch(
        handleChangeConfig({
          config: { ...config, isLocal: true },
        }),
      )

      handleSearchMp3Music()
    } catch (error) {
      openModal({
        title: 'Atenção',
        description:
          'O aplicativo não consegue acessar suas músicas locais no momento. Por favor, tente novamente mais tarde.',
        singleAction: {
          title: 'OK',
          action() {
            closeModal()
          },
        },
      })
    }
  }, [closeModal, config, dispatch, handleSearchMp3Music, openModal])

  return (
    <View
      style={{ display: isVisible ? 'flex' : 'none' }}
      className="absolute h-full w-full"
    >
      <TouchableOpacity
        className="bg-black/70 absolute w-full h-full"
        activeOpacity={1}
        onPress={() => {
          handleIsVisible()
        }}
      />
      <View className="bg-gray-950 w-10/12 flex-1 ">
        <View className="flex-row items-center border-b border-gray-400/60 p-4">
          <View className="bg-white w-16 h-16 rounded-full overflow-hidden items-center justify-center">
            {user.photoURL ? (
              <Image
                source={{ uri: user.photoURL }}
                alt="user pic"
                className="w-full h-full object-contain"
              />
            ) : (
              <Icon name="user" color={'#9ca3af'} size={35} />
            )}
          </View>

          <View className="ml-4">
            <Text className="font-bold text-xl text-white">
              {user.displayName}
            </Text>
            <Text className="text-xs text-gray-300">
              Sonoriza {user.plain === 'premium' ? 'Premium' : 'Free'}
            </Text>
          </View>
        </View>

        <View className="p-4 pb-8 flex-1">
          <Button icon="gear" title="Gerenciamento de conta" />

          <Button
            icon="thumbs-o-up"
            title="Avaliar o aplicativo"
            className="mt-5"
          />

          <Button icon="question" title="Sobre" className="mt-5" />

          <Switch
            icon="file"
            title="Modo Local"
            onValueChange={() => {
              if (config.isLocal) {
                dispatch(
                  handleChangeConfig({
                    config: { ...config, isLocal: false },
                  }),
                )

                return
              }
              handleStoragePermission()
            }}
            value={config.isLocal}
          />
          <Text className="mt-1 text-sm">
            Este modo permite ao usuário reproduzir músicas armazenadas
            localmente no dispositivo.
          </Text>

          <TouchableOpacity
            className="ml-auto mr-auto mt-auto bg-purple-600 h-14 items-center justify-center px-6 rounded-full"
            activeOpacity={0.6}
            onPress={() => {
              openModal({
                title: 'Atenção',
                description: 'Tem certeza de que deseja sair do aplicativo?',
                twoActions: {
                  actionCancel() {
                    closeModal()
                  },
                  textCancel: 'Voltar',
                  actionConfirm() {
                    handleSignOutApp()
                  },
                  textConfirm: 'Sair',
                },
              })
            }}
          >
            <Text className="font-bold text-white">DESCONECTAR</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}
