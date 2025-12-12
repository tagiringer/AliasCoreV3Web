# Data Model: AliasCore Mobile MVP

**Feature**: AliasCore Mobile - Universal Gaming Identity Platform
**Date**: 2025-12-11
**Source**: Extracted from [spec.md](./spec.md)

## Overview

This document defines the core data entities for AliasCore Mobile, their attributes, validation rules, and relationships. The backend API is the source of truth for all data; the mobile app consumes and displays this data.

## Entities

### 1. User

Represents an authenticated user with their profile information.

**Attributes**:

| Field | Type | Required | Validation | Description |
|-------|------|----------|------------|-------------|
| `id` | string | ✅ | UUID or unique identifier | User's unique identifier |
| `email` | string | ✅ | Valid email format | User's email from Google OAuth |
| `displayName` | string | ✅ | 3-30 characters, alphanumeric + spaces + `. - '` | User-chosen display name |
| `avatarUrl` | string \| null | ❌ | Valid URL or null | Link to user's avatar image |
| `domains` | string[] | ✅ | Array of domain IDs, max 10 items | List of domain profile IDs linked to this user |
| `createdAt` | string | ✅ | ISO 8601 timestamp | Account creation timestamp |
| `updatedAt` | string | ✅ | ISO 8601 timestamp | Last profile update timestamp |

**Relationships**:
- 1:N with DomainProfile (one user has many domain profiles, max 10)

**Validation Rules**:
- `displayName`: Must be 3-30 characters, allow alphanumeric, spaces, and punctuation (`. - '`)
- `domains`: Maximum 10 domain IDs per user (enforced by backend)
- `email`: Must be valid email format from Google OAuth

**TypeScript Interface**:
```typescript
export interface User {
  id: string;
  email: string;
  displayName: string;
  avatarUrl: string | null;
  domains: string[]; // max 10 items
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
}
```

**Example**:
```json
{
  "id": "usr_abc123",
  "email": "player@example.com",
  "displayName": "ChessMaster2000",
  "avatarUrl": "https://cdn.aliascore.app/avatars/usr_abc123.jpg",
  "domains": ["dom_chess_001", "dom_valorant_002"],
  "createdAt": "2025-12-11T10:00:00Z",
  "updatedAt": "2025-12-11T14:30:00Z"
}
```

---

### 2. DomainProfile

Represents a user's profile for a specific gaming domain (e.g., Chess, Valorant).

**Attributes**:

| Field | Type | Required | Validation | Description |
|-------|------|----------|------------|-------------|
| `id` | string | ✅ | UUID or unique identifier | Domain profile unique identifier |
| `userId` | string | ✅ | Foreign key to User | ID of the user who owns this profile |
| `domainKey` | string | ✅ | Lowercase alphanumeric slug (e.g., 'chess', 'valorant') | Unique identifier for the domain |
| `domainName` | string | ✅ | Human-readable name | Display name for the domain (e.g., 'Chess', 'Valorant') |
| `domainIcon` | string | ✅ | Valid URL or asset path | URL or identifier for domain icon image |
| `primaryPlatform` | string | ✅ | Platform name | Primary platform for this domain (e.g., 'Chess.com', 'Riot Games') |
| `platformUsername` | string | ✅ | Non-empty string | User's username on the primary platform |
| `peakRating` | number \| null | ❌ | Positive number or null | Highest rating achieved by the user |
| `currentRating` | number \| null | ❌ | Positive number or null | User's current rating |
| `gamesPlayed` | number \| null | ❌ | Non-negative integer or null | Total games played in this domain |
| `rankTier` | string \| null | ❌ | Free text or null | Rank/tier name (e.g., 'Diamond', 'Master') |
| `shareSlug` | string | ✅ | Unique slug | Unique slug for public share URLs |
| `lastUpdated` | string | ✅ | ISO 8601 timestamp | Timestamp of last stats sync from platform |

**Relationships**:
- N:1 with User (many domain profiles belong to one user)
- 1:N with Event (one domain has many events)

**Validation Rules**:
- `shareSlug`: Must be unique across all domain profiles (enforced by backend)
- `platformUsername`: Required, cannot be empty
- Ratings (`peakRating`, `currentRating`): Must be positive numbers if present
- `gamesPlayed`: Must be non-negative integer if present

**TypeScript Interface**:
```typescript
export interface DomainProfile {
  id: string;
  userId: string;
  domainKey: string; // e.g., 'chess', 'valorant'
  domainName: string; // e.g., 'Chess', 'Valorant'
  domainIcon: string;
  primaryPlatform: string; // e.g., 'Chess.com', 'Riot Games'
  platformUsername: string;
  peakRating: number | null;
  currentRating: number | null;
  gamesPlayed: number | null;
  rankTier: string | null;
  shareSlug: string; // unique
  lastUpdated: string; // ISO 8601
}
```

**Example**:
```json
{
  "id": "dom_chess_001",
  "userId": "usr_abc123",
  "domainKey": "chess",
  "domainName": "Chess",
  "domainIcon": "https://cdn.aliascore.app/icons/chess.png",
  "primaryPlatform": "Chess.com",
  "platformUsername": "ChessMaster2000",
  "peakRating": 2400,
  "currentRating": 2350,
  "gamesPlayed": 1234,
  "rankTier": "Expert",
  "shareSlug": "usr_abc123_chess",
  "lastUpdated": "2025-12-11T14:00:00Z"
}
```

---

### 3. Event

Represents a local event for a specific gaming domain (e.g., Chess tournament, Valorant LAN).

**Attributes**:

| Field | Type | Required | Validation | Description |
|-------|------|----------|------------|-------------|
| `id` | string | ✅ | UUID or unique identifier | Event unique identifier |
| `domainKey` | string | ✅ | Must match valid domain (e.g., 'chess', 'valorant') | Domain this event belongs to |
| `name` | string | ✅ | Non-empty string | Event name |
| `description` | string | ✅ | Free text | Event description |
| `venue` | string | ✅ | Non-empty string | Venue name and/or address |
| `dateTime` | string | ✅ | ISO 8601 timestamp | Event date and time |
| `latitude` | number | ✅ | Valid latitude (-90 to 90) | Event location latitude |
| `longitude` | number | ✅ | Valid longitude (-180 to 180) | Event location longitude |
| `link` | string \| null | ❌ | Valid URL or null | Optional external link for event details/registration |
| `organizerName` | string \| null | ❌ | Free text or null | Optional organizer name |

**Relationships**:
- N:1 with DomainProfile (many events belong to one domain, via `domainKey`)

**Validation Rules**:
- `latitude`: Must be between -90 and 90 (valid latitude)
- `longitude`: Must be between -180 and 180 (valid longitude)
- `dateTime`: Must be valid ISO 8601 timestamp
- `link`: Must be valid URL if present

**TypeScript Interface**:
```typescript
export interface Event {
  id: string;
  domainKey: string; // e.g., 'chess'
  name: string;
  description: string;
  venue: string;
  dateTime: string; // ISO 8601
  latitude: number; // -90 to 90
  longitude: number; // -180 to 180
  link: string | null;
  organizerName: string | null;
}
```

**Example**:
```json
{
  "id": "evt_001",
  "domainKey": "chess",
  "name": "City Chess Championship 2025",
  "description": "Annual city-wide chess tournament for all skill levels. USCF rated.",
  "venue": "Community Center, 123 Main St, San Francisco, CA",
  "dateTime": "2025-12-20T10:00:00Z",
  "latitude": 37.7749,
  "longitude": -122.4194,
  "link": "https://citychess.example.com/tournament-2025",
  "organizerName": "SF Chess Club"
}
```

---

### 4. SharePayload

Represents the data structure for QR code and NFC sharing. Contains only public profile information, no sensitive data.

**Attributes**:

| Field | Type | Required | Validation | Description |
|-------|------|----------|------------|-------------|
| `type` | string | ✅ | Always `'domain-profile'` | Share type identifier |
| `shareSlug` | string | ✅ | Unique slug matching DomainProfile | Unique slug for the shared profile |
| `domainKey` | string | ✅ | Valid domain key | Domain being shared (e.g., 'chess') |
| `displayName` | string | ✅ | User's display name | User's display name (public) |
| `platformUsername` | string | ✅ | Platform username | Username on the platform |
| `shareUrl` | string | ✅ | Valid URL | Full public URL to view this profile |
| `timestamp` | string | ✅ | ISO 8601 timestamp | Timestamp when share was created |

**Relationships**:
- Derived from User and DomainProfile (read-only, ephemeral)

**Validation Rules**:
- `type`: Must always be `'domain-profile'`
- `shareUrl`: Must be valid URL format
- **SECURITY**: Must NOT include email, auth tokens, or private user data

**TypeScript Interface**:
```typescript
export interface SharePayload {
  type: 'domain-profile'; // literal type
  shareSlug: string;
  domainKey: string;
  displayName: string;
  platformUsername: string;
  shareUrl: string; // e.g., https://aliascore.app/share/usr_abc123/chess
  timestamp: string; // ISO 8601
}
```

**Example**:
```json
{
  "type": "domain-profile",
  "shareSlug": "usr_abc123_chess",
  "domainKey": "chess",
  "displayName": "ChessMaster2000",
  "platformUsername": "ChessMaster2000",
  "shareUrl": "https://aliascore.app/share/usr_abc123/chess",
  "timestamp": "2025-12-11T15:30:00Z"
}
```

**Usage**:
- Encoded in QR codes via react-native-qrcode-svg
- Written to NFC tags via react-native-nfc-manager (NDEF format)
- Displayed in share sheet preview

---

## Relationship Diagram

```
┌─────────────┐
│    User     │
│             │ 1
│ - id        ├────────┐
│ - email     │        │
│ - domains[] │        │
└─────────────┘        │
                       │
                       │ N
                  ┌────▼──────────────┐
                  │  DomainProfile    │
                  │                   │ 1
                  │ - id              ├────────┐
                  │ - userId (FK)     │        │
                  │ - domainKey       │        │
                  │ - shareSlug       │        │
                  └───────────────────┘        │
                                               │
                                               │ N
                                          ┌────▼─────┐
                                          │  Event   │
                                          │          │
                                          │ - id     │
                                          │ - domainKey (FK)
                                          └──────────┘

┌──────────────────┐
│  SharePayload    │  (Derived, ephemeral)
│                  │
│ - Constructed from User + DomainProfile
│ - Used for QR/NFC sharing
│ - No persistent storage
└──────────────────┘
```

---

## Data Flow

### Authentication Flow
1. User signs in with Google OAuth
2. Backend receives Google ID token → POST /api/auth/google
3. Backend validates token, creates/retrieves User entity
4. Backend returns auth token + User object
5. Mobile app stores auth token securely (expo-secure-store)
6. Mobile app caches User object locally

### Domain Data Flow
1. User lands on Domains Dashboard
2. App fetches user's domains → GET /api/domains
3. Backend returns array of DomainProfile entities
4. App caches domain data locally (zustand)
5. App displays domain cards with highlight stats

### Events Data Flow
1. User swipes right on domain profile → opens Events Map
2. App requests user location (expo-location)
3. App fetches events → GET /api/events?domainKey=chess&lat=37.7&lon=-122.4&radius=30
4. Backend returns Event entities (max 25, sorted by soonest date)
5. App displays event pins on map

### Sharing Flow
1. User taps share button on domain profile
2. App constructs SharePayload from User + DomainProfile
3. App generates QR code encoding shareUrl (react-native-qrcode-svg)
4. Recipient scans QR → opens shareUrl in browser
5. Backend serves public profile page → GET /api/share/:userId/:domainId

---

## Mock Data Strategy

For development (MOCK_AUTH=true), the app generates mock entities:

### Mock User
```typescript
{
  id: 'mock-user-id-12345',
  email: 'testuser@example.com',
  displayName: 'Test User',
  avatarUrl: null,
  domains: ['mock-chess', 'mock-valorant'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
}
```

### Mock Domain Profiles (2-3 domains)
- Chess: Chess.com, peak rating 2400, current 2350
- Valorant: Riot Games, peak rank Diamond 3, current Platinum 1
- (Optional) Speedrunning: Speedrun.com, best time 12:34.56

### Mock Events (5-10 per domain)
- Realistic event names, dates (upcoming), venues
- Coordinates near San Francisco (37.7749, -122.4194) for testing

See [research.md](./research.md) for mock data generation patterns (to be generated in Phase 0).

---

## Notes

- **Backend is source of truth**: Mobile app does NOT calculate ratings, aggregate stats, or modify user data (except display name/avatar during onboarding)
- **Nullable fields**: Many stats fields (peakRating, currentRating, gamesPlayed, rankTier) are nullable to handle missing or incomplete platform data gracefully
- **Security**: Auth tokens, email addresses, and private user data MUST NOT appear in SharePayload or logs
- **Uniqueness**: shareSlug must be unique per domain profile (enforced by backend, used in public URLs)
- **Limits**: Max 10 domains per user, max 25 events displayed on map
