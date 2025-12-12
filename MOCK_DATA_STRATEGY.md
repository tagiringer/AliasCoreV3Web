# AliasCore Mobile MVP: Mock Data Generation Strategy

## Executive Summary

This document outlines the recommended mock data generation strategy for AliasCore Mobile MVP development and testing. The approach uses a **Factory Pattern with Seed-Based Deterministic Generation** to ensure consistency across app restarts while maintaining realistic gaming domain data.

---

## Decision: Recommended Architecture

### Pattern: **Deterministic Mock Data Factory with Environment-Based Switching**

**Core Components:**
1. **Mock Data Factories** - Deterministic data generators organized by domain
2. **Seeded Random Generation** - Consistent data across restarts using fixed seeds
3. **AsyncStorage Persistence** - Cache mock data locally for replay
4. **Environment Variable Gate** - `MOCK_AUTH=true` enables mock mode globally

**Why This Approach:**
- ✅ Deterministic (same seed = same data every time)
- ✅ Realistic (uses domain-specific patterns and realistic values)
- ✅ Scalable (easy to add more domains or events)
- ✅ No external dependencies (seeded Math.random)
- ✅ Offline capable (works without network)
- ✅ Clear separation of mock/production code paths

---

## Rationale

### Requirements Analysis

1. **Consistency Across Restarts**
   - Current issue: `generateMockUser()` in authApi.ts creates new IDs on each call
   - Solution: Seed-based deterministic generation with fixed constants

2. **Domain-Specific Realism**
   - Chess: ELO ratings (800-2800), platforms (Chess.com, Lichess)
   - Valorant: Rank tiers (Iron-Radiant), region servers, acts/episodes
   - Speedrunning: Game/category names, platforms (speedrun.com), PB times

3. **Environment Switching**
   - Already have `MOCK_AUTH` in `app.config.js`
   - Need to extend this to all data endpoints
   - Should work at API response interception level

4. **Data Persistence**
   - Mock user ID must be constant: `mock-user-12345`
   - Domain profiles linked to consistent user ID
   - Events generated deterministically per domain

---

## Implementation Architecture

### Layer 1: Seeded Random Generator

A seedable random number generator for consistent data generation:

```typescript
// src/common/utils/seededRandom.ts
class SeededRandom {
  private seed: number;

  constructor(seed: number) {
    this.seed = seed;
  }

  // Linear congruential generator (deterministic)
  next(): number {
    this.seed = (this.seed * 9301 + 49297) % 233280;
    return this.seed / 233280;
  }

  // Generate random integer in range [min, max)
  nextInt(min: number, max: number): number {
    return Math.floor(this.next() * (max - min)) + min;
  }

  // Pick random item from array
  pick<T>(items: T[]): T {
    return items[this.nextInt(0, items.length)];
  }
}
```

**Seed Strategy:**
- Use fixed seed `20250101` for deterministic output
- Seed value chosen: January 1, 2025 (project start date)
- Same seed always produces same sequence

### Layer 2: Mock Data Factories

Domain-specific factories following Factory Pattern:

```typescript
// src/common/services/mockData/factories/userFactory.ts
export const createMockUser = (seed: number = 20250101): User => {
  const rng = new SeededRandom(seed);

  return {
    id: 'mock-user-12345',
    email: 'mockuser@aliascore.dev',
    displayName: 'Test Player',
    avatarUrl: null,
    domains: ['chess', 'valorant', 'speedrunning'],
    createdAt: new Date(2024, 0, 1).toISOString(), // Fixed date
    updatedAt: new Date(2024, 0, 1).toISOString(),
  };
};
```

```typescript
// src/common/services/mockData/factories/domainProfileFactory.ts
export const createMockDomainProfile = (
  domainKey: string,
  userId: string = 'mock-user-12345'
): DomainProfile => {
  const rng = new SeededRandom(20250101 + hashDomainKey(domainKey));

  const profiles: Record<string, DomainProfile> = {
    chess: {
      id: 'profile-chess-001',
      userId,
      domainKey: 'chess',
      domainName: 'Chess',
      domainIcon: 'chess-icon-url',
      primaryPlatform: 'Chess.com',
      platformUsername: 'TestChessPlayer',
      peakRating: 1850,
      currentRating: 1720,
      gamesPlayed: 4205,
      rankTier: 'Expert',
      shareSlug: 'chess-profile-slug-001',
      lastUpdated: new Date(2024, 11, 15).toISOString(),
    },
    valorant: {
      id: 'profile-valorant-001',
      userId,
      domainKey: 'valorant',
      domainName: 'Valorant',
      domainIcon: 'valorant-icon-url',
      primaryPlatform: 'Riot Games',
      platformUsername: 'TestValorantPlayer#NA1',
      peakRating: 2100,
      currentRating: 1950,
      gamesPlayed: 892,
      rankTier: 'Diamond 1',
      shareSlug: 'valorant-profile-slug-001',
      lastUpdated: new Date(2024, 11, 14).toISOString(),
    },
    speedrunning: {
      id: 'profile-speedrun-001',
      userId,
      domainKey: 'speedrunning',
      domainName: 'Speedrunning',
      domainIcon: 'speedrun-icon-url',
      primaryPlatform: 'speedrun.com',
      platformUsername: 'TestSpeedrunner',
      peakRating: 42,
      currentRating: 42,
      gamesPlayed: 156,
      rankTier: 'World Record Holder',
      shareSlug: 'speedrun-profile-slug-001',
      lastUpdated: new Date(2024, 11, 10).toISOString(),
    },
  };

  return profiles[domainKey] || createDefaultProfile(domainKey, userId);
};
```

```typescript
// src/common/services/mockData/factories/eventFactory.ts
export const createMockEvents = (domainKey: string, count: number = 8): Event[] => {
  const rng = new SeededRandom(20250101 + hashDomainKey(domainKey));
  const events: Event[] = [];

  // Domain-specific event templates
  const eventTemplates: Record<string, any> = {
    chess: {
      names: [
        'Metropolitan Chess Championship',
        'Community Blitz Tournament',
        'Rapid Rating Event',
        'Junior Chess Academy Open',
        'Weekend Grand Prix',
        'Online Relay Tournament',
        'Simultaneous Exhibition',
        'Chess.com Titled Arena Finals',
      ],
      venues: [
        'Community Chess Center',
        'Public Library Main Branch',
        'University Chess Club',
        'Chess Academy Downtown',
        'Park Recreation Center',
      ],
    },
    valorant: {
      names: [
        'Regional Valorant League Finals',
        'Campus Valorant Championship',
        'VCT Qualifier Round 2',
        'Collegiate Esports Tournament',
        'Weekend Ranked Showdown',
        'Pro Player Invitational',
        'Team Ranking Series',
        'Community 5v5 Clash',
      ],
      venues: [
        'Esports Arena Downtown',
        'Gaming Convention Center',
        'University Esports Facility',
        'LAN Gaming Lounge',
        'Riot Games Regional Hub',
      ],
    },
    speedrunning: {
      names: [
        'Summer Speedrunning Festival',
        'Charity Marathon Event',
        'Category Speedrun Championship',
        'Community Race Tournament',
        'Annual Speedrun Expo',
        'Cross-Game Relay Race',
        'Glitchless Championship',
        'Speedrunning Hall of Fame Induction',
      ],
      venues: [
        'Gaming Convention Center',
        'Speedrunning Community Hub',
        'Online Streaming Arena',
        'GDQ Event Venue',
        'International Gaming Expo',
      ],
    },
  };

  const templates = eventTemplates[domainKey] || {
    names: ['Generic Gaming Event'],
    venues: ['Community Gaming Center'],
  };

  // Generate count events with deterministic properties
  for (let i = 0; i < count; i++) {
    const nameIndex = rng.nextInt(0, templates.names.length);
    const venueIndex = rng.nextInt(0, templates.venues.length);
    const daysFromNow = rng.nextInt(7, 90);

    const eventDate = new Date();
    eventDate.setDate(eventDate.getDate() + daysFromNow);

    // Deterministic lat/long variations (within reasonable city bounds)
    const baseLatitude = 40.7128; // NYC example
    const baseLongitude = -74.0060;
    const latOffset = (rng.next() - 0.5) * 0.05;
    const lonOffset = (rng.next() - 0.5) * 0.05;

    events.push({
      id: `event-${domainKey}-${i + 1}`,
      domainKey,
      name: templates.names[nameIndex],
      description: `${templates.names[nameIndex]} for ${domainKey} players`,
      venue: templates.venues[venueIndex],
      dateTime: eventDate.toISOString(),
      latitude: baseLatitude + latOffset,
      longitude: baseLongitude + lonOffset,
      link: `https://example.com/events/event-${domainKey}-${i + 1}`,
      organizerName: ['Alice Chen', 'Bob Smith', 'Carol Martinez'].at(rng.nextInt(0, 3)),
    });
  }

  return events;
};
```

### Layer 3: Mock Data Store/Service

Central service for accessing mock data:

```typescript
// src/common/services/mockData/mockDataService.ts
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createMockUser } from './factories/userFactory';
import { createMockDomainProfile } from './factories/domainProfileFactory';
import { createMockEvents } from './factories/eventFactory';

const MOCK_MODE = Constants.expoConfig?.extra?.mockAuth === true;
const MOCK_CACHE_KEY_PREFIX = 'aliascore_mock_';

class MockDataService {
  private cache: Map<string, any> = new Map();
  private initialized = false;

  async initialize(): Promise<void> {
    if (!MOCK_MODE || this.initialized) return;

    try {
      // Load cached mock data from AsyncStorage
      const keys = await AsyncStorage.getAllKeys();
      const mockKeys = keys.filter(k => k.startsWith(MOCK_CACHE_KEY_PREFIX));

      if (mockKeys.length > 0) {
        const data = await AsyncStorage.multiGet(mockKeys);
        for (const [key, value] of data) {
          if (value) {
            const cacheKey = key.replace(MOCK_CACHE_KEY_PREFIX, '');
            this.cache.set(cacheKey, JSON.parse(value));
          }
        }
        logger.info('Mock data cache loaded from AsyncStorage', { count: mockKeys.length });
      }

      this.initialized = true;
    } catch (error) {
      logger.warn('Failed to load mock data cache', { error });
      this.initialized = true;
    }
  }

  private async setCacheItem(key: string, value: any): Promise<void> {
    this.cache.set(key, value);

    if (MOCK_MODE) {
      try {
        await AsyncStorage.setItem(
          MOCK_CACHE_KEY_PREFIX + key,
          JSON.stringify(value)
        );
      } catch (error) {
        logger.warn('Failed to cache mock data', { error, key });
      }
    }
  }

  private getCacheItem<T>(key: string): T | null {
    const value = this.cache.get(key);
    return value || null;
  }

  // User data
  getMockUser(): User {
    let user = this.getCacheItem<User>('user');

    if (!user) {
      user = createMockUser();
      this.setCacheItem('user', user);
    }

    return user;
  }

  // Domain profiles
  async getMockDomainProfiles(): Promise<DomainProfile[]> {
    let profiles = this.getCacheItem<DomainProfile[]>('domain_profiles');

    if (!profiles) {
      const user = this.getMockUser();
      profiles = [
        createMockDomainProfile('chess', user.id),
        createMockDomainProfile('valorant', user.id),
        createMockDomainProfile('speedrunning', user.id),
      ];
      await this.setCacheItem('domain_profiles', profiles);
    }

    return profiles;
  }

  async getMockDomainProfile(domainKey: string): Promise<DomainProfile> {
    const profiles = await this.getMockDomainProfiles();
    const profile = profiles.find(p => p.domainKey === domainKey);

    if (!profile) {
      throw new Error(`No mock profile for domain: ${domainKey}`);
    }

    return profile;
  }

  // Events
  async getMockEvents(domainKey: string): Promise<Event[]> {
    const cacheKey = `events_${domainKey}`;
    let events = this.getCacheItem<Event[]>(cacheKey);

    if (!events) {
      events = createMockEvents(domainKey, 8);
      await this.setCacheItem(cacheKey, events);
    }

    return events;
  }

  // For testing: clear cache
  async clearMockCache(): Promise<void> {
    this.cache.clear();

    if (MOCK_MODE) {
      try {
        const keys = await AsyncStorage.getAllKeys();
        const mockKeys = keys.filter(k => k.startsWith(MOCK_CACHE_KEY_PREFIX));
        await AsyncStorage.multiRemove(mockKeys);
      } catch (error) {
        logger.warn('Failed to clear mock data cache', { error });
      }
    }
  }
}

export const mockDataService = new MockDataService();
```

### Layer 4: API Interception

Modify existing API client or create interceptor to return mock data:

```typescript
// src/common/services/mockData/mockApiInterceptor.ts
import Constants from 'expo-constants';
import { mockDataService } from './mockDataService';

const MOCK_MODE = Constants.expoConfig?.extra?.mockAuth === true;

/**
 * Intercept API calls and return mock data when in mock mode
 */
export async function tryGetMockResponse(
  endpoint: string,
  method: string = 'GET'
): Promise<any | null> {
  if (!MOCK_MODE) return null;

  // Simulate network latency for realistic testing
  await new Promise(resolve => setTimeout(resolve, 200 + Math.random() * 300));

  // Auth endpoints (already handled in authApi.ts)
  if (endpoint === '/api/auth/google' && method === 'POST') {
    const user = mockDataService.getMockUser();
    return {
      token: 'mock-jwt-token-' + Date.now(),
      user,
      isNewUser: false,
    };
  }

  if (endpoint === '/api/auth/me' && method === 'GET') {
    return { user: mockDataService.getMockUser() };
  }

  if (endpoint === '/api/auth/signout' && method === 'POST') {
    return { success: true };
  }

  // Domain endpoints
  if (endpoint === '/api/domains' && method === 'GET') {
    const profiles = await mockDataService.getMockDomainProfiles();
    return { domains: profiles };
  }

  if (endpoint.match(/^\/api\/domains\/(\w+)$/) && method === 'GET') {
    const domainKey = endpoint.split('/').pop()!;
    const profile = await mockDataService.getMockDomainProfile(domainKey);
    return { domain: profile };
  }

  // Event endpoints
  if (endpoint.match(/^\/api\/domains\/(\w+)\/events$/) && method === 'GET') {
    const domainKey = endpoint.split('/')[3];
    const events = await mockDataService.getMockEvents(domainKey);
    return { events };
  }

  if (endpoint.match(/^\/api\/events\?/) && method === 'GET') {
    // Handle events by location query params
    const allEvents: Event[] = [];
    for (const domain of ['chess', 'valorant', 'speedrunning']) {
      const events = await mockDataService.getMockEvents(domain);
      allEvents.push(...events);
    }
    return { events: allEvents };
  }

  return null;
}
```

### Layer 5: Environment Configuration

Update `app.config.js` to support MOCK_AUTH:

```javascript
// Existing setup already supports MOCK_AUTH
export default {
  // ... existing config
  extra: {
    apiBaseUrl: process.env.API_BASE_URL || 'https://api.aliascore.example.com',
    mockAuth: process.env.MOCK_AUTH === 'true',  // Already present
    env: process.env.ENV || 'development'
  }
};
```

Update `.env.example`:

```bash
# .env.example additions
API_BASE_URL=https://api.aliascore.example.com
MOCK_AUTH=false
ENV=development
```

---

## Alternatives Considered

### Alternative 1: Faker.js Library
**Pros:**
- Industry standard, extensive realistic data generation
- Pre-built providers for many domains
- Minimal code needed

**Cons:**
- Adds external dependency (not zero-dep)
- Faker.js is random (even with seed, output can vary between versions)
- Heavier bundle size
- Overkill for 3 domains with ~25 events total

**Decision:** Rejected - Deterministic seeded random is sufficient and keeps app lightweight

### Alternative 2: JSON File-Based Mock Data
**Pros:**
- Simple, static, human-editable
- No generation overhead
- Easy to inspect and modify

**Cons:**
- Hard to keep consistent across app restarts (file paths, serialization)
- Not scalable for future domains
- No programmatic control
- Requires file bundling in app

**Decision:** Rejected - Less flexible, harder to maintain consistency

### Alternative 3: Backend Mock API Server
**Pros:**
- Closest to real production workflow
- Can test error responses, edge cases
- Network behavior is realistic

**Cons:**
- Requires running separate service
- Adds setup complexity
- Not offline-capable
- Defeats purpose of fast local development

**Decision:** Rejected - Overkill for MVP testing

### Alternative 4: MSW (Mock Service Worker)
**Pros:**
- Intercepts at network level
- Great for testing
- Industry standard

**Cons:**
- Requires service worker setup
- Not all React Native platforms support it well
- Adds complexity

**Decision:** Rejected - Native API interception is simpler for React Native

---

## Implementation Approach

### Phase 1: Foundation (Week 1)
1. Create `src/common/utils/seededRandom.ts` - Seeded RNG utility
2. Create `src/common/services/mockData/factories/` - All factory functions
3. Create `src/common/services/mockData/mockDataService.ts` - Central mock data manager
4. Create `src/common/services/mockData/mockApiInterceptor.ts` - API interception

### Phase 2: Integration (Week 2)
1. Modify `src/common/services/apiClient.ts` to use mock interceptor
2. Update `src/auth/services/authApi.ts` to use `mockDataService`
3. Create mock profile/event API endpoints (defer to Phase 3)
4. Add initialization in `AuthProvider` to load mock data

### Phase 3: Testing & Refinement (Week 3)
1. Add mock domain/event fetching endpoints
2. Test consistency across restarts
3. Validate realistic data values
4. Add unit tests for factories and mock data service

---

## Data Examples

### Mock User
```json
{
  "id": "mock-user-12345",
  "email": "mockuser@aliascore.dev",
  "displayName": "Test Player",
  "avatarUrl": null,
  "domains": ["chess", "valorant", "speedrunning"],
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z"
}
```

### Mock Domain Profiles
```json
[
  {
    "id": "profile-chess-001",
    "userId": "mock-user-12345",
    "domainKey": "chess",
    "domainName": "Chess",
    "primaryPlatform": "Chess.com",
    "platformUsername": "TestChessPlayer",
    "peakRating": 1850,
    "currentRating": 1720,
    "gamesPlayed": 4205,
    "rankTier": "Expert",
    "shareSlug": "chess-profile-slug-001",
    "lastUpdated": "2024-12-15T00:00:00Z"
  },
  {
    "id": "profile-valorant-001",
    "userId": "mock-user-12345",
    "domainKey": "valorant",
    "domainName": "Valorant",
    "primaryPlatform": "Riot Games",
    "platformUsername": "TestValorantPlayer#NA1",
    "peakRating": 2100,
    "currentRating": 1950,
    "gamesPlayed": 892,
    "rankTier": "Diamond 1",
    "shareSlug": "valorant-profile-slug-001",
    "lastUpdated": "2024-12-14T00:00:00Z"
  },
  {
    "id": "profile-speedrun-001",
    "userId": "mock-user-12345",
    "domainKey": "speedrunning",
    "domainName": "Speedrunning",
    "primaryPlatform": "speedrun.com",
    "platformUsername": "TestSpeedrunner",
    "peakRating": 42,
    "currentRating": 42,
    "gamesPlayed": 156,
    "rankTier": "World Record Holder",
    "shareSlug": "speedrun-profile-slug-001",
    "lastUpdated": "2024-12-10T00:00:00Z"
  }
]
```

### Mock Events (Sample - Chess Domain)
```json
[
  {
    "id": "event-chess-1",
    "domainKey": "chess",
    "name": "Metropolitan Chess Championship",
    "description": "Metropolitan Chess Championship for chess players",
    "venue": "Community Chess Center",
    "dateTime": "2025-01-15T18:00:00Z",
    "latitude": 40.7153,
    "longitude": -74.0095,
    "link": "https://example.com/events/event-chess-1",
    "organizerName": "Alice Chen"
  },
  {
    "id": "event-chess-2",
    "domainKey": "chess",
    "name": "Community Blitz Tournament",
    "description": "Community Blitz Tournament for chess players",
    "venue": "Public Library Main Branch",
    "dateTime": "2025-01-22T19:00:00Z",
    "latitude": 40.7171,
    "longitude": -74.0081,
    "link": "https://example.com/events/event-chess-2",
    "organizerName": "Bob Smith"
  }
]
```

---

## Consistency Guarantees

### Fixed Constants
- Mock user ID: `mock-user-12345` (never changes)
- Mock user email: `mockuser@aliascore.dev`
- Mock display name: `Test Player`
- Seed base: `20250101` (fixed)

### Deterministic Generation
- Seeded RNG ensures same sequence for each domain
- Domain profiles always generated for: Chess, Valorant, Speedrunning
- Events always generated in same order per domain
- Timestamps fixed to specific dates (not current date)

### AsyncStorage Persistence
- Data cached after first generation
- Survives app restart
- Can be cleared manually via `mockDataService.clearMockCache()`

---

## Testing Strategy

### Unit Tests
```typescript
// __tests__/services/mockData/seededRandom.test.ts
describe('SeededRandom', () => {
  test('same seed produces same sequence', () => {
    const rng1 = new SeededRandom(20250101);
    const rng2 = new SeededRandom(20250101);

    expect(rng1.nextInt(0, 100)).toBe(rng2.nextInt(0, 100));
  });

  test('different seeds produce different sequences', () => {
    const rng1 = new SeededRandom(20250101);
    const rng2 = new SeededRandom(20250102);

    expect(rng1.nextInt(0, 100)).not.toBe(rng2.nextInt(0, 100));
  });
});

// __tests__/services/mockData/mockDataService.test.ts
describe('MockDataService', () => {
  test('user is consistent across calls', async () => {
    const service = new MockDataService();
    const user1 = service.getMockUser();
    const user2 = service.getMockUser();

    expect(user1.id).toBe(user2.id);
    expect(user1.id).toBe('mock-user-12345');
  });

  test('domain profiles are consistent across restarts', async () => {
    // Simulate restart by creating new service instance
    const service1 = new MockDataService();
    await service1.initialize();
    const profiles1 = await service1.getMockDomainProfiles();

    const service2 = new MockDataService();
    await service2.initialize();
    const profiles2 = await service2.getMockDomainProfiles();

    expect(profiles1[0].id).toBe(profiles2[0].id);
  });
});
```

### Integration Tests
- Verify mock data switches on/off with MOCK_AUTH flag
- Test AsyncStorage persistence
- Verify API interception returns correct mock data

### Manual Testing
- Run with `MOCK_AUTH=true`
- Log out and verify same user ID on login
- Check that events load without network
- Restart app and verify data persists

---

## Code File Organization

```
src/
├── common/
│   ├── services/
│   │   ├── apiClient.ts (modify to use interceptor)
│   │   └── mockData/
│   │       ├── mockDataService.ts (MAIN SERVICE)
│   │       ├── mockApiInterceptor.ts (INTEGRATION POINT)
│   │       └── factories/
│   │           ├── userFactory.ts
│   │           ├── domainProfileFactory.ts
│   │           └── eventFactory.ts
│   └── utils/
│       └── seededRandom.ts
├── auth/
│   └── services/
│       └── authApi.ts (update to use mockDataService)
└── ... (rest of app)
```

---

## Future Enhancements

1. **Admin Debug Screen**
   - Toggle mock mode at runtime
   - Clear mock data cache
   - Regenerate mock data
   - View current mock user/profiles

2. **Multiple Mock Users**
   - Add user selection for testing multi-user scenarios
   - Seed variations for different mock users

3. **Mock Error Scenarios**
   - Network timeout simulations
   - API error responses
   - Validation error responses

4. **Mock Data Statistics**
   - Dashboard showing mock data coverage
   - Event count per domain
   - Realistic rating distributions

5. **GraphQL Support** (if adopting GraphQL)
   - Mock resolvers using same factories
   - Consistent data across REST and GraphQL

---

## Configuration Reference

### Environment Variables
```bash
# For development with mock data
MOCK_AUTH=true
API_BASE_URL=https://api.aliascore.example.com  # Not used in mock mode

# For production/staging
MOCK_AUTH=false
API_BASE_URL=https://api.aliascore.prod.com
```

### How to Run
```bash
# Start with mock auth enabled
MOCK_AUTH=true npm start

# Start with real auth
MOCK_AUTH=false npm start

# Run tests
npm test
```

---

## Summary

The **Deterministic Mock Data Factory with Seed-Based Generation** approach provides:

1. ✅ **Consistency** - Same user ID and data across app restarts
2. ✅ **Realism** - Domain-specific data patterns and realistic values
3. ✅ **Simplicity** - No external dependencies, pure TypeScript
4. ✅ **Scalability** - Easy to add more domains or events
5. ✅ **Offline** - Works without network connectivity
6. ✅ **Testability** - Clear separation of mock/production code paths

This strategy allows the team to develop and test the MVP quickly without backend availability while maintaining realistic data structures.

