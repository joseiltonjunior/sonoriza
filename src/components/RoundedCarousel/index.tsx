import Carousel from 'react-native-reanimated-carousel'

import { Rounded } from '@components/Rounded'

interface RoundedCourselProps {
  artists: {
    name: string
    photoURL: string
  }[]
}

export function RoundedCarousel({ artists }: RoundedCourselProps) {
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
          //   onPress={() => console.log(item)}
          className="mr-4"
        />
      )}
    />
  )
}
