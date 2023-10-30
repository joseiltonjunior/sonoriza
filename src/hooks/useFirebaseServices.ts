import { useCallback } from 'react'
import firestore from '@react-native-firebase/firestore'
import crashlytics from '@react-native-firebase/crashlytics'
import { MusicProps } from '@utils/Types/musicProps'
import { MusicalGenresDataProps } from '@storage/modules/musicalGenres/reducer'
import { ArtistsDataProps } from '@storage/modules/artists/reducer'

export function useFirebaseServices() {
  const handleGetMusicsDatabase = useCallback(async () => {
    const response = await firestore()
      .collection('musics')
      .get()
      .then(async (querySnapshot) => {
        const musicsResponse = querySnapshot.docs.map((doc) => ({
          url: doc.data().url,
          artwork: doc.data().artwork,
          artist: doc.data().artist,
          title: doc.data().title,
        })) as MusicProps[]

        return musicsResponse
      })
      .catch((err) => {
        crashlytics().recordError(err)
      })

    return response as MusicProps[]
  }, [])

  const handleGetMusicalGenres = useCallback(async () => {
    const response = await firestore()
      .collection('musicalGenres')
      .get()
      .then(async (querySnapshot) => {
        const musicalGenresResponse = querySnapshot.docs.map((doc) => ({
          name: doc.data().name as string,
        })) as MusicalGenresDataProps[]

        return musicalGenresResponse
      })
      .catch((err) => {
        crashlytics().recordError(err)
      })
    return response as MusicalGenresDataProps[]
  }, [])

  const handleGetArtists = useCallback(async () => {
    const response = await firestore()
      .collection('artists')
      .get()
      .then(async (querySnapshot) => {
        const artistsResponse = querySnapshot.docs.map((doc) => ({
          name: doc.data().name as string,
          photoURL: doc.data().photoURL as string,
        })) as ArtistsDataProps[]

        return artistsResponse
      })

      .catch((err) => {
        crashlytics().recordError(err)
      })

    return response as ArtistsDataProps[]
  }, [])

  return { handleGetArtists, handleGetMusicalGenres, handleGetMusicsDatabase }
}
