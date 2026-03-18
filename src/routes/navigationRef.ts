import { createNavigationContainerRef } from '@react-navigation/native'

export const navigationRef = createNavigationContainerRef()

export function resetToSignIn() {
  if (navigationRef.isReady()) {
    navigationRef.reset({
      index: 0,
      routes: [{ name: 'SignIn' as never }],
    })
  }
}
