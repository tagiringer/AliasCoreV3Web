# Mock Data Implementation Code Patterns

This document contains ready-to-use code patterns for implementing the mock data strategy. Copy these into your project as specified.

---

## File 1: Seeded Random Generator
**Path:** `src/common/utils/seededRandom.ts`

```typescript
/**
 * Seeded random number generator
 * Produces deterministic sequences for consistent mock data
 * Uses Linear Congruential Generator algorithm
 */

export class SeededRandom {
  private seed: number;

  constructor(seed: number) {
    this.seed = Math.abs(Math.floor(seed)) || 1;
  }

  /**
   * Get next random number [0, 1)
   */
  next(): number {
    this.seed = (this.seed * 9301 + 49297) % 233280;
    return this.seed / 233280;
  }

  /**
   * Get random integer in range [min, max)
   */
  nextInt(min: number, max: number): number {
    if (min >= max) return min;
    return Math.floor(this.next() * (max - min)) + min;
  }

  /**
   * Get random float in range [min, max)
   */
  nextFloat(min: number, max: number): number {
    return this.next() * (max - min) + min;
  }

  /**
   * Pick random item from array
   */
  pick<T>(items: T[]): T {
    if (items.length === 0) throw new Error('Cannot pick from empty array');
    return items[this.nextInt(0, items.length)];
  }

  /**
   * Shuffle array (in-place)
   */
  shuffle<T>(items: T[]): T[] {
    const result = [...items];
    for (let i = result.length - 1; i > 0; i--) {
      const j = this.nextInt(0, i + 1);
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }

  /**
   * Generate random string of given length (alphanumeric)
   */
  nextString(length: number): string {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += this.pick(chars.split(''));
    }
    return result;
  }
}

/**
 * Helper to create consistent seeds based on domain key
 */
export function createDomainSeed(domainKey: string, baseSeed: number = 20250101): number {
  let hash = baseSeed;
  for (let i = 0; i < domainKey.length; i++) {
    hash = ((hash << 5) - hash) + domainKey.charCodeAt(i);
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}
```

---

## File 2: User Factory
**Path:** `src/common/services/mockData/factories/userFactory.ts`

```typescript
import type { User } from '../../../types/entities';
import { SeededRandom } from '../../../utils/seededRandom';

const MOCK_USER_ID = 'mock-user-12345';
const MOCK_USER_EMAIL = 'mockuser@aliascore.dev';
const MOCK_USER_DISPLAY_NAME = 'Test Player';

/**
 * Create a consistent mock user for development
 * Always returns the same user data
 */
export function createMockUser(): User {
  return {
    id: MOCK_USER_ID,
    email: MOCK_USER_EMAIL,
    displayName: MOCK_USER_DISPLAY_NAME,
    avatarUrl: null,
    domains: ['chess', 'valorant', 'speedrunning'],
    createdAt: new Date(2024, 0, 1).toISOString(), // 2024-01-01
    updatedAt: new Date(2024, 0, 1).toISOString(),
  };
}

/**
 * Get the consistent mock user ID
 */
export function getMockUserId(): string {
  return MOCK_USER_ID;
}
```

---

## File 3: Domain Profile Factory
**Path:** `src/common/services/mockData/factories/domainProfileFactory.ts`

```typescript
import type { DomainProfile } from '../../../types/entities';
import { SeededRandom, createDomainSeed } from '../../../utils/seededRandom';

interface DomainProfileTemplate {
  id: string;
  domainKey: string;
  domainName: string;
  domainIcon: string;
  primaryPlatform: string;
  platformUsername: string;
  peakRating: number | null;
  currentRating: number | null;
  gamesPlayed: number | null;
  rankTier: string | null;
  shareSlug: string;
  lastUpdatedDaysAgo: number;
}

const DOMAIN_PROFILE_TEMPLATES: Record<string, DomainProfileTemplate> = {
  chess: {
    id: 'profile-chess-001',
    domainKey: 'chess',
    domainName: 'Chess',
    domainIcon: 'https://example.com/chess-icon.png',
    primaryPlatform: 'Chess.com',
    platformUsername: 'TestChessPlayer',
    peakRating: 1850,
    currentRating: 1720,
    gamesPlayed: 4205,
    rankTier: 'Expert',
    shareSlug: 'chess-profile-slug-001',
    lastUpdatedDaysAgo: 12,
  },
  valorant: {
    id: 'profile-valorant-001',
    domainKey: 'valorant',
    domainName: 'Valorant',
    domainIcon: 'https://example.com/valorant-icon.png',
    primaryPlatform: 'Riot Games',
    platformUsername: 'TestValorantPlayer#NA1',
    peakRating: 2100,
    currentRating: 1950,
    gamesPlayed: 892,
    rankTier: 'Diamond 1',
    shareSlug: 'valorant-profile-slug-001',
    lastUpdatedDaysAgo: 13,
  },
  speedrunning: {
    id: 'profile-speedrun-001',
    domainKey: 'speedrunning',
    domainName: 'Speedrunning',
    domainIcon: 'https://example.com/speedrun-icon.png',
    primaryPlatform: 'speedrun.com',
    platformUsername: 'TestSpeedrunner',
    peakRating: 42,
    currentRating: 42,
    gamesPlayed: 156,
    rankTier: 'World Record Holder',
    shareSlug: 'speedrun-profile-slug-001',
    lastUpdatedDaysAgo: 17,
  },
};

/**
 * Create a mock domain profile
 * Profiles are deterministic based on domain key
 */
export function createMockDomainProfile(
  domainKey: string,
  userId: string
): DomainProfile {
  const template = DOMAIN_PROFILE_TEMPLATES[domainKey];

  if (!template) {
    throw new Error(`No mock profile template for domain: ${domainKey}`);
  }

  const lastUpdated = new Date();
  lastUpdated.setDate(lastUpdated.getDate() - template.lastUpdatedDaysAgo);

  return {
    id: template.id,
    userId,
    domainKey: template.domainKey,
    domainName: template.domainName,
    domainIcon: template.domainIcon,
    primaryPlatform: template.primaryPlatform,
    platformUsername: template.platformUsername,
    peakRating: template.peakRating,
    currentRating: template.currentRating,
    gamesPlayed: template.gamesPlayed,
    rankTier: template.rankTier,
    shareSlug: template.shareSlug,
    lastUpdated: lastUpdated.toISOString(),
  };
}

/**
 * Get all available domain keys for mock data
 */
export function getMockDomainKeys(): string[] {
  return Object.keys(DOMAIN_PROFILE_TEMPLATES);
}

/**
 * Create all mock domain profiles for a user
 */
export function createAllMockDomainProfiles(userId: string): DomainProfile[] {
  return getMockDomainKeys().map(key => createMockDomainProfile(key, userId));
}
```

---

## File 4: Event Factory
**Path:** `src/common/services/mockData/factories/eventFactory.ts`

```typescript
import type { Event } from '../../../types/entities';
import { SeededRandom, createDomainSeed } from '../../../utils/seededRandom';

interface EventTemplates {
  names: string[];
  venues: string[];
  organizers: string[];
}

const EVENT_TEMPLATES: Record<string, EventTemplates> = {
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
      'National Championship Qualifier',
      'Speed Chess Festival',
    ],
    venues: [
      'Community Chess Center',
      'Public Library Main Branch',
      'University Chess Club',
      'Chess Academy Downtown',
      'Park Recreation Center',
      'Hotel Grand Ballroom',
      'Convention Center',
      'School Gymnasium',
    ],
    organizers: [
      'Alice Chen',
      'Bob Smith',
      'Carol Martinez',
      'David Kumar',
      'Emma Johnson',
      'Frank Rodriguez',
      'Grace Lee',
      'Henry Wong',
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
      'Spike Rush Championship',
      'Agent Selection Championship',
    ],
    venues: [
      'Esports Arena Downtown',
      'Gaming Convention Center',
      'University Esports Facility',
      'LAN Gaming Lounge',
      'Riot Games Regional Hub',
      'Cyber Cafe Pro',
      'Tech Innovation Hub',
      'Gaming Pavilion',
    ],
    organizers: [
      'Alice Chen',
      'Bob Smith',
      'Carol Martinez',
      'David Kumar',
      'Emma Johnson',
      'Frank Rodriguez',
      'Grace Lee',
      'Henry Wong',
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
      'Any% World Record Chase',
      '100% Speedrun Challenge',
    ],
    venues: [
      'Gaming Convention Center',
      'Speedrunning Community Hub',
      'Online Streaming Arena',
      'GDQ Event Venue',
      'International Gaming Expo',
      'Speedrun Community Hall',
      'Virtual Event Space',
      'Gaming Museum',
    ],
    organizers: [
      'Alice Chen',
      'Bob Smith',
      'Carol Martinez',
      'David Kumar',
      'Emma Johnson',
      'Frank Rodriguez',
      'Grace Lee',
      'Henry Wong',
    ],
  },
};

// Base coordinates (NYC area - can be adjusted per region)
const BASE_LATITUDE = 40.7128;
const BASE_LONGITUDE = -74.0060;
const COORDINATE_VARIANCE = 0.05; // ~5km variance

/**
 * Create array of mock events for a domain
 * Events are deterministic based on domain key and count
 */
export function createMockEvents(
  domainKey: string,
  count: number = 8
): Event[] {
  const templates = EVENT_TEMPLATES[domainKey];

  if (!templates) {
    throw new Error(`No mock event templates for domain: ${domainKey}`);
  }

  const seed = createDomainSeed(domainKey);
  const rng = new SeededRandom(seed);
  const events: Event[] = [];

  for (let i = 0; i < count; i++) {
    const daysFromNow = rng.nextInt(7, 90);
    const eventDate = new Date();
    eventDate.setDate(eventDate.getDate() + daysFromNow);

    // Deterministic lat/long variations
    const latOffset = (rng.nextFloat(-1, 1) * COORDINATE_VARIANCE);
    const lonOffset = (rng.nextFloat(-1, 1) * COORDINATE_VARIANCE);

    events.push({
      id: `event-${domainKey}-${i + 1}`,
      domainKey,
      name: rng.pick(templates.names),
      description: `Join us for an exciting ${domainKey} competition at our venue.`,
      venue: rng.pick(templates.venues),
      dateTime: eventDate.toISOString(),
      latitude: BASE_LATITUDE + latOffset,
      longitude: BASE_LONGITUDE + lonOffset,
      link: `https://example.com/events/event-${domainKey}-${i + 1}`,
      organizerName: rng.pick(templates.organizers),
    });
  }

  return events;
}

/**
 * Get mock events for multiple domains
 */
export function createAllMockEvents(
  domainKeys: string[],
  eventsPerDomain: number = 8
): Event[] {
  return domainKeys.flatMap(key =>
    createMockEvents(key, eventsPerDomain)
  );
}
```

---

## File 5: Mock Data Service
**Path:** `src/common/services/mockData/mockDataService.ts`

```typescript
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { logger } from '../logger';
import type { User, DomainProfile, Event } from '../../types/entities';
import {
  createMockUser,
  getMockUserId,
} from './factories/userFactory';
import {
  createMockDomainProfile,
  createAllMockDomainProfiles,
  getMockDomainKeys,
} from './factories/domainProfileFactory';
import {
  createMockEvents,
  createAllMockEvents,
} from './factories/eventFactory';

const MOCK_MODE = Constants.expoConfig?.extra?.mockAuth === true;
const MOCK_CACHE_KEY_PREFIX = 'aliascore_mock_';

/**
 * Central service for accessing mock data
 * Ensures consistency across app restarts via caching
 */
class MockDataService {
  private cache: Map<string, any> = new Map();
  private initialized = false;

  /**
   * Initialize mock data from AsyncStorage
   * Call this once during app startup
   */
  async initialize(): Promise<void> {
    if (!MOCK_MODE || this.initialized) return;

    try {
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
        logger.info('Mock data loaded from AsyncStorage', {
          count: mockKeys.length,
        });
      }

      this.initialized = true;
    } catch (error) {
      logger.warn('Failed to initialize mock data cache', { error });
      this.initialized = true; // Mark as initialized even if failed
    }
  }

  /**
   * Set cache item and persist to AsyncStorage
   */
  private async setCacheItem(key: string, value: any): Promise<void> {
    this.cache.set(key, value);

    if (MOCK_MODE) {
      try {
        await AsyncStorage.setItem(
          MOCK_CACHE_KEY_PREFIX + key,
          JSON.stringify(value)
        );
      } catch (error) {
        logger.warn('Failed to cache mock data item', { error, key });
      }
    }
  }

  /**
   * Get cache item
   */
  private getCacheItem<T>(key: string): T | null {
    const value = this.cache.get(key);
    return value || null;
  }

  // ==================== USER ====================

  /**
   * Get mock user
   * Returns the same user every time (deterministic)
   */
  getMockUser(): User {
    let user = this.getCacheItem<User>('user');

    if (!user) {
      user = createMockUser();
      this.setCacheItem('user', user);
    }

    return user;
  }

  /**
   * Get mock user ID
   */
  getMockUserId(): string {
    return getMockUserId();
  }

  // ==================== DOMAIN PROFILES ====================

  /**
   * Get all mock domain profiles
   */
  async getMockDomainProfiles(): Promise<DomainProfile[]> {
    let profiles = this.getCacheItem<DomainProfile[]>('domain_profiles');

    if (!profiles) {
      const user = this.getMockUser();
      profiles = createAllMockDomainProfiles(user.id);
      await this.setCacheItem('domain_profiles', profiles);
    }

    return profiles;
  }

  /**
   * Get mock domain profile by key
   */
  async getMockDomainProfile(domainKey: string): Promise<DomainProfile> {
    const profiles = await this.getMockDomainProfiles();
    const profile = profiles.find(p => p.domainKey === domainKey);

    if (!profile) {
      throw new Error(`No mock profile for domain: ${domainKey}`);
    }

    return profile;
  }

  /**
   * Get available domain keys
   */
  getAvailableDomainKeys(): string[] {
    return getMockDomainKeys();
  }

  // ==================== EVENTS ====================

  /**
   * Get mock events for a specific domain
   */
  async getMockEvents(
    domainKey: string,
    count: number = 8
  ): Promise<Event[]> {
    const cacheKey = `events_${domainKey}_${count}`;
    let events = this.getCacheItem<Event[]>(cacheKey);

    if (!events) {
      events = createMockEvents(domainKey, count);
      await this.setCacheItem(cacheKey, events);
    }

    return events;
  }

  /**
   * Get all mock events across all domains
   */
  async getAllMockEvents(eventsPerDomain: number = 8): Promise<Event[]> {
    const cacheKey = `all_events_${eventsPerDomain}`;
    let events = this.getCacheItem<Event[]>(cacheKey);

    if (!events) {
      const domainKeys = this.getAvailableDomainKeys();
      events = createAllMockEvents(domainKeys, eventsPerDomain);
      await this.setCacheItem(cacheKey, events);
    }

    return events;
  }

  /**
   * Get mock events by domain keys
   */
  async getMockEventsByDomains(
    domainKeys: string[],
    eventsPerDomain: number = 8
  ): Promise<Event[]> {
    const allEvents: Event[] = [];

    for (const key of domainKeys) {
      const events = await this.getMockEvents(key, eventsPerDomain);
      allEvents.push(...events);
    }

    return allEvents;
  }

  // ==================== CACHE MANAGEMENT ====================

  /**
   * Clear all mock data from cache and AsyncStorage
   * Useful for testing or forcing regeneration
   */
  async clearMockCache(): Promise<void> {
    this.cache.clear();

    if (MOCK_MODE) {
      try {
        const keys = await AsyncStorage.getAllKeys();
        const mockKeys = keys.filter(k => k.startsWith(MOCK_CACHE_KEY_PREFIX));
        if (mockKeys.length > 0) {
          await AsyncStorage.multiRemove(mockKeys);
        }
        logger.info('Mock data cache cleared', { count: mockKeys.length });
      } catch (error) {
        logger.warn('Failed to clear mock data cache', { error });
      }
    }
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
    };
  }
}

// Singleton instance
export const mockDataService = new MockDataService();
```

---

## File 6: Mock API Interceptor
**Path:** `src/common/services/mockData/mockApiInterceptor.ts`

```typescript
import Constants from 'expo-constants';
import { mockDataService } from './mockDataService';
import { logger } from '../logger';

const MOCK_MODE = Constants.expoConfig?.extra?.mockAuth === true;
const NETWORK_DELAY_MS = 200; // Base network latency
const NETWORK_JITTER_MS = 300; // Random variation

/**
 * Simulate network latency
 */
async function simulateNetworkDelay(): Promise<void> {
  const delay = NETWORK_DELAY_MS + Math.random() * NETWORK_JITTER_MS;
  return new Promise(resolve => setTimeout(resolve, delay));
}

/**
 * Try to intercept API call with mock response
 * Returns mock data if endpoint matches, otherwise null
 *
 * @param endpoint The API endpoint (e.g., '/api/auth/google')
 * @param method HTTP method (GET, POST, etc.)
 * @returns Mock response object or null if no mock available
 */
export async function tryGetMockResponse(
  endpoint: string,
  method: string = 'GET'
): Promise<any | null> {
  if (!MOCK_MODE) return null;

  // Simulate realistic network behavior
  await simulateNetworkDelay();

  try {
    // ==================== AUTH ENDPOINTS ====================

    if (endpoint === '/api/auth/google' && method === 'POST') {
      const user = mockDataService.getMockUser();
      return {
        token: 'mock-jwt-token-' + Date.now(),
        user,
        isNewUser: false,
      };
    }

    if (endpoint === '/api/auth/me' && method === 'GET') {
      const user = mockDataService.getMockUser();
      return { user };
    }

    if (endpoint === '/api/auth/signout' && method === 'POST') {
      return { success: true };
    }

    // ==================== DOMAIN ENDPOINTS ====================

    if (endpoint === '/api/domains' && method === 'GET') {
      const profiles = await mockDataService.getMockDomainProfiles();
      return { domains: profiles };
    }

    // GET /api/domains/{domainKey}
    const domainMatch = endpoint.match(/^\/api\/domains\/([a-z]+)$/);
    if (domainMatch && method === 'GET') {
      const domainKey = domainMatch[1];
      const profile = await mockDataService.getMockDomainProfile(domainKey);
      return { domain: profile };
    }

    // PATCH /api/domains/{domainKey}
    if (domainMatch && method === 'PATCH') {
      const domainKey = domainMatch[1];
      const profile = await mockDataService.getMockDomainProfile(domainKey);
      // In real scenario, would update with request body
      return { domain: profile };
    }

    // ==================== EVENT ENDPOINTS ====================

    // GET /api/domains/{domainKey}/events
    const eventsMatch = endpoint.match(/^\/api\/domains\/([a-z]+)\/events$/);
    if (eventsMatch && method === 'GET') {
      const domainKey = eventsMatch[1];
      const events = await mockDataService.getMockEvents(domainKey);
      return { events };
    }

    // GET /api/events (with optional query params)
    if (endpoint.startsWith('/api/events') && method === 'GET') {
      const events = await mockDataService.getAllMockEvents();
      return { events };
    }

    // GET /api/events?near={latitude},{longitude}&radius={km}
    if (endpoint.startsWith('/api/events?near=') && method === 'GET') {
      const events = await mockDataService.getAllMockEvents();
      // In real scenario, would filter by location
      return { events };
    }

    // ==================== PROFILE ENDPOINTS ====================

    if (endpoint === '/api/profile' && method === 'GET') {
      const user = mockDataService.getMockUser();
      const profiles = await mockDataService.getMockDomainProfiles();
      return { user, profiles };
    }

    if (endpoint === '/api/profile' && method === 'PATCH') {
      const user = mockDataService.getMockUser();
      // In real scenario, would update with request body
      return { user };
    }

    // ==================== SHARE ENDPOINTS ====================

    // GET /api/share/{shareSlug}
    const shareMatch = endpoint.match(/^\/api\/share\/([a-z0-9-]+)$/);
    if (shareMatch && method === 'GET') {
      const shareSlug = shareMatch[1];
      const profiles = await mockDataService.getMockDomainProfiles();
      const profile = profiles.find(p => p.shareSlug === shareSlug);

      if (!profile) {
        return null; // No mock for this slug
      }

      return {
        sharePayload: {
          type: 'domain-profile',
          shareSlug: profile.shareSlug,
          domainKey: profile.domainKey,
          displayName: mockDataService.getMockUser().displayName,
          platformUsername: profile.platformUsername,
          shareUrl: `https://example.com/share/${shareSlug}`,
          timestamp: new Date().toISOString(),
        },
      };
    }

    // No mock available for this endpoint
    return null;
  } catch (error) {
    logger.error('Error generating mock response', {
      endpoint,
      method,
      error: error instanceof Error ? error.message : String(error),
    });
    return null;
  }
}

/**
 * Check if endpoint should use mock data
 */
export function isMockableEndpoint(endpoint: string): boolean {
  const mockablePatterns = [
    /^\/api\/auth\//,
    /^\/api\/domains/,
    /^\/api\/events/,
    /^\/api\/profile/,
    /^\/api\/share\//,
  ];

  return mockablePatterns.some(pattern => pattern.test(endpoint));
}
```

---

## File 7: Index/Export File
**Path:** `src/common/services/mockData/index.ts`

```typescript
export { mockDataService } from './mockDataService';
export { tryGetMockResponse, isMockableEndpoint } from './mockApiInterceptor';

// Export factories for direct use if needed
export { createMockUser, getMockUserId } from './factories/userFactory';
export {
  createMockDomainProfile,
  createAllMockDomainProfiles,
  getMockDomainKeys,
} from './factories/domainProfileFactory';
export {
  createMockEvents,
  createAllMockEvents,
} from './factories/eventFactory';
```

---

## Integration Point 1: Update API Client

**File:** `src/common/services/apiClient.ts`

Add this import at the top:
```typescript
import { tryGetMockResponse } from './mockData/mockApiInterceptor';
```

In the `request` method, before the `fetch` call (around line 94), add:
```typescript
// Try to get mock response if in mock mode
const mockResponse = await tryGetMockResponse(endpoint, options.method || 'GET');
if (mockResponse !== null) {
  logger.debug('Using mock response', { endpoint });
  return mockResponse;
}
```

Complete modified section:
```typescript
async request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = await this.getAuthToken();

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const url = `${this.baseUrl}${endpoint}`;

  try {
    logger.debug('API request', {
      method: options.method || 'GET',
      endpoint,
    });

    // TRY MOCK RESPONSE FIRST
    const mockResponse = await tryGetMockResponse(
      endpoint,
      options.method || 'GET'
    );
    if (mockResponse !== null) {
      logger.debug('Using mock response', { endpoint });
      return mockResponse;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    // ... rest of method unchanged
  }
}
```

---

## Integration Point 2: Initialize Mock Data in AuthProvider

**File:** `src/auth/context/AuthContext.tsx`

Add this import:
```typescript
import { mockDataService } from '../../common/services/mockData';
```

In the `useEffect` for `initializeAuth`, add initialization:
```typescript
useEffect(() => {
  const initializeAuth = async () => {
    try {
      // Initialize mock data service if in mock mode
      await mockDataService.initialize();

      const token = await getToken();
      // ... rest unchanged
    }
  };

  initializeAuth();
}, []);
```

---

## Usage Examples

### In Components

```typescript
// Get mock user
const user = mockDataService.getMockUser();
console.log('User ID:', user.id); // 'mock-user-12345'

// Get domain profiles
const profiles = await mockDataService.getMockDomainProfiles();
profiles.forEach(p => console.log(p.domainName, p.currentRating));

// Get events for specific domain
const chessEvents = await mockDataService.getMockEvents('chess');
console.log(`Found ${chessEvents.length} chess events`);

// Get all events
const allEvents = await mockDataService.getAllMockEvents();
console.log(`Total events: ${allEvents.length}`);
```

### For Testing

```typescript
// Clear mock cache between tests
await mockDataService.clearMockCache();

// Get cache stats
const stats = mockDataService.getCacheStats();
console.log('Cached items:', stats.keys);
```

---

## Environment Setup

### Update `.env.example`

```bash
# API Configuration
API_BASE_URL=https://api.aliascore.example.com

# Mock Data (set to true for development, false for production)
MOCK_AUTH=false

# Environment
ENV=development
```

### For Development

Create `.env` with:
```bash
MOCK_AUTH=true
API_BASE_URL=https://api.aliascore.example.com
ENV=development
```

### Running the App

```bash
# With mock data enabled
MOCK_AUTH=true npm start

# With real API
MOCK_AUTH=false npm start

# Run with iOS
MOCK_AUTH=true npm run ios

# Run with Android
MOCK_AUTH=true npm run android
```

---

## Testing

### Unit Test Example

```typescript
// __tests__/services/mockData.test.ts
import { mockDataService } from '../src/common/services/mockData';

describe('Mock Data Service', () => {
  beforeEach(async () => {
    await mockDataService.clearMockCache();
    await mockDataService.initialize();
  });

  test('user ID is consistent', () => {
    const user1 = mockDataService.getMockUser();
    const user2 = mockDataService.getMockUser();

    expect(user1.id).toBe(user2.id);
    expect(user1.id).toBe('mock-user-12345');
  });

  test('domain profiles are available', async () => {
    const profiles = await mockDataService.getMockDomainProfiles();

    expect(profiles.length).toBeGreaterThan(0);
    expect(profiles.map(p => p.domainKey)).toContain('chess');
    expect(profiles.map(p => p.domainKey)).toContain('valorant');
  });

  test('events are generated per domain', async () => {
    const chessEvents = await mockDataService.getMockEvents('chess');
    const valorantEvents = await mockDataService.getMockEvents('valorant');

    expect(chessEvents.length).toBe(8);
    expect(valorantEvents.length).toBe(8);
    expect(chessEvents[0].domainKey).toBe('chess');
    expect(valorantEvents[0].domainKey).toBe('valorant');
  });
});
```

---

## Checklist for Implementation

- [ ] Create `src/common/utils/seededRandom.ts`
- [ ] Create `src/common/services/mockData/factories/userFactory.ts`
- [ ] Create `src/common/services/mockData/factories/domainProfileFactory.ts`
- [ ] Create `src/common/services/mockData/factories/eventFactory.ts`
- [ ] Create `src/common/services/mockData/mockDataService.ts`
- [ ] Create `src/common/services/mockData/mockApiInterceptor.ts`
- [ ] Create `src/common/services/mockData/index.ts`
- [ ] Update `src/common/services/apiClient.ts` with mock interceptor
- [ ] Update `src/auth/context/AuthContext.tsx` with initialization
- [ ] Update `.env.example` with `MOCK_AUTH` variable
- [ ] Test with `MOCK_AUTH=true npm start`
- [ ] Verify user ID persists across restarts
- [ ] Run unit tests with `npm test`

