import { ReduxProps } from '@storage/index'

import { UserProps } from '@storage/modules/user/reducer'
import { MusicProps } from '@utils/Types/musicProps'

import { useMemo } from 'react'
import { useSelector } from 'react-redux'

export function useFavorites(currentMusic?: MusicProps) {
  const { user } = useSelector<ReduxProps, UserProps>((state) => state.user)

  const isFavoriteMusic = useMemo(() => {
    const filter = user.favoritesMusics?.find(
      (item) => item === currentMusic?.id,
    )

    return !!filter
  }, [currentMusic?.id, user.favoritesMusics])

  return { isFavoriteMusic }
}
