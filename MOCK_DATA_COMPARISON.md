# Mock Data Architecture: Detailed Comparison

## Decision Matrix

| Criteria | Seeded Random (RECOMMENDED) | Faker.js | JSON Files | Backend Server | MSW |
|----------|-----------|----------|-----------|----------------|-----|
| **Implementation Time** | 10 min | 5 min | 15 min | 2 hours | 30 min |
| **Dependencies** | 0 | 1 | 0 | Backend code | 1 |
| **Bundle Size** | +10KB | +50KB | +100KB | N/A | +20KB |
| **Consistency** | ✅ Perfect | ⚠️ Seeded | ✅ Perfect | ✅ Perfect | ✅ Perfect |
| **Offline** | ✅ Yes | ✅ Yes | ✅ Yes | ❌ No | ✅ Yes |
| **Data Realism** | ✅ Custom | ✅ Excellent | ✅ Static | ✅ Real | ✅ Custom |
| **Error Scenarios** | ❌ Hard | ✅ Easy | ❌ No | ✅ Easy | ✅ Easy |
| **Learning Curve** | Low | Low | Very Low | Medium | Medium |
| **Production Ready** | ✅ Yes | ✅ Yes | ✅ Yes | ✅ Yes | ✅ Yes |
| **Maintainability** | ✅ Easy | ✅ Easy | ⚠️ Medium | ⚠️ Medium | ✅ Easy |
| **Testing** | ✅ Easy | ✅ Easy | ✅ Very Easy | ✅ Easy | ✅ Easy |
| **Flexibility** | ✅ High | ✅ High | ⚠️ Low | ✅ Very High | ✅ High |

---

## Detailed Comparison

### Option 1: Seeded Random Generation (RECOMMENDED)

#### Pros
```
✅ No external dependencies
✅ Complete deterministic output
✅ Full control over data generation
✅ Easy to customize per domain
✅ Lightweight (10KB)
✅ Works offline perfectly
✅ Consistent across restarts guaranteed
✅ Good learning value
✅ Easy to test
```

#### Cons
```
❌ Requires more initial setup code
❌ Less out-of-the-box data providers
❌ Need to build domain-specific logic
```

#### Code Example
```typescript
// Create factories once, use forever
const user = createMockUser();           // Same every time
const profile = createMockDomainProfile('chess', user.id); // Same every time
const events = createMockEvents('chess');  // Same every time

// Consistent across restarts via AsyncStorage cache
```

#### When to Use
- MVP development
- Quick iteration
- Limited domains (2-5)
- Small team
- Offline development needed
- Learning/educational purpose

#### Cost Analysis
- Setup: ~2 hours (includes testing)
- Maintenance: Low (internal code)
- Extension: Medium (add domain = 30 min)

---

### Option 2: Faker.js Library

#### Pros
```
✅ Industry standard library
✅ Extensive data providers
✅ Easy to generate realistic data
✅ Minimal boilerplate
✅ Large community & examples
✅ Good for rapid prototyping
✅ Seeded for consistency
```

#### Cons
```
❌ Adds 50KB dependency
❌ Faker updates can change output (even with seed)
❌ Not needed for 3 domains
❌ Overkill for MVP
❌ Less control over data format
```

#### Code Example
```typescript
import { faker } from '@faker-js/faker';

faker.seed(123);

const user = {
  id: faker.string.uuid(),
  email: faker.internet.email(),
  displayName: faker.person.fullName(),
};

// Problem: Each faker version may produce different output!
```

#### When to Use
- Large data sets needed
- Many entity types
- Complex data relationships
- Later-stage development
- Team already using Faker

#### Cost Analysis
- Setup: ~1 hour
- Maintenance: Low
- Extension: Very fast
- Bundle: +50KB
- Risk: Version updates may change test data

---

### Option 3: Static JSON Files

#### Pros
```
✅ Absolutely consistent
✅ Human-editable
✅ Easy to inspect
✅ No code needed
✅ Perfect for static test data
```

#### Cons
```
❌ Hard to persist ID consistency
❌ Not scalable (hard to add more)
❌ File bundling complexity
❌ Not realistic for generated data
❌ Difficult to extend
❌ Path resolution in React Native
```

#### Code Example
```typescript
// mockData.json
{
  "user": { "id": "mock-user-12345", ... },
  "domainProfiles": [ ... ],
  "events": [ ... ]
}

// Usage
import mockData from './mockData.json';
const user = mockData.user;

// Problem: How to bundle file? How to reload on app restart?
```

#### When to Use
- Static test data only
- No new data generation needed
- Very small team
- Educational/demo purposes

#### Cost Analysis
- Setup: ~15 min
- Maintenance: Medium
- Extension: Slow (manual)

---

### Option 4: Backend Mock API Server

#### Pros
```
✅ Closest to production
✅ Test error responses
✅ Network behavior realistic
✅ Easy to modify on the fly
✅ Can share with team
```

#### Cons
```
❌ Requires running separate service
❌ 2+ hours setup time
❌ Adds complexity
❌ Docker/containerization needed
❌ No offline support
❌ Overkill for MVP
❌ Deploy & maintain separately
```

#### Code Example
```typescript
// Start mock server
npm run mock-api-server

// App talks to it normally
const response = await apiClient.get('/api/domains');
// Server returns mock data
```

#### When to Use
- Team testing (multiple developers)
- Advanced error scenario testing
- Staging environment
- Integration testing
- Near-production testing

#### Cost Analysis
- Setup: 2-4 hours
- Maintenance: Medium-High
- Extension: Medium
- Infrastructure: Server needed
- Risk: Requires running separate process

---

### Option 5: Mock Service Worker (MSW)

#### Pros
```
✅ Industry standard (used by Discord, etc.)
✅ Network-level interception
✅ Great for advanced testing
✅ Error scenario support
✅ Works with REST and GraphQL
```

#### Cons
```
❌ Service Worker setup complex
❌ React Native support limited
❌ Overkill for MVP
❌ Learning curve
❌ Adds dependency
```

#### Code Example
```typescript
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';

const handlers = [
  http.get('/api/domains', () => {
    return HttpResponse.json(mockDomainData);
  }),
];

const server = setupServer(...handlers);
```

#### When to Use
- Advanced test scenarios
- Team with MSW experience
- Later-stage development
- GraphQL APIs
- Comprehensive testing

#### Cost Analysis
- Setup: 30 min - 1 hour
- Maintenance: Low (framework)
- Extension: Fast
- Learning: Medium

---

## Recommendation Summary

### For AliasCore MVP: **Seeded Random Generation**

**Why:**
1. ✅ Consistency guaranteed (fixed seed = same data)
2. ✅ No dependencies (keeps bundle small)
3. ✅ Offline-capable (critical for field development)
4. ✅ Fast implementation (10 minutes)
5. ✅ Perfect for 3 domains + events
6. ✅ Easy to understand and maintain
7. ✅ Realistic domain-specific data
8. ✅ Clear learning value

**Score: 9.5/10**

---

## Implementation Roadmap

### Phase 1: MVP (Now) - Seeded Random
```
Week 1: Implement seeded random factories
├─ User factory (5 min)
├─ Domain profile factory (10 min)
├─ Event factory (15 min)
├─ Mock data service (20 min)
└─ Integration (10 min)

Week 2: Testing & refinement
├─ Unit tests
├─ Integration tests
├─ Manual testing
└─ Documentation
```

### Phase 2: Growth (Later) - Consider Faker.js
```
If needed for:
├─ 10+ domains
├─ Complex user profiles
├─ Extensive test data
└─ Multiple user scenarios
```

### Phase 3: Teams (Future) - Consider Backend Server
```
If needed for:
├─ Multiple developers
├─ Error scenario testing
├─ Staging environment
└─ Production mirror testing
```

---

## Code Complexity Comparison

### Seeded Random - Lines of Code
```
seededRandom.ts         ~ 100 lines
userFactory.ts          ~ 30 lines
domainProfileFactory.ts ~ 80 lines
eventFactory.ts         ~ 150 lines
mockDataService.ts      ~ 200 lines
mockApiInterceptor.ts   ~ 200 lines
─────────────────────────────────
TOTAL                   ~ 760 lines
+ Integration:          ~20 lines (in apiClient.ts)
```

### Faker.js - Lines of Code
```
mockDataFactories.ts    ~ 200 lines
integration.ts          ~ 30 lines
─────────────────────────────────
TOTAL                   ~ 230 lines
+ Dependencies:         faker.js (50KB)
```

### JSON Files - Lines of Code
```
mockData.json           ~ 500 lines
mockDataLoader.ts       ~ 50 lines
─────────────────────────────────
TOTAL                   ~ 550 lines
+ File management:      Complex
```

---

## Performance Comparison

### Startup Time (First Load)
```
Seeded Random:    ~50ms (generate + cache)
Faker.js:         ~150ms (library init + generate)
JSON Files:       ~100ms (parse + load)
Backend Server:   ~500ms (network call)
MSW:              ~200ms (setup)
```

### Restart Time (From Cache)
```
Seeded Random:    <10ms (load from AsyncStorage)
Faker.js:         ~100ms (library init)
JSON Files:       ~30ms (parse)
Backend Server:   ~500ms (network call)
MSW:              ~150ms (setup)
```

### Memory Usage
```
Seeded Random:    ~50KB (3 profiles + 24 events)
Faker.js:         ~150KB (library + generated data)
JSON Files:       ~100KB (parsed)
Backend Server:   ~0KB (remote)
MSW:              ~80KB
```

### Bundle Size Impact
```
Seeded Random:    +10KB (source code)
Faker.js:         +50KB (library)
JSON Files:       0KB (external file)
Backend Server:   0KB (remote)
MSW:              +20KB (library)
```

---

## Test Coverage

### Unit Testing

#### Seeded Random
```typescript
✅ Same seed produces same sequence
✅ Different seeds produce different output
✅ RNG methods produce expected ranges
✅ Pick from array works
✅ Shuffle works deterministically
```

#### Faker.js
```typescript
✅ Seeded faker produces consistent data
⚠️ May vary between faker versions
✅ Locale support
✅ Multiple providers
```

#### JSON Files
```typescript
✅ File loads correctly
✅ Data structure correct
⚠️ No generation logic to test
```

### Integration Testing

#### Seeded Random
```typescript
✅ MockDataService caches correctly
✅ AsyncStorage persistence works
✅ API interceptor returns mock data
✅ Consistency across restarts
```

#### All Options
```typescript
✅ MOCK_AUTH flag works
✅ Real API still works with flag off
✅ No network calls in mock mode
```

---

## Domain-Specific Considerations

### Chess
- Rating ranges: 800-2800 (ELO)
- Platforms: Chess.com, Lichess, ICC
- Realistic: 1720 current, 1850 peak ✅

### Valorant
- Rank tiers: Iron to Radiant
- Rating system: RR (Rating Rating)
- Realistic: Diamond 1 (2000 RR equivalent) ✅

### Speedrunning
- No numerical rating system
- Tracks times and world records
- Realistic: Custom rating representation ✅

**Seeded Random handles all three well.**
**Faker.js would need custom providers.**
**JSON would need manual data.**

---

## Risk Analysis

### Seeded Random
```
Risk: Low
├─ No external dependencies
├─ No version updates to worry about
├─ Full code control
└─ Easy to debug
```

### Faker.js
```
Risk: Medium
├─ Dependency management
├─ Version changes may affect output
├─ Learning curve for customization
└─ Larger bundle
```

### JSON Files
```
Risk: High
├─ Scaling problems
├─ Hard to maintain consistency
├─ File bundling issues
└─ Difficult to debug
```

### Backend Server
```
Risk: Medium-High
├─ Infrastructure complexity
├─ Deployment required
├─ Network dependency
└─ Maintenance overhead
```

### MSW
```
Risk: Low-Medium
├─ Library maturity
├─ React Native support gaps
├─ Good documentation
└─ Active maintenance
```

---

## Conclusion

**Recommended:** Seeded Random Generation

**Rationale:**
- Perfect for MVP phase
- No external dependencies
- Guaranteed consistency
- Easy to understand and maintain
- Fast to implement
- Offline-capable
- Scale-able for near future

**Next Step:** See `MOCK_DATA_IMPLEMENTATION.md` for ready-to-use code.

