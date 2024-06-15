import { InfoPlayingMusic } from '@components/InfoPlayingMusic'
import { useBottomModal } from '@hooks/useBottomModal'

import { MusicProps } from '@utils/Types/musicProps'
import {
  Image,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
} from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import colors from 'tailwindcss/colors'

interface MusicComponentProps extends TouchableOpacityProps {
  music: MusicProps
  customOption?: {
    action: () => void
    icon: string
  }
}

export function MusicComponent({
  music,
  customOption,
  ...rest
}: MusicComponentProps) {
  const { openModal } = useBottomModal()

  return (
    <View className="flex-row justify-between">
      <TouchableOpacity {...rest} className="flex-row w-[90%]">
        <View className="w-16 h-16 bg-purple-600 rounded-xl overflow-hidden items-center justify-center">
          <Image
            source={{ uri: music.artwork }}
            alt="artwork"
            className="h-full w-full"
          />
        </View>
        <View className="w-full ml-2">
          <Text
            className="font-nunito-bold text-white text-base"
            numberOfLines={1}
          >
            {music.title}
          </Text>
          <Text className="font-nunito-regular text-gray-300 mt-1">
            {music.album}
          </Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        className="p-2 w-[10%] flex-row items-center justify-center"
        onPress={() => {
          if (customOption) {
            customOption.action()
          } else {
            openModal({
              children: <InfoPlayingMusic musicSelected={music} />,
            })
          }
        }}
      >
        <Icon
          name={customOption ? customOption.icon : 'ellipsis-vertical'}
          size={24}
          color={colors.white}
        />
      </TouchableOpacity>
    </View>
  )
}
