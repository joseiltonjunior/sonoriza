import { ReduxProps } from '@storage/index'
import { FavoriteMusicsProps } from '@storage/modules/favoriteMusics/reducer'

import { MusicProps } from '@utils/Types/musicProps'

import { useMemo } from 'react'
import { useSelector } from 'react-redux'

export function useFavorites(currentMusic?: MusicProps) {
  const { favoriteMusics } = useSelector<ReduxProps, FavoriteMusicsProps>(
    (state) => state.favoriteMusics,
  )

  const isFavoriteMusic = useMemo(() => {
    const filter = favoriteMusics.find((item) => item.id === currentMusic?.id)

    return !!filter
  }, [currentMusic?.id, favoriteMusics])

  return { isFavoriteMusic }
}
