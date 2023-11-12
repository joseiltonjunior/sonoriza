import Carousel from 'react-native-reanimated-carousel'

import { Rounded } from '@components/Rounded'
import { useNavigation } from '@react-navigation/native'
import { StackNavigationProps } from '@routes/routes'
import { ArtistsDataProps } from '@utils/Types/artistsProps'

interface RoundedCourselProps {
  artists: ArtistsDataProps[]
  roundedSmall?: boolean
  onAction?: () => void
}

export function RoundedCarousel({
  artists,
  roundedSmall,
  onAction,
}: RoundedCourselProps) {
  const navigation = useNavigation<StackNavigationProps>()

  return (
    <Carousel
      loop={false}
      style={{ width: 'auto' }}
      width={roundedSmall ? 130 : 160}
      height={roundedSmall ? 150 : 180}
      data={artists}
      scrollAnimationDuration={1000}
      renderItem={({ item }) => (
        <Rounded
          artist={item.name}
          artwork={item.photoURL}
          roundedSmall={roundedSmall}
          onPress={() => {
            if (onAction) onAction()
            navigation.navigate('Artist', { artistId: item.id })
          }}
          className={`ml-4`}
        />
      )}
    />
  )
}
