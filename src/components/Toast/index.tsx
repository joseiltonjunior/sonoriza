import { useToast } from '@hooks/useToast'
import { Text } from 'react-native'

import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated'
import { useEffect } from 'react'

export function Toast() {
  const {
    toastState: { title, visible },
    hiddenToast,
  } = useToast()

  const translateX = useSharedValue(-500)

  useEffect(() => {
    if (visible) {
      translateX.value = withTiming(0, {
        duration: 500,
        easing: Easing.out(Easing.exp),
      })

      setTimeout(() => {
        translateX.value = withTiming(-500, {
          duration: 500,
          easing: Easing.in(Easing.exp),
        })
        hiddenToast()
      }, 3000)
    }
  }, [hiddenToast, translateX, visible])

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    }
  })

  return (
    <Animated.View
      style={[animatedStyle]}
      className={`bg-white/80 py-3 px-4 absolute w-[96%] mx-2 bottom-2 rounded-md border-b border-purple-600`}
    >
      <Text className="font-bold text-gray-700">{title}</Text>
    </Animated.View>
  )
}
