import Carousel from 'react-native-reanimated-carousel'

import { Release } from '@components/Release'

import { useNavigation } from '@react-navigation/native'
import { StackNavigationProps } from '@routes/routes'
import { ArtistsDataProps } from '@utils/Types/artistsProps'
import { MusicProps } from '@utils/Types/musicProps'

export interface AlbumProps {
  name: string
  artwork: string
}

interface AlbumCourselProps {
  albums: AlbumProps[]
  artist: ArtistsDataProps
  musics: MusicProps[]
}

export function AlbumsCarousel({ albums, artist }: AlbumCourselProps) {
  const navigation = useNavigation<StackNavigationProps>()

  return (
    <Carousel
      loop={false}
      style={{ width: 'auto' }}
      width={140}
      height={160}
      data={albums}
      scrollAnimationDuration={500}
      renderItem={({ item }) => (
        <Release
          name={item.name}
          artwork={item.artwork}
          onPress={() => {
            navigation.navigate('Album', {
              album: item.name,
              artistId: artist.id,
            })
          }}
          className="ml-4"
        />
      )}
    />
  )
}
