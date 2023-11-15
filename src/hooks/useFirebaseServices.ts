import firestore from '@react-native-firebase/firestore'

import crashlytics from '@react-native-firebase/crashlytics'
import { MusicProps } from '@utils/Types/musicProps'
import { MusicalGenresDataProps } from '@utils/Types/musicalGenresProps'
import { ArtistsDataProps } from '@utils/Types/artistsProps'
import { useDispatch, useSelector } from 'react-redux'
import { ReduxProps } from '@storage/index'
import { UserProps, handleSetUser } from '@storage/modules/user/reducer'

export function useFirebaseServices() {
  const { user } = useSelector<ReduxProps, UserProps>((state) => state.user)

  const dispatch = useDispatch()

  // get

  const handleGetMusicsDatabase = async (): Promise<MusicProps[]> => {
    let musics = [] as MusicProps[]
    await firestore()
      .collection('musics')
      .get()
      .then(async (querySnapshot) => {
        const musicsResponse = querySnapshot.docs.map((doc) =>
          doc.data(),
        ) as MusicProps[]

        musics = musicsResponse
      })
      .catch((err) => {
        crashlytics().recordError(err)
      })

    return musics
  }

  const handleGetMusicalGenres = async (): Promise<
    MusicalGenresDataProps[]
  > => {
    let musicalGenres = [] as MusicalGenresDataProps[]
    await firestore()
      .collection('musicalGenres')
      .get()
      .then(async (querySnapshot) => {
        const musicalGenresResponse = querySnapshot.docs.map((doc) =>
          doc.data(),
        ) as MusicalGenresDataProps[]

        musicalGenres = musicalGenresResponse
      })
      .catch((err) => {
        crashlytics().recordError(err)
      })
    return musicalGenres
  }

  const handleGetArtists = async (): Promise<ArtistsDataProps[]> => {
    let artists = [] as ArtistsDataProps[]
    await firestore()
      .collection('artists')
      .get()
      .then(async (querySnapshot) => {
        const artistsResponse = querySnapshot.docs.map((doc) =>
          doc.data(),
        ) as ArtistsDataProps[]

        artists = artistsResponse
      })

      .catch((err) => {
        crashlytics().recordError(err)
      })

    return artists
  }

  // put

  const handleFavoriteMusic = async (musicSelected: MusicProps) => {
    try {
      const userRef = firestore().collection('users').doc(user.uid)
      const musicRef = firestore().collection('musics').doc(musicSelected.id)

      let like = 0

      await musicRef.get().then((querySnapshot) => {
        const { like: likeMusic } = querySnapshot.data() as MusicProps

        if (likeMusic) {
          like = likeMusic
        }
      })

      let favoritesMusics = [] as string[]

      if (user.favoritesMusics) {
        favoritesMusics = user.favoritesMusics
      }

      const exist = favoritesMusics.find((music) => music === musicSelected.id)

      if (exist) {
        const filter = favoritesMusics.filter(
          (music) => music !== musicSelected.id,
        ) as string[]

        favoritesMusics = filter
        like--
      } else {
        favoritesMusics = [...favoritesMusics, musicSelected.id]
        like++
      }

      musicRef.update({ like })
      userRef.update({ favoritesMusics })

      dispatch(
        handleSetUser({
          user: { ...user, favoritesMusics },
        }),
      )
    } catch (error) {
      console.error('Erro ao executar ação de favoritar/remover música:', error)
    }
  }

  const handleFavoriteArtist = async (artist: ArtistsDataProps) => {
    try {
      const userRef = firestore().collection('users').doc(user.uid)
      const artistRef = firestore().collection('artists').doc(artist.id)

      let like = 0

      await artistRef.get().then((querySnapshot) => {
        const { like: likeArtist } = querySnapshot.data() as ArtistsDataProps
        if (likeArtist) {
          like = likeArtist
        }
      })

      let favoritesArtists = [] as string[]

      if (user.favoritesArtists) {
        favoritesArtists = user.favoritesArtists
      }

      const exist = favoritesArtists.find((item) => item === artist.id)

      if (exist) {
        const filter = favoritesArtists.filter(
          (item) => item !== artist.id,
        ) as string[]

        like--
        favoritesArtists = filter
      } else {
        like++
        favoritesArtists = [...favoritesArtists, artist.id]
      }

      userRef.update({ favoritesArtists })
      artistRef.update({ like })

      dispatch(
        handleSetUser({
          user: { ...user, favoritesArtists },
        }),
      )
    } catch (error) {
      console.error(
        'Erro ao executar ação de favoritar/remover artista:',
        error,
      )
    }
  }

  // in cache

  const handleGetArtistById = async (
    artistID: string,
  ): Promise<ArtistsDataProps> => {
    let artist = {} as ArtistsDataProps
    await firestore()
      .collection('artists')
      .doc(artistID)
      .get({ source: 'cache' })
      .then(async (querySnapshot) => {
        const artistResponse = querySnapshot.data() as ArtistsDataProps

        artist = artistResponse
      })

      .catch((err) => {
        crashlytics().recordError(err)
      })

    return artist
  }

  const handleGetMusicsById = async (
    musicsId: string[],
  ): Promise<MusicProps[]> => {
    let musics = [] as MusicProps[]
    await firestore()
      .collection('musics')
      .where(firestore.FieldPath.documentId(), 'in', musicsId)
      .get({ source: 'cache' })
      .then(async (querySnapshot) => {
        const musicsResponse = querySnapshot.docs.map((doc) =>
          doc.data(),
        ) as MusicProps[]

        musics = musicsResponse
      })
      .catch((err) => {
        crashlytics().recordError(err)
      })

    return musics
  }

  const handleGetFavoritesArtists = async (
    artistsId: string[],
  ): Promise<ArtistsDataProps[]> => {
    let artists = [] as ArtistsDataProps[]
    const batches = []
    const batchSize = 10

    for (let i = 0; i < artistsId.length; i += batchSize) {
      const batch = artistsId.slice(i, i + batchSize)
      batches.push(batch)
    }

    for (const batch of batches) {
      await firestore()
        .collection('artists')
        .where(firestore.FieldPath.documentId(), 'in', batch)
        .get({ source: 'cache' })
        .then((querySnapshot) => {
          const artistsResponse = querySnapshot.docs.map((doc) =>
            doc.data(),
          ) as ArtistsDataProps[]
          artists = artists.concat(artistsResponse)
        })
        .catch((err) => {
          crashlytics().recordError(err)
        })
    }

    return artists
  }

  const handleGetFavoritesMusics = async (
    musicsId: string[],
  ): Promise<MusicProps[]> => {
    let musics = [] as MusicProps[]

    const batches = []
    const batchSize = 10

    for (let i = 0; i < musicsId.length; i += batchSize) {
      const batch = musicsId.slice(i, i + batchSize)
      batches.push(batch)
    }

    for (const batch of batches) {
      await firestore()
        .collection('musics')
        .where(firestore.FieldPath.documentId(), 'in', batch)
        .get({ source: 'cache' })
        .then((querySnapshot) => {
          const musicsResponse = querySnapshot.docs.map((doc) =>
            doc.data(),
          ) as MusicProps[]
          musics = musics.concat(musicsResponse)
        })
        .catch((err) => {
          crashlytics().recordError(err)
        })
    }

    return musics
  }

  return {
    handleGetArtists,
    handleGetMusicalGenres,
    handleGetMusicsDatabase,
    handleFavoriteMusic,
    handleFavoriteArtist,
    handleGetArtistById,
    handleGetMusicsById,
    handleGetFavoritesArtists,
    handleGetFavoritesMusics,
  }
}
