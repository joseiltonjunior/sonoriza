// import { PlaybackService } from '@services/PlaybackService'
import { useCallback, useEffect, useState } from 'react'
import {
  Alert,
  Button,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
// import { request, PERMISSIONS } from 'react-native-permissions'
import TrackPlayer, { State, Track } from 'react-native-track-player'

import Icon from 'react-native-vector-icons/AntDesign'

export function Home() {
  const [trackList, setTrackList] = useState([
    {
      url: 'https://firebasestorage.googleapis.com/v0/b/spotifree-1cc94.appspot.com/o/track-test.mp3?alt=media&token=dd445907-0696-4ab0-b7a5-781dd205f590&_gl=1*cih7gg*_ga*MTE2OTU1MDAzMS4xNjg1NjYwOTg2*_ga_CW55HF8NVT*MTY5NjYzMjcxNi4xMDkuMS4xNjk2NjMyODE5LjE4LjAuMA..', // Load media from the network
      title: 'Avaritia',
      artist: 'deadmau5',
      album: 'while(1<2)',
      genre: 'Progressive House, Electro House',
      date: '2014-05-20T07:00:00+00:00', // RFC 3339
      artwork: 'https://avatars.githubusercontent.com/u/47725788?v=4', // Load artwork from the network
      duration: 402, // Duration in seconds
    },
  ])

  const [isTrackPlayerInitialized, setIsTrackPlayerInitialized] =
    useState(false)

  const [isPlaying, setPlaying] = useState(false)

  const initializeTrackPlayer = useCallback(async () => {
    if (!isTrackPlayerInitialized) {
      await TrackPlayer.setupPlayer()
      setIsTrackPlayerInitialized(true)
      await TrackPlayer.add(trackList)
    }
  }, [isTrackPlayerInitialized, trackList])

  // const requestMusicPermission = useCallback(async () => {
  //   try {
  //     const result = await request(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE)

  //     if (result !== 'granted') {
  //       Alert.alert(
  //         'Permissão necessária',
  //         'Por favor, conceda permissão para acessar suas músicas.',
  //       )
  //     }
  //   } catch (error) {
  //     console.error('Erro ao solicitar permissão:', error)
  //   }
  // }, [])

  const addMusic = async (newTrack: Track) => {
    try {
      await TrackPlayer.add(newTrack)
    } catch (error) {
      Alert.alert('Error', 'Error ao add musica')
    }
  }

  const handleMusicInfo = useCallback(async () => {
    try {
      const state = await TrackPlayer.getState()

      if (state === State.Playing) {
        console.log('The player is playing')
        const trackIndex = (await TrackPlayer.getCurrentTrack()) as number
        const trackObject = (await TrackPlayer.getTrack(trackIndex)) as Track
        console.log(`Title: ${trackObject.url}`)
      }
    } catch (error) {
      Alert.alert('Error', 'Error ao reproduzir')
      console.log(error)
    }
  }, [])

  useEffect(() => {
    // handleMusicInfo()
    initializeTrackPlayer()
    // teste()
    // console.log(TrackPlayer.getQueue())
    // requestMusicPermission()
  }, [initializeTrackPlayer])

  return (
    <ScrollView className="p-2  flex-1">
      <Text className="text-white font-bold text-2xl text-center mt-4">
        Spotifree
      </Text>
      {/* <Button title="ADD TO LIST" onPress={addMusic} /> */}
      <View className="flex-1 items-center mt-12">
        <Image
          source={{ uri: trackList[0].artwork }}
          alt=""
          className="w-72 h-72 object-cover rounded-3xl"
        />
        <Text className="font-bold text-2xl mt-4">{trackList[0].title}</Text>
        <Text>{trackList[0].artist}</Text>
      </View>
      <View className="flex-1 h-1 bg-gray-500 mx-12 mt-8 rounded-2xl"></View>
      <View className="flex-row justify-around mt-4 items-center px-12">
        <TouchableOpacity
          onPress={() => TrackPlayer.skipToPrevious()}
          className=" p-2 rounded-full "
        >
          <Icon name="stepbackward" size={30} color="#000000" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            if (isPlaying) {
              TrackPlayer.pause()
              setPlaying(false)
            } else {
              TrackPlayer.play()
              setPlaying(true)
            }
          }}
          className="bg-white p-4 rounded-full "
        >
          <Icon
            name={isPlaying ? 'pause' : 'caretright'}
            size={30}
            color="#000000"
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => TrackPlayer.skipToNext()}
          className=" p-2 rounded-full "
        >
          <Icon name="stepforward" size={30} color="#000000" />
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}
