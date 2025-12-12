# Tasks: Dashboard Visual Enhancements

**Input**: Design documents from `/specs/002-dashboard-visual-enhancements/`
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, contracts/ ✅

**Tests**: Tests are NOT explicitly requested in this feature specification. Implementation tasks only.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and dependencies for visual enhancements

- [X] T001 Install DiceBear avatar dependencies (@dicebear/core @dicebear/big-smile)
- [X] T002 [P] Create src/common/components/ directory if not exists
- [X] T003 [P] Create src/domains/constants/ directory if not exists
- [X] T004 [P] Create src/map/screens/ directory
- [X] T005 [P] Create src/map/components/ directory

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core TypeScript types and color configuration that all user stories depend on

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T006 Create DomainColorScheme interface in src/domains/constants/domainColors.ts
- [X] T007 Create domain color map (DOMAIN_COLORS) with all gaming domains (chess, valorant, speedrunning, league, cs) in src/domains/constants/domainColors.ts
- [X] T008 [P] Create getDomainColors function in src/domains/constants/domainColors.ts
- [X] T009 [P] Create DEFAULT_DOMAIN_COLOR constant in src/domains/constants/domainColors.ts
- [X] T010 Validate all domain colors meet WCAG AA contrast requirements (4.5:1 minimum)

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Avatar Display on Dashboard (Priority: P1) 🎯 MVP

**Goal**: Display a bitmoji-style avatar at the top of the domains dashboard for personalization

**Independent Test**: Authenticate as a user and verify the avatar appears at the top of the domains dashboard. Avatar should be personalized based on user email/ID seed.

### Implementation for User Story 1

- [X] T011 [P] [US1] Create Avatar component with AvatarProps interface in src/common/components/Avatar.tsx
- [X] T012 [P] [US1] Implement DiceBear avatar generation (bigSmile style) with seed parameter in src/common/components/Avatar.tsx
- [X] T013 [P] [US1] Add SVG rendering using react-native-svg in src/common/components/Avatar.tsx
- [X] T014 [P] [US1] Add size prop support (default 100pt, recommended 60-120pt) in src/common/components/Avatar.tsx
- [X] T015 [P] [US1] Add style prop for additional container styling in src/common/components/Avatar.tsx
- [X] T016 [US1] Import Avatar component into DomainsDashboardScreen in src/domains/screens/DomainsDashboardScreen.tsx
- [X] T017 [US1] Add avatar container View at top of DomainsDashboardScreen in src/domains/screens/DomainsDashboardScreen.tsx
- [X] T018 [US1] Get user seed from auth context (user.email || user.id || 'default') in src/domains/screens/DomainsDashboardScreen.tsx
- [X] T019 [US1] Render Avatar component with seed and size=80 in src/domains/screens/DomainsDashboardScreen.tsx
- [X] T020 [US1] Add proper spacing and positioning styles for avatar container in src/domains/screens/DomainsDashboardScreen.tsx

**Checkpoint**: At this point, User Story 1 should be fully functional - avatar displays at top of dashboard, personalized per user, renders in <2s

---

## Phase 4: User Story 2 - Domain-Specific Visual Styling (Priority: P1)

**Goal**: Each gaming domain card has unique color scheme and border styling for visual differentiation

**Independent Test**: View domains dashboard with multiple domain cards and verify each has distinct colors and borders (Chess=green, Valorant=red, etc.)

### Implementation for User Story 2

- [X] T021 [P] [US2] Import getDomainColors function into DomainCard component in src/domains/components/DomainCard.tsx
- [X] T022 [P] [US2] Add colorScheme variable using getDomainColors(domain.domainKey) in src/domains/components/DomainCard.tsx
- [X] T023 [US2] Apply border color styling (borderLeftWidth: 4, borderLeftColor: colorScheme.border) in src/domains/components/DomainCard.tsx
- [X] T024 [US2] Apply primary color background tint (backgroundColor: colorScheme.primary + '10') in src/domains/components/DomainCard.tsx
- [X] T025 [US2] Ensure text color matches textContrast recommendation (light vs dark) in src/domains/components/DomainCard.tsx
- [X] T026 [US2] Test with Chess domain (green #2C5E1A primary, #1F4312 border) renders correctly in src/domains/components/DomainCard.tsx
- [X] T027 [US2] Test with Valorant domain (red #FA4454 primary, #C91F30 border) renders correctly in src/domains/components/DomainCard.tsx
- [X] T028 [US2] Test fallback to DEFAULT_DOMAIN_COLOR for unknown domain keys in src/domains/components/DomainCard.tsx
- [X] T029 [US2] Verify visual differentiation meets WCAG AA contrast on all backgrounds in src/domains/components/DomainCard.tsx

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently - avatar displays and domain cards have unique colors

---

## Phase 5: User Story 3 - Right-Swipe Map Navigation (Priority: P2)

**Goal**: Users can swipe right on domains dashboard to reveal map placeholder with smooth gesture navigation

**Independent Test**: Perform right-swipe gesture on dashboard and verify navigation to map screen with <500ms transition

### Implementation for User Story 3

- [X] T030 [P] [US3] Create MapPlaceholderState interface in src/map/screens/MapPlaceholderScreen.tsx
- [X] T031 [P] [US3] Create MapPlaceholderScreen component with placeholder state in src/map/screens/MapPlaceholderScreen.tsx
- [X] T032 [P] [US3] Add map background View with gray background color in src/map/screens/MapPlaceholderScreen.tsx
- [X] T033 [P] [US3] Add center location pin indicator (40x40pt circle, primary color, white border) in src/map/screens/MapPlaceholderScreen.tsx
- [X] T034 [P] [US3] Add pulsing animation to location pin in src/map/screens/MapPlaceholderScreen.tsx
- [X] T035 [P] [US3] Add subtle coordinate reference lines (horizontal/vertical) in src/map/screens/MapPlaceholderScreen.tsx
- [X] T036 [P] [US3] Create info Card overlay at bottom (40% of screen) in src/map/screens/MapPlaceholderScreen.tsx
- [X] T037 [P] [US3] Add "COMING SOON" badge in info card in src/map/screens/MapPlaceholderScreen.tsx
- [X] T038 [P] [US3] Add feature list (tournament discovery, player connections, event schedules) in src/map/screens/MapPlaceholderScreen.tsx
- [X] T039 [US3] Import MapPlaceholderScreen into AppStack in src/navigation/AppStack.tsx
- [X] T040 [US3] Add Map screen to Stack.Navigator in src/navigation/AppStack.tsx
- [X] T041 [US3] Configure FAST_TRANSITION_SPEC (250ms duration, useNativeDriver: true) in src/navigation/AppStack.tsx
- [X] T042 [US3] Configure DomainsDashboard screen gesture options (gestureEnabled: true, gestureDirection: 'horizontal', gestureResponseDistance: SCREEN_WIDTH * 0.5) in src/navigation/AppStack.tsx
- [X] T043 [US3] Set gestureVelocityImpact to 0.4 for intentional swipe detection in src/navigation/AppStack.tsx
- [X] T044 [US3] Configure Map screen gesture options for back navigation in src/navigation/AppStack.tsx
- [X] T045 [US3] Apply CardStyleInterpolators.forHorizontalIOS to both screens in src/navigation/AppStack.tsx
- [X] T046 [US3] Test right-swipe gesture from dashboard navigates to map in <500ms in src/navigation/AppStack.tsx
- [X] T047 [US3] Test left-swipe or back gesture returns from map to dashboard in src/navigation/AppStack.tsx
- [X] T048 [US3] Verify no conflicts with vertical ScrollView on dashboard in src/navigation/AppStack.tsx
- [X] T049 [US3] Verify 60fps animation performance (native driver enabled) in src/navigation/AppStack.tsx

**Checkpoint**: All user stories should now be independently functional - avatar, domain colors, and map navigation all work

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories and final validation

- [X] T050 [P] Verify avatar load time <2s (SC-005 requirement)
- [X] T051 [P] Verify gesture transition <500ms (SC-004 requirement)
- [X] T052 [P] Verify domain card render <100ms per card
- [X] T053 [P] Verify all colors meet WCAG AA contrast (SC-006 requirement)
- [X] T054 [P] Test avatar personalization (same seed produces same avatar)
- [X] T055 [P] Test visual domain differentiation (can distinguish without reading labels)
- [X] T056 [P] Test gesture navigation success (right-swipe to map works first try)
- [X] T057 Test with single domain (edge case - color still visible)
- [X] T058 Test with unknown domain (fallback color applies)
- [X] T059 Test with missing avatar seed (default seed used)
- [X] T060 Test offline mode (avatar still renders from seed)
- [X] T061 Run npm run type-check to verify TypeScript compilation
- [X] T062 Run npm run lint to verify code style compliance
- [X] T063 Verify quickstart.md instructions are accurate and complete
- [X] T064 Clean build test (npm run clean && npm install && npm run ios/android)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-5)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P1 → P2)
- **Polish (Phase 6)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories (independent color system)
- **User Story 3 (P2)**: Can start after Foundational (Phase 2) - No dependencies on other stories (independent navigation)

### Within Each User Story

**User Story 1 (Avatar)**:
- Tasks T011-T015 can run in parallel (all in Avatar.tsx)
- Tasks T016-T020 are sequential (dashboard integration)

**User Story 2 (Domain Colors)**:
- Tasks T021-T025 can run in parallel (all DomainCard.tsx modifications)
- Tasks T026-T029 are testing/validation

**User Story 3 (Map Navigation)**:
- Tasks T030-T038 can run in parallel (all MapPlaceholderScreen.tsx)
- Tasks T039-T049 are sequential (navigation configuration and testing)

### Parallel Opportunities

- All Setup tasks (T002-T005) marked [P] can run in parallel
- All Foundational tasks (T008-T009) marked [P] can run in parallel
- Once Foundational phase completes, all THREE user stories can start in parallel (US1, US2, US3 are fully independent)
- Within US1: T011-T015 in parallel
- Within US2: T021-T025 in parallel
- Within US3: T030-T038 in parallel
- Polish tasks T050-T056 can run in parallel

---

## Parallel Example: User Story 1

```bash
# Launch all Avatar component implementation tasks together:
Task: "Create Avatar component with AvatarProps interface in src/common/components/Avatar.tsx"
Task: "Implement DiceBear avatar generation (bigSmile style) with seed parameter in src/common/components/Avatar.tsx"
Task: "Add SVG rendering using react-native-svg in src/common/components/Avatar.tsx"
Task: "Add size prop support (default 100pt, recommended 60-120pt) in src/common/components/Avatar.tsx"
Task: "Add style prop for additional container styling in src/common/components/Avatar.tsx"
```

## Parallel Example: User Story 2

```bash
# Launch all DomainCard color styling tasks together:
Task: "Import getDomainColors function into DomainCard component in src/domains/components/DomainCard.tsx"
Task: "Add colorScheme variable using getDomainColors(domain.domainKey) in src/domains/components/DomainCard.tsx"
Task: "Apply border color styling (borderLeftWidth: 4, borderLeftColor: colorScheme.border) in src/domains/components/DomainCard.tsx"
Task: "Apply primary color background tint (backgroundColor: colorScheme.primary + '10') in src/domains/components/DomainCard.tsx"
Task: "Ensure text color matches textContrast recommendation (light vs dark) in src/domains/components/DomainCard.tsx"
```

## Parallel Example: User Story 3

```bash
# Launch all MapPlaceholderScreen UI tasks together:
Task: "Create MapPlaceholderState interface in src/map/screens/MapPlaceholderScreen.tsx"
Task: "Create MapPlaceholderScreen component with placeholder state in src/map/screens/MapPlaceholderScreen.tsx"
Task: "Add map background View with gray background color in src/map/screens/MapPlaceholderScreen.tsx"
Task: "Add center location pin indicator (40x40pt circle, primary color, white border) in src/map/screens/MapPlaceholderScreen.tsx"
Task: "Add pulsing animation to location pin in src/map/screens/MapPlaceholderScreen.tsx"
Task: "Add subtle coordinate reference lines (horizontal/vertical) in src/map/screens/MapPlaceholderScreen.tsx"
Task: "Create info Card overlay at bottom (40% of screen) in src/map/screens/MapPlaceholderScreen.tsx"
Task: "Add 'COMING SOON' badge in info card in src/map/screens/MapPlaceholderScreen.tsx"
Task: "Add feature list (tournament discovery, player connections, event schedules) in src/map/screens/MapPlaceholderScreen.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 + User Story 2 Only)

1. Complete Phase 1: Setup (T001-T005)
2. Complete Phase 2: Foundational (T006-T010) - CRITICAL, blocks all stories
3. Complete Phase 3: User Story 1 (T011-T020) - Avatar display
4. Complete Phase 4: User Story 2 (T021-T029) - Domain colors
5. **STOP and VALIDATE**: Test US1 and US2 independently (avatar + colored domains)
6. Deploy/demo if ready

### Full Feature Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Avatar works ✅
3. Add User Story 2 → Test independently → Domain colors work ✅
4. Add User Story 3 → Test independently → Map navigation works ✅
5. Complete Polish phase → All success criteria met ✅
6. Deploy complete feature

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup (Phase 1) + Foundational (Phase 2) together
2. Once Foundational is done:
   - Developer A: User Story 1 (Avatar) - T011-T020
   - Developer B: User Story 2 (Domain Colors) - T021-T029
   - Developer C: User Story 3 (Map Navigation) - T030-T049
3. Stories complete and integrate independently (no conflicts)
4. Team reconvenes for Polish phase together

---

## Notes

- [P] tasks = different files, no dependencies - safe to run in parallel
- [Story] label maps task to specific user story for traceability (US1, US2, US3)
- Each user story is independently completable and testable
- All three user stories can be developed in parallel after Foundational phase
- Commit after each task or logical group (e.g., after completing a component)
- Stop at any checkpoint to validate story independently
- Total estimated tasks: 64
- Total estimated implementation time: 4-6 hours
- Bundle impact: +40KB (DiceBear avatars only)
- Performance targets: <2s avatar load, <500ms transitions, <100ms card render, 60fps animations
