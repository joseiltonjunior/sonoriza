import Carousel from 'react-native-reanimated-carousel'
import { Card } from '../Card'

import { MusicProps } from '@utils/Types/musicProps'
import { useTrackPlayer } from '@hooks/useTrackPlayer'

interface BoxCourselProps {
  musics: MusicProps[]
}

export function BoxCarousel({ musics }: BoxCourselProps) {
  const { handleMusicSelected } = useTrackPlayer()

  return (
    <Carousel
      loop={false}
      style={{ width: 'auto' }}
      width={170}
      height={190}
      data={musics}
      scrollAnimationDuration={1000}
      renderItem={({ item, index }) => (
        <Card
          title={item.title}
          artist={item.artist}
          artwork={item.artwork}
          onPress={() =>
            handleMusicSelected({
              indexSelected: index,
              musicSelected: item,
              listMusics: musics,
            })
          }
          className="mr-4"
        />
      )}
    />
  )
}
