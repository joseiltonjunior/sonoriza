import { AlbumsCarousel } from '@components/AlbumCarousel'
import { BottomMenu } from '@components/BottomMenu/Index'

import { ControlCurrentMusic } from '@components/ControlCurrentMusic'
import { Loading } from '@components/Loading'
import { MusicComponent } from '@components/MusicComponent'

import { Section } from '@components/Section'
import { useToast } from '@hooks/useToast'

import { useTrackPlayer } from '@hooks/useTrackPlayer'
import { useNavigation, useRoute } from '@react-navigation/native'
import { RouteParamsProps, StackNavigationProps } from '@routes/routes'
import { api } from '@services/api'
import { ReduxProps } from '@storage/index'

import { CurrentMusicProps } from '@storage/modules/currentMusic/reducer'
import { FavoriteArtistsProps, setFavoriteArtists } from '@storage/modules/favoriteArtists/reducer'

import { UserProps } from '@storage/modules/user/reducer'
import { ArtistsDataProps } from '@utils/Types/artistsProps'
import { MusicProps } from '@utils/Types/musicProps'
import { UserDataProps } from '@utils/Types/userProps'

import { useEffect, useMemo, useState } from 'react'

import {
  Dimensions,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import { useDispatch, useSelector } from 'react-redux'
import colors from 'tailwindcss/colors'

interface AlbumProps {
  name: string
  artwork: string
}

export function Artist() {
  const { params } = useRoute<RouteParamsProps<'Artist'>>()
  const { artistId } = params

  const size = Dimensions.get('window').width * 1

  const { showToast } = useToast()

  const dispatch = useDispatch();

  const [artist, setArtist] = useState<ArtistsDataProps>()
  const [albums, setAlbums] = useState<AlbumProps[]>([])
  const [topMusics, setTopMusics] = useState<MusicProps[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const navigation = useNavigation<StackNavigationProps>()
  const { handleMusicSelected } = useTrackPlayer()

  const { isCurrentMusic } = useSelector<ReduxProps, CurrentMusicProps>(
    (state) => state.currentMusic,
  )

  const { favoriteArtists } = useSelector<ReduxProps, FavoriteArtistsProps>(
      (state) => state.favoriteArtists,
    )

  const { user } = useSelector<ReduxProps, UserProps>((state) => state.user)

  const removeDuplicates = (arr: AlbumProps[]): AlbumProps[] => {
    return arr.filter((value, index, self) => {
      return self.findIndex((m) => m.name === value.name) === index
    })
  }

  const handleGetArtist = async () => {
    setIsLoading(true)
    await api
      .get(`/artists/${artistId}`)
      .then(async (response) => {
        const artist = response.data as ArtistsDataProps

        const music = await api
          .get(`/musics?artistId=${artistId}`)
          .then((response) => response.data.data as MusicProps[])

        setTopMusics(music)

        const filterAlbums = music.map((music) => ({
          name: music.album,
          artwork: music.artwork,
        }))

        const uniqueAlbumList = removeDuplicates(filterAlbums)

        setAlbums(uniqueAlbumList)
        setArtist(artist)
      })
      .catch((err) => console.log(err, 'err'))
      .finally(() => setIsLoading(false))
  }  

  async function handleFavoriteArtist(artistId: string) {
      await api
        .post(`/artists/${artistId}/like`)
        .then(async (response) => {
          const isFavorite = response.data as { liked: false; likesCount: 0 }
  
          const userUpdated = await api
            .get('/me')
            .then((response) => response.data as UserDataProps)       
  
          if (userUpdated.favoriteArtists) {
            dispatch(
              setFavoriteArtists({favoriteArtists: userUpdated.favoriteArtists}),
            )
          }        
  
          let message = ''
  
          if (isFavorite.liked === false) {
            message = 'Removido dos favoritos.'
          } else {
            message = 'Adicionado aos favoritos.'
          }
  
          showToast({ title: message })
        })
        .catch((err) => console.log(err, 'err'))
    }

  const isFavorite = useMemo(() => {
    const filter = favoriteArtists?.find((item) => item.id === artistId)

    return !!filter
  }, [artist?.id, favoriteArtists])

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
          alt={artist?.title}
          style={{ height: size }}
          className={`p-4 pt-12`}
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
              {artist?.title}
            </Text>
          </View>
        </ImageBackground>

        <View className="flex-row px-4 mt-2 items-center justify-between">
          <View className="rounded-full overflow-hidden">
            <TouchableOpacity
              onPress={() => {
                if (!artist) return
                handleFavoriteArtist(artist.id)
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
                <Icon name="play" size={30} color={colors.white} />
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
                <MusicComponent
                  music={item}
                  onPress={() => {
                    if (!topMusics) return
                    handleMusicSelected({
                      listMusics: topMusics,
                      musicSelected: item,
                    })
                  }}
                />
              </View>
            ))
            .slice(0, 4)}

          {topMusics && topMusics.length > 4 && (
            <TouchableOpacity
              className="bg-purple-600 rounded-md items-center py-1 mt-2"
              onPress={() => {
                navigation.navigate('MoreMusic', {
                  title: `${artist.title}`,
                  type: 'artist',
                  // artistFlow: artist?.musics,
                  artistId: artist.id,
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
            title="Discografia"
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
