import { BottomMenu } from '@components/BottomMenu/Index'
import { BoxCarousel } from '@components/BoxCarousel'
import { ControlCurrentMusic } from '@components/ControlCurrentMusic'
import { RoundedCarousel } from '@components/RoundedCarousel'
import { Section } from '@components/Section'
import { useFirebaseServices } from '@hooks/useFirebaseServices'
import { useNavigation } from '@react-navigation/native'
import { StackNavigationProps } from '@routes/routes'
import { ReduxProps } from '@storage/index'
import { CurrentMusicProps } from '@storage/modules/currentMusic/reducer'
import { UserProps } from '@storage/modules/user/reducer'
import { ArtistsDataProps } from '@utils/Types/artistsProps'
import { MusicProps } from '@utils/Types/musicProps'
import { useEffect, useState } from 'react'
import { Text, View } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { useSelector } from 'react-redux'

import IconAnt from 'react-native-vector-icons/AntDesign'
import { useSideMenu } from '@hooks/useSideMenu'

export function Favorites() {
  const { isCurrentMusic } = useSelector<ReduxProps, CurrentMusicProps>(
    (state) => state.currentMusic,
  )

  const { user } = useSelector<ReduxProps, UserProps>((state) => state.user)

  const { handleGetFavoritesArtists, handleGetFavoritesMusics } =
    useFirebaseServices()

  const [artists, setArtists] = useState<ArtistsDataProps[]>()
  const [musics, setMusics] = useState<MusicProps[]>()

  const navigation = useNavigation<StackNavigationProps>()

  const { handleIsVisible } = useSideMenu()

  const handleArtists = async (artistsId: string[]) => {
    await handleGetFavoritesArtists(artistsId).then((result) =>
      setArtists(result),
    )
  }

  const handleMusics = async (musicsId: string[]) => {
    await handleGetFavoritesMusics(musicsId).then((result) => setMusics(result))
  }

  useEffect(() => {
    if (user?.favoritesArtists) {
      handleArtists(user.favoritesArtists)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.favoritesArtists])

  useEffect(() => {
    if (user?.favoritesMusics) {
      handleMusics(user.favoritesMusics)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.favoritesMusics])

  return (
    <View className="flex-1">
      <View className="p-4 flex-row items-center justify-between">
        <Text className="text-white text-3xl font-nunito-bold">Favoritos</Text>

        <TouchableOpacity onPress={handleIsVisible} activeOpacity={0.6}>
          <IconAnt name="setting" size={26} />
        </TouchableOpacity>
      </View>

      <View className="p-4 flex-1 w-screen">
        {musics && (
          <Section
            title="Suas músicas favoritas"
            onPress={() =>
              navigation.navigate('MoreMusic', {
                listMusics: musics,
                title: 'Suas músicas favoritas',
              })
            }
          >
            <BoxCarousel musics={musics} />
          </Section>
        )}

        {artists && (
          <Section
            title="Seus artistas favoritos"
            className="mt-12"
            onPress={() =>
              navigation.navigate('MoreArtists', {
                listArtists: artists,
                title: 'Seus artistas favoritos',
              })
            }
          >
            <RoundedCarousel artists={artists} />
          </Section>
        )}
      </View>

      {isCurrentMusic && <ControlCurrentMusic music={isCurrentMusic} />}
      <BottomMenu />
    </View>
  )
}
