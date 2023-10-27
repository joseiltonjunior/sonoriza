import Carousel from 'react-native-reanimated-carousel'
import { Card } from '../Card'

import { useNavigation } from '@react-navigation/native'
import { StackNavigationProps } from '@routes/routes'
import { MusicProps } from '@utils/Types/musicProps'
import { useTrackPlayer } from '@hooks/useTrackPlayer'

interface BoxCourselProps {
  musics: MusicProps[]
}

export function BoxCarousel({ musics }: BoxCourselProps) {
  const navigation = useNavigation<StackNavigationProps>()
  const { TrackPlayer } = useTrackPlayer()

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
          onPress={() => {
            TrackPlayer.reset()
            TrackPlayer.add(musics)
            TrackPlayer.skip(index)
            TrackPlayer.play()

            navigation.navigate('Music')
          }}
          className="mr-4"
        />
      )}
    />
  )
}
