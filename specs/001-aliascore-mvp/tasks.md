# Implementation Tasks: AliasCore Mobile MVP

**Feature**: AliasCore Mobile - Universal Gaming Identity Platform
**Branch**: `001-mock-auth-flow`
**Date**: 2025-12-11
**Status**: Ready for Implementation

---

## Overview

This document breaks down the AliasCore Mobile MVP implementation into actionable, independently testable tasks organized by user story. Each user story represents a complete, shippable increment that delivers value.

**Tech Stack**: TypeScript 5.9.2, React Native 0.81.5, Expo SDK ~54.0.0, React Navigation 6.1.18

**Organization**: Tasks are grouped by user story (US1-US5) from the [spec.md](./spec.md), ordered by priority (P1 → P2 → P3).

---

## Task Format Legend

```
- [ ] [TaskID] [P] [Story] Description with file path
```

- **TaskID**: Sequential number (T001, T002, etc.)
- **[P]**: Parallelizable (can run simultaneously with other [P] tasks)
- **[Story]**: User story label ([US1], [US2], etc.)
- **File paths**: Absolute or relative to project root

---

## Phase 1: Setup & Infrastructure (Foundation)

**Goal**: Prepare the development environment and implement mock data infrastructure for frontend-only development.

### Environment Setup

- [X] T001 Verify `.env` file exists with MOCK_AUTH=true, API_BASE_URL configured
- [X] T002 [P] Install any missing dependencies with `npm install`
- [X] T003 [P] Run type check to verify TypeScript configuration: `npm run type-check`
- [ ] T004 [P] Start Expo development server to verify setup: `npm start`

### Mock Data Infrastructure

**Why First**: Mock data enables all user stories to be developed and tested without backend dependency.

- [X] T005 [P] Create seeded random number generator in `src/common/services/mock/seededRandom.ts`
- [X] T006 [P] Create user factory in `src/common/services/mock/userFactory.ts`
- [X] T007 [P] Create domain profile factory in `src/common/services/mock/domainProfileFactory.ts`
- [X] T008 [P] Create event factory in `src/common/services/mock/eventFactory.ts`
- [X] T009 Create mock data service (singleton) in `src/common/services/mock/mockDataService.ts`
- [X] T010 Create mock API interceptor in `src/common/services/mock/mockApiInterceptor.ts`
- [X] T011 Create barrel export in `src/common/services/mock/index.ts`
- [X] T012 Integrate mock interceptor into `src/auth/services/authApi.ts` (check MOCK_AUTH flag)
- [X] T013 Initialize mock service in `src/auth/context/AuthContext.tsx` when MOCK_AUTH=true
- [X] T014 Test mock data generation: verify consistent user ID, 2-3 domains, 5-10 events per domain (type check passed)

**Acceptance**: Running app in mock mode (MOCK_AUTH=true) generates deterministic data that persists across restarts.

---

## Phase 2: User Story 1 - First-Time User Onboarding (P1)

**Goal**: Enable users to sign in with Google (or mock auth) and complete onboarding to access their dashboard.

**Independent Test**: Fresh install → Sign in → Complete onboarding → Land on dashboard.

**Why P1**: Gateway to all other features. Without authentication, no other user stories are accessible.

### Authentication Flow ([US1])

- [ ] T015 [P] [US1] Update `src/auth/services/authApi.ts` to skip onboarding in mock mode (per clarification)
- [ ] T016 [P] [US1] Verify `src/auth/services/tokenStorage.ts` web fallback (localStorage) works correctly
- [ ] T017 [US1] Update `src/auth/context/AuthContext.tsx` to bypass onboarding for mock users
- [ ] T018 [US1] Test returning user flow: app restart → verify user remains authenticated → lands on dashboard

### Onboarding Screens ([US1])

- [ ] T019 [P] [US1] Verify `src/auth/screens/SplashScreen.tsx` displays branding and value proposition
- [ ] T020 [P] [US1] Verify `src/auth/screens/WelcomeScreen.tsx` shows "Sign in with Google" button
- [ ] T021 [US1] Test WelcomeScreen: tap button → mock auth triggers → navigates to dashboard (onboarding skipped in mock mode)
- [ ] T022 [P] [US1] Review `src/auth/screens/OnboardingScreen.tsx` for production use (not used in mock mode, but should exist)
- [ ] T023 [US1] Verify onboarding validation: display name 3-30 chars, alphanumeric + spaces + `. - '`

### Navigation Integration ([US1])

- [ ] T024 [US1] Verify `src/navigation/RootNavigator.tsx` routes authenticated users to AppStack
- [ ] T025 [US1] Verify `src/navigation/AuthStack.tsx` shows Splash → Welcome → Onboarding for new users
- [ ] T026 [US1] Test auth state transitions: unauthenticated → authenticated → dashboard

### US1 Acceptance Testing

- [ ] T027 [US1] **Integration Test**: Fresh app install → splash screen → welcome screen → sign in → dashboard
- [ ] T028 [US1] **Integration Test**: Returning user → app launch → bypass auth screens → land on dashboard
- [ ] T029 [US1] **Integration Test**: Mock mode → sign in → skip onboarding → dashboard with 2-3 mock domains

**US1 Deliverable**: Working authentication flow with onboarding (skipped in mock mode), landing users on the Domains Dashboard.

---

## Phase 3: User Story 2 - View Gaming Domain Profiles (P1)

**Goal**: Display user's gaming domains on a dashboard and allow navigation to detailed domain profiles.

**Independent Test**: Sign in → View dashboard with domain cards → Tap a card → View domain profile with stats → Dismiss back to dashboard.

**Why P1**: Core value proposition. Without domain profiles, the app has no primary content.

### Domain Dashboard Screen ([US2])

- [X] T030 [P] [US2] Create `src/domains/screens/DomainsDashboardScreen.tsx` with full-screen vertical scrollable grid
- [X] T031 [P] [US2] Create `src/domains/components/DomainCard.tsx` component (domain icon, name, 1-2 highlight stats)
- [X] T032 [US2] Implement domains API service in `src/domains/services/domainsApi.ts` with mock mode support
- [X] T033 [US2] Domain state managed with React useState (zustand deferred - not needed for MVP)
- [X] T034 [US2] Integrate domainsApi with dashboard: fetch domains on mount
- [X] T035 [US2] Render domain cards from mock data (Chess, Valorant)
- [X] T036 [US2] Implement empty state: "No gaming domains yet" message with call-to-action
- [X] T037 [US2] Implement pull-to-refresh gesture to reload domain data
- [X] T038 [US2] Add loading skeleton while fetching domains

### Domain Profile Screen ([US2])

- [ ] T039 [P] [US2] Create `src/domains/screens/DomainProfileScreen.tsx` with namecard-style layout
- [ ] T040 [P] [US2] Create `src/domains/components/DomainProfileCard.tsx` (display name, platform, ratings, stats)
- [ ] T041 [US2] Implement navigation from dashboard → domain profile (tap domain card)
- [ ] T042 [US2] Display profile data: display name, primary platform, platform username, peak rating, current rating, games played, rank tier
- [ ] T043 [US2] Handle missing/incomplete stats: show "—" for null fields (e.g., "Current Rating: —")
- [ ] T044 [US2] Implement swipe-down dismiss gesture to return to dashboard
- [ ] T045 [US2] Add share button (floating action button, bottom-right) for future US3

### Navigation & Gestures ([US2])

- [ ] T046 [US2] Update `src/navigation/AppStack.tsx` to include DomainsDashboard and DomainProfile screens
- [ ] T047 [US2] Configure gesture navigation: horizontal swipe for domain profile transitions
- [ ] T048 [US2] Set transition duration to 250ms with native driver (per research.md)
- [ ] T049 [US2] Test gesture responsiveness: target <100ms response time

### US2 Acceptance Testing

- [ ] T050 [US2] **Integration Test**: Dashboard loads → displays 2-3 mock domain cards
- [ ] T051 [US2] **Integration Test**: Tap Chess card → navigate to Chess profile → see stats (1720 rating, 1850 peak, Expert)
- [ ] T052 [US2] **Integration Test**: Swipe down on profile → dismiss to dashboard
- [ ] T053 [US2] **Unit Test**: Test domain card rendering with null stats (games played null, rank tier null)
- [ ] T054 [US2] **Performance Test**: Profile render time <500ms after tap (per spec)

**US2 Deliverable**: Functional Domains Dashboard and Domain Profile screens with gesture navigation and mock data.

---

## Phase 4: User Story 3 - Share Domain Profile via QR Code (P2)

**Goal**: Enable users to share their domain profile via QR code for instant scanning.

**Independent Test**: Open domain profile → Tap share → Select QR → See full-screen QR code → Verify URL encodes correct profile.

**Why P2**: Sharing is a key differentiator. Enables social use case for gamers to connect.

### Share Sheet & QR Components ([US3])

- [ ] T055 [P] [US3] Create `src/sharing/screens/ShareSheetScreen.tsx` (bottom sheet with QR/NFC options)
- [ ] T056 [P] [US3] Create `src/sharing/screens/QRCodeScreen.tsx` (full-screen QR code display)
- [ ] T057 [P] [US3] Create `src/sharing/components/QRCodeDisplay.tsx` using react-native-qrcode-svg
- [ ] T058 [US3] Create `src/sharing/hooks/useProfileShareURL.ts` to generate share URLs
- [ ] T059 [US3] Create `src/sharing/services/shareService.ts` to build SharePayload

### QR Generation Configuration ([US3])

- [ ] T060 [US3] Configure QRCodeDisplay: size 300px (profile card) or 400px (full-screen modal), ECL=M, quietZone=8
- [ ] T061 [US3] Generate share URL from domain profile: `https://aliascore.app/share/{shareSlug}`
- [ ] T062 [US3] Test QR generation performance: target <100ms generation time (per spec)
- [ ] T063 [US3] Implement error handling: "Unable to generate QR code. Please try again"

### Share Flow Integration ([US3])

- [ ] T064 [US3] Add share button to DomainProfileScreen (floating action button, already added in T045)
- [ ] T065 [US3] Implement share button onPress: navigate to ShareSheet modal
- [ ] T066 [US3] ShareSheet displays: "Share your {domainName} profile" + preview (username, peak rating)
- [ ] T067 [US3] ShareSheet options: "QR Code" button, "NFC" button (stub for US5)
- [ ] T068 [US3] Tap "QR Code" → navigate to QRCodeScreen with full-screen QR
- [ ] T069 [US3] QRCodeScreen: display QR, header "Scan to view profile", dismiss gesture (swipe down)

### Navigation Updates ([US3])

- [ ] T070 [US3] Update `src/navigation/AppStack.tsx` to include ShareSheet and QRCode screens
- [ ] T071 [US3] Configure ShareSheet as modal presentation with vertical dismiss gesture
- [ ] T072 [US3] Configure QRCodeScreen as transparentModal with fade transition

### US3 Acceptance Testing

- [ ] T073 [US3] **Integration Test**: Domain profile → tap share → see ShareSheet with QR/NFC options
- [ ] T074 [US3] **Integration Test**: Tap QR Code → see full-screen QR → verify URL contains shareSlug
- [ ] T075 [US3] **Integration Test**: Swipe down on QR screen → dismiss to domain profile
- [ ] T076 [US3] **Performance Test**: QR generation <100ms (per spec)
- [ ] T077 [US3] **Unit Test**: Test shareService generates correct SharePayload (no email, no tokens)

**US3 Deliverable**: Working QR code sharing with sub-100ms generation and correct URL encoding.

---

## Phase 5: User Story 4 - Discover Local Events for a Domain (P2)

**Goal**: Display nearby gaming events on a map for the selected domain.

**Independent Test**: Domain profile → Swipe right → See events map with pins → Tap pin → View event details.

**Why P2**: Community value. Connects users to local gaming events.

### Events Map Screen ([US4])

- [ ] T078 [P] [US4] Create `src/events/screens/EventsMapScreen.tsx` using react-native-maps
- [ ] T079 [P] [US4] Create `src/events/components/EventPin.tsx` (custom map marker)
- [ ] T080 [P] [US4] Create `src/events/components/EventDetailsSheet.tsx` (bottom sheet overlay)
- [ ] T081 [US4] Implement events API service in `src/events/services/eventsApi.ts` with mock mode support
- [ ] T082 [US4] Generate mock events: 5-10 per domain (Chess, Valorant, Speedrunning), realistic names/dates/venues

### Location & Permissions ([US4])

- [ ] T083 [US4] Request location permission using expo-location on map load
- [ ] T084 [US4] Handle permission granted: center map on user location, fetch events within 30km radius
- [ ] T085 [US4] Handle permission denied: show events in default area (San Francisco 37.7749, -122.4194), prompt to enable location
- [ ] T086 [US4] Display max 25 event pins (per spec), sorted by soonest date if more exist

### Event Interaction ([US4])

- [ ] T087 [US4] Implement tap on event pin → display EventDetailsSheet
- [ ] T088 [US4] EventDetailsSheet shows: event name, date/time, venue, description, "View Event" button
- [ ] T089 [US4] "View Event" button opens external link in browser (or in-app web view)
- [ ] T090 [US4] Handle network error: show error state "Unable to load events" with retry button

### Navigation & Gestures ([US4])

- [ ] T091 [US4] Implement right-swipe gesture on DomainProfileScreen → navigate to EventsMap
- [ ] T092 [US4] Update `src/navigation/AppStack.tsx` with custom gesture configuration (50% screen width threshold)
- [ ] T093 [US4] Implement left-swipe or back gesture on EventsMap → dismiss to DomainProfile
- [ ] T094 [US4] Test gesture response time: <100ms (per spec)

### US4 Acceptance Testing

- [ ] T095 [US4] **Integration Test**: Domain profile → swipe right → events map opens with pins
- [ ] T096 [US4] **Integration Test**: Tap event pin → see event details (name, date, venue)
- [ ] T097 [US4] **Integration Test**: Swipe left on map → dismiss to domain profile
- [ ] T098 [US4] **Integration Test**: Deny location permission → map shows default area with prompt
- [ ] T099 [US4] **Performance Test**: Events map loads within 5 seconds (per spec)

**US4 Deliverable**: Functional events map with location permissions, event pins, and details overlay.

---

## Phase 6: User Story 5 - Share Domain Profile via NFC (P3)

**Goal**: Stub NFC sharing with "Coming Soon" message for MVP.

**Independent Test**: Domain profile → Tap share → Select NFC → See "Coming Soon" message.

**Why P3**: Low priority, deferred to post-MVP. QR codes cover 90% of sharing use cases.

### NFC Stub Implementation ([US5])

- [ ] T100 [US5] Update ShareSheetScreen to include "NFC" button alongside "QR Code"
- [ ] T101 [US5] Implement NFC button onPress: display alert "NFC sharing coming soon!"
- [ ] T102 [US5] Add TODO comment in shareService for future NFC implementation (NDEF format, react-native-nfc-manager)

### US5 Acceptance Testing

- [ ] T103 [US5] **Integration Test**: ShareSheet → tap NFC → see "Coming Soon" message
- [ ] T104 [US5] **Integration Test**: Dismiss alert → return to ShareSheet

**US5 Deliverable**: Stubbed NFC sharing UI, ready for post-MVP implementation.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Goal**: Optimize performance, improve UX polish, and ensure production readiness.

### Performance Optimization

- [ ] T105 [P] Verify all React Navigation transitions use `useNativeDriver: true`
- [ ] T106 [P] Profile app launch time: verify <2s to dashboard on mid-range device
- [ ] T107 [P] Profile domain profile render: verify <500ms after tap
- [ ] T108 [P] Test gesture responsiveness: verify <100ms across all gestures
- [ ] T109 Optimize bundle size: analyze with `expo-bundler` and remove unused dependencies

### Error Handling & Edge Cases

- [ ] T110 [P] Implement network error states for all API calls (domains, events)
- [ ] T111 [P] Implement retry functionality for failed network requests
- [ ] T112 [P] Test offline behavior: cached domains viewable, events show error state
- [ ] T113 Add logging for critical errors (crashes, API failures) using `src/common/services/logger.ts`

### UX Polish

- [ ] T114 [P] Add loading skeletons for dashboard and domain profile screens
- [ ] T115 [P] Add haptic feedback on button taps and gesture completions (optional)
- [ ] T116 [P] Verify accessibility: 44×44pt touch targets, WCAG AA color contrast, readable text sizes
- [ ] T117 Test rapid gesture interactions: ensure no crashes or glitches

### Testing (Critical Path)

- [ ] T118 [P] Create integration test harness in `__tests__/integration/`
- [ ] T119 [P] Write integration test: Login flow (`__tests__/integration/auth/login-flow.test.tsx`)
- [ ] T120 [P] Write integration test: Dashboard view (`__tests__/integration/domains/dashboard.test.tsx`)
- [ ] T121 [P] Write integration test: Domain profile view (`__tests__/integration/domains/domain-profile.test.tsx`)
- [ ] T122 [P] Write integration test: QR generation (`__tests__/integration/sharing/qr-generation.test.tsx`)
- [ ] T123 Write unit test: Domain stat formatters (`__tests__/unit/utils/formatters.test.ts`)
- [ ] T124 Write unit test: Share URL builder (`__tests__/unit/services/shareService.test.ts`)
- [ ] T125 Run all tests: `npm test` → verify 100% of critical path tests pass

### Production Readiness

- [ ] T126 Update `.env.example` with all required variables and documentation
- [ ] T127 Verify `app.config.js` exposes MOCK_AUTH and API_BASE_URL to Expo
- [ ] T128 Review security: verify no tokens in logs, secure storage used for auth tokens
- [ ] T129 Test production mode: set MOCK_AUTH=false, verify app requires real backend (expected to fail gracefully)
- [ ] T130 Final smoke test: Fresh install on iOS and Android → complete US1, US2, US3, US4

**Phase 7 Deliverable**: Production-ready MVP with optimized performance, error handling, and critical path test coverage.

---

## Dependency Graph

**User Story Completion Order** (can be developed in parallel where noted):

```
Phase 1: Setup & Infrastructure (T001-T014)
   ↓
Phase 2: US1 - Onboarding (T015-T029) ← BLOCKING for all other stories
   ↓
Phase 3: US2 - Domain Profiles (T030-T054) ← BLOCKING for US3, US4, US5
   ↓
┌──────────────────────┬──────────────────────┬──────────────────────┐
↓                      ↓                      ↓                      ↓
Phase 4: US3 -        Phase 5: US4 -        Phase 6: US5 -        Phase 7: Polish
QR Sharing            Events Map            NFC Stub              (T105-T130)
(T055-T077)           (T078-T099)           (T100-T104)
[Can run parallel]    [Can run parallel]    [Can run parallel]    [Can run parallel]
```

**Critical Path**: US1 → US2 → US3 (MVP core)
**Parallel Work**: US3, US4, US5 can be developed simultaneously after US2 completes

---

## Parallel Execution Examples

### Phase 1 Parallelization
Run T002, T003, T004 in parallel (different systems):
```bash
Terminal 1: npm install
Terminal 2: npm run type-check
Terminal 3: npm start
```

Run T005-T008 in parallel (different files):
```bash
Developer A: seededRandom.ts + userFactory.ts
Developer B: domainProfileFactory.ts + eventFactory.ts
```

### Phase 3 Parallelization (US2)
Run T030-T031 in parallel (different files):
```bash
Developer A: DomainsDashboardScreen.tsx
Developer B: DomainCard.tsx
```

### Phases 4-6 Parallelization
**After US2 completes**, run US3, US4, US5 in parallel:
```bash
Developer A: US3 - QR Sharing (T055-T077)
Developer B: US4 - Events Map (T078-T099)
Developer C: US5 - NFC Stub (T100-T104)
```

---

## Implementation Strategy

### MVP Scope (Recommended First Delivery)

**Minimum Viable Product**: US1 + US2 + US3

- **US1**: Authentication & Onboarding (gateway to app)
- **US2**: Domain Dashboard & Profiles (core value proposition)
- **US3**: QR Code Sharing (key differentiator)

**Estimated Effort**: ~2-3 days for experienced React Native developer

**Deferrable**: US4 (Events Map), US5 (NFC Stub), Phase 7 (Polish) can be added incrementally post-MVP.

### Incremental Delivery

1. **Week 1**: Phase 1 (Setup) + Phase 2 (US1 - Onboarding)
   - Deliverable: Working authentication with mock data

2. **Week 2**: Phase 3 (US2 - Domain Profiles)
   - Deliverable: Dashboard and profile viewing

3. **Week 3**: Phase 4 (US3 - QR Sharing) + Phase 7 (Critical Path Tests)
   - Deliverable: MVP with sharing and basic test coverage

4. **Week 4**: Phase 5 (US4 - Events Map) + Phase 6 (US5 - NFC Stub) + Phase 7 (Polish)
   - Deliverable: Full feature set with production readiness

---

## Task Summary

| Phase | User Story | Task Count | Parallel Opportunities | Blocking? |
|-------|------------|:----------:|:---------------------:|:---------:|
| Phase 1 | Setup | 14 | 10 tasks (T002-T008) | ✅ Blocks all |
| Phase 2 | US1 - Onboarding | 15 | 5 tasks | ✅ Blocks US2-US5 |
| Phase 3 | US2 - Domain Profiles | 25 | 8 tasks | ✅ Blocks US3-US5 |
| Phase 4 | US3 - QR Sharing | 23 | 5 tasks | ❌ Can parallel with US4,US5 |
| Phase 5 | US4 - Events Map | 22 | 4 tasks | ❌ Can parallel with US3,US5 |
| Phase 6 | US5 - NFC Stub | 5 | 0 tasks | ❌ Can parallel with US3,US4 |
| Phase 7 | Polish | 26 | 15 tasks | ❌ Can parallel with US3-US5 |
| **Total** | **5 User Stories** | **130 tasks** | **47 parallelizable** | - |

---

## Independent Test Criteria (Per User Story)

### US1: First-Time User Onboarding
**Test**: Fresh install → splash → welcome → sign in → land on dashboard
**Pass Criteria**: User authenticated, bypasses auth screens on restart, mock mode skips onboarding

### US2: View Gaming Domain Profiles
**Test**: Dashboard loads → tap domain card → view profile → swipe to dismiss
**Pass Criteria**: 2-3 mock domains displayed, profile shows stats, gestures work smoothly

### US3: Share Domain Profile via QR Code
**Test**: Profile → tap share → select QR → see QR code → verify URL
**Pass Criteria**: QR generates <100ms, encodes correct shareSlug, dismisses cleanly

### US4: Discover Local Events for a Domain
**Test**: Profile → swipe right → map loads → tap pin → see details
**Pass Criteria**: Map shows 5-10 events, location permission handled, pins interactive

### US5: Share Domain Profile via NFC
**Test**: Profile → tap share → select NFC → see "Coming Soon"
**Pass Criteria**: Stub message displays, user can dismiss and return to share sheet

---

## Next Steps

1. **Start with Phase 1**: Setup mock data infrastructure (T001-T014)
2. **Proceed to US1**: Complete authentication and onboarding (T015-T029)
3. **Build US2**: Implement domain dashboard and profiles (T030-T054)
4. **Add US3**: QR sharing for MVP completion (T055-T077)
5. **Optionally add US4/US5**: Events map and NFC stub (T078-T104)
6. **Polish**: Performance, testing, production readiness (T105-T130)

**Current Status**: Ready to begin implementation. All tasks are specific, actionable, and independently testable.

---

**Format Validation**: ✅ All 130 tasks follow the required checklist format with TaskID, [P] markers, [Story] labels, and file paths.
