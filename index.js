/**
 * @format
 */

import { AppRegistry } from 'react-native'
import App from './App'
import { name as appName } from './app.json'
import TrackPlayer from 'react-native-track-player'
import messaging from '@react-native-firebase/messaging'

import { PlaybackService } from '@services/PlaybackService'

import Notifee, { AndroidImportance } from '@notifee/react-native'

const setupNotificationChannel = async () => {
  const channelId = await Notifee.createChannel({
    id: 'default',
    name: 'releases',
    vibration: true,
    importance: AndroidImportance.HIGH,
  })

  return channelId
}

async function onMessageReceived(remoteMessage) {
  const title = remoteMessage.notification.title
  const body = remoteMessage.notification.body

  const channelId = await setupNotificationChannel()

  await Notifee.displayNotification({
    title,
    body,
    android: {
      channelId,
      smallIcon: '@mipmap/icon',
    },
  })
}

messaging().onMessage(onMessageReceived)

messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  return remoteMessage
})

AppRegistry.registerComponent(appName, () => App)
TrackPlayer.registerPlaybackService(() => PlaybackService)
