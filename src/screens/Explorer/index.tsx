import { BottomMenu } from '@components/BottomMenu/Index'
import { ControlCurrentMusic } from '@components/ControlCurrentMusic'
import { Header } from '@components/Header'
import { ReleasesCarousel } from '@components/ReleasesCarousel'
import { useFirebaseServices } from '@hooks/useFirebaseServices'
import { useNavigation } from '@react-navigation/native'
import { StackNavigationProps } from '@routes/routes'
import { ReduxProps } from '@storage/index'
import { CurrentMusicProps } from '@storage/modules/currentMusic/reducer'
import { NotificationsProps } from '@storage/modules/notifications/reducer'

import logoSonorizaTv from '@assets/sonoriza-tv.png'

import { ReleasesDataProps } from '@utils/Types/releasesProps'
import { useEffect, useMemo, useState } from 'react'
import {
  Image,
  Linking,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { useSelector } from 'react-redux'
import { useModal } from '@hooks/useModal'

export function Explorer() {
  const { handleGetMusicalGenres } = useFirebaseServices()

  const navigation = useNavigation<StackNavigationProps>()

  const { notifications } = useSelector<ReduxProps, NotificationsProps>(
    (state) => state.notifications,
  )

  const { isCurrentMusic } = useSelector<ReduxProps, CurrentMusicProps>(
    (state) => state.currentMusic,
  )

  const [musicalGenres, setMusicalGenres] = useState<string[]>([])

  const { openModal, closeModal } = useModal()

  const handleGetData = async () => {
    try {
      const resultMusicalGenres = await handleGetMusicalGenres()
      setMusicalGenres(resultMusicalGenres.map((item) => item.name))
    } catch (error) {}
  }

  const handleFormatReleasesArtists = useMemo(() => {
    const newList = notifications
      .map((item) => {
        const release = {
          name: item.title,
          artwork: item.imageUrl,
          id: item.artistId,
          type: item.type,
        }

        return release as ReleasesDataProps
      })
      .filter((item) => item.type === 'artist')

    return newList
  }, [notifications])

  function chunkArray(array: string[], chunkSize: number) {
    const result = []
    for (let i = 0; i < array.length; i += chunkSize) {
      result.push(array.slice(i, i + chunkSize))
    }
    return result
  }

  const handleOpenSonorizaTv = async () => {
    const link = 'https://sonoriza-tv.vercel.app/'

    const supported = await Linking.canOpenURL(link)

    if (supported) {
      await Linking.openURL(link)
    } else {
      openModal({
        title: 'Atenção',
        description:
          'Desculpe, não foi possível abrir o link neste momento. Por favor, tente novamente.',
        singleAction: {
          action() {
            closeModal()
          },
          title: 'OK',
        },
      })
    }
  }

  useEffect(() => {
    handleGetData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <View className="bg-gray-700 flex-1">
      <Header title="Explorar" />

      <ScrollView>
        {handleFormatReleasesArtists && (
          <View className="mt-4">
            <Text className="pl-4 mb-2 text-lg font-nunito-bold text-white">
              Novos artistas
            </Text>
            <ReleasesCarousel releases={handleFormatReleasesArtists} />
          </View>
        )}

        <View className="mb-32">
          {musicalGenres.length > 0 && (
            <View className="mt-14">
              <Text className="text-lg pl-4 font-nunito-bold text-white">
                Explorar tudo
              </Text>
              <View className="flex-wrap">
                {chunkArray(musicalGenres, 2).map((col, index) => (
                  <View key={index} className="flex-row w-full px-2">
                    {col.map((item) => (
                      <TouchableOpacity
                        activeOpacity={0.6}
                        key={item}
                        className="flex-1 p-2"
                        onPress={() =>
                          navigation.navigate('GenreSelected', { type: item })
                        }
                      >
                        <View className="bg-purple-600 rounded-lg items-center justify-center h-16">
                          <Text className="font-nunito-bold text-white text-base">
                            {item}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    ))}
                  </View>
                ))}
              </View>
            </View>
          )}

          <View className="px-4 mt-16">
            <Text className="font-nunito-bold text-white text-lg mb-2">
              Explorar Filmes
            </Text>
            <TouchableOpacity
              onPress={handleOpenSonorizaTv}
              activeOpacity={0.6}
              className="bg-purple-600 w-full rounded-md h-60 items-center justify-center"
            >
              <Image
                source={logoSonorizaTv}
                alt="sonoriza tv"
                style={{ objectFit: 'contain', width: 250 }}
              />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <View className="absolute bottom-0 w-full">
        {isCurrentMusic && <ControlCurrentMusic music={isCurrentMusic} />}
        <BottomMenu />
      </View>
    </View>
  )
}
