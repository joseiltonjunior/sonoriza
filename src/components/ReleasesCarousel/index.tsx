import Carousel from 'react-native-reanimated-carousel'

import { Release } from '@components/Release'
import { ReleasesDataProps } from '@utils/Types/releasesProps'
import { useNavigation } from '@react-navigation/native'
import { StackNavigationProps } from '@routes/routes'

interface ReleasesCourselProps {
  releases: ReleasesDataProps[]
}

export function ReleasesCarousel({ releases }: ReleasesCourselProps) {
  const navigation = useNavigation<StackNavigationProps>()

  return (
    <Carousel
      loop={false}
      style={{ width: 'auto' }}
      width={140}
      height={160}
      data={releases}
      scrollAnimationDuration={1000}
      renderItem={({ item }) => (
        <Release
          name={item.name}
          artwork={item.artwork}
          onPress={() => navigation.navigate('Artist', { artistId: item.id })}
          className="ml-4"
        />
      )}
    />
  )
}
