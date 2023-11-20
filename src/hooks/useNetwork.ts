import NetInfo from '@react-native-community/netinfo'
import { useModal } from './useModal'

import { useDispatch } from 'react-redux'
import {
  handleIgnoreAlert,
  handleSetNetStatus,
} from '@storage/modules/netInfo/reducer'

export function useNetwork() {
  const { openModal, closeModal } = useModal()

  const dispatch = useDispatch()

  const checkNetwork = async () => {
    let status = false
    await NetInfo.fetch().then((state) => {
      if (!state.isConnected) {
        dispatch(handleSetNetStatus(false))

        status = false
        return
      }

      status = true
      dispatch(handleSetNetStatus(true))
    })

    return status
  }

  const openModalErr = () => {
    openModal({
      title: 'Atenção',
      description:
        'Ops... Parece que você está sem conexão com a internet. Modo offline ativo com funções limitadas.',
      singleAction: {
        title: 'Aproveitar modo offline',
        action() {
          dispatch(handleIgnoreAlert(true))
          closeModal()
        },
      },
    })
  }

  return { checkNetwork, openModalErr }
}
