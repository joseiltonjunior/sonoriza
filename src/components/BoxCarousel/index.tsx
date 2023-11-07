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
      width={170}
      height={190}
      data={musics}
      scrollAnimationDuration={1000}
      renderItem={({ item, index }) => (
        <Card
          title={item.title}
          album={item.album}
          artwork={item.artwork}
          onPress={() =>
            handleMusicSelected({
              indexSelected: index,
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
