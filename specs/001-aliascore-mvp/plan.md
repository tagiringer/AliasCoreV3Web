# Implementation Plan: AliasCore Mobile MVP

**Branch**: `001-aliascore-mvp` | **Date**: 2025-11-29 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-aliascore-mvp/spec.md`

## Summary

AliasCore Mobile is a React Native application that serves as a universal gaming identity platform. Users authenticate via Google OAuth, view their gaming domain profiles (Chess, esports, speedrunning, etc.), share profiles via QR codes or NFC, and discover local events. The UX is inspired by Snapchat: gesture-driven, full-screen views, minimal chrome, and fast transitions.

**Technical Approach**: Expo-based React Native app with TypeScript, feature-first architecture, React Navigation for stack-based navigation, lightweight state management (Zustand), and secure token storage. Backend API integration for auth, profiles, domains, and events.

## Technical Context

**Language/Version**: TypeScript 5.x with React Native via Expo SDK 50+
**Primary Dependencies**:
- Expo SDK (managed workflow)
- React Navigation 6.x (stack navigation)
- Zustand (lightweight state management)
- Expo SecureStore (token storage)
- react-native-maps (events map)
- react-native-qrcode-svg (QR generation)
- react-native-nfc-manager (NFC, stubbed initially)

**Storage**: Expo SecureStore for auth tokens; AsyncStorage for cached domain data
**Testing**: Jest + React Native Testing Library for integration/unit tests
**Target Platform**: iOS 13+ and Android 8.0+ (cross-platform mobile)
**Project Type**: mobile (Expo React Native)
**Performance Goals**: <2s app launch, <500ms screen transitions, <100ms gesture response, 60 FPS animations
**Constraints**: <200ms API response p95, offline-capable (cached data), location-based queries (20-mile radius)
**Scale/Scope**: MVP with 10 screens, 5 main features, support for 10 domains per user, 25 events per map view

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### I. Snapchat-Inspired UX ✅
- **Status**: PASS
- Full-screen views with React Navigation's card-style modals
- Gesture-driven navigation via PanResponder and React Navigation Gestures
- Fast transitions (<500ms) using native driver animations
- Minimal chrome: no tab bars, minimal headers, gesture-first dismissals
- Accessibility: 44×44pt touch targets, 16pt minimum text, WCAG AA contrast

### II. Feature-First Architecture ✅
- **Status**: PASS
- Directory structure follows constitution exactly:
  ```
  src/
  ├── auth/              # Authentication feature
  ├── profile/           # User profile feature
  ├── domains/           # Game domains feature
  ├── events/            # Events/map feature
  ├── sharing/           # QR/NFC sharing feature
  ├── common/            # Shared utilities, types, components
  └── navigation/        # Navigation configuration
  ```
- Each feature contains: screens/, components/, hooks/, services/, types.ts, index.ts

### III. Type Safety & Modern React Native ✅
- **Status**: PASS
- Strict TypeScript mode enabled in tsconfig.json
- Functional components with hooks (no class components)
- Full typing for API responses, navigation params, component props
- Avoid `any` types; use `unknown` or proper generics where needed

### IV. Critical Path Testing ✅
- **Status**: PASS
- Integration tests for: auth flow, domains dashboard, domain profile, QR generation
- Unit tests for: rating formatters, share URL builders, data transformations
- No snapshot tests for MVP (per constitution)

### V. Mobile-First Performance ✅
- **Status**: PASS
- Lazy loading for map screen (React.lazy + Suspense)
- Cached domain data via AsyncStorage + stale-while-revalidate pattern
- Skeleton screens for loading states
- Native driver animations for 60 FPS
- Image optimization via Expo's image caching

### VI. Security & Privacy by Default ✅
- **Status**: PASS
- Expo SecureStore for auth tokens (encrypted keychain on iOS, EncryptedSharedPreferences on Android)
- No hardcoded API URLs (use environment variables via app.config.js)
- Logging excludes tokens, emails, sensitive data (only log event types, anonymized user IDs)
- Share payloads expose only public profile data (no auth tokens, emails)

### VII. Explicit Over Implicit ✅
- **Status**: PASS
- Backend API contracts documented in contracts/ directory
- NFC implementation explicitly stubbed with interface for future upgrade
- All "NEEDS CLARIFICATION" items resolved in research.md
- Trade-offs documented (e.g., Zustand over Redux, Expo over bare React Native)

**Overall Gate Status**: ✅ **PASS** - All constitutional principles satisfied

## Project Structure

### Documentation (this feature)

```text
specs/001-aliascore-mvp/
├── plan.md              # This file (/speckit.plan command output)
├── spec.md              # Feature specification (input)
├── research.md          # Phase 0 output (research & decisions)
├── data-model.md        # Phase 1 output (entities & schemas)
├── quickstart.md        # Phase 1 output (dev setup guide)
├── contracts/           # Phase 1 output (API contracts)
│   ├── auth.openapi.yaml
│   ├── profile.openapi.yaml
│   ├── domains.openapi.yaml
│   └── events.openapi.yaml
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

This is an Expo-managed React Native mobile application. The directory structure follows the Feature-First Architecture (Constitution Principle II):

```text
/
├── app.config.js           # Expo configuration
├── package.json
├── tsconfig.json
├── .env.example            # Environment variables template
├── App.tsx                 # Root component with AuthProvider + Navigation
├── src/
│   ├── auth/               # Authentication feature
│   │   ├── screens/
│   │   │   ├── SplashScreen.tsx
│   │   │   ├── WelcomeScreen.tsx
│   │   │   └── OnboardingScreen.tsx
│   │   ├── components/
│   │   │   └── GoogleSignInButton.tsx
│   │   ├── hooks/
│   │   │   ├── useAuth.ts
│   │   │   └── useAuthToken.ts
│   │   ├── services/
│   │   │   ├── authApi.ts
│   │   │   └── tokenStorage.ts
│   │   ├── context/
│   │   │   └── AuthContext.tsx
│   │   ├── types.ts
│   │   └── index.ts
│   ├── profile/            # User profile feature
│   │   ├── screens/
│   │   │   └── ProfileSetupScreen.tsx
│   │   ├── services/
│   │   │   └── profileApi.ts
│   │   ├── types.ts
│   │   └── index.ts
│   ├── domains/            # Game domains feature
│   │   ├── screens/
│   │   │   ├── DomainsDashboardScreen.tsx
│   │   │   └── DomainProfileScreen.tsx
│   │   ├── components/
│   │   │   ├── DomainCard.tsx
│   │   │   ├── DomainNamecard.tsx
│   │   │   └── StatsGrid.tsx
│   │   ├── hooks/
│   │   │   ├── useDomains.ts
│   │   │   └── useDomainProfile.ts
│   │   ├── services/
│   │   │   ├── domainsApi.ts
│   │   │   └── domainsCache.ts
│   │   ├── types.ts
│   │   └── index.ts
│   ├── events/             # Events/map feature
│   │   ├── screens/
│   │   │   ├── EventsMapScreen.tsx
│   │   │   └── EventDetailsSheet.tsx
│   │   ├── components/
│   │   │   └── EventPin.tsx
│   │   ├── hooks/
│   │   │   ├── useEvents.ts
│   │   │   └── useLocation.ts
│   │   ├── services/
│   │   │   ├── eventsApi.ts
│   │   │   └── locationService.ts
│   │   ├── types.ts
│   │   └── index.ts
│   ├── sharing/            # QR/NFC sharing feature
│   │   ├── screens/
│   │   │   ├── ShareSheet.tsx
│   │   │   └── QRCodeScreen.tsx
│   │   ├── components/
│   │   │   └── QRCodeDisplay.tsx
│   │   ├── services/
│   │   │   ├── qrService.ts
│   │   │   ├── nfcService.ts       # Stubbed interface
│   │   │   └── shareUrlBuilder.ts
│   │   ├── types.ts
│   │   └── index.ts
│   ├── common/             # Shared utilities, types, components
│   │   ├── components/
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Text.tsx
│   │   │   ├── LoadingSkeleton.tsx
│   │   │   └── ErrorState.tsx
│   │   ├── hooks/
│   │   │   ├── useAppState.ts
│   │   │   └── useNetworkStatus.ts
│   │   ├── services/
│   │   │   ├── apiClient.ts
│   │   │   └── logger.ts
│   │   ├── types/
│   │   │   ├── api.ts
│   │   │   ├── navigation.ts
│   │   │   └── entities.ts
│   │   ├── utils/
│   │   │   ├── formatters.ts
│   │   │   └── validators.ts
│   │   ├── theme/
│   │   │   ├── colors.ts
│   │   │   ├── typography.ts
│   │   │   └── spacing.ts
│   │   └── index.ts
│   └── navigation/         # Navigation configuration
│       ├── AuthStack.tsx
│       ├── AppStack.tsx
│       ├── RootNavigator.tsx
│       └── types.ts
└── __tests__/              # Tests (mirrors src/ structure)
    ├── integration/
    │   ├── auth.test.tsx
    │   ├── domains.test.tsx
    │   └── sharing.test.tsx
    └── unit/
        ├── formatters.test.ts
        ├── shareUrlBuilder.test.ts
        └── validators.test.ts
```

**Structure Decision**: Mobile application structure (Option 3 equivalent, but using Expo's conventions). The src/ directory is organized by feature verticals (auth, profile, domains, events, sharing) with a common/ directory for shared code. Each feature is self-contained with its own screens, components, hooks, services, and types. Navigation is centralized in the navigation/ directory. Tests mirror the source structure.

This structure enables:
- **Parallel development**: Teams can work on different features independently
- **Clear ownership**: Each feature has all its related code in one place
- **Easy testing**: Test files correspond directly to source files
- **Future extraction**: Features can be extracted into separate packages if needed

## Complexity Tracking

> **No violations** - Constitution Check passed all gates. No complexity justifications needed.

---

## Phase 0: Research & Technology Decisions

### Research Questions

1. **State Management Choice**: Zustand vs React Context for MVP scope
2. **Navigation Patterns**: Best practices for gesture-driven stack navigation in React Navigation 6
3. **Offline Caching Strategy**: AsyncStorage patterns for domain data with stale-while-revalidate
4. **Google OAuth Integration**: Expo AuthSession vs expo-google-app-auth for OAuth flow
5. **NFC Implementation**: Stub vs minimal integration for react-native-nfc-manager
6. **Map Performance**: react-native-maps optimization for 25 event pins
7. **QR Code Library**: react-native-qrcode-svg vs react-native-qrcode-generator
8. **Logging Strategy**: Expo's built-in logging vs custom logger for errors + critical actions

### Research Deliverable

**Output**: `research.md` documenting:
- Technology choices with rationales
- Best practices for each selected technology
- Integration patterns and code examples
- Performance considerations
- Security implications
- Accessibility requirements

---

## Phase 1: Design & Contracts

### 1. Data Model Design

**Output**: `data-model.md` containing:

#### Entity: User
```typescript
interface User {
  id: string;                    // UUID from backend
  email: string;                 // From Google OAuth
  displayName: string;           // User-chosen, 3-30 chars
  avatarUrl: string | null;      // URL or null
  domains: string[];             // Array of DomainProfile IDs (max 10)
  createdAt: string;             // ISO 8601 timestamp
  updatedAt: string;             // ISO 8601 timestamp
}
```

**Validation Rules**:
- `displayName`: 3-30 characters, alphanumeric + spaces + (. - ')
- `domains`: Maximum 10 items
- `email`: Valid email format (enforced by OAuth)

#### Entity: DomainProfile
```typescript
interface DomainProfile {
  id: string;                    // UUID from backend
  userId: string;                // Foreign key to User
  domainKey: string;             // e.g., "chess", "valorant", "speedrun"
  domainName: string;            // e.g., "Chess", "Valorant"
  domainIcon: string;            // URL to icon image
  primaryPlatform: string;       // e.g., "Chess.com", "Riot Games"
  platformUsername: string;      // Username on that platform
  peakRating: number | null;     // Highest rating achieved
  currentRating: number | null;  // Current rating
  gamesPlayed: number | null;    // Total games
  rankTier: string | null;       // e.g., "Expert", "Diamond"
  shareSlug: string;             // Short slug for public share URL
  lastUpdated: string;           // ISO 8601 timestamp
}
```

**Validation Rules**:
- `peakRating`, `currentRating`: Non-negative integers if present
- `gamesPlayed`: Non-negative integer if present
- `shareSlug`: Unique per user+domain combination

#### Entity: Event
```typescript
interface Event {
  id: string;                    // UUID from backend
  domainKey: string;             // e.g., "chess"
  name: string;                  // Event name
  description: string | null;    // Event description
  startTime: string;             // ISO 8601 timestamp
  endTime: string | null;        // ISO 8601 timestamp
  latitude: number;              // Decimal degrees
  longitude: number;             // Decimal degrees
  venueName: string;             // Venue name
  venueAddress: string | null;   // Full address
  externalUrl: string | null;    // Link to event page
}
```

**Validation Rules**:
- `latitude`: -90 to 90
- `longitude`: -180 to 180
- `startTime`: Must be in the future for active events

#### Entity: SharePayload
```typescript
interface SharePayload {
  userId: string;
  domainKey: string;
  shareSlug: string;
  displayName: string;
  platformUsername: string;
  peakRating: number | null;
  // Public share URL is constructed from these fields
}
```

### 2. API Contracts

**Output**: `contracts/` directory with OpenAPI specs

#### `contracts/auth.openapi.yaml`
```yaml
openapi: 3.0.0
info:
  title: AliasCore Auth API
  version: 1.0.0
paths:
  /api/auth/google/login:
    get:
      summary: Initiate Google OAuth flow
      parameters:
        - name: redirect_uri
          in: query
          required: true
          schema:
            type: string
      responses:
        '302':
          description: Redirect to Google OAuth consent screen

  /api/auth/google/callback:
    get:
      summary: Handle Google OAuth callback
      parameters:
        - name: code
          in: query
          required: true
          schema:
            type: string
      responses:
        '200':
          description: Auth successful
          content:
            application/json:
              schema:
                type: object
                properties:
                  token:
                    type: string
                  user:
                    $ref: '#/components/schemas/User'
                  isNewUser:
                    type: boolean

  /api/auth/me:
    get:
      summary: Get current authenticated user
      security:
        - bearerAuth: []
      responses:
        '200':
          description: User details
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/User'
        '401':
          description: Unauthorized (invalid/expired token)

components:
  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT

  schemas:
    User:
      type: object
      properties:
        id:
          type: string
          format: uuid
        email:
          type: string
          format: email
        displayName:
          type: string
          minLength: 3
          maxLength: 30
        avatarUrl:
          type: string
          format: uri
          nullable: true
        domains:
          type: array
          items:
            type: string
          maxItems: 10
        createdAt:
          type: string
          format: date-time
        updatedAt:
          type: string
          format: date-time
```

#### `contracts/profile.openapi.yaml`
```yaml
openapi: 3.0.0
info:
  title: AliasCore Profile API
  version: 1.0.0
paths:
  /api/profile:
    put:
      summary: Update user profile (onboarding)
      security:
        - bearerAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                displayName:
                  type: string
                  minLength: 3
                  maxLength: 30
                  pattern: '^[a-zA-Z0-9 .\-'']+$'
                avatarUrl:
                  type: string
                  format: uri
                  nullable: true
      responses:
        '200':
          description: Profile updated
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/User'
        '400':
          description: Validation error
```

#### `contracts/domains.openapi.yaml`
```yaml
openapi: 3.0.0
info:
  title: AliasCore Domains API
  version: 1.0.0
paths:
  /api/domains:
    get:
      summary: Get all domains for authenticated user
      security:
        - bearerAuth: []
      responses:
        '200':
          description: List of domain profiles
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/DomainProfile'

  /api/domains/{domainKey}:
    get:
      summary: Get specific domain profile
      security:
        - bearerAuth: []
      parameters:
        - name: domainKey
          in: path
          required: true
          schema:
            type: string
      responses:
        '200':
          description: Domain profile details
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/DomainProfile'
        '404':
          description: Domain not found

components:
  schemas:
    DomainProfile:
      type: object
      properties:
        id:
          type: string
          format: uuid
        userId:
          type: string
          format: uuid
        domainKey:
          type: string
        domainName:
          type: string
        domainIcon:
          type: string
          format: uri
        primaryPlatform:
          type: string
        platformUsername:
          type: string
        peakRating:
          type: integer
          nullable: true
        currentRating:
          type: integer
          nullable: true
        gamesPlayed:
          type: integer
          nullable: true
        rankTier:
          type: string
          nullable: true
        shareSlug:
          type: string
        lastUpdated:
          type: string
          format: date-time
```

#### `contracts/events.openapi.yaml`
```yaml
openapi: 3.0.0
info:
  title: AliasCore Events API
  version: 1.0.0
paths:
  /api/events:
    get:
      summary: Get events for a domain within radius
      security:
        - bearerAuth: []
      parameters:
        - name: domainKey
          in: query
          required: true
          schema:
            type: string
        - name: latitude
          in: query
          required: true
          schema:
            type: number
            format: double
        - name: longitude
          in: query
          required: true
          schema:
            type: number
            format: double
        - name: radius
          in: query
          schema:
            type: number
            default: 20
            description: Radius in miles
        - name: limit
          in: query
          schema:
            type: integer
            default: 25
            maximum: 25
      responses:
        '200':
          description: List of events (max 25, sorted by soonest)
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/Event'
                maxItems: 25

components:
  schemas:
    Event:
      type: object
      properties:
        id:
          type: string
          format: uuid
        domainKey:
          type: string
        name:
          type: string
        description:
          type: string
          nullable: true
        startTime:
          type: string
          format: date-time
        endTime:
          type: string
          format: date-time
          nullable: true
        latitude:
          type: number
          format: double
        longitude:
          type: number
          format: double
        venueName:
          type: string
        venueAddress:
          type: string
          nullable: true
        externalUrl:
          type: string
          format: uri
          nullable: true
```

### 3. Developer Quickstart

**Output**: `quickstart.md` containing:
- Prerequisites (Node.js 18+, Expo CLI, iOS Simulator / Android Emulator)
- Clone and setup instructions
- Environment variable configuration (.env.example → .env)
- Install dependencies (`npm install`)
- Start development server (`npx expo start`)
- Run on simulators/emulators
- Run tests (`npm test`)
- Debugging tips (React Native Debugger, Flipper)

---

## Phase 2: Implementation Breakdown (Tasks)

**Note**: This phase is handled by the `/speckit.tasks` command (NOT by `/speckit.plan`). The tasks.md file will be generated separately based on this plan and the spec.

Expected task categories:
1. **Setup**: Expo project initialization, dependencies, configuration
2. **Foundational**: API client, auth context, navigation stacks, design system
3. **User Story 1 (P1)**: Authentication & Onboarding
4. **User Story 2 (P1)**: Domains Dashboard & Domain Profile
5. **User Story 3 (P2)**: QR Code Sharing
6. **User Story 4 (P2)**: Events Map
7. **User Story 5 (P3)**: NFC Sharing (stubbed)
8. **Polish**: Error handling, loading states, logging, testing

---

## Technical Implementation Details

### Navigation Architecture

#### RootNavigator (App.tsx)
```typescript
export default function App() {
  return (
    <AuthProvider>
      <RootNavigator />
    </AuthProvider>
  );
}

function RootNavigator() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer>
      {user ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
}
```

#### AuthStack
```typescript
const AuthStack = createStackNavigator();

function AuthStackNavigator() {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Welcome" component={WelcomeScreen} />
      <AuthStack.Screen name="Onboarding" component={OnboardingScreen} />
    </AuthStack.Navigator>
  );
}
```

#### AppStack
```typescript
const AppStack = createStackNavigator();

function AppStackNavigator() {
  return (
    <AppStack.Navigator screenOptions={{ headerShown: false, gestureEnabled: true }}>
      <AppStack.Screen name="Dashboard" component={DomainsDashboardScreen} />
      <AppStack.Screen
        name="DomainProfile"
        component={DomainProfileScreen}
        options={{ presentation: 'card', gestureDirection: 'vertical' }}
      />
      <AppStack.Screen
        name="EventsMap"
        component={EventsMapScreen}
        options={{ presentation: 'card', gestureDirection: 'horizontal' }}
      />
      <AppStack.Screen
        name="ShareSheet"
        component={ShareSheet}
        options={{ presentation: 'modal' }}
      />
      <AppStack.Screen
        name="QRCode"
        component={QRCodeScreen}
        options={{ presentation: 'modal' }}
      />
    </AppStack.Navigator>
  );
}
```

### State Management (Zustand)

```typescript
// src/common/store/appStore.ts
import { create } from 'zustand';

interface AppStore {
  domains: DomainProfile[];
  setDomains: (domains: DomainProfile[]) => void;
  selectedDomain: DomainProfile | null;
  setSelectedDomain: (domain: DomainProfile | null) => void;
}

export const useAppStore = create<AppStore>((set) => ({
  domains: [],
  setDomains: (domains) => set({ domains }),
  selectedDomain: null,
  setSelectedDomain: (domain) => set({ selectedDomain: domain }),
}));
```

### API Client

```typescript
// src/common/services/apiClient.ts
import { getItemAsync } from 'expo-secure-store';
import { API_BASE_URL } from '@env';

class ApiClient {
  private baseUrl: string = API_BASE_URL;

  async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = await getItemAsync('auth_token');

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    };

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    return response.json();
  }

  get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  post<T>(endpoint: string, body: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  put<T>(endpoint: string, body: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }
}

export const apiClient = new ApiClient();
```

### Auth Context

```typescript
// src/auth/context/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { setItemAsync, getItemAsync, deleteItemAsync } from 'expo-secure-store';
import { User } from '../../common/types/entities';
import { authApi } from '../services/authApi';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signIn: (token: string, user: User) => Promise<void>;
  signOut: () => Promise<void>;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  async function loadUser() {
    try {
      const token = await getItemAsync('auth_token');
      if (token) {
        const user = await authApi.getCurrentUser();
        setUser(user);
      }
    } catch (error) {
      // Token invalid, clear it
      await deleteItemAsync('auth_token');
    } finally {
      setIsLoading(false);
    }
  }

  async function signIn(token: string, userData: User) {
    await setItemAsync('auth_token', token);
    setUser(userData);
  }

  async function signOut() {
    await deleteItemAsync('auth_token');
    setUser(null);
  }

  function updateUser(userData: User) {
    setUser(userData);
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, signIn, signOut, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
```

### Logging Strategy

```typescript
// src/common/services/logger.ts
type LogLevel = 'error' | 'warn' | 'info';
type LogEvent = 'auth_success' | 'auth_failure' | 'domain_view' | 'share_qr' | 'share_nfc' | 'event_view' | 'api_error';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  event: LogEvent;
  userId?: string;  // Anonymized if possible
  message?: string;
  error?: string;
}

class Logger {
  private sensitiveFields = ['token', 'email', 'password', 'authorization'];

  log(level: LogLevel, event: LogEvent, data?: Record<string, unknown>) {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      event,
      userId: this.anonymizeUserId(data?.userId as string),
      message: data?.message as string,
      error: data?.error as string,
    };

    // Filter out sensitive data
    const sanitized = this.sanitize(entry);

    // In production, send to backend logging service
    // In development, log to console
    if (__DEV__) {
      console.log(`[${sanitized.level.toUpperCase()}]`, sanitized);
    } else {
      // Send to backend logging endpoint
      this.sendToBackend(sanitized);
    }
  }

  error(event: LogEvent, error: Error, data?: Record<string, unknown>) {
    this.log('error', event, { ...data, error: error.message });
  }

  info(event: LogEvent, data?: Record<string, unknown>) {
    this.log('info', event, data);
  }

  private anonymizeUserId(userId?: string): string | undefined {
    if (!userId) return undefined;
    // Hash or truncate user ID for privacy
    return userId.substring(0, 8) + '***';
  }

  private sanitize(data: unknown): unknown {
    // Remove sensitive fields recursively
    if (typeof data === 'object' && data !== null) {
      const sanitized: Record<string, unknown> = {};
      for (const [key, value] of Object.entries(data)) {
        if (!this.sensitiveFields.includes(key.toLowerCase())) {
          sanitized[key] = this.sanitize(value);
        }
      }
      return sanitized;
    }
    return data;
  }

  private async sendToBackend(entry: LogEntry) {
    // Implementation for production logging
    // POST to /api/logs endpoint
  }
}

export const logger = new Logger();
```

### Design System

```typescript
// src/common/theme/colors.ts
export const colors = {
  primary: '#6C63FF',      // Vibrant purple (Snapchat-inspired)
  secondary: '#FFD700',    // Gold accent
  background: '#FFFFFF',
  surface: '#F5F5F5',
  text: {
    primary: '#000000',
    secondary: '#666666',
    tertiary: '#999999',
  },
  error: '#FF3B30',
  success: '#34C759',
  border: '#E0E0E0',
};

// src/common/theme/typography.ts
export const typography = {
  h1: {
    fontSize: 32,
    fontWeight: '700' as const,
    lineHeight: 40,
  },
  h2: {
    fontSize: 24,
    fontWeight: '600' as const,
    lineHeight: 32,
  },
  body: {
    fontSize: 16,  // Minimum per constitution accessibility
    fontWeight: '400' as const,
    lineHeight: 24,
  },
  caption: {
    fontSize: 14,
    fontWeight: '400' as const,
    lineHeight: 20,
  },
};

// src/common/theme/spacing.ts
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};
```

### Gesture Handling (Domain Profile → Events Map)

```typescript
// src/domains/screens/DomainProfileScreen.tsx
import { PanGestureHandler } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedGestureHandler } from 'react-native-reanimated';

export function DomainProfileScreen({ navigation, route }) {
  const { domain } = route.params;
  const translateX = useSharedValue(0);

  const gestureHandler = useAnimatedGestureHandler({
    onActive: (event) => {
      // Right swipe threshold: >50% screen width
      if (event.translationX > 0) {
        translateX.value = event.translationX;
      }
    },
    onEnd: (event) => {
      if (event.translationX > screenWidth * 0.5) {
        // Navigate to Events Map
        navigation.navigate('EventsMap', { domainKey: domain.domainKey });
      } else {
        // Reset
        translateX.value = 0;
      }
    },
  });

  return (
    <PanGestureHandler onGestureEvent={gestureHandler}>
      <Animated.View>
        {/* Domain profile UI */}
      </Animated.View>
    </PanGestureHandler>
  );
}
```

### Caching Strategy (Stale-While-Revalidate)

```typescript
// src/domains/services/domainsCache.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

const CACHE_KEY = 'domains_cache';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export async function getCachedDomains(): Promise<DomainProfile[] | null> {
  try {
    const cached = await AsyncStorage.getItem(CACHE_KEY);
    if (!cached) return null;

    const { data, timestamp } = JSON.parse(cached);
    const age = Date.now() - timestamp;

    if (age > CACHE_DURATION) {
      // Stale, but return it while revalidating in background
      return data;
    }

    return data;
  } catch {
    return null;
  }
}

export async function setCachedDomains(domains: DomainProfile[]): Promise<void> {
  const cached = {
    data: domains,
    timestamp: Date.now(),
  };
  await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(cached));
}
```

### Testing Structure

```typescript
// __tests__/integration/auth.test.tsx
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { AuthProvider } from '../../src/auth/context/AuthContext';
import { WelcomeScreen } from '../../src/auth/screens/WelcomeScreen';

describe('Authentication Flow', () => {
  it('should navigate to onboarding after successful Google sign-in', async () => {
    const { getByText } = render(
      <AuthProvider>
        <WelcomeScreen />
      </AuthProvider>
    );

    const signInButton = getByText('Continue with Google');
    fireEvent.press(signInButton);

    await waitFor(() => {
      // Verify navigation to onboarding
      expect(mockNavigation.navigate).toHaveBeenCalledWith('Onboarding');
    });
  });
});

// __tests__/unit/formatters.test.ts
import { formatRating } from '../../src/common/utils/formatters';

describe('formatRating', () => {
  it('should format rating with platform', () => {
    expect(formatRating(2400, 'Chess.com')).toBe('2400 on Chess.com');
  });

  it('should handle null rating', () => {
    expect(formatRating(null, 'Chess.com')).toBe('— on Chess.com');
  });
});
```

---

## Non-Functional Considerations

### Performance Optimizations

1. **Lazy Loading**:
   - Events Map screen loaded lazily with React.lazy + Suspense
   - Heavy components (QR code, map) deferred until needed

2. **Image Optimization**:
   - Use Expo's image caching for domain icons and avatars
   - Placeholder images while loading
   - Appropriate resolutions for different screen densities

3. **Animation Performance**:
   - Use native driver for all animations (useNativeDriver: true)
   - Avoid layout calculations during animations
   - 60 FPS target for transitions

4. **Bundle Size**:
   - Code splitting for feature modules
   - Tree-shaking enabled in metro bundler
   - Remove unused dependencies

### Location Permissions UX

```typescript
// src/events/hooks/useLocation.ts
import * as Location from 'expo-location';
import { useState, useEffect } from 'react';

export function useLocation() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [permissionStatus, setPermissionStatus] = useState<Location.PermissionStatus | null>(null);

  async function requestPermission() {
    const { status } = await Location.requestForegroundPermissionsAsync();
    setPermissionStatus(status);

    if (status === 'granted') {
      const loc = await Location.getCurrentPositionAsync({});
      setLocation(loc);
    }
  }

  return { location, permissionStatus, requestPermission };
}
```

**Permission Flow**:
1. On Events Map screen open, check permission status
2. If not determined, show friendly prompt: "Allow location to find events near you"
3. If denied, show map with fallback location (IP-based or default city)
4. Provide "Enable Location" button in UI to re-request permission

### Extensibility Patterns

1. **Adding New Domains**:
   - Domain configuration driven by backend API
   - No hardcoded domain types in frontend
   - Domain icons and labels come from API responses

2. **Adding New Stats**:
   - `DomainProfile` type uses optional fields
   - UI components check for stat availability before rendering
   - New stats can be added to API response without breaking existing UI

3. **Future Features**:
   - NFC service follows interface pattern (easy to upgrade from stub)
   - Share methods can be extended (e.g., add "Share via Link" option)
   - Event filters can be added without changing map component

---

## Success Criteria Validation

| Criterion | Target | Implementation Strategy |
|-----------|--------|-------------------------|
| SC-001: Onboarding <90s | <90 seconds | Minimal steps, auto-advance, pre-fill from Google profile |
| SC-002: Dashboard → Profile <500ms | <500ms | Native driver animations, cached data, skeleton screens |
| SC-003: QR generation <2s | <2 seconds | Lazy load QR library, generate on-demand, cache share URL |
| SC-004: 90% auth success rate | 90% | Robust error handling, retry logic, clear error messages |
| SC-005: Smooth transitions | No lag/stutter | Native driver, 60 FPS, optimized gestures |
| SC-006: App launch <2s | <2 seconds | Defer non-critical init, cached auth token validation |
| SC-007: Public profile load <3s | <3 seconds | Backend responsibility, CDN for static assets |
| SC-008: Events load <5s | <5 seconds | Backend query optimization, max 25 events, loading skeleton |
| SC-009: 95% gestures <100ms | <100ms | Native driver, PanGestureHandler, no heavy computations |
| SC-010: Zero crashes | 0 crashes | Comprehensive error boundaries, defensive coding, logging |

---

## Deployment Considerations

### Environment Configuration

```javascript
// app.config.js
export default ({ config }) => ({
  ...config,
  extra: {
    apiBaseUrl: process.env.API_BASE_URL,
    googleClientId: process.env.GOOGLE_CLIENT_ID,
    googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
  },
});
```

```bash
# .env.example
API_BASE_URL=https://api.aliascore.app
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret
```

### Build Profiles

- **Development**: Localhost backend, debug mode enabled
- **Staging**: Staging backend, logging enabled
- **Production**: Production backend, analytics enabled, error reporting

---

## Next Steps

1. Run `/speckit.tasks` to generate tasks.md from this plan
2. Execute tasks in priority order (P1 → P2 → P3)
3. Follow feature-first implementation (complete one feature vertically before moving to next)
4. Test critical flows after each feature completion
5. Deploy to TestFlight/Google Play Internal Testing for user feedback

---

**End of Implementation Plan**

This plan provides a complete technical blueprint for implementing AliasCore Mobile MVP. All constitutional principles are satisfied, API contracts are defined, and the architecture is ready for implementation via the `/speckit.tasks` command.
