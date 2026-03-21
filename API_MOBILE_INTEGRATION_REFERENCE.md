# Sonoriza API + Mobile - Integration Reference

## Purpose of this document

This file documents the current integration state between:
- Sonoriza API
- Sonoriza Mobile

It is intended to work as a shared reference for:
- backend and mobile alignment
- future refactors in the auth/session/device layer
- onboarding and architectural review
- tracking what is already implemented versus what is still pending

It should not replace:
- the API integration reference
- the mobile integration reference
- the project `README`

It should be treated as the specific contract and flow reference for the API <-> Mobile integration.

## Current integration summary

The Sonoriza Mobile application is no longer integrated with the backend only through user/session credentials.

The current integration now includes:
- account creation through the API
- account verification through the API
- login through the API
- refresh-token-based session lifecycle
- authenticated profile bootstrap through `GET /me`
- music, artist, genre, recommendation, like and view flows through the API
- authenticated profile photo upload through `POST /me/photo`
- device registration context during login and account verification
- FCM token capture during authentication flows
- push notification delivery through Firebase Messaging + Notifee

This means the current mobile runtime should be understood as:
- an API-first mobile client
- with persisted session state
- with device-aware authentication
- and with push delivery reconnected to the authenticated installation context

## What was implemented in the API

The API evolved from a simple session and catalog backend into a session-aware and device-aware platform backend.

### Authentication and account lifecycle

The API already supports:
- `POST /accounts`
- `POST /accounts/verify`
- `POST /accounts/resend-verification`
- `POST /sessions`
- `POST /sessions/refresh`
- `POST /sessions/logout`
- `GET /me`

Current auth characteristics:
- accounts are created as `PENDING_VERIFICATION`
- account verification activates the user and opens the first session
- login is allowed only for `ACTIVE` accounts
- refresh token rotation is mandatory
- logout revokes the current session

### Session and device model

The API now includes:
- `devices` domain
- `sessions` bound to a `deviceId`
- a `Device` entity persisted in the database

Current device-aware behavior:
- login requires `device`
- account verification requires `device`
- sessions are now bound to a specific device
- only one active session is allowed per user
- login from a different device while another session is active returns `409 ACTIVE_SESSION_ALREADY_EXISTS`
- login again on the same device rotates the active session
- refresh keeps the same device binding

### Device payload expected by the API

The API currently expects a `device` object like:

```json
{
  "deviceKey": "stable-device-or-installation-key",
  "platform": "MOBILE",
  "deviceName": "Galaxy S24",
  "manufacturer": "Samsung",
  "model": "SM-S921B",
  "osName": "Android",
  "osVersion": "14",
  "appVersion": "1.0.0",
  "fcmToken": "optional-fcm-token"
}
```

Purpose of this payload:
- register the authenticated installation context
- support single active session per user
- persist the current FCM token for push delivery
- track device metadata for session governance

### Catalog and profile flows already exposed by the API

The API currently supports the mobile app in:
- `GET /me`
- `GET /me/recommendations/musics`
- `PATCH /me`
- `POST /me/photo`
- `GET /musics`
- `GET /musics/:id`
- `POST /musics/:id/like`
- `POST /musics/:id/view`
- `GET /artists`
- `GET /artists/:id`
- `POST /artists/:id/like`
- `GET /genres`

## What was implemented in the mobile app

The mobile app already migrated the main user-facing flow to the API and now participates in the device-aware contract.

### Auth and session layer

The mobile app already implements:
- API-based sign in in `src/screens/SignIn/index.tsx`
- API-based account verification in `src/screens/ConfirmCode/index.tsx`
- persisted `accessToken` and `refreshToken` in the Redux `user` slice
- cold-start validation and refresh in `src/screens/SplashScreen/index.tsx`
- request interceptor auth header injection in `src/services/api.ts`
- response interceptor retry and `401` handling in `src/services/api.ts`
- centralized session utilities in `src/services/session.ts`
- public/private route separation in `src/routes/routes.tsx`

### Device-aware authentication on mobile

The mobile app now collects and sends device context during:
- `POST /sessions`
- `POST /accounts/verify`

Current device payload sources on mobile:
- `deviceKey`
  - obtained through Firebase Installations
- `fcmToken`
  - obtained through Firebase Messaging
- device metadata
  - obtained through `react-native-device-info`

Packages currently involved:
- `@react-native-firebase/installations`
- `@react-native-firebase/messaging`
- `react-native-device-info`

### Current device payload built by the mobile app

The current mobile payload contains:
- `deviceKey`
- `platform = MOBILE`
- `deviceName`
- `manufacturer`
- `model`
- `osName`
- `osVersion`
- `appVersion`
- `fcmToken`

Current practical meaning:
- the mobile client now authenticates both the user and the installation
- the backend can distinguish same-account access coming from different devices
- push delivery can target the authenticated installation

### Notifications and push delivery

The push layer is already functional again on mobile.

Main file:
- `index.js`

Current behavior:
- listens to foreground messages through Firebase Messaging
- registers a background message handler
- creates an Android channel through Notifee
- displays local notifications through Notifee

Current result:
- when the API sends a push to the stored `fcmToken`, the mobile app receives and displays it correctly

## Current integrated flow

## 1. Create account

1. Mobile calls `POST /accounts`
2. API creates the user as `PENDING_VERIFICATION`
3. API generates and sends the verification code
4. Mobile redirects the user to the confirmation screen

## 2. Verify account and create first authenticated session

1. Mobile collects:
   - `email`
   - `code`
   - `device`
2. Mobile calls `POST /accounts/verify`
3. API validates the code
4. API activates the account
5. API registers or updates the device
6. API creates the first session bound to that device
7. API returns:
   - `access_token`
   - `refresh_token`
   - `user`
8. Mobile persists the session in Redux
9. Mobile enters the authenticated flow

## 3. Login with an already active account

1. Mobile collects:
   - `email`
   - `password`
   - `device`
2. Mobile calls `POST /sessions`
3. API validates credentials and account status
4. API evaluates device/session rules
5. API behavior depends on the session state:
   - same device: rotate active session
   - another device with active session: return `409 ACTIVE_SESSION_ALREADY_EXISTS`
   - no active session: open a new session normally
6. On success, API returns:
   - `access_token`
   - `refresh_token`
   - `user`
7. Mobile persists the session and enters the private app flow

## 4. Cold start

1. Mobile opens through `SplashScreen`
2. Mobile checks persisted session state
3. If there is no stored session:
   - go to `SignIn`
4. If there is a stored session and the device is offline:
   - go to `Home`
5. If there is a stored session and the device is online:
   - validate current access token
   - refresh if needed
   - call `GET /me`
   - merge the profile snapshot into Redux
   - go to `Home`

## 5. Protected request lifecycle

1. Mobile issues a protected request through Axios
2. Request interceptor checks whether the route is protected
3. If protected:
   - ensure valid access token
   - refresh before request if needed
   - inject `Authorization: Bearer <token>`
4. If the backend still returns `401`:
   - try one forced refresh
   - retry original request one time
   - if refresh fails, clear local session and return to `SignIn`

## 6. Push notification lifecycle

1. Mobile obtains `fcmToken` during login or account verification
2. Mobile sends `fcmToken` inside `device`
3. API persists `fcmToken` in the `Device` entity
4. API can later use this token to send push notifications
5. Mobile receives the push through Firebase Messaging
6. Mobile displays the notification through Notifee

## Current integration gains

The current API + Mobile integration now provides:

- API-first authentication instead of direct Firebase auth usage
- refresh-token-based mobile session lifecycle
- authenticated profile bootstrap from the backend
- catalog, recommendation, like and view flows centralized in the API
- user-scoped profile photo upload through the backend
- device-aware session creation
- one-active-session-per-user enforcement
- persisted FCM token associated with the authenticated device
- restored push notification delivery through the backend contract

## Current responsibilities split

### API owns

- account lifecycle
- session lifecycle
- refresh token rotation
- session revocation
- active-session conflict rules
- device persistence
- FCM token persistence
- authenticated profile source of truth
- recommendation source of truth
- catalog source of truth
- like and view business rules
- user photo upload rules

### Mobile owns

- UI rendering
- local session persistence
- public/private navigation flow
- token-aware request execution
- device metadata collection
- Firebase Installations `deviceKey` capture
- Firebase Messaging token capture
- on-device notification display
- playback and queue lifecycle
- offline local experience

## What is already working well

At the current stage, the shared runtime between API and Mobile is already healthy in the following areas:

- login
- account verification
- session persistence
- refresh token lifecycle
- authenticated splash/bootstrap
- recommendations
- music likes
- artist likes
- music view tracking
- profile update
- profile photo upload
- device persistence during auth
- FCM token capture
- push delivery and local notification display

## Known integration limitations

The integration is already strong, but some points are still not complete.

### 1. Logout is not yet fully backend-aware on mobile

The API already exposes:
- `POST /sessions/logout`

Current mobile logout behavior is still primarily local:
- clear Redux state
- reset navigation

This means the mobile app does not yet fully consume the backend logout contract.

### 2. `ACTIVE_SESSION_ALREADY_EXISTS` still needs dedicated UX treatment

The API already returns:
- `409 ACTIVE_SESSION_ALREADY_EXISTS`

The mobile contract already supports this response, but the UX for that conflict is not yet specialized in the sign-in flow.

### 3. FCM token refresh lifecycle is not fully closed yet

The mobile app already sends the initial `fcmToken`, but the broader lifecycle still needs refinement:
- detect token rotation
- send updated token back to the backend
- decide whether this happens on app start, auth, or both

### 4. Some app modules still depend on broader ongoing backend evolution

Examples:
- playlists
- some notification-history/UI surfaces
- password recovery completion flow

## Recommended next steps for the integration

- make mobile logout call `POST /sessions/logout`
- add dedicated UX for `409 ACTIVE_SESSION_ALREADY_EXISTS`
- centralize device-payload creation into a shared mobile service
- close the FCM token refresh/update flow
- continue aligning remaining account flows such as password recovery
- keep refining notification deep-link behavior as notification payloads mature

## Executive summary

The current Sonoriza API + Mobile integration is no longer only about credentials and access tokens.

It is now an integrated runtime model with:
- account verification
- refresh-token-based sessions
- device-bound authentication
- single active session per user
- persisted device context
- persisted FCM token context
- restored push notification delivery
- API-backed catalog, recommendation, like and playback analytics flows

This document should be considered the current shared integration reference for Sonoriza API and Sonoriza Mobile.
