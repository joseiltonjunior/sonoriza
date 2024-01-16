import Carousel from 'react-native-reanimated-carousel'
import IconFather from 'react-native-vector-icons/Feather'

import playing from '@assets/playing.json'
import AnimatedLottieView from 'lottie-react-native'

import { useTrackPlayer } from '@hooks/useTrackPlayer'
import { MusicProps } from '@utils/Types/musicProps'
import { Text, View, TouchableOpacity, ImageBackground } from 'react-native'
import colors from 'tailwindcss/colors'
import { useSelector } from 'react-redux'
import { ReduxProps } from '@storage/index'
import { CurrentMusicProps } from '@storage/modules/currentMusic/reducer'
import { useBottomModal } from '@hooks/useBottomModal'
import { InfoPlayingMusic } from '@components/InfoPlayingMusic'

interface ListCourselProps {
  musics: MusicProps[]
}

export function ListCarousel({ musics }: ListCourselProps) {
  const { handleMusicSelected } = useTrackPlayer()

  const { openModal } = useBottomModal()

  const { isCurrentMusic } = useSelector<ReduxProps, CurrentMusicProps>(
    (state) => state.currentMusic,
  )

  function chunkArray(array: MusicProps[], chunkSize: number) {
    const result = []
    for (let i = 0; i < array.length; i += chunkSize) {
      result.push(array.slice(i, i + chunkSize))
    }
    return result
  }

  return (
    <Carousel
      loop={false}
      style={{ width: 'auto' }}
      width={320}
      height={230}
      data={chunkArray(musics, 3)}
      scrollAnimationDuration={500}
      renderItem={({ item }) => (
        <View className=" ml-4">
          {item.map((music, index) => (
            <View
              className="flex-row justify-between items-center overflow-hidden mb-4"
              key={index}
            >
              <TouchableOpacity
                className="flex-row items-center gap-2 w-full"
                onLongPress={() => {
                  openModal({
                    children: <InfoPlayingMusic currentMusic={music} />,
                  })
                }}
                onPress={() => {
                  handleMusicSelected({
                    musicSelected: music,

                    listMusics: musics,
                  })
                }}
              >
                <View className="w-16 h-16 bg-purple-600 rounded-xl overflow-hidden items-center justify-center">
                  {music.artwork ? (
                    <ImageBackground
                      source={{ uri: music.artwork }}
                      alt="artwork"
                      className="h-full w-full items-center justify-center"
                    >
                      {music.title === isCurrentMusic?.title && (
                        <View className="bg-white/80 rounded-full p-1">
                          <AnimatedLottieView
                            source={playing}
                            autoPlay
                            loop
                            style={{ width: 30, height: 30 }}
                          />
                        </View>
                      )}
                    </ImageBackground>
                  ) : (
                    <IconFather name="music" size={28} color={colors.white} />
                  )}
                </View>
                <View>
                  <Text
                    className="font-nunito-bold text-white"
                    numberOfLines={1}
                  >
                    {music.title}
                  </Text>
                  <Text className="font-nunito-regular text-gray-300">
                    {music.artists[0].name}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}
    />
  )
}
