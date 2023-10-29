import Carousel from 'react-native-reanimated-carousel'
import { Card } from '../Card'

import { useNavigation } from '@react-navigation/native'
import { StackNavigationProps } from '@routes/routes'
import { MusicProps } from '@utils/Types/musicProps'
import { useTrackPlayer } from '@hooks/useTrackPlayer'
import { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import {
  handleChangeStateCurrentMusic,
  handleSetCurrentMusic,
} from '@storage/modules/currentMusic/reducer'
import { State } from 'react-native-track-player'

interface BoxCourselProps {
  musics: MusicProps[]
  currentMusic?: MusicProps
}

export function BoxCarousel({ musics, currentMusic }: BoxCourselProps) {
  const navigation = useNavigation<StackNavigationProps>()
  const { TrackPlayer } = useTrackPlayer()

  const dispatch = useDispatch()

  const handleMusicSelected = useCallback(
    async (music: MusicProps, index: number) => {
      if (currentMusic?.title === music.title) {
        navigation.navigate('Music')
        return
      }

      TrackPlayer.reset()
      TrackPlayer.add(musics)
      TrackPlayer.skip(index)
      TrackPlayer.play()
      navigation.navigate('Music')
      dispatch(handleSetCurrentMusic({ isCurrentMusic: music }))
      dispatch(handleChangeStateCurrentMusic(State.Playing))
    },
    [currentMusic?.title, TrackPlayer, musics, dispatch, navigation],
  )

  return (
    <Carousel
      loop={false}
      style={{ width: 'auto' }}
      width={150}
      height={170}
      data={musics}
      scrollAnimationDuration={1000}
      renderItem={({ item, index }) => (
        <Card
          title={item.title}
          artist={item.artist}
          artwork={item.artwork}
          onPress={() => handleMusicSelected(item, index)}
          className="mr-4"
        />
      )}
    />
  )
}
