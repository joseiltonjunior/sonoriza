import { useNavigation, useRoute } from '@react-navigation/native'
import { RouteParamsProps, StackNavigationProps } from '@routes/routes'
import {
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import Icon from 'react-native-vector-icons/AntDesign'
import colors from 'tailwindcss/colors'

export function Artist() {
  const { params } = useRoute<RouteParamsProps<'Artist'>>()
  const { artist } = params

  const navigation = useNavigation<StackNavigationProps>()

  return (
    <View>
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
          <Text className="font-semibold text-white" style={styles.text}>
            {artist.name}
          </Text>
        </View>
      </ImageBackground>
    </View>
  )
}
const styles = StyleSheet.create({
  text: {
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
    fontSize: 42,
  },
})
