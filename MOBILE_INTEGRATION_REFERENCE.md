# Sonoriza Mobile - Full Integration Reference

## Purpose of this document

This file documents the current state of the Sonoriza Mobile application.

It is intended to work as a shared reference for:
- future mobile refactors
- alignment with Sonoriza API
- alignment with Sonoriza Admin
- onboarding and architectural review

It should not replace the project `README`.
It should be treated as a broader integration and architecture reference for the React Native application.

## Project identity

- Project: Sonoriza Mobile
- Stack: React Native + TypeScript
- Main target currently exercised: Android
- Local repository role: end-user mobile client for Sonoriza

## Product context

The mobile app started as a local music player focused on files stored on the device.

Over time, the product evolved into a streaming-oriented client, and the app now sits in a transition state:
- part of the application still reflects the old Firebase-first architecture
- authentication has already started migrating to the Sonoriza API
- catalog and profile flows are progressively moving away from direct Firebase usage
- playback, offline support, and mobile UX remain native concerns of the app

This means the application should currently be understood as a hybrid client during migration.

## Current runtime architecture

The application is organized around:
- React Native screens and components
- React Navigation stack routing
- Redux Toolkit state management
- `redux-persist` with AsyncStorage
- React Native Track Player for playback
- Notifee and Firebase Messaging for notifications
- Axios for Sonoriza API communication

Main entry points:
- App root: [App.tsx](/C:/Users/IONIC/Projects/sonoriza/App.tsx)
- Native registration: [index.js](/C:/Users/IONIC/Projects/sonoriza/index.js)
- Routes: [src/routes/routes.tsx](/C:/Users/IONIC/Projects/sonoriza/src/routes/routes.tsx)
- Global providers: [src/hooks/index.tsx](/C:/Users/IONIC/Projects/sonoriza/src/hooks/index.tsx)
- API client: [src/services/api.ts](/C:/Users/IONIC/Projects/sonoriza/src/services/api.ts)
- Redux store: [src/storage/index.ts](/C:/Users/IONIC/Projects/sonoriza/src/storage/index.ts)

## Current folder overview

The main application structure currently looks like this:

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

### Meaning of the main folders

- `components/`
  - reusable UI pieces such as carousels, headers, modal wrappers, player controls, inputs and cards
- `hooks/`
  - global providers and feature hooks
  - includes modal, side menu, toast, bottom modal, playlist modal, track player logic, network logic, and the legacy Firebase service layer
- `routes/`
  - stack navigation configuration and navigation helpers
- `screens/`
  - page-level UI and screen-specific flows
- `services/`
  - integration layers such as Axios API client and playback service
- `storage/`
  - Redux Toolkit slices, root reducer, store configuration, and persistence setup
- `utils/Types/`
  - domain-oriented client-side types for music, artists, releases, playlists, users and notifications

## Application shell

The app shell is assembled in [App.tsx](/C:/Users/IONIC/Projects/sonoriza/App.tsx):
- wraps the application with global providers from `Hooks`
- mounts `NavigationContainer`
- renders stack routes
- mounts global overlay components outside screen trees

Global overlay and utility UI currently includes:
- side menu
- modal
- bottom modal
- playlist modal
- toast

Global providers are wired in [src/hooks/index.tsx](/C:/Users/IONIC/Projects/sonoriza/src/hooks/index.tsx):
- Redux `Provider`
- `PersistGate`
- bottom modal provider
- modal provider
- toast provider
- playlist modal provider
- side menu provider

## Navigation architecture

Navigation is handled with React Navigation stack routes in [src/routes/routes.tsx](/C:/Users/IONIC/Projects/sonoriza/src/routes/routes.tsx).

Current registered screens:
- `SplashScreen`
- `SignIn`
- `Register`
- `Home`
- `Music`
- `MoreMusic`
- `MoreArtists`
- `Artist`
- `GenreSelected`
- `Favorites`
- `Queue`
- `Search`
- `RecoveryPassword`
- `Album`
- `Profile`
- `EditProfile`
- `Notifications`
- `Explorer`
- `EditPlaylist`
- `Playlists`
- `NewPlaylist`

Current navigation characteristics:
- stack-based navigation
- hidden native headers
- custom opacity-based card transition
- typed route params through `RootStackParamList`

There is also a navigation ref helper in [src/routes/navigationRef.ts](/C:/Users/IONIC/Projects/sonoriza/src/routes/navigationRef.ts) intended for non-component navigation flows such as API interceptor-driven redirects.

## State management and persistence

The app uses Redux Toolkit plus `redux-persist` in [src/storage/index.ts](/C:/Users/IONIC/Projects/sonoriza/src/storage/index.ts).

Persistence details:
- storage backend: AsyncStorage
- persisted at root level
- blacklisted from persistence:
  - `currentMusic`
  - `netInfo`
  - `trackPlayer`

### Current slices

The root reducer in [src/storage/modules/rootReducer.ts](/C:/Users/IONIC/Projects/sonoriza/src/storage/modules/rootReducer.ts) currently combines:
- `user`
- `currentMusic`
- `queue`
- `historic`
- `trackListOffline`
- `netInfo`
- `trackPlayer`
- `favoriteArtists`
- `releases`
- `favoriteMusics`
- `searchHistoric`
- `inspiredMixes`
- `newsNotifications`
- `notifications`
- `historicNotifications`
- `playlist`

### Functional meaning of current state

#### User session and identity

The `user` slice stores the authenticated user shape currently used by the mobile client.

Current user properties in [src/utils/Types/userProps.ts](/C:/Users/IONIC/Projects/sonoriza/src/utils/Types/userProps.ts):
- `id`
- `name`
- `email`
- `photoUrl`
- `role`
- `isActive`
- `favoritesArtists`
- `favoritesMusics`
- `isAuthenticated`

Current practical meaning:
- `isAuthenticated` is currently being used as the access token
- user profile data is persisted locally
- Redux now acts as the primary mobile session cache

#### Playback state

Playback-related state is split across:
- `currentMusic`
- `queue`
- `historic`
- `trackPlayer`

Purpose:
- reflect the current track
- keep queue state aligned with Track Player
- store recent listening history
- store local Track Player initialization state

#### Cached catalog and local UX state

Additional persisted slices currently support:
- favorites cache
- releases cache
- inspired mixes cache
- offline track list
- search history
- notifications list
- unread/news flags
- notification history
- playlist state

This means the app already behaves as a persisted client, not just a transient UI shell.

## Current session and authentication flow

The current mobile authentication direction is API-first.

### Sign in

Implemented in [src/screens/SignIn/index.tsx](/C:/Users/IONIC/Projects/sonoriza/src/screens/SignIn/index.tsx).

Current behavior:
- user submits email and password
- mobile calls `POST /sessions`
- response user data is written into Redux
- `access_token` is stored in `user.isAuthenticated`
- user is redirected to `Home`

Current stored values after login:
- `name`
- `email`
- `photoUrl`
- `role`
- `id`
- `isActive`
- `isAuthenticated` as access token

### Register

Implemented in [src/screens/Register/index.tsx](/C:/Users/IONIC/Projects/sonoriza/src/screens/Register/index.tsx).

Current behavior:
- user submits account form
- mobile calls `POST /accounts`
- then immediately calls `POST /sessions`
- the authenticated session result is written into Redux
- user is redirected to `Home`

### Sign out

Currently handled in [src/screens/Profile/index.tsx](/C:/Users/IONIC/Projects/sonoriza/src/screens/Profile/index.tsx).

Current sign-out behavior:
- stops playback
- clears multiple cached slices
- clears current user data from Redux
- resets navigation to `SignIn`

### Current session limitation

The API integration reference defines both `access_token` and `refresh_token`.

The mobile client currently stores only the access token in Redux through `user.isAuthenticated`.

This means:
- refresh lifecycle is not fully represented in the current mobile storage model yet
- logout and token expiration handling are only partially aligned with the new backend contract
- the user slice is functioning as a temporary session container during migration

## Current API client behavior

The Axios client is defined in [src/services/api.ts](/C:/Users/IONIC/Projects/sonoriza/src/services/api.ts).

Current request behavior:
- reads `BASE_API_URL` from environment
- reads the current token from Redux through `store.getState()`
- injects `Authorization: Bearer <token>` when available

Current response behavior:
- intercepts `401 Unauthorized`
- clears the current Redux user state
- attempts to redirect the user back to `SignIn` using `resetToSignIn`

This establishes the current mobile direction:
- token-aware API client
- centralized request auth header injection
- centralized unauthorized handling

## Current environment model

Environment variables are typed in [src/@types/env.d.ts](/C:/Users/IONIC/Projects/sonoriza/src/@types/env.d.ts).

Current mobile env usage includes:
- `WEB_CLIENT_ID`
- `CLOUD_FRONT_DOMAIN`
- `BASE_API_URL`

The base API URL is consumed directly by the Axios client.

Practical integration note:
- on physical Android devices over USB debugging, local API access works best through `adb reverse` and `localhost`
- on Wi-Fi device testing, the mobile client must use the machine LAN IP

## Current playback architecture

Playback is handled with `react-native-track-player`.

Main files:
- player hook: [src/hooks/useTrackPlayer.ts](/C:/Users/IONIC/Projects/sonoriza/src/hooks/useTrackPlayer.ts)
- playback service: [src/services/PlaybackService.ts](/C:/Users/IONIC/Projects/sonoriza/src/services/PlaybackService.ts)
- native registration: [index.js](/C:/Users/IONIC/Projects/sonoriza/index.js)
- player initialization screen flow: [src/screens/SplashScreen/index.tsx](/C:/Users/IONIC/Projects/sonoriza/src/screens/SplashScreen/index.tsx)

Current playback responsibilities:
- initialize player once
- configure Android playback capabilities
- handle current queue synchronization
- play selected music lists
- navigate to music screen when the current item is reselected
- persist listening history in Redux
- support remote controls:
  - play
  - pause
  - seek
  - next
  - previous
  - stop

## Current notification architecture

Notification-related behavior is currently split between:
- Firebase Messaging
- Notifee
- Redux slices for notification history and unread state

Main file:
- [index.js](/C:/Users/IONIC/Projects/sonoriza/index.js)

Current behavior:
- creates Android notification channel through Notifee
- listens to foreground Firebase messages
- displays local notification banners through Notifee
- registers background message handler

Current app-level notification state additionally tracks:
- fetched notification payloads
- unread/news status
- locally opened notification history

## Current screen responsibilities

### Entry and bootstrap

- `SplashScreen`
  - initializes Track Player
  - decides between `SignIn` and `Home`
  - currently acts as the bootstrap gate of the app

### Authentication and account access

- `SignIn`
  - API login flow
- `Register`
  - account creation + immediate session creation
- `RecoveryPassword`
  - password recovery entry point

### Main content and catalog exploration

- `Home`
  - main content orchestration
  - favorite and recommendation hydration
  - releases loading
  - notification refresh
- `Explorer`
  - genre exploration entry point
- `Search`
  - text search and search history
- `MoreMusic`
  - extended music listing flow
- `MoreArtists`
  - extended artist listing flow
- `GenreSelected`
  - genre-focused browsing
- `Album`
  - album-focused track listing
- `Artist`
  - artist details and artist music listing
- `Music`
  - current music detail and player view

### User and personalization

- `Favorites`
  - favorites aggregation
- `Profile`
  - profile summary and sign out
- `EditProfile`
  - profile editing flow
- `Notifications`
  - notifications and version-related UI

### Queue and playlist flows

- `Queue`
  - playback queue visualization
- `Playlists`
  - user playlists listing
- `NewPlaylist`
  - playlist creation
- `EditPlaylist`
  - playlist editing

## Legacy and migration state

The codebase is currently in a mixed integration state.

### Already migrated or in active migration

- login through Sonoriza API
- account creation through Sonoriza API
- token injection through Axios interceptor
- unauthorized handling through Axios response interceptor

### Still present as legacy Firebase-first behavior

- legacy data access hook in [src/hooks/useFirebaseServices.ts](/C:/Users/IONIC/Projects/sonoriza/src/hooks/useFirebaseServices.ts)
- Firebase Messaging still used for push delivery handling
- several content and profile flows still rely on the old Firebase service layer
- older upload-related screen logic still reflects direct-storage-era assumptions

This means the current app should be read as:
- auth migration already started
- domain data migration still ongoing
- mobile playback and local UX architecture remain stable

## Current mobile responsibilities versus API responsibilities

### Mobile should own

- UI rendering
- navigation
- local session cache
- playback lifecycle
- queue state
- offline local list
- local search history
- modal and toast UX
- notification display on device

### API should own

- authentication
- token lifecycle
- profile source of truth
- music catalog source of truth
- artist catalog source of truth
- genres source of truth
- admin uploads
- signed URL orchestration
- user profile mutation rules

## Important mobile integration notes

### Current token handling

Current mobile state stores the access token in `user.isAuthenticated`.

This is functional for the current stage, but the naming is semantically weak because the field behaves like a token holder rather than a boolean authentication flag.

### Profile photo uploads

The API integration contract makes an important distinction:
- `POST /uploads` is administrative
- it is not the right endpoint for ordinary user avatar uploads

For mobile profile photo updates, a dedicated authenticated endpoint under the `me` scope is the correct next step, for example:
- `PATCH /me/photo`

This keeps:
- permission boundaries correct
- user identity bound to JWT
- AWS operations centralized in the backend

### Refresh token alignment

The backend already supports:
- access token
- refresh token
- refresh rotation
- logout revocation

The mobile application still needs a fully aligned refresh strategy so that:
- `refresh_token` is stored safely
- expired access tokens are renewed without forcing unnecessary logout
- session invalidation falls back cleanly to login when refresh fails

## Known limitations in the current mobile state

- auth storage model is not yet fully aligned with access + refresh token lifecycle
- Firebase service layer still exists as a major dependency for several screens
- navigation-ref-driven interceptor redirects depend on the navigation container integration path
- upload flow for ordinary user avatars is not yet formalized in the API contract
- some slices still behave as long-lived cache without explicit invalidation strategy
- parts of the app still reflect assumptions from the previous Firebase-centered architecture

## Natural next steps for the mobile application

- formalize a dedicated auth/session storage model
- add refresh-token lifecycle support
- migrate `GET /me` into the main profile bootstrap path
- replace remaining Firebase data reads with Sonoriza API flows
- separate admin upload assumptions from user profile upload flows
- introduce dedicated authenticated avatar upload endpoint
- review logout flow to align with API logout and token revocation
- evaluate which persisted slices are source-of-truth cache versus disposable UI cache

## Executive summary

Sonoriza Mobile is no longer just a local player and is no longer purely a Firebase client.

It is now a React Native streaming-oriented mobile client in transition, with:
- Redux-persisted local state
- API-first authentication already in motion
- interceptor-based token propagation
- playback and queue orchestration through Track Player
- notification handling through Firebase Messaging and Notifee
- gradual migration of domain flows away from Firebase toward the Sonoriza API

This document should be considered the current integration and architecture reference for Sonoriza Mobile.
