import Carousel from 'react-native-reanimated-carousel'

import { Rounded } from '@components/Rounded'
import { useNavigation } from '@react-navigation/native'
import { StackNavigationProps } from '@routes/routes'
import { ArtistsDataProps } from '@utils/Types/artistsProps'
import { useSelector } from 'react-redux'
import { ReduxProps } from '@storage/index'
import { NetInfoProps } from '@storage/modules/netInfo/reducer'

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

  const { status } = useSelector<ReduxProps, NetInfoProps>(
    (state) => state.netInfo,
  )

  return (
    <Carousel
      loop={false}
      style={{ width: 'auto' }}
      width={roundedSmall ? 130 : 150}
      height={roundedSmall ? 150 : 160}
      data={artists}
      scrollAnimationDuration={500}
      renderItem={({ item }) => (
        <Rounded
          disabled={!status}
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
