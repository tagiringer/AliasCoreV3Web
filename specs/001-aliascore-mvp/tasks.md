# Tasks: AliasCore Mobile MVP

**Input**: Design documents from `/specs/001-aliascore-mvp/`
**Prerequisites**: plan.md (technical architecture), spec.md (user stories with priorities)

**Tests**: Per constitution (Principle IV: Critical Path Testing), we include integration tests for critical flows and unit tests for domain logic. No snapshot tests for MVP.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, US4, US5)
- Include exact file paths in descriptions

## Path Conventions

This is an Expo React Native mobile application. All paths are relative to repository root:
- Source code: `src/` (feature-first organization)
- Tests: `__tests__/` (mirrors `src/` structure)
- Configuration: Root level (`app.config.js`, `package.json`, `tsconfig.json`)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic Expo React Native structure

- [X] T001 Initialize Expo managed workflow project with TypeScript template
- [X] T002 Configure package.json with dependencies: @react-navigation/native, @react-navigation/stack, zustand, expo-secure-store, @react-native-async-storage/async-storage, react-native-maps, react-native-qrcode-svg, react-native-nfc-manager, react-native-gesture-handler, react-native-reanimated
- [X] T003 [P] Configure tsconfig.json with strict mode enabled
- [X] T004 [P] Create .env.example with API_BASE_URL, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET placeholders
- [X] T005 [P] Configure app.config.js to load environment variables from .env
- [X] T006 [P] Setup ESLint and Prettier for TypeScript + React Native
- [X] T007 [P] Configure Jest and React Native Testing Library in package.json
- [X] T008 Create feature-first directory structure: src/auth/, src/profile/, src/domains/, src/events/, src/sharing/, src/common/, src/navigation/

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

### Common Types & Utilities

- [X] T009 [P] Define User interface in src/common/types/entities.ts
- [X] T010 [P] Define DomainProfile interface in src/common/types/entities.ts
- [X] T011 [P] Define Event interface in src/common/types/entities.ts
- [X] T012 [P] Define SharePayload interface in src/common/types/entities.ts
- [X] T013 [P] Define navigation types (screen params) in src/common/types/navigation.ts
- [X] T014 [P] Define API request/response types in src/common/types/api.ts

### Design System

- [X] T015 [P] Create color palette in src/common/theme/colors.ts (primary: #6C63FF, secondary: #FFD700, etc.)
- [X] T016 [P] Create typography scale in src/common/theme/typography.ts (minimum 16pt body text per constitution)
- [X] T017 [P] Create spacing constants in src/common/theme/spacing.ts

### Common Components

- [X] T018 [P] Create Button component in src/common/components/Button.tsx (44×44pt minimum per constitution)
- [X] T019 [P] Create Card component in src/common/components/Card.tsx
- [X] T020 [P] Create Text component in src/common/components/Text.tsx (uses typography scale)
- [X] T021 [P] Create LoadingSkeleton component in src/common/components/LoadingSkeleton.tsx
- [X] T022 [P] Create ErrorState component in src/common/components/ErrorState.tsx

### API Client & Logging

- [X] T023 Create API client with auth token injection in src/common/services/apiClient.ts
- [X] T024 [P] Create logger service (errors + critical actions, no sensitive data) in src/common/services/logger.ts
- [X] T025 [P] Create utility functions (formatRating, validateDisplayName) in src/common/utils/formatters.ts
- [X] T026 [P] Create validation utilities in src/common/utils/validators.ts

### Navigation Infrastructure

- [X] T027 Create AuthStack navigator in src/navigation/AuthStack.tsx
- [X] T028 Create AppStack navigator in src/navigation/AppStack.tsx (with gesture configs per constitution)
- [X] T029 Create RootNavigator with conditional auth/app stack rendering in src/navigation/RootNavigator.tsx
- [X] T030 Create navigation type definitions in src/navigation/types.ts

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - First-Time User Onboarding (Priority: P1) 🎯 MVP

**Goal**: Enable users to authenticate via Google OAuth, set display name and avatar, and land on dashboard

**Independent Test**: Install app fresh, complete Google sign-in, set display name (3-30 chars) and avatar, verify arrival at Domains Dashboard

### Tests for User Story 1

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [X] T031 [P] [US1] Integration test for auth flow in __tests__/integration/auth.test.tsx
- [X] T032 [P] [US1] Unit test for display name validation (3-30 chars, alphanumeric + spaces + . - ') in __tests__/unit/validators.test.ts

### Implementation for User Story 1

#### Auth Types & Services

- [X] T033 [P] [US1] Define auth types in src/auth/types.ts (AuthResponse, LoginRequest, etc.)
- [X] T034 [US1] Create tokenStorage service (SecureStore wrapper) in src/auth/services/tokenStorage.ts
- [X] T035 [US1] Create authApi service (Google OAuth endpoints) in src/auth/services/authApi.ts

#### Auth Context & Hooks

- [X] T036 [US1] Create AuthContext with user state, signIn, signOut, updateUser in src/auth/context/AuthContext.tsx
- [X] T037 [P] [US1] Create useAuth hook in src/auth/hooks/useAuth.ts
- [X] T038 [P] [US1] Create useAuthToken hook for token refresh logic in src/auth/hooks/useAuthToken.ts

#### Auth Screens

- [X] T039 [P] [US1] Create SplashScreen with branding and auto-advance logic in src/auth/screens/SplashScreen.tsx
- [X] T040 [P] [US1] Create WelcomeScreen with "Sign in with Google" button in src/auth/screens/WelcomeScreen.tsx
- [X] T041 [US1] Create OnboardingScreen with display name input and avatar picker in src/auth/screens/OnboardingScreen.tsx

#### Auth Components

- [X] T042 [P] [US1] Create GoogleSignInButton component in src/auth/components/GoogleSignInButton.tsx

#### Profile Setup

- [X] T043 [P] [US1] Define profile types in src/profile/types.ts
- [X] T044 [US1] Create profileApi service (PUT /api/profile endpoint) in src/profile/services/profileApi.ts
- [X] T045 [US1] Create ProfileSetupScreen (integrated into OnboardingScreen flow) in src/profile/screens/ProfileSetupScreen.tsx

#### Integration & Polish

- [X] T046 [US1] Integrate AuthContext into App.tsx root component
- [X] T047 [US1] Wire AuthStack screens into navigation (Splash → Welcome → Onboarding)
- [X] T048 [US1] Add error handling for auth failures (friendly messages + retry button)
- [X] T049 [US1] Add logging for auth_success, auth_failure events
- [X] T050 [US1] Validate display name constraints (3-30 chars, alphanumeric + spaces + . - ')
- [X] T051 [US1] Add loading states (skeleton screen) during auth token validation

**Checkpoint**: At this point, User Story 1 should be fully functional - users can authenticate and complete onboarding

---

## Phase 4: User Story 2 - View Gaming Domain Profiles (Priority: P1) 🎯 MVP Extension

**Goal**: Enable authenticated users to view their domains dashboard and tap into detailed domain profiles

**Independent Test**: Log in, view dashboard with domain cards, tap a card, verify domain profile displays stats (peak rating, current rating, platform, games played, rank tier)

### Tests for User Story 2

- [ ] T052 [P] [US2] Integration test for domains dashboard rendering in __tests__/integration/domains.test.tsx
- [ ] T053 [P] [US2] Unit test for rating formatters (formatRating function) in __tests__/unit/formatters.test.ts

### Implementation for User Story 2

#### Domains Types & State

- [ ] T054 [P] [US2] Define domain types in src/domains/types.ts (mirrors DomainProfile from entities.ts)
- [ ] T055 [P] [US2] Create Zustand store for domains state in src/common/store/appStore.ts (domains array, selectedDomain)

#### Domains Services

- [ ] T056 [US2] Create domainsApi service (GET /api/domains, GET /api/domains/{domainKey}) in src/domains/services/domainsApi.ts
- [ ] T057 [P] [US2] Create domainsCache service (AsyncStorage stale-while-revalidate pattern) in src/domains/services/domainsCache.ts

#### Domains Hooks

- [ ] T058 [US2] Create useDomains hook (fetch, cache, refresh logic) in src/domains/hooks/useDomains.ts
- [ ] T059 [P] [US2] Create useDomainProfile hook (fetch single domain) in src/domains/hooks/useDomainProfile.ts

#### Domains Components

- [ ] T060 [P] [US2] Create DomainCard component (domain icon, name, highlight stats) in src/domains/components/DomainCard.tsx
- [ ] T061 [P] [US2] Create DomainNamecard component (namecard-style plate for profile screen) in src/domains/components/DomainNamecard.tsx
- [ ] T062 [P] [US2] Create StatsGrid component (games played, rank tier, etc.) in src/domains/components/StatsGrid.tsx

#### Domains Screens

- [ ] T063 [US2] Create DomainsDashboardScreen (renders domain cards, pull-to-refresh) in src/domains/screens/DomainsDashboardScreen.tsx
- [ ] T064 [US2] Create DomainProfileScreen (namecard, share button, swipe-right gesture for map) in src/domains/screens/DomainProfileScreen.tsx

#### Integration & Polish

- [ ] T065 [US2] Wire DomainsDashboardScreen into AppStack as initial screen
- [ ] T066 [US2] Wire DomainProfileScreen into AppStack with card presentation and vertical gesture
- [ ] T067 [US2] Add empty state for dashboard (no domains: "Connect your profiles to get started")
- [ ] T068 [US2] Add loading skeleton for dashboard while fetching domains
- [ ] T069 [US2] Add error state for dashboard (network error with retry button)
- [ ] T070 [US2] Add logging for domain_view events
- [ ] T071 [US2] Implement dismiss gesture (swipe down) on DomainProfileScreen to return to dashboard
- [ ] T072 [US2] Add placeholder text ("—") for missing domain stats (e.g., if currentRating is null)
- [ ] T073 [US2] Ensure domain cards are visually distinct (domain icon, color, typography) per constitution UX principles

**Checkpoint**: At this point, Users can authenticate AND view their domain profiles - MVP core value delivered

---

## Phase 5: User Story 3 - Share Domain Profile via QR Code (Priority: P2)

**Goal**: Enable users to share their domain profile via QR code from the domain profile screen

**Independent Test**: Open domain profile, tap share button, select QR code, verify full-screen QR displays, scan QR (or open URL manually) to confirm public profile page loads

### Tests for User Story 3

- [ ] T074 [P] [US3] Integration test for QR code generation in __tests__/integration/sharing.test.tsx
- [ ] T075 [P] [US3] Unit test for shareUrlBuilder (constructs public profile URL) in __tests__/unit/shareUrlBuilder.test.ts

### Implementation for User Story 3

#### Sharing Types & Services

- [ ] T076 [P] [US3] Define sharing types in src/sharing/types.ts (QRSharePayload, NFCSharePayload)
- [ ] T077 [P] [US3] Create shareUrlBuilder service (builds https://aliascore.app/share/{userId}/{domainKey}) in src/sharing/services/shareUrlBuilder.ts
- [ ] T078 [P] [US3] Create qrService (wraps react-native-qrcode-svg) in src/sharing/services/qrService.ts
- [ ] T079 [P] [US3] Create nfcService stub (interface for future NFC integration) in src/sharing/services/nfcService.ts

#### Sharing Components

- [ ] T080 [P] [US3] Create QRCodeDisplay component in src/sharing/components/QRCodeDisplay.tsx

#### Sharing Screens

- [ ] T081 [US3] Create ShareSheet (bottom sheet with QR/NFC options) in src/sharing/screens/ShareSheet.tsx
- [ ] T082 [US3] Create QRCodeScreen (full-screen QR display with dismiss) in src/sharing/screens/QRCodeScreen.tsx

#### Integration & Polish

- [ ] T083 [US3] Wire ShareSheet into AppStack as modal presentation
- [ ] T084 [US3] Wire QRCodeScreen into AppStack as modal presentation
- [ ] T085 [US3] Add share button to DomainProfileScreen (bottom-right floating action button)
- [ ] T086 [US3] Connect share button to ShareSheet navigation
- [ ] T087 [US3] Implement QR generation (<100ms per constitution performance target)
- [ ] T088 [US3] Add logging for share_qr events
- [ ] T089 [US3] Add error handling for QR generation failures ("Unable to generate QR code. Please try again")
- [ ] T090 [US3] Ensure share sheet clearly communicates what's being shared (domain name, username, stats summary)
- [ ] T091 [US3] Add dismiss gesture (swipe down) on ShareSheet and QRCodeScreen

**Checkpoint**: At this point, Users can authenticate, view domains, AND share profiles via QR code

---

## Phase 6: User Story 4 - Discover Local Events for a Domain (Priority: P2)

**Goal**: Enable users to swipe right on domain profile to view map of local events (20-mile radius, max 25 events)

**Independent Test**: Open domain profile, swipe right, verify events map opens with pins, tap pin to view event details (name, date, venue, link)

### Tests for User Story 4

- [ ] T092 [P] [US4] Integration test for events map loading in __tests__/integration/events.test.tsx

### Implementation for User Story 4

#### Events Types & Services

- [ ] T093 [P] [US4] Define event types in src/events/types.ts (mirrors Event from entities.ts)
- [ ] T094 [US4] Create eventsApi service (GET /api/events with lat/lng/radius/limit params) in src/events/services/eventsApi.ts
- [ ] T095 [P] [US4] Create locationService (Expo Location wrapper) in src/events/services/locationService.ts

#### Events Hooks

- [ ] T096 [US4] Create useEvents hook (fetch events by domain + location) in src/events/hooks/useEvents.ts
- [ ] T097 [P] [US4] Create useLocation hook (request permission, get coords) in src/events/hooks/useLocation.ts

#### Events Components

- [ ] T098 [P] [US4] Create EventPin component (map marker) in src/events/components/EventPin.tsx

#### Events Screens

- [ ] T099 [US4] Create EventsMapScreen (react-native-maps with event pins, max 25) in src/events/screens/EventsMapScreen.tsx
- [ ] T100 [US4] Create EventDetailsSheet (bottom sheet with event details) in src/events/screens/EventDetailsSheet.tsx

#### Integration & Polish

- [ ] T101 [US4] Wire EventsMapScreen into AppStack with horizontal gesture direction
- [ ] T102 [US4] Implement right-swipe gesture on DomainProfileScreen using PanGestureHandler (>50% screen width threshold)
- [ ] T103 [US4] Add location permission request flow (friendly prompt: "Allow location to find events near you")
- [ ] T104 [US4] Handle location permission denied (show map with fallback location, prompt to enable)
- [ ] T105 [US4] Lazy load EventsMapScreen (React.lazy + Suspense per constitution performance principle)
- [ ] T106 [US4] Limit events to 25 soonest upcoming events (backend handles this, frontend validates)
- [ ] T107 [US4] Add logging for event_view events
- [ ] T108 [US4] Add error state for events map (network error with retry button)
- [ ] T109 [US4] Add loading skeleton for events map while fetching data
- [ ] T110 [US4] Implement dismiss gesture (swipe left) on EventsMapScreen to return to domain profile
- [ ] T111 [US4] Ensure smooth transitions between domain profile and events map (60 FPS using native driver)

**Checkpoint**: At this point, Users can authenticate, view domains, share profiles, AND discover local events

---

## Phase 7: User Story 5 - Share Domain Profile via NFC (Priority: P3)

**Goal**: Stub NFC sharing with "Coming Soon" message OR implement minimal NFC integration

**Independent Test**: Open domain profile, tap share, select NFC, verify "Coming Soon" message OR verify NFC payload is written correctly

### Implementation for User Story 5

#### NFC Integration (Stubbed)

- [ ] T112 [P] [US5] Implement nfcService stub with "Coming Soon" response in src/sharing/services/nfcService.ts
- [ ] T113 [US5] Add NFC option to ShareSheet with conditional rendering (show "Coming Soon" badge)
- [ ] T114 [US5] Add logging for share_nfc events (even if stubbed)
- [ ] T115 [US5] Document NFC interface for future upgrade in src/sharing/services/nfcService.ts (comments explaining how to integrate react-native-nfc-manager)

**Checkpoint**: NFC sharing is stubbed and ready for future implementation

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories and final MVP readiness

### Performance Optimizations

- [ ] T116 [P] Enable native driver for all animations (useNativeDriver: true)
- [ ] T117 [P] Optimize images (use Expo image caching for domain icons and avatars)
- [ ] T118 [P] Implement code splitting for feature modules (lazy load map screen)

### Error Handling & Logging

- [ ] T119 [P] Add error boundaries around each feature screen
- [ ] T120 [P] Validate all logging excludes sensitive data (tokens, emails, passwords)
- [ ] T121 [P] Add network status monitoring (useNetworkStatus hook in src/common/hooks/)

### Testing

- [ ] T122 [P] Run all integration tests and verify critical flows pass
- [ ] T123 [P] Run all unit tests and verify formatters/validators pass
- [ ] T124 Validate app meets performance targets (<2s launch, <500ms transitions, <100ms gestures)

### Documentation

- [ ] T125 [P] Create README.md with project overview and quick start
- [ ] T126 [P] Verify .env.example is complete and accurate
- [ ] T127 [P] Document environment setup (Node.js 18+, Expo CLI, iOS Simulator / Android Emulator)

### Final Validation

- [ ] T128 Test app on iOS simulator (iOS 13+)
- [ ] T129 Test app on Android emulator (Android 8.0+)
- [ ] T130 Verify all user stories work independently and together
- [ ] T131 Run accessibility audit (44×44pt touch targets, 16pt text, WCAG AA contrast)
- [ ] T132 Verify no hardcoded API URLs or secrets in codebase
- [ ] T133 Confirm all constitutional principles are satisfied

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-7)**: All depend on Foundational phase completion
  - **User Story 1 (P1)**: Can start after Foundational - No dependencies on other stories
  - **User Story 2 (P1)**: Can start after Foundational - Depends on User Story 1 (requires auth to view domains)
  - **User Story 3 (P2)**: Can start after Foundational - Depends on User Story 2 (shares domain profile)
  - **User Story 4 (P2)**: Can start after Foundational - Depends on User Story 2 (swipes from domain profile)
  - **User Story 5 (P3)**: Can start after Foundational - Depends on User Story 3 (extends sharing options)
- **Polish (Phase 8)**: Depends on all desired user stories being complete

### User Story Dependencies

```
Foundational (Phase 2)
        ↓
   User Story 1 (Auth & Onboarding) ← REQUIRED FOR ALL
        ↓
   User Story 2 (Domains Dashboard & Profile) ← REQUIRED FOR US3 & US4
        ↓
        ├──→ User Story 3 (QR Sharing)
        ├──→ User Story 4 (Events Map)
        └──→ User Story 5 (NFC Sharing) ← Extends US3
```

**Recommended Sequential Order for Solo Developer**:
1. Phase 1: Setup
2. Phase 2: Foundational
3. Phase 3: User Story 1 (Auth) → **STOP & TEST**
4. Phase 4: User Story 2 (Domains) → **STOP & TEST** (MVP complete!)
5. Phase 5: User Story 3 (QR) → **STOP & TEST**
6. Phase 6: User Story 4 (Events) → **STOP & TEST**
7. Phase 7: User Story 5 (NFC Stub) → **STOP & TEST**
8. Phase 8: Polish

### Within Each User Story

- Tests (if included) MUST be written and FAIL before implementation
- Types before services
- Services before hooks
- Hooks before components
- Components before screens
- Screens before integration
- Integration before logging/error handling

### Parallel Opportunities

- **Setup (Phase 1)**: T003, T004, T005, T006, T007 can run in parallel
- **Foundational (Phase 2)**:
  - All types (T009-T014) can run in parallel
  - All theme files (T015-T017) can run in parallel
  - All common components (T018-T022) can run in parallel
  - Logger and validators (T024-T026) can run in parallel
- **User Story 1**: T031-T032 (tests), T033 (types), T037-T038 (hooks), T039-T040 (screens), T042-T043 (components/types) can run in parallel
- **User Story 2**: T052-T053 (tests), T054-T055 (types/state), T057 (cache), T059 (hook), T060-T062 (components) can run in parallel
- **User Story 3**: T074-T075 (tests), T076-T079 (types/services), T080 (component) can run in parallel
- **User Story 4**: T092 (test), T093 (types), T095 (service), T097 (hook), T098 (component) can run in parallel
- **User Story 5**: T112-T113 (NFC stub) can run in parallel
- **Polish (Phase 8)**: T116-T118, T119-T121, T122-T124, T125-T127 can each run in parallel within their categories

---

## Parallel Example: User Story 2

```bash
# Launch all tests for User Story 2 together:
Task T052: "Integration test for domains dashboard rendering in __tests__/integration/domains.test.tsx"
Task T053: "Unit test for rating formatters in __tests__/unit/formatters.test.ts"

# Launch types and state together:
Task T054: "Define domain types in src/domains/types.ts"
Task T055: "Create Zustand store in src/common/store/appStore.ts"

# Launch all components together (after hooks are done):
Task T060: "Create DomainCard component in src/domains/components/DomainCard.tsx"
Task T061: "Create DomainNamecard component in src/domains/components/DomainNamecard.tsx"
Task T062: "Create StatsGrid component in src/domains/components/StatsGrid.tsx"
```

---

## Implementation Strategy

### MVP First (User Stories 1 + 2 Only)

1. Complete Phase 1: Setup (T001-T008)
2. Complete Phase 2: Foundational (T009-T030) - CRITICAL blocking phase
3. Complete Phase 3: User Story 1 (T031-T051) - Authentication & Onboarding
4. **STOP and VALIDATE**: Test User Story 1 independently (users can sign in and complete onboarding)
5. Complete Phase 4: User Story 2 (T052-T073) - Domains Dashboard & Profile
6. **STOP and VALIDATE**: Test User Stories 1+2 together (full auth → domains flow)
7. **MVP COMPLETE**: Users can authenticate and view their gaming domains
8. Deploy to TestFlight/Google Play Internal Testing

### Incremental Delivery

1. Setup + Foundational → Foundation ready (T001-T030)
2. Add User Story 1 → Test independently → **Demo** (T031-T051)
3. Add User Story 2 → Test independently → **MVP Demo** (T052-T073)
4. Add User Story 3 → Test independently → **Feature Demo** (T074-T091)
5. Add User Story 4 → Test independently → **Feature Demo** (T092-T111)
6. Add User Story 5 → Test independently → **Feature Demo** (T112-T115)
7. Polish → Final MVP → **Production Release** (T116-T133)

Each story adds value without breaking previous stories.

### Parallel Team Strategy

With multiple developers (requires Foundational phase complete first):

1. **Team completes Setup + Foundational together** (T001-T030)
2. Once Foundational is done:
   - **Developer A**: User Story 1 (Auth) (T031-T051)
   - **Developer B**: Prepare for User Story 2 (read docs, plan components)
3. After US1 complete:
   - **Developer A**: User Story 3 (QR Sharing) (T074-T091)
   - **Developer B**: User Story 2 (Domains) (T052-T073)
   - **Developer C**: User Story 4 (Events) (T092-T111) - can start screens/components, wait for US2 integration
4. Stories complete and integrate independently

---

## Task Summary

**Total Tasks**: 133

**Breakdown by Phase**:
- Phase 1 (Setup): 8 tasks
- Phase 2 (Foundational): 22 tasks
- Phase 3 (User Story 1 - Auth): 21 tasks
- Phase 4 (User Story 2 - Domains): 22 tasks
- Phase 5 (User Story 3 - QR Sharing): 18 tasks
- Phase 6 (User Story 4 - Events): 20 tasks
- Phase 7 (User Story 5 - NFC Stub): 4 tasks
- Phase 8 (Polish): 18 tasks

**Parallelizable Tasks**: 68 tasks marked with [P]

**Independent Test Criteria per Story**:
- **US1**: Install fresh, sign in with Google, set display name (3-30 chars) and avatar, verify dashboard arrival
- **US2**: Log in, view dashboard cards, tap card, verify domain profile displays stats
- **US3**: Open domain profile, tap share, select QR, verify full-screen QR displays and scans correctly
- **US4**: Open domain profile, swipe right, verify map with pins, tap pin to see event details
- **US5**: Open domain profile, tap share, select NFC, verify "Coming Soon" message or NFC payload

**Suggested MVP Scope**: User Stories 1 + 2 (51 total tasks including Setup + Foundational + US1 + US2)

**Estimated MVP Timeline (Solo Developer)**:
- Phase 1 (Setup): ~1 day
- Phase 2 (Foundational): ~3-4 days
- Phase 3 (User Story 1): ~3-4 days
- Phase 4 (User Story 2): ~3-4 days
- **MVP Total**: ~10-13 days

---

## Notes

- All tasks follow strict checklist format: `- [ ] [ID] [P?] [Story?] Description with file path`
- [P] tasks = different files, no dependencies, can run in parallel
- [Story] label (US1, US2, etc.) maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Verify tests fail before implementing (TDD for critical flows)
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Constitution principles embedded throughout (gesture-driven UX, feature-first architecture, type safety, performance targets, security)
- No snapshot tests per constitution (Principle IV)
- All file paths are exact and follow feature-first structure
- MVP = User Stories 1 + 2 (auth + domains viewing)
- Full MVP = User Stories 1-4 (add sharing + events)
