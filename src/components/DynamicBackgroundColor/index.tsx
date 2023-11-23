import { PropsWithChildren, useEffect } from 'react'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'

interface Props extends PropsWithChildren {
  color?: string
}

export function DynamicBackgroundColor({ color, children }: Props) {
  const backgroundColor = useSharedValue(color || '#202022')

  const animatedStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: backgroundColor.value,
    }
  })

  useEffect(() => {
    backgroundColor.value = withTiming(color || '#202022')
  }, [backgroundColor, color])

  return (
    <Animated.View className="flex-1" style={[animatedStyle]}>
      {children}
    </Animated.View>
  )
}
