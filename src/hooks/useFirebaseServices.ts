import firestore from '@react-native-firebase/firestore'
import messaging from '@react-native-firebase/messaging'

import crashlytics from '@react-native-firebase/crashlytics'
import { MusicProps } from '@utils/Types/musicProps'
import { MusicalGenresDataProps } from '@utils/Types/musicalGenresProps'
import { ArtistsDataProps } from '@utils/Types/artistsProps'
import { useDispatch, useSelector } from 'react-redux'
import { ReduxProps } from '@storage/index'
import { UserProps, handleSetUser } from '@storage/modules/user/reducer'
import { ReleasesDataProps } from '@utils/Types/releasesProps'
import { UserDataProps } from '@utils/Types/userProps'

import { shuffleArray } from '@utils/Types/shuffleArray'
import { NotificationsDataProps } from '@utils/Types/notificationsProps'
import { VersionProps } from '@utils/Types/versionProps'
import { PlaylistProps } from '@utils/Types/playlistProps'
import { useToast } from './useToast'

export function useFirebaseServices() {
  const { user } = useSelector<ReduxProps, UserProps>((state) => state.user)

  const { showToast } = useToast()

  const dispatch = useDispatch()

  const handleGetMusicsNewUser = async (): Promise<MusicProps[]> => {
    let musics = [] as MusicProps[]
    await firestore()
      .collection('musics')
      .limit(10)
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

  const handleGetArtistsNewUser = async (): Promise<ArtistsDataProps[]> => {
    let artists = [] as ArtistsDataProps[]
    await firestore()
      .collection('artists')
      .limit(10)
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
        showToast({ title: 'Removido dos favoritos.' })
      } else {
        favoritesMusics = [...favoritesMusics, musicSelected.id]
        like++
        showToast({ title: 'Adicionado aos favoritos.' })
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

  const handleGetArtistById = async (
    artistID: string,
  ): Promise<ArtistsDataProps> => {
    let artist = {} as ArtistsDataProps
    await firestore()
      .collection('artists')
      .doc(artistID)
      .get()
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
    page = 1,
    pageSize = 10,
  ): Promise<MusicProps[]> => {
    let musics = [] as MusicProps[]

    const startIndex = (page - 1) * pageSize

    await firestore()
      .collection('musics')
      .where(
        firestore.FieldPath.documentId(),
        'in',
        musicsId.slice(startIndex, startIndex + pageSize),
      )
      .get()
      .then((querySnapshot) => {
        const musicsResponse = querySnapshot.docs.map((doc) =>
          doc.data(),
        ) as MusicProps[]
        musics = musics.concat(musicsResponse)
      })
      .catch((err) => {
        crashlytics().recordError(err)
      })

    return musics
  }

  const handleGetAllMusicsById = async (
    musicsId: string[],
    pageSize = 10,
  ): Promise<MusicProps[]> => {
    let musics = [] as MusicProps[]
    const totalItems = musicsId.length
    const totalPages = Math.ceil(totalItems / pageSize)

    for (let page = 1; page <= totalPages; page++) {
      const startIndex = (page - 1) * pageSize
      const endIndex = Math.min(startIndex + pageSize, totalItems)

      const batchIds = musicsId.slice(startIndex, endIndex)

      if (batchIds.length === 0) {
        break // Não há mais lotes para buscar
      }

      await firestore()
        .collection('musics')
        .where(firestore.FieldPath.documentId(), 'in', batchIds)
        .get()
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

  const handleGetFavoritesArtists = async (
    artistsId: string[],
    page = 1,
    pageSize = 10,
  ): Promise<ArtistsDataProps[]> => {
    let artists = [] as ArtistsDataProps[]

    const startIndex = (page - 1) * pageSize

    await firestore()
      .collection('artists')
      .where(
        firestore.FieldPath.documentId(),
        'in',
        artistsId.slice(startIndex, startIndex + pageSize),
      )
      .get()
      .then((querySnapshot) => {
        const artistsResponse = querySnapshot.docs.map((doc) =>
          doc.data(),
        ) as ArtistsDataProps[]
        artists = artists.concat(artistsResponse)
      })
      .catch((err) => {
        crashlytics().recordError(err)
      })

    return artists
  }

  const handleGetFavoritesMusics = async (
    musicsId: string[],
    page = 1,
    pageSize = 10,
  ): Promise<MusicProps[]> => {
    let musics = [] as MusicProps[]

    const startIndex = (page - 1) * pageSize
    await firestore()
      .collection('musics')
      .where(
        firestore.FieldPath.documentId(),
        'in',
        musicsId.slice(startIndex, startIndex + pageSize),
      )
      .get()
      .then((querySnapshot) => {
        const musicsResponse = querySnapshot.docs.map((doc) =>
          doc.data(),
        ) as MusicProps[]
        musics = musics.concat(musicsResponse)
      })

    return musics
  }

  const handleGetMusicsByGenre = async (
    musicalGenre: string,
  ): Promise<MusicProps[]> => {
    let musics = [] as MusicProps[]

    await firestore()
      .collection('musics')
      .where('genre', '==', musicalGenre)
      .get()
      .then((querySnapshot) => {
        const musicsResponse = querySnapshot.docs.map((doc) =>
          doc.data(),
        ) as MusicProps[]
        musics = musicsResponse
      })

    return musics
  }

  const handleGetInspiredMixes = async (
    musicalGenres: string[],
    noIncludes: string[],
  ): Promise<MusicProps[]> => {
    let musics = [] as MusicProps[]

    for (const musicalGenre of musicalGenres) {
      const genreMusics = await firestore()
        .collection('musics')
        .where('genre', '==', musicalGenre)
        .where(firestore.FieldPath.documentId(), 'not-in', noIncludes)
        .limit(5)
        .get()
        .then((querySnapshot) =>
          querySnapshot.docs.map((doc) => doc.data() as MusicProps),
        )

      musics = [...musics, ...genreMusics]
    }

    return shuffleArray(musics)
  }

  const handleGetArtistsByGenre = async (
    musicalGenre: string,
    page = 1,
    pageSize = 10,
  ): Promise<ArtistsDataProps[]> => {
    let artists = [] as ArtistsDataProps[]

    const startIndex = (page - 1) * pageSize

    let query = firestore()
      .collection('artists')
      .where('musicalGenres', 'array-contains', { name: musicalGenre })
      .limit(pageSize)

    if (startIndex > 0) {
      const startAfterDoc = await firestore()
        .collection('artists')
        .where('musicalGenres', 'array-contains', { name: musicalGenre })
        .limit(startIndex)
        .get()

      if (!startAfterDoc.empty) {
        query = query.startAfter(startAfterDoc.docs[startAfterDoc.size - 1])
      }
    }

    const querySnapshot = await query.get()

    if (!querySnapshot.empty) {
      artists = querySnapshot.docs.map((doc) => doc.data() as ArtistsDataProps)
    } else {
      console.log('Não há mais resultados.')
    }

    return artists
  }

  const handleGetMusicsByFilter = async (
    filter: string,
  ): Promise<MusicProps[]> => {
    const querySnapshot = await firestore()
      .collection('musics')
      .where('title', '>=', filter)
      .where('title', '<=', filter + '\uf8ff')
      .get()

    const musics = querySnapshot.docs.map((doc) => doc.data() as MusicProps)
    return musics
  }

  const handleGetArtistsByFilter = async (
    filter: string,
  ): Promise<ArtistsDataProps[]> => {
    const querySnapshot = await firestore()
      .collection('artists')
      .where('name', '>=', filter)
      .where('name', '<=', filter + '\uf8ff')
      .get()

    const artists = querySnapshot.docs.map(
      (doc) => doc.data() as ArtistsDataProps,
    )
    return artists
  }

  const handleGetMusicsByAlbum = async (
    filter: string,
  ): Promise<MusicProps[]> => {
    const querySnapshot = await firestore()
      .collection('musics')
      .where('album', '==', filter)
      .get()

    const musics = querySnapshot.docs.map((doc) => doc.data() as MusicProps)
    return musics
  }

  const handleGetReleases = async (): Promise<ReleasesDataProps[]> => {
    const querySnapshot = await firestore().collection('releases').get()

    const releases = querySnapshot.docs.map(
      (doc) => doc.data() as ReleasesDataProps,
    )

    return releases
  }

  async function handleFetchDataUser(userUid: string) {
    const user = (
      await firestore().collection('users').doc(userUid).get()
    ).data() as UserDataProps

    return user
  }

  const handleGetNotifications = async (): Promise<
    NotificationsDataProps[]
  > => {
    const querySnapshot = await firestore().collection('notifications').get()

    const nofications = querySnapshot.docs.map(
      (doc) => doc.data() as NotificationsDataProps,
    )

    return nofications
  }

  async function handleSaveUser({
    email,
    displayName,
    photoURL,
    uid,
    plan,
  }: UserDataProps) {
    firestore().collection('users').doc(uid).set({
      email,
      displayName,
      photoURL,
      uid,
      plan,
    })
  }

  const handleRequestPermissionNotifications = async (userId: string) => {
    const status = await messaging().requestPermission()

    const enable = status === 1 || status === 2

    if (enable) {
      const tokenFcm = await messaging().getToken()

      const userDocRef = firestore().collection('users').doc(userId)

      await userDocRef.update({ tokenFcm })
    }
  }

  async function handleFetchNewVersionApp(versionId: string) {
    const version = (
      await firestore().collection('versions').doc(versionId).get()
    ).data() as VersionProps

    return version
  }

  const handleGetPlaylistByUserId = async (
    userId: string,
  ): Promise<PlaylistProps[]> => {
    const querySnapshot = await firestore()
      .collection('playlists')
      .where('userId', '==', userId)
      .get()

    const playlists = querySnapshot.docs.map(
      (doc) => doc.data() as PlaylistProps,
    )
    return playlists
  }

  return {
    handleGetArtistsNewUser,
    handleGetMusicalGenres,
    handleGetMusicsNewUser,
    handleFavoriteMusic,
    handleFavoriteArtist,
    handleGetArtistById,
    handleGetMusicsById,
    handleGetFavoritesArtists,
    handleGetFavoritesMusics,
    handleGetMusicsByFilter,
    handleGetMusicsByGenre,
    handleGetArtistsByFilter,
    handleGetReleases,
    handleFetchDataUser,
    handleGetArtistsByGenre,
    handleGetInspiredMixes,
    handleGetAllMusicsById,
    handleSaveUser,
    handleRequestPermissionNotifications,
    handleGetNotifications,
    handleGetMusicsByAlbum,
    handleFetchNewVersionApp,
    handleGetPlaylistByUserId,
  }
}
