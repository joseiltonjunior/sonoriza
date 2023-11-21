import { useModal } from './useModal'

import { useDispatch } from 'react-redux'
import { handleIgnoreAlert } from '@storage/modules/netInfo/reducer'

export function useNetwork() {
  const { openModal, closeModal } = useModal()

  const dispatch = useDispatch()

  const openModalErrNetwork = () => {
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

  return { openModalErrNetwork }
}
