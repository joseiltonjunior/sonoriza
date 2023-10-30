import { MusicalGenresProps } from '@storage/modules/musicalGenres/reducer'
import { Text, TouchableOpacity, View } from 'react-native'
import Carousel from 'react-native-reanimated-carousel'

export function MusicalGenres({ musicalGenres }: MusicalGenresProps) {
  return (
    <View>
      <Carousel
        loop={false}
        style={{ width: '100%' }}
        width={170}
        height={70}
        data={musicalGenres}
        scrollAnimationDuration={1000}
        renderItem={({ item }) => (
          <TouchableOpacity
            className="bg-purple-600 mr-4 px-6 rounded-lg items-center justify-center h-full"
            activeOpacity={0.6}
          >
            <Text className="font-nunito-bold text-center text-white text-base leading-5">
              {item.name}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  )
}
