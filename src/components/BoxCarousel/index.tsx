import Carousel from 'react-native-reanimated-carousel'
import { Card } from '../Card'

import { useTrackPlayer } from '@hooks/useTrackPlayer'
import { MusicProps } from '@utils/Types/musicProps'

interface BoxCourselProps {
  musics: MusicProps[]
}

export function BoxCarousel({ musics }: BoxCourselProps) {
  const { handleMusicSelected } = useTrackPlayer()

  return (
    <Carousel
      loop={false}
      style={{ width: 'auto' }}
      width={140}
      height={160}
      data={musics}
      scrollAnimationDuration={1000}
      renderItem={({ item }) => (
        <Card
          title={item.title}
          album={item.album}
          artwork={item.artwork}
          onPress={() =>
            handleMusicSelected({
              musicSelected: item,
              listMusics: musics,
            })
          }
          className="ml-4"
        />
      )}
    />
  )
}
