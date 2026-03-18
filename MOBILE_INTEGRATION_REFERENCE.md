# Sonoriza Mobile - Full Integration Reference

## Purpose of this document

This file documents the current state of the Sonoriza Mobile application.

It is intended to work as a shared reference for:
- future mobile refactors
- alignment with Sonoriza API
- alignment with Sonoriza Admin
- onboarding and architectural review

It should not replace the project `README`.
It should be treated as the broader integration and architecture reference for the React Native application.

## Project identity

- Project: Sonoriza Mobile
- Stack: React Native + TypeScript
- Main target currently exercised: Android
- Repository role: end-user mobile client for Sonoriza

## Product context

The mobile app started as a local music player focused on files stored on the device.

Over time, the product evolved into a streaming-oriented client, and the app now sits in an advanced migration state:
- authentication is already API-first
- session lifecycle is already aligned with access token + refresh token
- the app now separates public routes from authenticated routes
- profile update and profile photo update already use the API contract
- music and artist like toggles are already API-backed
- playback analytics already register music views through the API
- `Home` can rehydrate its authenticated data through pull-to-refresh
- playback, offline support, and mobile UX remain native concerns of the app
- push delivery still uses Firebase Messaging and Notifee at the app boundary
- parts of the domain layer and repository structure still reflect the older Firebase-first architecture

This means the application should currently be understood as:
- a React Native streaming client
- with an API-aligned auth/session layer
- and an ongoing domain migration away from legacy integrations

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
- App root: `App.tsx`
- Native registration: `index.js`
- Routes: `src/routes/routes.tsx`
- Navigation ref: `src/routes/navigationRef.ts`
- Global providers: `src/hooks/index.tsx`
- API client: `src/services/api.ts`
- Session module: `src/services/session.ts`
- Redux store: `src/storage/index.ts`

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
  - integration layers such as Axios API client, session lifecycle and playback service
- `storage/`
  - Redux Toolkit slices, root reducer, store configuration, and persistence setup
- `utils/Types/`
  - domain-oriented client-side types for music, artists, releases, playlists, users and notifications

## Application shell

The app shell is assembled in `App.tsx`:
- wraps the application with global providers from `Hooks`
- mounts `NavigationContainer`
- attaches `navigationRef`
- renders stack routes
- mounts global overlay components outside screen trees

Global overlay and utility UI currently includes:
- side menu
- modal
- bottom modal
- playlist modal
- toast

Global providers are wired in `src/hooks/index.tsx`:
- Redux `Provider`
- `PersistGate`
- bottom modal provider
- modal provider
- toast provider
- playlist modal provider
- side menu provider

## Navigation architecture

Navigation is handled with React Navigation stack routes in `src/routes/routes.tsx`.

Current navigation characteristics:
- stack-based navigation
- hidden native headers
- custom opacity-based card transition
- typed route params through `RootStackParamList`
- `SplashScreen` as the bootstrap gate
- public routes and private routes are separated
- authenticated route rendering is gated by `hasStoredSession(user)`

### Public routes

These flows do not require an authenticated session:
- `SignIn`
- `Register`
- `ConfirmCode`
- `RecoveryPassword`

### Private routes

These flows require a stored authenticated session:
- `Home`
- `Music`
- `MoreMusic`
- `MoreArtists`
- `Artist`
- `GenreSelected`
- `Favorites`
- `Queue`
- `Search`
- `Album`
- `Profile`
- `EditProfile`
- `Notifications`
- `Explorer`
- `EditPlaylist`
- `Playlists`
- `NewPlaylist`

### Bootstrap route

`SplashScreen` is always mounted as the entry point.

Its responsibility is to:
- initialize Track Player
- inspect persisted session state
- decide whether the app starts in public or private flow
- attempt token refresh when needed
- refresh the authenticated profile snapshot with `GET /me`

There is also a navigation ref helper in `src/routes/navigationRef.ts` used for non-component navigation flows such as session invalidation after interceptor-driven `401`.

## State management and persistence

The app uses Redux Toolkit plus `redux-persist` in `src/storage/index.ts`.

Persistence details:
- storage backend: AsyncStorage
- persisted at root level
- blacklisted from persistence:
  - `currentMusic`
  - `netInfo`
  - `trackPlayer`

### Current slices

The root reducer in `src/storage/modules/rootReducer.ts` currently combines:
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

#### User identity and session

The `user` slice currently stores both:
- authenticated user profile snapshot
- current session credentials

Current user properties in `src/utils/Types/userProps.ts`:
- `id`
- `name`
- `email`
- `photoUrl`
- `role`
- `accountStatus`
- `favoriteArtists`
- `favoriteMusics`
- `favoriteGenres`
- `accessToken`
- `refreshToken`

Current practical meaning:
- the user slice is temporarily serving as the session container
- profile data is persisted locally
- `accessToken` is the token used for protected API requests
- `refreshToken` is used to renew the session without forcing logout

This is intentionally transitional.
The project may later split `user` and `session`, but that separation has not been introduced yet.

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

This means the app behaves as a persisted mobile client, not just a transient UI shell.

## Current session and authentication flow

The current mobile authentication layer is API-first and already aligned with refresh-token-based sessions.

### Sign in

Implemented in `src/screens/SignIn/index.tsx`.

Current behavior:
- user submits email and password
- mobile calls `POST /sessions`
- response returns `access_token`, `refresh_token`, and `user`
- mobile stores both tokens plus the user snapshot in Redux
- user is redirected to `Home`

Stored values after login:
- `name`
- `email`
- `photoUrl`
- `role`
- `id`
- `accountStatus`
- `accessToken`
- `refreshToken`

### Register

Implemented in `src/screens/Register/index.tsx`.

Current behavior:
- user submits account form
- mobile calls `POST /accounts`
- successful account creation does not immediately create a local session
- user is redirected to `ConfirmCode`

### Current auth-form behavior

The `SignIn` and `Register` screens currently include keyboard-aware scroll handling.

Current behavior:
- listens to keyboard show/hide only while the screen is focused
- increases bottom padding when the keyboard opens
- scrolls to the bottom when needed so the primary CTA remains reachable
- keeps scroll usable while the keyboard is open
- avoids carrying keyboard offset artifacts when moving between auth screens

### Confirm account

Implemented in `src/screens/ConfirmCode/index.tsx`.

Current behavior:
- mobile sends `email` and `code` to `POST /accounts/verify`
- API returns `access_token`, `refresh_token`, and `user`
- mobile stores the authenticated session in Redux
- user is redirected to `Home`

### Sign out

Currently handled in `src/screens/Profile/index.tsx` through the shared session cleanup in `src/services/session.ts`.

Current sign-out behavior:
- stops playback
- clears queue
- clears favorites
- clears historic and search cache
- clears releases and inspired mixes
- clears notifications-related slices
- clears playlists
- clears current user/session data from Redux
- resets navigation to `SignIn`

### Session bootstrap on app start

Bootstrap is handled by `src/screens/SplashScreen/index.tsx`.

Current cold-start behavior:
- if there is no stored session, go to `SignIn`
- if there is a stored session and the device is offline, go to `Home`
- if there is a stored session and the device is online:
  - validate the current access token
  - refresh it when needed
  - if refresh succeeds, call `GET /me`
  - merge the fresh profile snapshot into Redux while preserving the session
  - navigate to `Home`
- if refresh fails and there is no valid session left, clear session and return to `SignIn`

## Current session lifecycle implementation

The session lifecycle is centralized in `src/services/session.ts`.

Main responsibilities:
- read the persisted session from Redux
- decode JWT payload locally
- detect access token expiration
- detect near-expiration access token threshold
- run refresh with a single in-flight promise lock
- clear the stored session consistently
- redirect to `SignIn` when session recovery fails

### Current local refresh strategy

The mobile client currently uses a `10 minute` threshold before access token expiration.

Current rules:
- if the access token is healthy, use it
- if the access token is close to expiring, refresh before protected requests
- if the access token is already expired, refresh before continuing
- if the refresh token is missing or expired, invalidate the local session

### Refresh concurrency protection

The session module uses a shared `refreshPromise` lock.

This means:
- only one `POST /sessions/refresh` request should be in flight at a time
- concurrent requests wait for the same refresh result
- refresh token rotation is less likely to break because of multiple simultaneous refresh calls

## Current API client behavior

The Axios client is defined in `src/services/api.ts`.

### Request interceptor

Current request behavior:
- reads `BASE_API_URL` from environment
- ignores public auth routes
- ignores `/sessions/refresh`
- reads the current session from Redux through the session module
- ensures a valid access token before protected requests
- injects `Authorization: Bearer <token>` when available

### Response interceptor

Current response behavior:
- listens for `401 Unauthorized`
- ignores public auth routes
- ignores refresh-route recursion
- attempts a forced refresh one time
- retries the original request once with the renewed access token
- if refresh fails, clears the stored session and redirects to `SignIn`

This means the mobile client now follows the API session contract much more closely than before.

## Current environment model

Environment variables are typed in `src/@types/env.d.ts`.

Current mobile env usage includes:
- `WEB_CLIENT_ID`
- `CLOUD_FRONT_DOMAIN`
- `BASE_API_URL`

The base API URL is consumed directly by the Axios client.

Practical integration note:
- on physical Android devices over USB debugging, local API access works best through `adb reverse` and `localhost`
- on Wi-Fi device testing, the mobile client must use the machine LAN IP

## External link handling on Android

The app currently opens external web links through React Native `Linking`.

Important Android note:
- Android web-link opening depends on manifest `queries` declarations for `http` and `https`
- these declarations already exist in `android/app/src/main/AndroidManifest.xml`
- this is relevant for external surfaces such as the side menu and Sonoriza TV access in `Explorer`

## Current playback architecture

Playback is handled with `react-native-track-player`.

Main files:
- player hook: `src/hooks/useTrackPlayer.ts`
- playback service: `src/services/PlaybackService.ts`
- native registration: `index.js`
- player initialization screen flow: `src/screens/SplashScreen/index.tsx`

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
- register music views through the API from playback logic

## Current notification architecture

Notification-related behavior is currently split between:
- Firebase Messaging
- Notifee
- Redux slices for notification history and unread state

Main file:
- `index.js`

Current behavior:
- creates Android notification channel through Notifee
- listens to foreground Firebase messages
- displays local notification banners through Notifee
- registers background message handler

Important runtime note:
- Firebase is no longer part of the core auth and catalog flow
- Firebase Messaging still remains in the push delivery layer through `index.js`
- some notification-related UI surfaces are intentionally reduced while the broader notification module is still being consolidated

Current app-level notification state additionally tracks:
- fetched notification payloads
- unread/news status
- locally opened notification history

## Current screen responsibilities

### Entry and bootstrap

- `SplashScreen`
  - initializes Track Player
  - decides between public and private app flow
  - validates or refreshes session
  - refreshes the authenticated profile snapshot

### Authentication and account access

- `SignIn`
  - API login flow
- `Register`
  - account creation
- `ConfirmCode`
  - account verification and first authenticated session creation
- `RecoveryPassword`
  - password recovery entry point

### Main content and catalog exploration

- `Home`
  - main authenticated landing flow
  - `GET /me` snapshot hydration
  - favorite artists, favorite musics, and favorite genres hydration
  - recommendations hydration through `GET /me/recommendations/musics`
  - pull-to-refresh reusing the same connected data loader
  - offline fallback sections when the device is disconnected
- `Explorer`
  - genre exploration entry point
  - external Sonoriza TV web-link entry point
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
  - updates own profile through `PATCH /me`
  - uploads avatar through `POST /me/photo`
  - shows inline loading feedback while save/upload is in progress
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

The codebase is still in a mixed integration state.

### Already aligned with the API

- login through Sonoriza API
- account creation through Sonoriza API
- account verification through Sonoriza API
- profile bootstrap through `GET /me`
- profile update through `PATCH /me`
- profile photo upload through `POST /me/photo`
- music like toggles through the API
- artist like toggles through the API
- playback view registration through the API
- authenticated recommendations through `GET /me/recommendations/musics`
- token injection through Axios interceptor
- refresh-token lifecycle in the mobile session layer
- centralized `401` handling with retry
- public/private route separation

### Still present as legacy or ongoing migration

- legacy data access hook in `src/hooks/useFirebaseServices.ts`
- Firebase Messaging still used for push delivery handling
- some repository structure and dormant helpers still reflect the old Firebase-first era
- the session still lives inside the `user` slice instead of a dedicated auth slice

This means the current app should be read as:
- authentication and session layer largely modernized
- domain migration still ongoing
- playback and local UX architecture already established

## Current mobile responsibilities versus API responsibilities

### Mobile should own

- UI rendering
- navigation
- local persisted session cache
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

### Session shape

Today the app stores session credentials inside the `user` slice.

This is acceptable for the current stage, but it remains a transitional choice.
The long-term design may still move toward:
- a dedicated `auth` or `session` slice
- a clearer separation between identity snapshot and credentials

### Profile photo uploads

The API integration contract makes an important distinction:
- `POST /uploads` is administrative
- `POST /me/photo` is the correct user-scoped upload endpoint

This keeps:
- permission boundaries correct
- user identity bound to JWT
- AWS operations centralized in the backend

Current mobile state:
- `EditProfile` already uses `POST /me/photo`
- avatar upload no longer needs the administrative upload route

### Offline bootstrap

The splash flow intentionally allows:
- entering the app with a persisted local session
- even when the device is offline

This preserves the mobile experience and avoids forcing login on transient connectivity loss.

## Known limitations in the current mobile state

- the session still shares the same slice as profile data
- parts of the domain layer still depend on legacy Firebase-era structure
- not every business flow has been migrated to the API yet
- persisted slices still behave more like durable cache than explicitly versioned cache
- push-token lifecycle is not yet integrated with the backend session model
- some UI entry points are intentionally hidden or reduced while the corresponding backend modules are still incomplete

## Natural next steps for the mobile application

- split `user` and `session` when the auth layer stabilizes further
- continue replacing legacy domain reads with API-backed services
- align password recovery and remaining account flows with the backend contract
- review playlist and notification surfaces as backend support matures
- define a clearer invalidation policy for persisted catalog caches
- integrate future FCM token lifecycle with the API when backend support is ready

## Executive summary

Sonoriza Mobile is no longer just a local player and is no longer purely a Firebase client.

It is now a React Native streaming-oriented mobile client with:
- Redux-persisted local state
- API-first authentication
- access token + refresh token session lifecycle
- public/private route separation
- interceptor-based token validation and retry
- playback and queue orchestration through Track Player
- notification handling through Firebase Messaging and Notifee
- gradual migration of domain flows toward the Sonoriza API

This document should be considered the current integration and architecture reference for Sonoriza Mobile.
