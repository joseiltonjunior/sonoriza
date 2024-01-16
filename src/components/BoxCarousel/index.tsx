import Carousel from 'react-native-reanimated-carousel'
import { Card } from '../Card'

import { useTrackPlayer } from '@hooks/useTrackPlayer'
import { MusicProps } from '@utils/Types/musicProps'
import { InfoPlayingMusic } from '@components/InfoPlayingMusic'
import { useBottomModal } from '@hooks/useBottomModal'

interface BoxCourselProps {
  musics: MusicProps[]
}

export function BoxCarousel({ musics }: BoxCourselProps) {
  const { handleMusicSelected } = useTrackPlayer()

  const { openModal } = useBottomModal()

  return (
    <Carousel
      loop={false}
      style={{ width: 'auto' }}
      width={140}
      height={160}
      data={musics}
      scrollAnimationDuration={500}
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
          onLongPress={() => {
            openModal({
              children: <InfoPlayingMusic currentMusic={item} />,
            })
          }}
          className="ml-4"
        />
      )}
    />
  )
}
