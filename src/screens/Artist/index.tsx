import { BottomMenu } from '@components/BottomMenu/Index'

import { ControlCurrentMusic } from '@components/ControlCurrentMusic'
import { useTrackPlayer } from '@hooks/useTrackPlayer'
import { useNavigation, useRoute } from '@react-navigation/native'
import { RouteParamsProps, StackNavigationProps } from '@routes/routes'
import { ReduxProps } from '@storage/index'
import { CurrentMusicProps } from '@storage/modules/currentMusic/reducer'
import { TrackListRemoteProps } from '@storage/modules/trackListRemote/reducer'

import { useMemo } from 'react'
import {
  FlatList,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import Icon from 'react-native-vector-icons/AntDesign'
import { useSelector } from 'react-redux'
import colors from 'tailwindcss/colors'

export function Artist() {
  const { params } = useRoute<RouteParamsProps<'Artist'>>()
  const { artist } = params

  const navigation = useNavigation<StackNavigationProps>()
  const { handleMusicSelected } = useTrackPlayer()

  const { isCurrentMusic } = useSelector<ReduxProps, CurrentMusicProps>(
    (state) => state.currentMusic,
  )

  const { trackListRemote } = useSelector<ReduxProps, TrackListRemoteProps>(
    (state) => state.trackListRemote,
  )

  const handleFilterMusics = useMemo(() => {
    return trackListRemote.filter((music) =>
      music.artist.toString().includes(artist.name),
    )
  }, [artist.name, trackListRemote])

  return (
    <>
      <View className="flex-1">
        <ImageBackground
          source={{ uri: artist.photoURL }}
          alt={artist.name}
          className="h-80 w-screen p-4"
        >
          <View>
            <TouchableOpacity
              onPress={() => {
                navigation.goBack()
              }}
            >
              <Icon name="back" size={30} color={colors.white} />
            </TouchableOpacity>
          </View>
          <View className="mt-auto items-center mb-14">
            <Text className="font-nunito-bold text-white" style={styles.text}>
              {artist.name}
            </Text>
          </View>
        </ImageBackground>

        <View className="bottom-6 flex-row px-4 items-center justify-center">
          <TouchableOpacity
            activeOpacity={1}
            className="bg-purple-600 rounded-full px-12 py-4 items-center"
            onPress={() => {
              handleMusicSelected({
                indexSelected: 0,
                listMusics: handleFilterMusics,
                musicSelected: handleFilterMusics[0],
              })
            }}
          >
            <View className="flex-row justify-center ">
              <Icon name="caretright" size={16} color={colors.white} />
              <Text className="font-nunito-bold text-white ml-4">TOCAR</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            className="bg-gray-700 p-4 rounded-full right-4 absolute"
          >
            <Icon name="hearto" color={colors.red[600]} size={22} />
          </TouchableOpacity>
        </View>

        <View className="p-4 ">
          <Text className="font-nunito-bold text-xl text-white">
            Top músicas
          </Text>

          <FlatList
            className="mt-8"
            showsVerticalScrollIndicator={false}
            data={handleFilterMusics}
            ItemSeparatorComponent={() => <View className="h-3" />}
            renderItem={({ item, index }) => (
              <View className="flex-row items-center ">
                <TouchableOpacity
                  key={index}
                  className="flex-row items-center gap-2 flex-1 overflow-hidden pr-24 "
                  onPress={() => {
                    handleMusicSelected({
                      indexSelected: index,
                      listMusics: handleFilterMusics,
                      musicSelected: item,
                    })
                  }}
                >
                  <View className="w-20 h-20 bg-purple-600 rounded-xl overflow-hidden items-center justify-center">
                    <Image
                      source={{ uri: item.artwork }}
                      alt="artwork"
                      className="h-full w-full"
                    />
                  </View>
                  <View>
                    <Text className="font-nunito-bold text-white text-base">
                      {item.title}
                    </Text>
                    <Text className="font-nunito-regular text-gray-300 mt-1">
                      {item.artist}
                    </Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.6} className="">
                  <Icon name="hearto" color={colors.white} size={22} />
                </TouchableOpacity>
              </View>
            )}
          />
        </View>
      </View>
      {isCurrentMusic && <ControlCurrentMusic music={isCurrentMusic} />}
      <BottomMenu />
    </>
  )
}
const styles = StyleSheet.create({
  text: {
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
    fontSize: 42,
  },
})
