import { ReduxProps } from '@storage/index'

import { CurrentMusicProps } from '@storage/modules/currentMusic/reducer'
import { UserProps } from '@storage/modules/user/reducer'

import { useMemo } from 'react'
import { useSelector } from 'react-redux'

export function useFavorites() {
  const { user } = useSelector<ReduxProps, UserProps>((state) => state.user)

  const { isCurrentMusic } = useSelector<ReduxProps, CurrentMusicProps>(
    (state) => state.currentMusic,
  )

  const isFavoriteMusic = useMemo(() => {
    const filter = user.favoritesMusics?.find(
      (item) => item === isCurrentMusic?.id,
    )

    return !!filter
  }, [isCurrentMusic?.id, user.favoritesMusics])

  return { isFavoriteMusic }
}
