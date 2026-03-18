# Sonoriza Mobile

![Sonoriza Logo](https://i.ibb.co/hZ7QNB3/sonoriza.png)

Sonoriza mobile client built with React Native, TypeScript, Redux Toolkit, and React Native Track Player.

## Overview

The mobile app currently covers:
- API-first authentication
- account creation and account verification by code
- `access_token` + `refresh_token` session persistence
- automatic session refresh on cold start and protected requests
- public and authenticated route separation
- authenticated profile bootstrap through `GET /me`
- profile update through `PATCH /me` and `POST /me/photo`
- music and artist like toggles plus playback view registration through the API
- pull-to-refresh on `Home` for connected data rehydration
- playback with `react-native-track-player`
- queue and playback history persistence
- offline-friendly bootstrap when a local session already exists
- push delivery bootstrap with Firebase Messaging and Notifee
- Redux Toolkit state management with `redux-persist`
- progressive migration from legacy Firebase-first flows to Sonoriza API flows

It is no longer just a local player. The mobile project now acts as the streaming client of the Sonoriza platform, with a session lifecycle aligned to the current API contract.

## Stack

- React Native
- TypeScript
- React Navigation
- Redux Toolkit
- Redux Persist
- Axios
- React Native Track Player
- Firebase Messaging
- Notifee
- NativeWind
- React Hook Form
- Zod

## Requirements

- Node.js
- React Native environment configured
- Android Studio or a physical Android device
- Java and Android SDK versions compatible with React Native `0.72.5`

## Quick setup

### 1) Install dependencies

```bash
npm install
```

### 2) Configure environment

The project currently uses:
- `WEB_CLIENT_ID`
- `CLOUD_FRONT_DOMAIN`
- `BASE_API_URL`

Typing is defined in [src/@types/env.d.ts](./src/@types/env.d.ts).

For local API usage on a physical Android device over USB, keep:

```env
BASE_API_URL="http://localhost:3333/"
```

And run:

```bash
adb reverse tcp:3333 tcp:3333
```

### 3) Start Metro

```bash
npm run start
```

### 4) Run Android

```bash
npm run android
```

## Scripts

- `npm run start` - start Metro bundler
- `npm run android` - run Android build
- `npm run ios` - run iOS build
- `npm run lint` - lint
- `npm run test` - tests

## Session and navigation model

- the app stores `accessToken` and `refreshToken` in the persisted `user` slice
- `SplashScreen` acts as the bootstrap gate
- authenticated route rendering is gated by `hasStoredSession(user)`
- if no local session exists, the app goes to `SignIn`
- if a local session exists and the device is offline, the app can still enter `Home`
- if a local session exists and the device is online, the app validates or refreshes the token and then fetches `GET /me`
- Axios interceptors attach `Authorization: Bearer <token>` and react to `401`
- public routes and authenticated routes are separated in the navigation stack
- `Home` pull-to-refresh reuses the same authenticated data loader used in the connected bootstrap flow

## Main structure

```text
src/
  @types/
  assets/
  components/
  config/
  hooks/
  routes/
  screens/
  services/
  storage/
  utils/
android/
ios/
```

## Architecture summary

```text
App.tsx
src/
  hooks/
    index.tsx
    useTrackPlayer.ts
    useFirebaseServices.ts
  routes/
    navigationRef.ts
    routes.tsx
  screens/
    SplashScreen/
    SignIn/
    Register/
    ConfirmCode/
    Home/
    Music/
    Profile/
    ...
  services/
    api.ts
    session.ts
    PlaybackService.ts
  storage/
    index.ts
    modules/
      rootReducer.ts
      user/
      queue/
      historic/
      favoriteMusics/
      favoriteArtists/
      releases/
      inspiredMixes/
      notifications/
      ...
  utils/
    Types/
```

## Notes

- The mobile app is already aligned with the API session lifecycle through `access_token`, `refresh_token`, and refresh rotation handling.
- The session currently still lives inside the `user` slice and may later be split into a dedicated auth/session slice.
- Core auth, profile, recommendations, likes, and playback analytics are already API-backed.
- Firebase is no longer part of the core account and catalog flow, but Firebase Messaging and Notifee still remain in the push delivery layer.
- Profile photo upload is already integrated through the user-scoped `POST /me/photo` contract rather than the administrative upload flow.
- External web links on Android rely on manifest `queries` for `http` and `https`, already declared in `android/app/src/main/AndroidManifest.xml`.
- Additional architectural reference is documented in [MOBILE_INTEGRATION_REFERENCE.md](./MOBILE_INTEGRATION_REFERENCE.md).
- API Swagger is available at [https://sonoriza-api.onrender.com/docs](https://sonoriza-api.onrender.com/docs).

## Credits

- Developed by [Joseilton Junior](https://github.com/joseiltonjunior)
- Technical founder profile: a product-oriented full stack engineer with pragmatic software architecture and systemic platform vision.
