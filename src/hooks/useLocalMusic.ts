import { PERMISSIONS, request } from 'react-native-permissions'
import RNFS from 'react-native-fs'
import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { handleTrackListLocal } from '@storage/modules/trackListLocal/reducer'
import { useModal } from './useModal'
import {
  ConfigProps,
  handleChangeConfig,
} from '@storage/modules/config/reducer'
import { ReduxProps } from '@storage/index'

export function useLocalMusic() {
  const dispatch = useDispatch()
  const { openModal, closeModal } = useModal()

  const { config } = useSelector<ReduxProps, ConfigProps>(
    (state) => state.config,
  )

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
        id: music.path,
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

  return { handleStoragePermission, handleSearchMp3Music }
}
