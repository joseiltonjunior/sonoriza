import firestore from '@react-native-firebase/firestore'
import crashlytics from '@react-native-firebase/crashlytics'
import { MusicProps } from '@utils/Types/musicProps'
import { MusicalGenresDataProps } from '@utils/Types/musicalGenresProps'
import { ArtistsDataProps } from '@utils/Types/artistsProps'

export function useFirebaseServices() {
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

  return {
    handleGetArtists,
    handleGetMusicalGenres,
    handleGetMusicsDatabase,
  }
}
