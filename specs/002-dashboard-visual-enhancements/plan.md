# Implementation Plan: Dashboard Visual Enhancements

**Branch**: `002-dashboard-visual-enhancements` | **Date**: 2025-12-11 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/002-dashboard-visual-enhancements/spec.md`

## Summary

This feature enhances the domains dashboard with three key visual improvements: (1) a bitmoji-style avatar display at the top of the screen for personalization, (2) unique color schemes and borders for each gaming domain card to improve visual differentiation, and (3) right-swipe gesture navigation to access a map screen placeholder. The technical approach leverages React Native's existing styling system for domain colors, adds an avatar component to the dashboard header, and implements custom gesture recognizers for the map navigation using React Navigation's gesture configuration.

## Technical Context

**Language/Version**: TypeScript 5.9.2, React Native 0.81.5, React 19.1.0, Expo SDK ~54.0.0
**Primary Dependencies**: React Navigation 6.1.18 (gesture handling), @react-navigation/stack 6.4.1, expo-constants (config), react-native-svg (potential avatar rendering)
**Storage**: AsyncStorage for domain color mappings (minimal local cache)
**Testing**: Jest 29+ with @testing-library/react-native for component testing
**Target Platform**: Cross-platform mobile (iOS 15+, Android 8+) via Expo
**Project Type**: Mobile application (feature-first React Native structure)
**Performance Goals**: Avatar load <2s, gesture navigation <500ms transition, domain card render <100ms per card
**Constraints**: WCAG AA color contrast for accessibility, 44x44pt minimum touch targets, smooth 60fps gesture animations
**Scale/Scope**: 3 new/modified screens (DomainsDashboard with avatar, Map placeholder, enhanced DomainCard component), ~5-8 new components

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### I. Snapchat-Inspired UX ✅
- **Compliance**: Full-screen dashboard with minimal chrome, gesture-driven map navigation via right-swipe, fast transitions (<500ms requirement), visually distinct domain cards
- **Verification**: User stories explicitly require gesture navigation, visual differentiation, and responsive transitions matching Snapchat UX patterns
- **Accessibility**: Spec requires WCAG AA contrast (SC-006), 60-80pt avatar sizing for readability, fallback navigation for gesture conflicts

### II. Feature-First Architecture ✅
- **Compliance**: Changes are scoped to existing features (`domains/` for avatar and colors, new `map/` placeholder screen) following established structure
- **Structure**: Will add components to `domains/components/`, update `domains/screens/DomainsDashboardScreen.tsx`, create `map/screens/MapPlaceholderScreen.tsx`
- **Isolation**: Avatar and domain colors are self-contained visual enhancements, map gesture navigation is cleanly separated

### III. Type Safety & Modern React Native ✅
- **Compliance**: All code uses TypeScript strict mode, functional components with hooks, typed navigation params for gesture navigation
- **Types**: Will define `DomainColorScheme`, `AvatarProps`, `MapScreenParams` interfaces
- **Patterns**: useState for domain colors, custom hooks for avatar logic, React Navigation typed stack for gesture config

### IV. Critical Path Testing ⚠️
- **Testing Plan**: Integration tests for avatar display on dashboard, domain card visual differentiation, gesture navigation to map
- **Priority**: Focus on critical flows (dashboard load with avatar, multiple domain cards with distinct colors, gesture recognition)
- **Deferred**: Snapshot tests for avatar styles, extensive gesture conflict testing (edge case), color theme permutations

### V. Mobile-First Performance ✅
- **Performance**: Avatar loads asynchronously (<2s target), domain colors applied via StyleSheet for native rendering, gesture navigation uses native driver
- **Optimization**: Lazy load avatar, cache domain color mappings, minimize re-renders on color application
- **Targets Met**: SC-004 (transition <500ms), SC-005 (avatar <2s), gesture response <100ms via native animations

### VI. Security & Privacy by Default ✅
- **No Sensitive Data**: Avatar is display-only (no upload/storage in MVP), domain colors are public styling data, map screen is placeholder (no location data)
- **Compliance**: No auth token exposure, no private data in logs, avatar placeholder uses generic assets
- **Scope**: All three user stories are purely visual enhancements with no security surface

### VII. Explicit Over Implicit ⚠️
- **Clarifications Needed in Research**:
  1. Avatar asset source - use SVG library (react-native-svg-avatars) vs static PNG placeholder vs custom illustrations?
  2. Domain color assignment strategy - hardcoded color map vs backend-defined vs algorithm-generated from domain name hash?
  3. Map placeholder UI - basic View with text vs react-native-maps with disabled interactions vs custom map illustration?
- **Trade-offs to Document**: Avatar vs user profile photo, color customization deferral, gesture conflict resolution priority

**Overall Status**: ✅ **PASS** - All core principles met. Two areas require Phase 0 research (avatar asset strategy, domain color source, map placeholder UI). No constitutional violations requiring justification.

## Project Structure

### Documentation (this feature)

```text
specs/002-dashboard-visual-enhancements/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command) - minimal/none for visual enhancements
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
src/
├── auth/              # Existing - no changes
├── domains/           # MODIFIED for avatar and domain colors
│   ├── screens/
│   │   └── DomainsDashboardScreen.tsx    # ADD avatar header, UPDATE with colors
│   ├── components/
│   │   ├── DomainCard.tsx                # UPDATE with dynamic color borders
│   │   ├── DashboardAvatar.tsx           # NEW component for bitmoji-style avatar
│   │   └── DomainColorProvider.tsx       # NEW context/hook for color assignment
│   ├── services/
│   │   └── domainColorsService.ts        # NEW service for color mappings
│   └── types.ts                           # ADD DomainColorScheme interface
├── map/               # NEW feature for placeholder screen
│   ├── screens/
│   │   └── MapPlaceholderScreen.tsx      # NEW blank map placeholder
│   └── components/
│       └── MapPlaceholder.tsx            # NEW component for MVP map UI
├── common/            # Existing - minimal changes for shared avatar assets
│   ├── components/
│   │   └── Avatar.tsx                    # NEW generic avatar component (reusable)
│   └── assets/
│       └── avatars/                      # NEW folder for avatar placeholder images
└── navigation/        # MODIFIED for gesture navigation
    └── AppStack.tsx                      # UPDATE gesture config for map navigation

tests/
├── integration/
│   └── domains/
│       ├── dashboard-avatar.test.tsx     # NEW test for avatar display
│       └── domain-colors.test.tsx        # NEW test for color differentiation
└── unit/
    └── services/
        └── domainColorsService.test.ts   # NEW test for color assignment logic
```

**Structure Decision**: Using existing feature-first mobile structure (`src/domains/`, `src/map/`, `src/common/`). Avatar and domain colors fit naturally in `domains/` feature, map placeholder is new `map/` feature, gesture navigation config updates existing `navigation/AppStack.tsx`. Follows Constitution Principle II (Feature-First Architecture).

## Complexity Tracking

No constitutional violations requiring justification. All enhancements align with existing architecture and principles.

## Phase 0: Research

*Execute research agents to resolve NEEDS CLARIFICATION items and gather best practices.*

### Research Tasks

1. **Avatar Asset Strategy**
   - **Question**: Use SVG library (react-native-svg-avatars) vs static PNG placeholder vs custom illustrations for bitmoji-style avatar?
   - **Research**: Evaluate libraries (react-native-svg-avatars, react-native-boring-avatars), compare bundle size, customization flexibility, and iOS/Android compatibility
   - **Decision Criteria**: MVP speed (prefer ready-made), bundle size (<100KB ideal), bitmoji aesthetic match
   - **Output**: Recommended avatar solution with example code and asset setup

2. **Domain Color Assignment Strategy**
   - **Question**: Hardcoded color map vs backend-defined vs algorithm-generated from domain name hash for domain-specific colors?
   - **Research**: Evaluate approaches (static TypeScript map, color hash function, backend API endpoint), consider extensibility for new domains
   - **Decision Criteria**: MVP simplicity (hardcoded acceptable), extensibility (easy to add new domains), performance (no network calls for colors)
   - **Output**: Color assignment implementation pattern with mapping example (Chess=blue, Valorant=red, etc.)

3. **Map Placeholder UI Design**
   - **Question**: Basic View with text vs react-native-maps library with disabled interactions vs custom map illustration?
   - **Research**: Assess options for "blank map" MVP (simple View, react-native-maps setup for future, SVG map mockup)
   - **Decision Criteria**: Future-readiness (easy upgrade to real map), visual polish (looks intentional, not broken), MVP effort (minimize complexity)
   - **Output**: Map placeholder component design with upgrade path notes

4. **Gesture Navigation Best Practices**
   - **Research**: React Navigation gesture configuration for right-swipe from dashboard (screen-level pan responder vs navigation gesture config)
   - **Best Practices**: Gesture threshold (50% swipe distance), conflict resolution with ScrollView, animation duration for <500ms target
   - **Output**: Gesture configuration code snippet and conflict avoidance guidelines

**Deliverable**: `research.md` with decisions for all 4 research areas, code snippets, and rationale.

## Phase 1: Design & Contracts

*Prerequisites: research.md complete*

### Data Model

**Entities to Define in data-model.md:**

1. **DomainColorScheme**
   - `domainKey`: string (e.g., 'chess', 'valorant')
   - `primaryColor`: string (hex color for card background tint)
   - `borderColor`: string (hex color for card border)
   - `accentColor`: string (optional, for highlights/badges)

2. **Avatar** (display model, not stored)
   - `source`: uri string or local asset (placeholder)
   - `style`: 'bitmoji' | 'placeholder' (for future extension)
   - `size`: number (60-80pt as per spec assumption)

3. **MapPlaceholder** (screen state model)
   - `displayMessage`: string ("Map coming soon" or similar)
   - `showControls`: boolean (if using react-native-maps in disabled mode)

**Relationships**: DomainColorScheme maps 1:1 to domainKey, Avatar associates 1:1 with User (display only, no DB entity).

### API Contracts

**No new backend contracts required** - This feature is purely frontend visual enhancements. Domain colors will be client-side, avatar is placeholder (no upload), map is blank screen.

**Contracts directory**: Create `contracts/visual-enhancements.md` documenting:
- Domain color mappings (static map on frontend)
- Avatar placeholder assets (local files, no API)
- Map screen (no API, placeholder only)

Note: If avatar upload is added post-MVP, will need `PUT /api/users/avatar` endpoint. Deferred to future spec.

### Quickstart Updates

**Add to quickstart.md:**
1. New dependencies: `react-native-svg-avatars` (if chosen in research) or equivalent
2. Avatar asset setup: Copy placeholder images to `src/common/assets/avatars/`
3. Domain colors configuration: Update `domainColorsService.ts` with new domain color mappings
4. Gesture navigation: Verify `react-navigation` gesture config for map screen
5. Testing: Run integration tests for avatar display and domain colors

### Agent Context Update

Run `.specify/scripts/bash/update-agent-context.sh` to add:
- react-native-svg-avatars (or chosen avatar library) to dependencies
- Domain color service pattern to code style notes
- Gesture navigation configuration to React Navigation patterns

**Deliverable**: `data-model.md`, `contracts/visual-enhancements.md`, updated `quickstart.md`, agent context synchronized.

## Phase 2: Tasks (NOT GENERATED BY THIS COMMAND)

Phase 2 (`/speckit.tasks`) will break down implementation into concrete tasks following Constitution Principle IV (Critical Path Testing). Expected task groups:

1. **Avatar Display** (US1 - P1): Avatar component, dashboard header integration, placeholder asset setup, tests
2. **Domain Colors** (US2 - P1): Color service, DomainCard styling updates, color mappings, visual regression tests
3. **Map Navigation** (US3 - P2): Map placeholder screen, gesture config in AppStack, navigation integration, gesture tests

Tasks will follow existing project patterns from `specs/001-aliascore-mvp/tasks.md` structure.

---

**Plan Status**: ✅ Phase 0 & Phase 1 Complete - Ready for Phase 2 (/speckit.tasks)

**Completed Deliverables**:
- ✅ Phase 0: research.md (4 research areas resolved)
- ✅ Phase 1: data-model.md (3 entities defined)
- ✅ Phase 1: contracts/visual-enhancements.md (zero API changes confirmed)
- ✅ Phase 1: quickstart.md (developer setup guide)
- ✅ Phase 1: Agent context updated (CLAUDE.md synchronized)

**Next**: Run `/speckit.tasks` to generate tasks.md for implementation.
