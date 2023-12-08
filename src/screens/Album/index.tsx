import { BottomMenu } from '@components/BottomMenu/Index'
import { ControlCurrentMusic } from '@components/ControlCurrentMusic'
import { InfoPlayingMusic } from '@components/InfoPlayingMusic'
import { useBottomModal } from '@hooks/useBottomModal'
import { useTrackPlayer } from '@hooks/useTrackPlayer'
import { useNavigation, useRoute } from '@react-navigation/native'
import { RouteParamsProps, StackNavigationProps } from '@routes/routes'
import { ReduxProps } from '@storage/index'
import { CurrentMusicProps } from '@storage/modules/currentMusic/reducer'
import {
  Dimensions,
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import { useSelector } from 'react-redux'
import colors from 'tailwindcss/colors'

export function Album() {
  const { params } = useRoute<RouteParamsProps<'Album'>>()
  const { album, musics } = params

  const { openModal } = useBottomModal()

  const navigation = useNavigation<StackNavigationProps>()

  const { handleMusicSelected } = useTrackPlayer()

  const size = Dimensions.get('window').width * 1

  const { isCurrentMusic } = useSelector<ReduxProps, CurrentMusicProps>(
    (state) => state.currentMusic,
  )

  return (
    <>
      <ScrollView showsVerticalScrollIndicator={false} className="bg-gray-700">
        <ImageBackground
          style={{ height: size }}
          source={{ uri: album.artwork }}
          alt="album photo"
          className="p-4"
        >
          <TouchableOpacity
            className="p-2 rounded-full"
            onPress={() => {
              navigation.goBack()
            }}
          >
            <Icon name="chevron-back-outline" size={30} color={colors.white} />
          </TouchableOpacity>
          <Text
            style={styles.text}
            className="font-nunito-bold text-white mt-auto"
          >
            {album.name}
          </Text>
        </ImageBackground>

        <View className="flex-row px-4 mt-2 items-center justify-between">
          <View className="rounded-full overflow-hidden">
            <TouchableOpacity
              // onPress={() => {
              //   if (!artist) return
              //   handleFavoriteArtist(artist)
              // }}
              activeOpacity={0.6}
              className="p-4"
            >
              <Icon
                name={album ? 'heart-sharp' : 'heart-outline'}
                color={colors.white}
                size={28}
              />
            </TouchableOpacity>
          </View>

          <View className="rounded-full overflow-hidden">
            <TouchableOpacity
              activeOpacity={0.6}
              className="bg-purple-600 p-3 items-center"
              onPress={() => {
                if (!album) return
                handleMusicSelected({
                  listMusics: musics,
                  musicSelected: musics[0],
                })
              }}
            >
              <View className="flex-row justify-center items-center">
                <Icon name="play" size={25} color={colors.white} />
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <View className="p-4 ">
          <Text className="font-nunito-bold text-xl text-white mb-4">
            Músicas do album
          </Text>
          {musics
            .filter((item) => item.album.includes(album.name))
            .map((item, index) => (
              <View
                className={`flex-row items-center mt-3 ${
                  index + 1 ===
                    musics.filter((item) => item.album.includes(album.name))
                      .length && 'pb-28'
                }`}
                key={item.id}
              >
                <TouchableOpacity
                  className="flex-row items-center gap-2 flex-1 overflow-hidden"
                  onPress={() => {
                    handleMusicSelected({
                      listMusics: musics,
                      musicSelected: item,
                    })
                  }}
                >
                  <View className="w-16 h-16 bg-purple-600 rounded-xl overflow-hidden items-center justify-center">
                    <Image
                      source={{ uri: item.artwork }}
                      alt="artwork"
                      className="h-full w-full"
                    />
                  </View>
                  <View className="w-full">
                    <Text
                      className="font-nunito-bold text-white text-base"
                      numberOfLines={1}
                    >
                      {item.title}
                    </Text>
                    <Text className="font-nunito-regular text-gray-300 mt-1">
                      {item.album}
                    </Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  className="ml-4"
                  onPress={() =>
                    openModal({
                      children: <InfoPlayingMusic currentMusic={item} />,
                    })
                  }
                >
                  <Icon
                    name="ellipsis-vertical"
                    size={24}
                    color={colors.white}
                  />
                </TouchableOpacity>
              </View>
            ))}
        </View>
      </ScrollView>
      <View className="absolute bottom-0 w-full">
        {isCurrentMusic && <ControlCurrentMusic music={isCurrentMusic} />}
        <BottomMenu />
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  text: {
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 2,
    fontSize: 30,
  },
})
