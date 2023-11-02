import Carousel from 'react-native-reanimated-carousel'

import { Rounded } from '@components/Rounded'
import { useNavigation } from '@react-navigation/native'
import { StackNavigationProps } from '@routes/routes'
import { ArtistsDataProps } from '@utils/Types/artistsProps'

interface RoundedCourselProps {
  artists: ArtistsDataProps[]
}

export function RoundedCarousel({ artists }: RoundedCourselProps) {
  const navigation = useNavigation<StackNavigationProps>()

  return (
    <Carousel
      loop={false}
      style={{ width: 'auto' }}
      width={170}
      height={190}
      data={artists}
      scrollAnimationDuration={1000}
      renderItem={({ item }) => (
        <Rounded
          artist={item.name}
          artwork={item.photoURL}
          onPress={() => {
            navigation.navigate('Artist', { artist: item })
          }}
          className="mr-4"
        />
      )}
    />
  )
}
