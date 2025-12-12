# Mock Data Quick Start Guide

## TL;DR

Use **Deterministic Seeded Random Generation** with environment-based switching via `MOCK_AUTH=true`.

- ✅ No external dependencies (pure TypeScript)
- ✅ Consistent across app restarts (same user ID, domains, events)
- ✅ Realistic gaming domain data
- ✅ Works offline
- ✅ Easy to test

---

## What You Get

### Fixed Mock User
```
ID: mock-user-12345
Email: mockuser@aliascore.dev
Name: Test Player
Domains: Chess, Valorant, Speedrunning
```

### 3 Domain Profiles
```
Chess (Chess.com):
  - Current Rating: 1720 (Peak: 1850)
  - Games: 4205
  - Rank: Expert

Valorant (Riot Games):
  - Current Rating: 1950 (Peak: 2100)
  - Games: 892
  - Rank: Diamond 1

Speedrunning (speedrun.com):
  - Current Rating: 42 (Peak: 42)
  - Games: 156
  - Rank: World Record Holder
```

### ~24 Total Events
- 8 events per domain
- Deterministically generated but realistic
- Include names, venues, dates, locations, organizers

---

## Implementation (Quick Version)

### Step 1: Copy Code Files (5 minutes)

Copy these ready-to-use files from `MOCK_DATA_IMPLEMENTATION.md`:

1. `src/common/utils/seededRandom.ts` - Random number generator
2. `src/common/services/mockData/factories/userFactory.ts` - User factory
3. `src/common/services/mockData/factories/domainProfileFactory.ts` - Domain profiles
4. `src/common/services/mockData/factories/eventFactory.ts` - Events
5. `src/common/services/mockData/mockDataService.ts` - Central service
6. `src/common/services/mockData/mockApiInterceptor.ts` - API interception
7. `src/common/services/mockData/index.ts` - Exports

### Step 2: Integrate with API Client (2 minutes)

Edit `src/common/services/apiClient.ts`:

```typescript
// Add import
import { tryGetMockResponse } from './mockData/mockApiInterceptor';

// In request() method, before fetch(), add:
const mockResponse = await tryGetMockResponse(endpoint, options.method || 'GET');
if (mockResponse !== null) {
  logger.debug('Using mock response', { endpoint });
  return mockResponse;
}
```

### Step 3: Initialize in AuthProvider (1 minute)

Edit `src/auth/context/AuthContext.tsx`:

```typescript
// Add import
import { mockDataService } from '../../common/services/mockData';

// In initializeAuth useEffect, add:
await mockDataService.initialize();
```

### Step 4: Environment Variable (30 seconds)

Update `.env`:

```bash
MOCK_AUTH=true
API_BASE_URL=https://api.aliascore.example.com
```

### Step 5: Test (1 minute)

```bash
MOCK_AUTH=true npm start
```

Done! Test:
- [ ] Can sign in with mock data
- [ ] User ID is always `mock-user-12345`
- [ ] Can see 3 domain profiles
- [ ] Can see events
- [ ] Kill app and restart - user ID persists
- [ ] `MOCK_AUTH=false npm start` uses real API

**Total implementation time: ~10 minutes**

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                   React Native App                      │
├─────────────────────────────────────────────────────────┤
│                 Authentication & Screens                │
└──────────────────────┬──────────────────────────────────┘
                       │
                       ▼
        ┌──────────────────────────────┐
        │      API Client               │
        │  (src/services/apiClient.ts)  │
        └──────────────┬────────────────┘
                       │
          ┌────────────┴────────────┐
          ▼                         ▼
    ┌──────────────┐        ┌──────────────────┐
    │ MOCK_MODE?   │        │ Network Request  │
    │ YES → Use    │        │ (Real API)       │
    │ Mock Data    │        │                  │
    └──────┬───────┘        └──────────────────┘
           │
           ▼
    ┌─────────────────────────────────┐
    │  Mock API Interceptor           │
    │  tryGetMockResponse()           │
    └──────┬──────────────────────────┘
           │
           ▼
    ┌──────────────────────────────────┐
    │  Mock Data Service               │
    │  (Caches in AsyncStorage)        │
    └──────┬───────────────────────────┘
           │
           ▼
    ┌──────────────────────────────────┐
    │  Factories                       │
    │  ├─ User Factory                │
    │  ├─ Domain Profile Factory      │
    │  └─ Event Factory               │
    └──────┬───────────────────────────┘
           │
           ▼
    ┌──────────────────────────────────┐
    │  Seeded Random Generator         │
    │  (Deterministic, seed=20250101)  │
    └──────────────────────────────────┘
```

---

## Key Concepts

### 1. Seeded Random
- Same seed always produces same sequence
- Seed: `20250101` (January 1, 2025)
- No external dependencies needed
- Pure deterministic math

### 2. Factories
- User Factory - creates `mock-user-12345`
- Domain Profile Factory - creates Chess/Valorant/Speedrunning profiles
- Event Factory - generates realistic events per domain

### 3. Mock Data Service
- Central singleton managing all mock data
- Caches data in AsyncStorage (survives app restart)
- Auto-initializes when `MOCK_AUTH=true`

### 4. API Interceptor
- Intercepts API calls at `apiClient` level
- Returns mock response if `MOCK_AUTH=true`
- Falls through to real API if `MOCK_AUTH=false`
- Simulates network latency (realistic)

### 5. Environment Gate
- `MOCK_AUTH=true` enables mock mode
- Set in `.env` file
- Can be toggled per environment

---

## Data Persistence

### How Consistency Works

1. **Fixed User ID**
   - Always returns `mock-user-12345`
   - Hardcoded constant

2. **Seeded Domain Data**
   - Seed = base seed (20250101) + domain hash
   - Same domain = same seed = same data
   - Generated once, then cached

3. **AsyncStorage Cache**
   - After first generation, data stored locally
   - Survives app restart
   - Can be cleared manually with `mockDataService.clearMockCache()`

### Example: User Restart Flow

```
App Start
    ↓
AuthProvider initializes
    ↓
mockDataService.initialize()
    ↓
Load from AsyncStorage cache?
    ├─ YES → Return cached user
    └─ NO → Generate new user, cache it
    ↓
Always returns mock-user-12345
```

---

## Testing Checklist

### Manual Testing
- [ ] Run `MOCK_AUTH=true npm start`
- [ ] Sign in successfully
- [ ] Check user ID in console: should be `mock-user-12345`
- [ ] Navigate to domains - should see Chess, Valorant, Speedrunning
- [ ] Check domain ratings are realistic
- [ ] View events - should see ~8 events per domain
- [ ] Kill app (Ctrl+C in terminal)
- [ ] Restart app (`npm start`)
- [ ] Verify user ID is still `mock-user-12345` (NOT regenerated)
- [ ] Switch to `MOCK_AUTH=false` and verify it tries to hit real API

### Automated Testing
```bash
npm test
```

Example test:
```typescript
test('mock user ID is consistent', () => {
  const user1 = mockDataService.getMockUser();
  const user2 = mockDataService.getMockUser();

  expect(user1.id).toBe('mock-user-12345');
  expect(user1.id).toBe(user2.id);
});
```

---

## Troubleshooting

### Issue: Mock data not working
**Solution:**
- Verify `MOCK_AUTH=true` in `.env`
- Check `app.config.js` reads `process.env.MOCK_AUTH`
- Verify mock files are in correct paths
- Check logger output for "Using mock response" messages

### Issue: Data changes after restart
**Solution:**
- This shouldn't happen - check AsyncStorage caching
- Call `mockDataService.clearMockCache()` to reset
- Verify seeded random generator is working

### Issue: Events have different dates each time
**Solution:**
- Events are generated relative to "today"
- This is intentional - events should be in future
- To make dates fixed, modify `eventFactory.ts` to use fixed base date

### Issue: Real API called even with MOCK_AUTH=true
**Solution:**
- Verify integration in `apiClient.ts` - mock interceptor must be called BEFORE fetch
- Check endpoint format matches patterns in `mockApiInterceptor.ts`
- Add debug logging: `logger.debug('Using mock response', { endpoint })`

---

## Future Enhancements

### Short Term
- [ ] Admin debug screen to toggle mock mode
- [ ] Multiple mock user profiles
- [ ] Mock error responses

### Medium Term
- [ ] Different seed per environment
- [ ] Mock data validation/testing
- [ ] GraphQL support for mock data

### Long Term
- [ ] Mock data management UI
- [ ] Mock data export/import
- [ ] CI/CD integration for mock testing

---

## File Locations Summary

```
src/
├── common/
│   ├── services/
│   │   ├── apiClient.ts ← MODIFY to use mock interceptor
│   │   └── mockData/
│   │       ├── index.ts ← CREATE
│   │       ├── mockDataService.ts ← CREATE
│   │       ├── mockApiInterceptor.ts ← CREATE
│   │       └── factories/
│   │           ├── userFactory.ts ← CREATE
│   │           ├── domainProfileFactory.ts ← CREATE
│   │           └── eventFactory.ts ← CREATE
│   └── utils/
│       └── seededRandom.ts ← CREATE
│
└── auth/
    └── context/
        └── AuthContext.tsx ← MODIFY to init mock service

.env ← UPDATE with MOCK_AUTH
.env.example ← UPDATE with MOCK_AUTH
```

---

## Configuration Reference

### Environment Variables
```bash
# Enable mock data mode
MOCK_AUTH=true

# Real API endpoint (not used in mock mode, but keep for production)
API_BASE_URL=https://api.aliascore.example.com
```

### Code References
- Mock service: `import { mockDataService } from '../../common/services/mockData'`
- Seeded RNG: `import { SeededRandom } from '../../utils/seededRandom'`
- Interceptor: `import { tryGetMockResponse } from './mockData/mockApiInterceptor'`

---

## Performance Notes

- **Startup time:** <50ms (mock data loads from AsyncStorage)
- **Memory overhead:** ~50KB (3 profiles + 24 events cached)
- **Network calls:** None (all intercepted)
- **Battery:** No network = lower power consumption

---

## Security Notes

- ❌ DO NOT commit actual auth tokens in mock data
- ❌ DO NOT use real user IDs
- ✅ Mock tokens are prefixed with `mock-` for clarity
- ✅ Mock mode only works with `MOCK_AUTH=true` in development

---

## Support

For detailed implementation code, see: `MOCK_DATA_IMPLEMENTATION.md`

For architecture decisions and rationale, see: `MOCK_DATA_STRATEGY.md`

Questions? Common issues above or check logger output with:
```typescript
import { logger } from '../../common/services/logger';
logger.debug('Debug message', { /* data */ });
```

---

## Summary

**Recommended Approach:** Deterministic Seeded Random Generation

**Why:** Fast, simple, zero-dependency, consistent, realistic

**Time to Implement:** ~10 minutes

**Key Files:** 7 files to create, 2 files to modify

**Status:** Ready to implement - all code patterns provided

