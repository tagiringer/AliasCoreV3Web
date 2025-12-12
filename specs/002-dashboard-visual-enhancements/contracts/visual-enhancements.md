# API Contracts: Dashboard Visual Enhancements

**Feature**: Dashboard Visual Enhancements
**Branch**: `002-dashboard-visual-enhancements`
**Date**: 2025-12-11
**Status**: ✅ Complete

## Overview

**No Backend API Changes Required**

This feature implements purely frontend visual enhancements with no backend integration. All data (avatar generation, domain colors, map placeholder) is static or client-generated.

---

## Contract Summary

| Feature Component | Backend Requirement | Status |
|-------------------|---------------------|--------|
| **Avatar Display** | None (client-generated from user data) | ✅ No API needed |
| **Domain Colors** | None (static frontend color map) | ✅ No API needed |
| **Map Placeholder** | None (static placeholder screen) | ✅ No API needed |
| **Gesture Navigation** | None (client-side navigation) | ✅ No API needed |

---

## 1. Avatar Display

### Current Implementation
**Endpoint**: N/A (no backend call)

**Data Source**:
- User seed: Derived from existing `User` entity (from authentication API)
- Avatar generation: Client-side via DiceBear library
- No image upload or storage in MVP

**Existing User Entity** (from authentication):
```typescript
// Already available from /api/auth endpoints
interface User {
  id: string;
  email: string;
  displayName: string;
  // ... other fields
}
```

**Avatar Seed Derivation**:
```typescript
// In DomainsDashboardScreen.tsx
const { user } = useAuth(); // From existing auth context
const avatarSeed = user?.email || user?.id || 'default';

<Avatar seed={avatarSeed} size={80} />
```

### Future Extension (Post-MVP)

When adding custom avatar upload functionality:

**Endpoint**: `PUT /api/users/avatar`

**Request**:
```typescript
{
  method: 'PUT',
  headers: {
    'Content-Type': 'multipart/form-data',
    'Authorization': 'Bearer {token}'
  },
  body: FormData {
    avatar: File // Image file (PNG, JPG, max 5MB)
  }
}
```

**Response**:
```typescript
{
  success: true,
  avatarUrl: "https://cdn.example.com/avatars/user-123.jpg"
}
```

**Updated User Entity**:
```typescript
interface User {
  id: string;
  email: string;
  displayName: string;
  avatarUrl?: string; // NEW: Custom uploaded avatar URL
}
```

**Implementation Impact**:
- Update `Avatar` component to accept `customUri` prop
- Fallback to DiceBear if `avatarUrl` is null or fails to load
- Add avatar upload UI in profile settings

**Deferred to**: Future feature specification (not in 002-dashboard-visual-enhancements scope)

---

## 2. Domain Colors

### Current Implementation
**Endpoint**: N/A (no backend call)

**Data Source**:
- Static TypeScript map in `src/domains/constants/domainColors.ts`
- Colors defined at compile time
- No network calls or API integration

**Color Assignment Strategy**:
```typescript
// Hardcoded color map
export const DOMAIN_COLORS: Record<string, DomainColorScheme> = {
  chess: { primary: '#2C5E1A', border: '#1F4312', ... },
  valorant: { primary: '#FA4454', border: '#C91F30', ... },
  // ... more domains
};

// Usage (zero network overhead)
const colors = getDomainColors(domain.domainKey); // O(1) lookup
```

**Domain Key Source**:
- `DomainProfile.domainKey` field from existing `/api/domains` endpoint
- No changes to domains API required

### Future Extension (Optional)

If dynamic color management is needed (for 50+ domains or A/B testing):

**Endpoint**: `GET /api/domains/colors`

**Request**:
```typescript
{
  method: 'GET',
  headers: {
    'Authorization': 'Bearer {token}'
  }
}
```

**Response**:
```typescript
{
  colors: {
    chess: {
      primary: "#2C5E1A",
      border: "#1F4312",
      accent: "#4A9D2A",
      textContrast: "light"
    },
    valorant: {
      primary: "#FA4454",
      border: "#C91F30",
      accent: "#FF6B7A",
      textContrast: "light"
    }
    // ... all domain colors
  },
  version: "1.0.0" // For cache invalidation
}
```

**Caching Strategy**:
```typescript
// Cache colors in AsyncStorage
const cachedColors = await AsyncStorage.getItem('domain_colors');
if (cachedColors && !isExpired(cachedColors)) {
  return JSON.parse(cachedColors);
}

// Fetch from API if cache miss or expired
const response = await fetch('/api/domains/colors');
await AsyncStorage.setItem('domain_colors', JSON.stringify(response.colors));
```

**Deferred to**: Future optimization (only if >50 domains or centralized color management needed)

---

## 3. Map Placeholder

### Current Implementation
**Endpoint**: N/A (no backend call)

**Data Source**:
- Static placeholder screen with hardcoded content
- No location data or map tiles
- No API integration for MVP

**Placeholder Content**:
```typescript
// MapPlaceholderScreen.tsx
const placeholderState = {
  displayMessage: "Discover gaming events, tournaments, and meetups near you",
  features: [
    "Find local tournaments",
    "Connect with nearby players",
    "Track event schedules"
  ],
  badgeText: "COMING SOON"
};
```

### Future Extension (Real Map Implementation)

When adding real events map functionality:

**Endpoint**: `GET /api/events/nearby`

**Request**:
```typescript
{
  method: 'GET',
  headers: {
    'Authorization': 'Bearer {token}'
  },
  params: {
    latitude: number,    // User's current latitude
    longitude: number,   // User's current longitude
    radius: number,      // Search radius in km (default: 50)
    domainKey?: string   // Optional: filter by gaming domain
  }
}
```

**Response**:
```typescript
{
  events: [
    {
      id: "evt_123",
      name: "Local Chess Tournament",
      description: "Weekly chess meetup at Central Park",
      domainKey: "chess",
      eventType: "tournament",
      location: {
        latitude: 37.7749,
        longitude: -122.4194,
        address: "123 Park Ave, San Francisco, CA"
      },
      startDate: "2025-12-15T10:00:00Z",
      endDate: "2025-12-15T18:00:00Z",
      participants: {
        registered: 24,
        capacity: 32
      },
      organizer: {
        id: "user_456",
        displayName: "ChessMaster"
      }
    }
    // ... more events
  ],
  meta: {
    total: 12,
    radius: 50,
    center: {
      latitude: 37.7749,
      longitude: -122.4194
    }
  }
}
```

**Event Entity**:
```typescript
interface EventLocation {
  id: string;
  name: string;
  description: string;
  domainKey: string;
  eventType: 'tournament' | 'meetup' | 'league' | 'casual';
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  startDate: string; // ISO 8601
  endDate: string;   // ISO 8601
  participants: {
    registered: number;
    capacity: number;
  };
  organizer: {
    id: string;
    displayName: string;
  };
}
```

**Deferred to**: Future feature specification (events map implementation, not in 002-dashboard-visual-enhancements scope)

---

## 4. Gesture Navigation

### Current Implementation
**Endpoint**: N/A (no backend call)

**Navigation Flow**:
- Client-side React Navigation
- Right-swipe gesture triggers screen transition
- No backend state tracking

**Navigation State**:
- Managed entirely by React Navigation
- No API calls for navigation events
- No analytics tracking in MVP

### Future Extension (Optional Analytics)

If adding gesture analytics:

**Endpoint**: `POST /api/analytics/events`

**Request**:
```typescript
{
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer {token}'
  },
  body: {
    eventType: 'gesture_navigation',
    properties: {
      sourceScreen: 'DomainsDashboard',
      targetScreen: 'Map',
      gestureType: 'right_swipe',
      duration: 250, // ms
      timestamp: '2025-12-11T10:30:00Z'
    }
  }
}
```

**Response**:
```typescript
{
  success: true,
  eventId: "analytics_789"
}
```

**Deferred to**: Future analytics implementation (not in 002-dashboard-visual-enhancements scope)

---

## API Impact Summary

### Changes Required for MVP
**None** - This feature has zero API impact.

### Existing APIs Used
1. **Authentication API** (already implemented):
   - `POST /api/auth/login` - Returns User entity with email/id for avatar seed
   - User context provides data for avatar generation

2. **Domains API** (already implemented):
   - `GET /api/domains` - Returns DomainProfile entities with domainKey
   - domainKey used to lookup colors from static color map

### No Changes to:
- Database schema
- Backend services
- API endpoints
- Authentication/authorization
- Response formats
- Error handling

### Future API Extensions (Out of Scope)
These are **not** part of the current feature but documented for future reference:

1. **Avatar Upload**: `PUT /api/users/avatar` (when adding custom avatar functionality)
2. **Dynamic Colors**: `GET /api/domains/colors` (when adding centralized color management)
3. **Events Map**: `GET /api/events/nearby` (when replacing map placeholder with real data)
4. **Analytics**: `POST /api/analytics/events` (when adding usage tracking)

All future extensions require separate feature specifications and should not be implemented as part of 002-dashboard-visual-enhancements.

---

## Contract Compliance

**Constitution Principle VI - Security & Privacy by Default**:
- ✅ No new sensitive data exposed
- ✅ No new authentication tokens required
- ✅ Avatar seed uses existing user data (no new PII)
- ✅ Domain colors are public styling data (no privacy concerns)
- ✅ Map placeholder has no location tracking (MVP)

**Constitution Principle II - Feature-First Architecture**:
- ✅ All visual enhancements contained within feature boundaries (domains/, map/, common/)
- ✅ No cross-cutting API changes
- ✅ Clear separation: visual layer only, no data layer changes

**Summary**: This feature adds zero API contracts, zero backend changes, and zero security/privacy surface area. All enhancements are purely frontend visual improvements.
