# Implementation Plan: AliasCore Mobile MVP - Universal Gaming Identity Platform

**Branch**: `001-mock-auth-flow` | **Date**: 2025-12-11 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-aliascore-mvp/spec.md`

## Summary

AliasCore Mobile is a React Native application that aggregates gaming achievements across multiple domains (Chess, Valorant, etc.) into a universal "gaming identity card." The MVP focuses on authentication, domain dashboard, domain profiles with QR/NFC sharing, and local events map discovery. The UX is Snapchat-inspired: gesture-driven, full-screen, minimal chrome, and fast transitions.

**Technical Approach**: React Native (Expo) with TypeScript, feature-first architecture, mock authentication for development (MOCK_AUTH environment variable), backend API integration for production, secure token storage (expo-secure-store with web localStorage fallback), gesture-based navigation using React Navigation stack.

## Technical Context

**Language/Version**: TypeScript 5.9.2, React Native 0.81.5, React 19.1.0, Expo SDK ~54.0.0
**Primary Dependencies**:
- Navigation: @react-navigation/native 6.1.18, @react-navigation/stack 6.4.1
- Authentication: expo-auth-session 7.0.9, expo-secure-store 15.0.7
- Sharing: react-native-qrcode-svg 6.3.0, react-native-nfc-manager 3.15.1
- Maps: react-native-maps 1.20.1
- State: zustand 4.5.2
- HTTP: native fetch API

**Storage**:
- Auth tokens: expo-secure-store (iOS Keychain, Android EncryptedSharedPreferences) with localStorage fallback for web
- App config: expo-constants for environment variables
- User data: Backend API (source of truth), local caching via zustand

**Testing**: Jest 29.7.0, @testing-library/react-native 12.5.0, jest-expo 54.0.0, react-test-renderer 19.1.0
**Target Platform**: iOS 15+, Android 10+, Web (development/testing only)
**Project Type**: Mobile application (cross-platform via Expo/React Native)
**Performance Goals**:
- App launch to dashboard: <2s on mid-range devices
- Domain profile render: <500ms after tap
- QR code generation: <100ms
- Gesture response: <100ms (immediate feedback)

**Constraints**:
- Must work offline for cached data viewing
- Backend API assumed to exist (contracts documented, not implemented in this project)
- Mock mode (MOCK_AUTH=true) must bypass all API calls for frontend development
- Security: no tokens in logs, secure storage only, minimal data in QR/NFC payloads

**Scale/Scope**:
- 5 primary user flows (onboarding, dashboard, domain profile, sharing, events map)
- ~10 screens total
- Maximum 10 domains per user
- 25 events max displayed on map

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### ✅ I. Snapchat-Inspired UX
- **Status**: PASS
- **Evidence**: Spec defines full-screen views, gesture-driven navigation (swipe right for map, swipe down to dismiss), minimal chrome, fast transitions (<500ms target), clear touch targets (44×44pt minimum)
- **Implementation**: Implemented via React Navigation stack with custom gesture handlers, cardStyleInterpolators for smooth transitions

### ✅ II. Feature-First Architecture
- **Status**: PASS
- **Evidence**: Existing codebase organized by feature: `src/auth/`, `src/domains/`, `src/events/`, `src/profile/`, `src/sharing/`, `src/common/`, `src/navigation/`
- **Implementation**: Each feature folder contains screens/, components/, hooks/, services/, types.ts, index.ts as per constitution

### ✅ III. Type Safety & Modern React Native
- **Status**: PASS
- **Evidence**: TypeScript strict mode enabled in tsconfig.json (strict: true, noImplicitAny: true), functional components only, hooks-based state management
- **Implementation**: All components use TypeScript with proper typing for props, navigation params, API responses

### ✅ IV. Critical Path Testing
- **Status**: PASS
- **Evidence**: Spec prioritizes integration tests for critical flows (login, dashboard, domain profile, QR generation) and unit tests for domain logic (formatters, URL builders)
- **Implementation**: Jest + React Native Testing Library for integration tests, focus on user flows over snapshots

### ✅ V. Mobile-First Performance
- **Status**: PASS
- **Evidence**: Spec defines performance targets (<2s launch, <500ms profile render, <100ms QR generation), caching strategy, offline support, loading states
- **Implementation**: zustand for state management, cached domain data, skeleton screens during load

### ✅ VI. Security & Privacy by Default
- **Status**: PASS
- **Evidence**: Spec requires secure token storage, no logging of tokens/email, minimal QR/NFC payload data, environment variables for config
- **Implementation**: expo-secure-store for tokens, logger excludes sensitive data, .env for API_BASE_URL with .env.example template

### ✅ VII. Explicit Over Implicit
- **Status**: PASS
- **Evidence**: Spec uses `/speckit.clarify` for ambiguity resolution, mock mode explicitly documented, backend contracts marked as assumptions
- **Implementation**: MOCK_AUTH=true environment variable for explicit mode switching, console logs confirm mock mode active

**Gate Result**: ✅ ALL CHECKS PASS - Proceed to Phase 0

## Project Structure

### Documentation (this feature)

```text
specs/001-aliascore-mvp/
├── spec.md              # Feature specification (complete)
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (to be generated)
├── data-model.md        # Phase 1 output (to be generated)
├── quickstart.md        # Phase 1 output (to be generated)
├── contracts/           # Phase 1 output (to be generated)
│   ├── auth.openapi.yaml
│   ├── domains.openapi.yaml
│   ├── events.openapi.yaml
│   └── sharing.openapi.yaml
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
# Mobile application structure (Expo/React Native)
src/
├── auth/                # Authentication feature (COMPLETE)
│   ├── screens/
│   │   ├── SplashScreen.tsx
│   │   ├── WelcomeScreen.tsx
│   │   └── OnboardingScreen.tsx
│   ├── components/
│   │   └── GoogleSignInButton.tsx
│   ├── context/
│   │   └── AuthContext.tsx
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   └── useAuthToken.ts
│   ├── services/
│   │   ├── authApi.ts (with mock mode support)
│   │   └── tokenStorage.ts (with web fallback)
│   ├── types.ts
│   └── index.ts
│
├── domains/             # Game domains feature (PLACEHOLDER - Phase 4)
│   ├── screens/
│   │   ├── DomainsDashboardScreen.tsx
│   │   └── DomainProfileScreen.tsx
│   ├── components/
│   │   ├── DomainCard.tsx
│   │   └── DomainProfileCard.tsx
│   ├── services/
│   │   └── domainsApi.ts (with mock data support)
│   ├── types.ts
│   └── index.ts
│
├── profile/             # User profile feature (PLACEHOLDER - Phase 3)
│   ├── screens/
│   │   └── ProfileSetupScreen.tsx
│   ├── services/
│   │   └── profileApi.ts
│   ├── types.ts
│   └── index.ts
│
├── sharing/             # QR/NFC sharing feature (PLACEHOLDER - Phase 5)
│   ├── screens/
│   │   ├── ShareSheetScreen.tsx
│   │   └── QRCodeScreen.tsx
│   ├── components/
│   │   └── QRCodeGenerator.tsx
│   ├── services/
│   │   └── sharingService.ts
│   ├── types.ts
│   └── index.ts
│
├── events/              # Events map feature (PLACEHOLDER - Phase 6)
│   ├── screens/
│   │   ├── EventsMapScreen.tsx
│   │   └── EventDetailsScreen.tsx
│   ├── components/
│   │   ├── EventPin.tsx
│   │   └── EventDetailsSheet.tsx
│   ├── services/
│   │   └── eventsApi.ts (with mock data support)
│   ├── types.ts
│   └── index.ts
│
├── common/              # Shared utilities and components (COMPLETE)
│   ├── components/
│   │   ├── Text.tsx
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── ErrorState.tsx
│   │   ├── LoadingSkeleton.tsx
│   │   └── index.ts
│   ├── hooks/
│   │   └── (future shared hooks)
│   ├── services/
│   │   ├── apiClient.ts (HTTP client with auth injection)
│   │   └── logger.ts (privacy-aware logging)
│   ├── theme/
│   │   ├── colors.ts
│   │   ├── spacing.ts
│   │   ├── typography.ts
│   │   └── index.ts
│   ├── types/
│   │   ├── api.ts
│   │   ├── entities.ts
│   │   ├── navigation.ts
│   │   └── index.ts
│   └── utils/
│       ├── formatters.ts
│       └── validators.ts
│
└── navigation/          # Navigation configuration (COMPLETE)
    ├── RootNavigator.tsx
    ├── AuthStack.tsx
    ├── AppStack.tsx (with placeholder dashboard)
    ├── types.ts
    └── index.ts

# Test structure
__tests__/
├── integration/
│   ├── auth/
│   │   ├── login-flow.test.tsx
│   │   └── onboarding-flow.test.tsx
│   ├── domains/
│   │   ├── dashboard.test.tsx
│   │   └── domain-profile.test.tsx
│   └── sharing/
│       └── qr-generation.test.tsx
└── unit/
    ├── services/
    │   ├── authApi.test.ts
    │   └── domainsApi.test.ts
    └── utils/
        ├── formatters.test.ts
        └── validators.test.ts

# Configuration
.env                     # Local environment (not committed)
.env.example             # Template with placeholders
app.config.js            # Expo configuration
tsconfig.json            # TypeScript strict mode enabled
package.json             # Dependencies and scripts
```

**Structure Decision**: Mobile application structure (Option 3 from template). Chosen because the project is a React Native mobile app with backend API integration. Each feature module is self-contained with screens, components, services, and types. The `common/` folder houses shared utilities and reusable UI components. Navigation is centralized in `navigation/` folder. Backend API is separate (not in this repository).

## Complexity Tracking

> **No violations detected.** Constitution check passed cleanly.

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| N/A | N/A | N/A |

## Phase 0: Outline & Research

### Research Tasks Identified

Based on Technical Context gaps and spec requirements, the following research tasks are needed:

#### 1. Mock Data Generation Strategy
**Question**: How should mock domain profiles and events be generated consistently across app restarts while maintaining realistic data?

**Investigation Areas**:
- Mock data structure for 2-3 domain profiles (Chess, Valorant, Speedrunning)
- Mock event data generation (5-10 events per domain)
- Data consistency across restarts (same mock user ID, domains)
- Mock vs. production data switching mechanism

**Output**: Patterns for mock data factories, seeding strategy, environment-based switching

#### 2. Backend API Contract Assumptions
**Question**: What are the assumed backend API endpoints, request/response schemas, and authentication flows?

**Investigation Areas**:
- Google OAuth backend integration flow (POST /api/auth/google)
- User profile endpoint (GET /api/auth/me)
- Domain profiles endpoint (GET /api/domains, GET /api/domains/:domainId)
- Events endpoint (GET /api/events?domainId=X&lat=Y&lon=Z&radius=30km)
- Public share page endpoint (GET /api/share/:userId/:domainId)

**Output**: OpenAPI 3.0 specifications for all backend contracts

#### 3. QR Code Generation Best Practices
**Question**: What QR code library best practices apply for performance (<100ms generation) and payload optimization?

**Investigation Areas**:
- react-native-qrcode-svg performance characteristics
- QR code error correction levels for profile URLs
- Optimal QR code size for mobile screens
- URL shortening strategies for QR payload minimization

**Output**: QR generation implementation pattern with performance targets

#### 4. NFC Implementation Strategy (MVP Stub)
**Question**: How should NFC be stubbed for MVP while structuring for future implementation?

**Investigation Areas**:
- react-native-nfc-manager API surface
- NFC payload format for profile URLs (NDEF records)
- Platform-specific permissions (iOS/Android)
- "Coming Soon" stub UI pattern

**Output**: NFC service interface with stub implementation and upgrade path

#### 5. React Native Maps Integration
**Question**: What are best practices for react-native-maps with event pins, location permissions, and offline graceful degradation?

**Investigation Areas**:
- Event pin clustering for 25 max events
- Location permission request flow (expo-location)
- Map initialization with/without user location
- Network error states and retry UX

**Output**: Maps integration pattern with permission handling and error states

#### 6. Offline Caching Strategy
**Question**: How should domain and user data be cached for offline viewing while maintaining freshness?

**Investigation Areas**:
- zustand persistence middleware options
- Cache invalidation triggers (pull-to-refresh, background refresh)
- Stale-while-revalidate patterns for React Native
- Storage limits and eviction policies

**Output**: Caching architecture with TTL and invalidation rules

#### 7. Gesture Navigation Configuration
**Question**: What React Navigation gesture configurations achieve Snapchat-like UX (<100ms response, smooth transitions)?

**Investigation Areas**:
- CardStyleInterpolators for swipe transitions
- Gesture threshold tuning (50% screen width for right-swipe, 30% height for down-swipe)
- Navigation animation performance optimization
- Handling rapid gesture interactions without glitches

**Output**: Navigation configuration with gesture handlers and transition specs

### Research Deliverable

All research findings will be consolidated in `research.md` using the format:
- **Decision**: [what was chosen]
- **Rationale**: [why chosen]
- **Alternatives considered**: [what else evaluated]
- **Implementation notes**: [key details for Phase 1]

## Phase 1: Design & Contracts

**Prerequisites:** `research.md` complete with all Technical Context gaps resolved

### Data Model (`data-model.md`)

Extract entities from spec and define schemas:

1. **User**
   - Fields: id, email, displayName, avatarUrl, domains (array of domainIds, max 10), createdAt, updatedAt
   - Validation: displayName 3-30 chars, alphanumeric + spaces + . - '
   - Relationships: 1:N with DomainProfile

2. **DomainProfile**
   - Fields: id, userId, domainKey, domainName, domainIcon, primaryPlatform, platformUsername, peakRating, currentRating, gamesPlayed, rankTier, shareSlug, lastUpdated
   - Validation: shareSlug unique, ratings nullable, platformUsername required
   - Relationships: N:1 with User, 1:N with Event

3. **Event**
   - Fields: id, domainKey, name, description, venue, dateTime, latitude, longitude, link, organizerName
   - Validation: latitude/longitude valid coordinates, dateTime ISO 8601
   - Relationships: N:1 with DomainProfile (via domainKey)

4. **SharePayload**
   - Fields: type (always 'domain-profile'), shareSlug, domainKey, displayName, platformUsername, shareUrl, timestamp
   - Validation: minimal fields only (no email, no auth tokens)
   - Use: QR/NFC encoding

### API Contracts (`contracts/`)

Generate OpenAPI 3.0 specs for backend endpoints:

1. **auth.openapi.yaml**
   - POST /api/auth/google (request: {idToken}, response: {token, user, isNewUser})
   - GET /api/auth/me (response: {user})
   - POST /api/auth/signout

2. **domains.openapi.yaml**
   - GET /api/domains (response: {domains: DomainProfile[]})
   - GET /api/domains/:domainId (response: DomainProfile)

3. **events.openapi.yaml**
   - GET /api/events?domainId=X&lat=Y&lon=Z&radius=30 (response: {events: Event[], limit: 25})

4. **sharing.openapi.yaml**
   - GET /api/share/:userId/:domainId (public endpoint, response: HTML page with profile data)

### Agent Context Update

Run `.specify/scripts/bash/update-agent-context.sh claude` to update `.claude/context/codebase-context.md` with new technology stack and architecture patterns from this plan.

### Quickstart Guide (`quickstart.md`)

Developer onboarding document:
1. Prerequisites (Node.js, Expo CLI, React Native dev environment)
2. Setup steps (npm install, .env configuration)
3. Running the app (expo start, mock mode vs. production mode)
4. Testing (jest, integration test structure)
5. Common commands (start, test, type-check, lint)

## Implementation Phases (Post-Planning)

**Note**: These phases are executed via `/speckit.tasks` command, NOT by `/speckit.plan`. This section documents the high-level roadmap.

### Phase 2: Foundation (Task Generation Phase)
- Execute `/speckit.tasks` to generate tasks.md
- Tasks include:
  - Finalize mock data factories (users, domains, events)
  - Implement mock API services with MOCK_AUTH switch
  - Create integration test harness

### Phase 3: Authentication & Onboarding
- Complete WelcomeScreen with Google OAuth (mock + production)
- Complete OnboardingScreen with display name + avatar
- Auth flow tests (login, onboarding, returning user)

### Phase 4: Domains Dashboard & Profile
- DomainsDashboardScreen with domain cards
- DomainProfileScreen with namecard-style UI
- Pull-to-refresh, empty states
- Domain profile tests

### Phase 5: Sharing (QR/NFC)
- ShareSheetScreen with options
- QRCodeScreen with instant generation (<100ms)
- NFC stub ("Coming Soon" message)
- QR generation tests

### Phase 6: Events Map
- EventsMapScreen with react-native-maps
- Event pins (max 25, clustered if needed)
- EventDetailsScreen (bottom sheet)
- Location permission handling
- Events map tests

### Phase 7: Polish & Integration
- Gesture navigation tuning (thresholds, animations)
- Performance optimization (bundle size, render time)
- Offline caching implementation
- End-to-end user flow tests
- Production deployment preparation

## Next Steps

1. ✅ **Phase 0**: Execute research tasks and generate `research.md` (COMPLETE)
2. ✅ **Phase 1**: Generate `data-model.md`, `contracts/`, `quickstart.md` (COMPLETE)
3. ✅ **Agent Context Update**: Updated CLAUDE.md with technology stack (COMPLETE)
4. ⏸️ **Phase 2**: Run `/speckit.tasks` to generate actionable task breakdown (separate command)
5. ⏸️ **Implementation**: Execute tasks from tasks.md in dependency order

**Current Status**: Planning phase complete. Ready for `/speckit.tasks` command.
