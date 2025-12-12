# Quickstart: Dashboard Visual Enhancements

**Feature**: Dashboard Visual Enhancements
**Branch**: `002-dashboard-visual-enhancements`
**Date**: 2025-12-11
**Status**: ✅ Ready for Implementation

## Overview

This guide provides setup instructions and developer quickstart for implementing the dashboard visual enhancements feature: avatar display, domain color schemes, and map placeholder with gesture navigation.

**Total Setup Time**: ~10 minutes
**Implementation Time**: ~4-6 hours (based on tasks.md breakdown)

---

## Prerequisites

Before starting implementation, ensure:

1. ✅ Base project setup complete (`001-aliascore-mvp` Phase 1 complete)
2. ✅ React Native development environment configured
3. ✅ Dependencies installed: `npm install` (from root)
4. ✅ Mobile device or simulator running

**Verify Environment**:
```bash
# Check React Native version
npx react-native --version  # Should be 0.81.5

# Check Expo SDK
npx expo --version          # Should be ~54.0.0

# Verify existing dependencies
npm list react-native-svg   # Should be 15.12.1
npm list react-native-gesture-handler  # Should be 2.28.0
```

---

## Step 1: Install New Dependencies

### Install DiceBear Avatar Library

```bash
npm install @dicebear/core @dicebear/big-smile
```

**Dependency Details**:
- **@dicebear/core**: Core avatar generation library (~15KB)
- **@dicebear/big-smile**: Bitmoji-style avatar style (~25KB)
- **Total Bundle Impact**: ~40KB (60% under 100KB budget)

**Verify Installation**:
```bash
npm list @dicebear/core @dicebear/big-smile
```

Expected output:
```
@dicebear/core@9.x.x
@dicebear/big-smile@9.x.x
```

### No Other Dependencies Needed

All other requirements use existing dependencies:
- ✅ `react-native-svg@15.12.1` (already installed) - Avatar rendering
- ✅ `react-native-gesture-handler@2.28.0` (already installed) - Gesture navigation
- ✅ `@react-navigation/stack@6.4.1` (already installed) - Navigation config

---

## Step 2: Project Structure Setup

### Create New Directories

```bash
# Avatar component directory (if not exists)
mkdir -p src/common/components

# Domain colors configuration
mkdir -p src/domains/constants

# Map feature directory
mkdir -p src/map/screens
mkdir -p src/map/components
```

### Verify Structure

```bash
tree -L 3 src/
```

Expected structure:
```
src/
├── auth/
├── common/
│   ├── components/    # Avatar component here
│   └── theme/
├── domains/
│   ├── components/    # DomainCard (to be modified)
│   ├── constants/     # NEW: domainColors.ts
│   ├── screens/       # DomainsDashboardScreen (to be modified)
│   └── services/
├── map/               # NEW FEATURE
│   ├── screens/       # MapPlaceholderScreen
│   └── components/    # Map placeholder components
└── navigation/        # AppStack.tsx (to be modified)
```

---

## Step 3: Avatar Setup

### Test Avatar Component

After implementing `src/common/components/Avatar.tsx` (per data-model.md), test it:

```typescript
// Test in any screen (e.g., DomainsDashboardScreen)
import { Avatar } from '../../common/components/Avatar';

<Avatar seed="test@example.com" size={80} />
```

**Expected Behavior**:
- Renders a colorful, cartoon-style avatar
- Same seed always produces same avatar
- Renders in <150ms on first load
- Re-renders in <10ms (cached)

### Verify Avatar Rendering

```bash
# Run on iOS
npm run ios

# Run on Android
npm run android
```

**Visual Verification Checklist**:
- [ ] Avatar displays at top of dashboard
- [ ] Avatar is circular (60-80pt diameter)
- [ ] Avatar changes when seed changes
- [ ] Avatar loads in <2 seconds (SC-005)
- [ ] No console errors or warnings

---

## Step 4: Domain Colors Configuration

### Add Domain Color Map

Implement `src/domains/constants/domainColors.ts` (per data-model.md and research.md):

```typescript
export const DOMAIN_COLORS: Record<string, DomainColorScheme> = {
  chess: {
    primary: '#2C5E1A',
    border: '#1F4312',
    accent: '#4A9D2A',
    textContrast: 'light',
  },
  valorant: {
    primary: '#FA4454',
    border: '#C91F30',
    accent: '#FF6B7A',
    textContrast: 'light',
  },
  // ... more domains
};
```

### Test Color Lookup

```bash
# In Node REPL or test file
node
```

```javascript
const { getDomainColors } = require('./src/domains/constants/domainColors.ts');

// Test lookup
console.log(getDomainColors('chess'));
// Expected: { primary: '#2C5E1A', border: '#1F4312', ... }

console.log(getDomainColors('unknown-domain'));
// Expected: DEFAULT_DOMAIN_COLOR (fallback)
```

### Validate WCAG Contrast

Use WebAIM Contrast Checker: https://webaim.org/resources/contrastchecker/

**Validation Checklist**:
- [ ] Chess primary + white text: ≥4.5:1 (AA compliance)
- [ ] Valorant primary + white text: ≥4.5:1
- [ ] All defined colors meet AA requirements

---

## Step 5: Gesture Navigation Setup

### Update Navigation Stack

Modify `src/navigation/AppStack.tsx` with gesture configuration (per research.md):

```typescript
const FAST_TRANSITION_SPEC = {
  open: {
    animation: 'timing' as const,
    config: {
      duration: 250,           // <500ms target
      useNativeDriver: true,   // 60fps guarantee
    },
  },
  close: {
    animation: 'timing' as const,
    config: {
      duration: 250,
      useNativeDriver: true,
    },
  },
};
```

### Test Gesture Navigation

**Manual Testing Steps**:
1. Launch app and authenticate
2. Navigate to DomainsDashboard
3. Perform right-swipe gesture (50% screen width)
4. Verify navigation to Map screen
5. Perform left-swipe or back gesture
6. Verify return to Dashboard

**Performance Testing**:
```bash
# Enable performance monitor
# In development menu: Toggle Performance Monitor

# Verify:
# - Gesture response < 16ms (1 frame)
# - Transition duration ~250ms
# - 60fps throughout transition (no dropped frames)
```

---

## Step 6: Verify Integration

### Run Full Integration Test

```bash
# Clean build
npm run clean
npm install

# Run iOS
npm run ios

# Run Android
npm run android
```

### Integration Checklist

**Avatar Display (US1)**:
- [ ] Avatar appears at top of DomainsDashboard
- [ ] Avatar is personalized (based on user seed)
- [ ] Avatar loads in <2s (SC-005)
- [ ] Avatar is properly sized (60-80pt)

**Domain Colors (US2)**:
- [ ] Each domain card has unique color scheme
- [ ] Chess card shows green color/border
- [ ] Valorant card shows red color/border
- [ ] Colors are visually distinct
- [ ] Text is readable on all backgrounds (WCAG AA)

**Map Navigation (US3)**:
- [ ] Right-swipe from dashboard navigates to map
- [ ] Transition completes in <500ms (SC-004)
- [ ] Map placeholder displays "Coming Soon" message
- [ ] Left-swipe/back returns to dashboard
- [ ] No conflicts with vertical scrolling

**Performance**:
- [ ] Dashboard renders in <1s
- [ ] Domain card render <100ms per card
- [ ] Gestures respond in <100ms
- [ ] No jank or dropped frames (60fps)

---

## Step 7: Developer Testing

### Test with Mock Data

```bash
# Ensure mock auth is enabled in app.config.ts
# mockAuth: true

# Test with mock users:
# - test@example.com (Chess + Valorant domains)
# - user2@example.com (Different avatar seed)
```

### Visual Regression Testing

**Take Screenshots**:
1. Dashboard with avatar and colored domain cards
2. Map placeholder screen
3. Gesture transition (mid-swipe)

**Compare Against**:
- Spec requirements (spec.md)
- Design mockups (if available)
- WCAG contrast requirements

### Edge Case Testing

**Test Scenarios**:
- [ ] Single domain (color differentiation still visible)
- [ ] No domains (empty state, avatar still shows)
- [ ] Unknown domain (uses DEFAULT_DOMAIN_COLOR)
- [ ] Missing avatar seed (uses default seed)
- [ ] Slow network (avatar should still render from seed)
- [ ] Airplane mode (avatar works offline)

---

## Troubleshooting

### Avatar Not Rendering

**Issue**: Avatar component shows blank or error

**Solutions**:
```bash
# Verify DiceBear installation
npm list @dicebear/core @dicebear/big-smile

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Check react-native-svg
npm list react-native-svg  # Should be 15.12.1

# Rebuild native modules (iOS)
cd ios && pod install && cd ..

# Rebuild (Android)
cd android && ./gradlew clean && cd ..
```

### Domain Colors Not Applying

**Issue**: All cards have same color

**Solutions**:
```typescript
// Debug: Check domainKey value
console.log('Domain Key:', domain.domainKey);

// Verify color lookup
import { getDomainColors } from '../constants/domainColors';
console.log('Colors:', getDomainColors(domain.domainKey));

// Check StyleSheet application
console.log('Applied Style:', {
  borderLeftColor: colorScheme.border,
  backgroundColor: colorScheme.primary + '10'
});
```

### Gesture Navigation Not Working

**Issue**: Right-swipe doesn't navigate to map

**Solutions**:
```bash
# Verify gesture handler installation
npm list react-native-gesture-handler  # Should be 2.28.0

# Check gesture configuration
# In AppStack.tsx, verify:
# - gestureEnabled: true
# - gestureDirection: 'horizontal'
# - gestureResponseDistance: SCREEN_WIDTH * 0.5

# Test navigation programmatically
navigation.navigate('Map');  # Should work

# Check for conflicting gestures
# Disable ScrollView temporarily to test
```

### Performance Issues

**Issue**: Transitions are slow or janky

**Solutions**:
```typescript
// Verify native driver is enabled
config: {
  duration: 250,
  useNativeDriver: true,  // MUST be true
}

// Check for expensive renders
// Add to DomainCard:
console.log('Render time:', Date.now() - startTime);

// Profile with React DevTools
import { Profiler } from 'react';

<Profiler id="DomainsDashboard" onRender={onRender}>
  {/* ... */}
</Profiler>
```

---

## Development Workflow

### Recommended Implementation Order

1. **Avatar Component** (T001-T005 from tasks.md)
   - Implement `Avatar.tsx`
   - Test rendering
   - Integrate into dashboard header

2. **Domain Colors** (T006-T015)
   - Create `domainColors.ts`
   - Update `DomainCard.tsx`
   - Validate WCAG compliance
   - Test visual differentiation

3. **Map Placeholder** (T016-T023)
   - Create `MapPlaceholderScreen.tsx`
   - Add to navigation stack
   - Test screen display

4. **Gesture Navigation** (T024-T032)
   - Update `AppStack.tsx` gesture config
   - Test right-swipe navigation
   - Test back navigation
   - Verify no ScrollView conflicts

5. **Integration Testing** (T033-T040)
   - Run full integration tests
   - Verify all success criteria
   - Performance profiling
   - WCAG compliance validation

### Git Workflow

```bash
# Create feature branch (if not already)
git checkout -b 002-dashboard-visual-enhancements

# Commit by phase
git add src/common/components/Avatar.tsx
git commit -m "feat(avatar): implement DiceBear avatar component"

git add src/domains/constants/domainColors.ts src/domains/components/DomainCard.tsx
git commit -m "feat(domains): add unique color schemes for domain cards"

git add src/map/screens/MapPlaceholderScreen.tsx
git commit -m "feat(map): add MVP map placeholder screen"

git add src/navigation/AppStack.tsx
git commit -m "feat(navigation): configure gesture navigation for map"

# Final commit
git add .
git commit -m "feat(002): complete dashboard visual enhancements

- Add bitmoji-style avatar to dashboard header
- Implement unique domain color schemes (WCAG AA compliant)
- Add map placeholder with right-swipe gesture navigation
- Performance: <2s avatar load, <500ms transitions, 60fps gestures

Closes #002"
```

---

## Next Steps

After completing implementation:

1. **Run Tests** (when tasks.md test tasks are implemented):
   ```bash
   npm run test
   npm run test:integration
   ```

2. **Performance Profiling**:
   ```bash
   npm run profile
   ```

3. **Create Pull Request**:
   - Use `/speckit.pr` command or manual PR creation
   - Reference spec.md for PR description
   - Include screenshots of avatar, domain colors, and map placeholder

4. **Code Review Checklist**:
   - [ ] TypeScript strict mode compliance
   - [ ] WCAG AA contrast validation
   - [ ] Performance metrics met (SC-004, SC-005)
   - [ ] No new security vulnerabilities
   - [ ] Constitution principles followed

---

## Reference

**Key Files**:
- Specification: `specs/002-dashboard-visual-enhancements/spec.md`
- Implementation Plan: `specs/002-dashboard-visual-enhancements/plan.md`
- Research Findings: `specs/002-dashboard-visual-enhancements/research.md`
- Data Model: `specs/002-dashboard-visual-enhancements/data-model.md`
- API Contracts: `specs/002-dashboard-visual-enhancements/contracts/visual-enhancements.md`
- Tasks Breakdown: `specs/002-dashboard-visual-enhancements/tasks.md` (generated by `/speckit.tasks`)

**External Resources**:
- DiceBear Documentation: https://dicebear.com/
- WebAIM Contrast Checker: https://webaim.org/resources/contrastchecker/
- React Navigation Gestures: https://reactnavigation.org/docs/stack-navigator/#gestures
- WCAG 2.1 Guidelines: https://www.w3.org/WAI/WCAG21/quickref/

**Support**:
- Constitution: `/home/nathan/Development/AliasCoreV3Web/.specify/constitution.md`
- Project README: `/home/nathan/Development/AliasCoreV3Web/README.md`
