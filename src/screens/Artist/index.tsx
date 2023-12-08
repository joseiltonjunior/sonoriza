import { AlbumsCarousel } from '@components/AlbumCarousel'
import { BottomMenu } from '@components/BottomMenu/Index'

import { ControlCurrentMusic } from '@components/ControlCurrentMusic'
import { InfoPlayingMusic } from '@components/InfoPlayingMusic'
import { Loading } from '@components/Loading'

import { Section } from '@components/Section'
import { useBottomModal } from '@hooks/useBottomModal'

import { useFirebaseServices } from '@hooks/useFirebaseServices'

import { useTrackPlayer } from '@hooks/useTrackPlayer'
import { useNavigation, useRoute } from '@react-navigation/native'
import { RouteParamsProps, StackNavigationProps } from '@routes/routes'
import { ReduxProps } from '@storage/index'

import { CurrentMusicProps } from '@storage/modules/currentMusic/reducer'

import { UserProps } from '@storage/modules/user/reducer'
import { ArtistsDataProps } from '@utils/Types/artistsProps'
import { MusicProps } from '@utils/Types/musicProps'

import { useEffect, useMemo, useState } from 'react'

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

interface AlbumProps {
  name: string
  artwork: string
}

export function Artist() {
  const { params } = useRoute<RouteParamsProps<'Artist'>>()
  const { artistId } = params

  const size = Dimensions.get('window').width * 1

  const { openModal } = useBottomModal()

  const [artist, setArtist] = useState<ArtistsDataProps>()
  const [albums, setAlbums] = useState<AlbumProps[]>([])
  const [topMusics, setTopMusics] = useState<MusicProps[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const navigation = useNavigation<StackNavigationProps>()
  const { handleMusicSelected } = useTrackPlayer()
  const { handleGetArtistById, handleGetAllMusicsById } = useFirebaseServices()

  const { isCurrentMusic } = useSelector<ReduxProps, CurrentMusicProps>(
    (state) => state.currentMusic,
  )

  const { user } = useSelector<ReduxProps, UserProps>((state) => state.user)

  const { handleFavoriteArtist } = useFirebaseServices()

  const removeDuplicates = (arr: AlbumProps[]): AlbumProps[] => {
    return arr.filter((value, index, self) => {
      return self.findIndex((m) => m.name === value.name) === index
    })
  }

  const handleGetMusics = async (musicsId: string[]) => {
    await handleGetAllMusicsById(musicsId)
      .then((result) => {
        setTopMusics(result)

        const filterAlbums = result.map((music) => ({
          name: music.album,
          artwork: music.artwork,
        }))

        const uniqueAlbumList = removeDuplicates(filterAlbums)
        console.log(uniqueAlbumList)
        setAlbums(uniqueAlbumList)
      })
      .catch((err) => console.log(err, 'err'))
      .finally(() => setIsLoading(false))
  }

  const handleGetArtist = async () => {
    setIsLoading(true)
    await handleGetArtistById(artistId)
      .then((result) => {
        handleGetMusics(result.musics)
        setArtist(result)
      })
      .catch((err) => console.log(err, 'err'))
  }

  const isFavorite = useMemo(() => {
    const filter = user.favoritesArtists?.find((item) => item === artist?.id)

    return !!filter
  }, [artist?.id, user.favoritesArtists])

  useEffect(() => {
    if (artistId) {
      handleGetArtist()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [artistId])

  if (isLoading || !artist) return <Loading />

  return (
    <>
      <ScrollView
        className="flex-1 bg-gray-700"
        showsVerticalScrollIndicator={false}
      >
        <ImageBackground
          source={{ uri: artist?.photoURL }}
          alt={artist?.name}
          style={{ height: size }}
          className={`p-4 `}
        >
          <TouchableOpacity
            className="p-2 rounded-full"
            onPress={() => {
              navigation.goBack()
            }}
          >
            <Icon name="chevron-back-outline" size={30} color={colors.white} />
          </TouchableOpacity>

          <View className="mt-auto">
            <Text className="font-nunito-bold text-white" style={styles.text}>
              {artist?.name}
            </Text>
          </View>
        </ImageBackground>

        <View className="flex-row px-4 mt-2 items-center justify-between">
          <View className="rounded-full overflow-hidden">
            <TouchableOpacity
              onPress={() => {
                if (!artist) return
                handleFavoriteArtist(artist)
              }}
              activeOpacity={0.6}
              className="p-4"
            >
              <Icon
                name={isFavorite ? 'heart-sharp' : 'heart-outline'}
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
                if (!topMusics) return
                handleMusicSelected({
                  listMusics: topMusics,
                  musicSelected: topMusics[0],
                })
              }}
            >
              <View className="flex-row justify-center items-center">
                <Icon name="play" size={25} color={colors.white} />
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <View className={`p-4 `}>
          <Text className="font-nunito-bold text-xl text-white">
            Top Músicas
          </Text>

          {topMusics
            ?.map((item) => (
              <View className="flex-row items-center mt-3" key={item.id}>
                <TouchableOpacity
                  className="flex-row items-center gap-2 flex-1 overflow-hidden"
                  onPress={() => {
                    if (!topMusics) return
                    handleMusicSelected({
                      listMusics: topMusics,
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
                  className="p-2"
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
            ))
            .slice(0, 4)}

          {topMusics && topMusics.length > 4 && (
            <TouchableOpacity
              className="bg-purple-600 rounded-md items-center py-1 mt-2"
              onPress={() => {
                navigation.navigate('MoreMusic', {
                  title: `${artist?.name}`,
                  type: 'artist',
                  artistFlow: artist?.musics,
                })
              }}
            >
              <Text className="font-nunito-medium text-white">
                Mostrar mais
              </Text>
            </TouchableOpacity>
          )}
        </View>
        {albums.length > 0 && (
          <Section
            title="Albums"
            className={`mt-6 ${isCurrentMusic ? 'mb-32' : 'mb-16'}`}
          >
            <AlbumsCarousel
              albums={albums}
              artist={artist}
              musics={topMusics}
            />
          </Section>
        )}
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
