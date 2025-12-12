# Feature Specification: AliasCore Mobile - Universal Gaming Identity Platform

**Feature Branch**: `001-aliascore-mvp`
**Created**: 2025-11-29
**Status**: Draft
**Input**: User description: "Create a comprehensive product specification for a mobile application called 'AliasCore' - a universal gaming identity platform that aggregates player achievements, ratings, and profiles across multiple game domains (chess, esports, speedrunning, etc.). Features include authentication, domain dashboard, domain profiles with sharing (QR/NFC), and local events map. Snapchat-inspired UX: gesture-driven, full-screen, minimal chrome, fast transitions."

## Product Overview

AliasCore is a mobile application that serves as a player's universal "gaming identity card." It aggregates achievements, ratings, and profiles across multiple game-related domains (e.g., chess, esports titles, speedrunning) into a single, shareable digital presence. Users can view their domain-specific profiles, share them instantly via QR codes or NFC, and discover local events for each gaming domain they participate in.

The experience is inspired by Snapchat: gesture-driven navigation, full-screen immersive views, minimal visible UI chrome, fast transitions, and delightful micro-interactions that make the app feel contemporary and fluid.

## Clarifications

### Session 2025-11-29

- Q: When displaying events on the map, what geographic radius should be used to define "nearby" events? → A: 20 miles / 30 km radius
- Q: What is the maximum number of gaming domains a single user can have linked to their profile? → A: 10 domains maximum
- Q: What level of logging should the app implement for production debugging and monitoring? → A: Errors + critical user actions (log errors plus auth events, profile views, shares)
- Q: What constraints should apply to user display names entered during onboarding? → A: 3-30 characters, alphanumeric + spaces/basic punctuation (. - ' )
- Q: When the events map loads, how many event pins should be displayed if more than the limit exist within the 20-mile radius? → A: 25 events maximum

### Session 2025-12-11

- Q: Should mock authentication persist across app restarts, or reset to unauthenticated state each time? → A: Mock auth persists across app restarts (behaves like real auth)
- Q: When using mock auth, should the app generate multiple mock domain profiles, or start with an empty state? → A: Generate 2-3 mock domain profiles (e.g., Chess, Valorant) with realistic stats
- Q: Should there be a visual indicator in the UI when running in mock mode to distinguish from production? → A: No visual indicator (mock mode is transparent to user)
- Q: Should mock event data be generated for the events map, or should it show empty state? → A: Generate 5-10 mock events with realistic data for each domain
- Q: In mock mode, should users go through onboarding flow or skip directly to dashboard? → A: Skip onboarding, go directly to dashboard with pre-set mock profile

## User Scenarios & Testing *(mandatory)*

### User Story 1 - First-Time User Onboarding (Priority: P1)

A new player downloads AliasCore to create their universal gaming identity. They launch the app for the first time, see the value proposition, sign in with their Google account, set up their profile (display name and avatar), and land on their dashboard ready to view their gaming domains.

**Why this priority**: Without authentication and onboarding, no other features can function. This is the gateway to the entire app experience.

**Independent Test**: Can be fully tested by installing the app fresh, completing Google sign-in, setting a display name and avatar, and verifying arrival at the dashboard. Delivers immediate value by creating the user's account and profile.

**Acceptance Scenarios**:

1. **Given** the app is launched for the first time, **When** the user views the splash screen, **Then** they see AliasCore branding and a clear value proposition (e.g., "Your Universal Gaming Identity")
2. **Given** the user proceeds from splash, **When** they arrive at the welcome screen, **Then** they see a "Sign in with Google" button
3. **Given** the user taps "Sign in with Google", **When** authentication completes successfully, **Then** they are recognized as authenticated and proceed to onboarding
4. **Given** a new user completes authentication, **When** they enter onboarding, **Then** they are prompted to set a display name and choose/upload an avatar
5. **Given** the user completes onboarding, **When** they tap continue/done, **Then** they land on the Domains Dashboard
6. **Given** a returning user launches the app, **When** they are already authenticated, **Then** they bypass splash/welcome/onboarding and land directly on the Domains Dashboard

---

### User Story 2 - View Gaming Domain Profiles (Priority: P1)

An authenticated user wants to view their gaming achievements and stats for a specific domain (e.g., Chess). They navigate to their Domains Dashboard, see cards for each domain they participate in, tap the Chess card, and view a detailed "namecard-style" profile showing their peak rating, current rating, platform username, and other stats.

**Why this priority**: This is the core value proposition—viewing aggregated gaming profiles. Without this, the app has no primary content.

**Independent Test**: Can be fully tested by logging in, viewing the dashboard with at least one domain card (e.g., Chess), tapping it, and verifying the domain profile displays accurate stats. Delivers value by showing the user their gaming identity for that domain.

**Acceptance Scenarios**:

1. **Given** the user is on the Domains Dashboard, **When** they view the screen, **Then** they see visually distinct cards for each domain they participate in (e.g., Chess)
2. **Given** a domain card is displayed, **When** the user views it, **Then** it shows the domain name, icon, and 1–2 highlight stats (e.g., peak rating, primary platform)
3. **Given** the user taps a domain card, **When** the transition completes, **Then** they see a full-screen domain profile screen
4. **Given** the domain profile screen is displayed, **When** the user views it, **Then** they see a namecard-style plate with: display name, primary platform and username, peak rating, current rating, and supporting stats (games played, rank tier)
5. **Given** the user is on a domain profile, **When** they perform a dismiss gesture (swipe down or back button), **Then** they return to the Domains Dashboard

---

### User Story 3 - Share Domain Profile via QR Code (Priority: P2)

A user at a chess tournament wants to share their Chess domain profile with another player. They open their Chess profile, tap the share button, select QR code, and present a full-screen QR code that the other player scans to view the public profile page.

**Why this priority**: Sharing is a key differentiator and social feature. It enables AliasCore to become a social tool for gamers to connect and compare profiles.

**Independent Test**: Can be fully tested by opening a domain profile, tapping share, generating a QR code, and verifying that scanning it (or opening the URL manually) leads to a public profile page showing the correct domain stats. Delivers value by enabling instant profile sharing.

**Acceptance Scenarios**:

1. **Given** the user is on a domain profile screen, **When** they tap the share button, **Then** they see sharing options (QR code, NFC)
2. **Given** the user selects QR code, **When** the share sheet appears, **Then** it clearly communicates what is being shared (domain name, username, stats summary)
3. **Given** the user confirms QR share, **When** the QR code is generated, **Then** they see a full-screen scannable QR code
4. **Given** another person scans the QR code, **When** they open the link, **Then** they are directed to a public web page showing the shared domain profile (name, platform, stats)
5. **Given** the user is viewing the QR code, **When** they perform a dismiss gesture, **Then** they return to the domain profile screen

---

### User Story 4 - Discover Local Events for a Domain (Priority: P2)

A chess player wants to find local chess tournaments. They open their Chess domain profile, swipe right to reveal the events map, see pins for nearby events, tap a pin to view event details (name, date, venue, description), and can navigate to the event link or save it for later.

**Why this priority**: Events discovery adds community value and helps users engage with their gaming domains in the real world. It's a secondary feature but enhances the core profile experience.

**Independent Test**: Can be fully tested by opening a domain profile, swiping right to open the map, verifying that event pins appear for the selected domain, and tapping a pin to view event details. Delivers value by connecting users to local gaming communities.

**Acceptance Scenarios**:

1. **Given** the user is on a domain profile screen, **When** they swipe right, **Then** the events map for that domain opens
2. **Given** the events map is displayed, **When** the user views it, **Then** they see a map with pins for nearby events relevant to the selected domain
3. **Given** the user has granted location permission, **When** the map loads, **Then** events are filtered and displayed based on the user's current location
4. **Given** an event pin is visible, **When** the user taps it, **Then** they see event details (name, date/time, venue, description, link)
5. **Given** the user is viewing the events map, **When** they swipe left or perform a dismiss gesture, **Then** they return to the domain profile screen

---

### User Story 5 - Share Domain Profile via NFC (Priority: P3)

A user wants to share their profile by tapping their phone against another user's phone using NFC. They open their domain profile, tap the share button, select NFC, and hold their phone close to another device to transfer the profile link.

**Why this priority**: NFC sharing is a premium, delightful feature but not essential for MVP. It can be stubbed or implemented post-launch.

**Independent Test**: Can be fully tested by opening a domain profile, selecting NFC share, and verifying that the NFC payload is written/presented correctly (or stubbed with a "Coming Soon" message). Delivers value by enabling contactless profile sharing.

**Acceptance Scenarios**:

1. **Given** the user is on a domain profile screen, **When** they tap the share button and select NFC, **Then** the app prepares to write/present NFC data
2. **Given** NFC is selected, **When** the user holds their phone near another NFC-enabled device, **Then** the domain profile link is transferred
3. **Given** the receiving device reads the NFC data, **When** they open the link, **Then** they see the public profile page (same as QR code flow)
4. **Given** NFC is not implemented in MVP, **When** the user selects NFC, **Then** they see a "Coming Soon" or stub message indicating future availability

---

### Edge Cases

- **What happens when a user has no domains on their dashboard?**
  Display an empty state with a message like "No gaming domains yet. Connect your profiles to get started" and a call-to-action to add domains (future feature).

- **What happens when a user denies location permission for the events map?**
  Display the map without user location, showing events in a default area (within 20 miles / 30 km of the user's last known city or IP-based location), with a prompt to enable location for personalized results.

- **What happens when events fail to load (network error)?**
  Show a friendly error state with a retry button: "Unable to load events. Check your connection and try again."

- **What happens when a user's domain profile has missing or incomplete stats?**
  Display available stats and show placeholder text or "—" for missing fields. For example, if current rating is unavailable, show "Current Rating: —".

- **What happens when the backend authentication fails during Google sign-in?**
  Show an error message: "Sign-in failed. Please try again" with a retry button. Log the user out if they were partially authenticated.

- **What happens when a user tries to share a profile but QR generation fails?**
  Show an error: "Unable to generate QR code. Please try again" and return to the domain profile screen.

- **What happens when a user rapidly swipes between domain profile and events map?**
  Ensure smooth transitions without glitches, stuttering, or crashes. Use transition animations that clearly indicate direction (right to map, left back to profile).

- **What happens when a user has no internet connection on first launch?**
  Display a blocking error state: "No internet connection. Please connect to continue" with a retry button. Authentication requires network access.

## Requirements *(mandatory)*

### Functional Requirements

#### Authentication & Onboarding

- **FR-001**: System MUST display a splash screen on first launch showing AliasCore branding and value proposition
- **FR-002**: System MUST provide a welcome screen with a "Sign in with Google" button
- **FR-003**: System MUST authenticate users via Google OAuth through the backend API
- **FR-004**: System MUST recognize returning authenticated users and bypass splash/welcome/onboarding
- **FR-005**: System MUST prompt new users to set a display name during onboarding (3-30 characters, alphanumeric plus spaces and basic punctuation: . - ' )
- **FR-006**: System MUST allow new users to choose or upload an avatar during onboarding
- **FR-007**: System MUST navigate authenticated users to the Domains Dashboard after onboarding or login

#### Domains Dashboard

- **FR-008**: System MUST display a dashboard of the user's gaming domains after authentication
- **FR-009**: Each domain card MUST show: domain name, domain icon, and 1–2 highlight stats (e.g., peak rating, platform)
- **FR-010**: Domain cards MUST be visually distinct and easily tappable (minimum 44×44pt touch targets per constitution accessibility requirements)
- **FR-011**: System MUST navigate to the domain profile screen when a domain card is tapped
- **FR-012**: System MUST display an empty state when the user has no domains, with a clear message and call-to-action

#### Domain Profile Screen

- **FR-013**: System MUST display a full-screen domain profile with a namecard-style layout
- **FR-014**: Domain profile MUST show: user's display name, primary platform and username, peak rating, current rating
- **FR-015**: Domain profile SHOULD show supporting stats: games played, rank tier, or other domain-relevant metrics
- **FR-016**: System MUST provide a share button on the domain profile screen
- **FR-017**: System MUST support a right-swipe gesture to open the events map from the domain profile
- **FR-018**: System MUST support a dismiss gesture (swipe down or back) to return to the Domains Dashboard

#### Share Profile Flow

- **FR-019**: System MUST present sharing options (QR code, NFC) when the share button is tapped
- **FR-020**: System MUST display a share sheet that clearly communicates: domain name, username, and summary of stats being shared
- **FR-021**: System MUST generate a full-screen scannable QR code when QR share is selected
- **FR-022**: QR code MUST encode a URL linking to a public profile page for that domain
- **FR-023**: System MUST support NFC sharing or display a "Coming Soon" stub if NFC is not implemented in MVP
- **FR-024**: System MUST allow users to dismiss the QR code or share sheet and return to the domain profile

#### Events Map

- **FR-025**: System MUST display a map of local events when the user swipes right on a domain profile
- **FR-026**: Events MUST be filtered by the selected domain (e.g., only Chess events for Chess domain)
- **FR-027**: System MUST display event pins on the map based on user's location within a 20-mile (30 km) radius (if permission granted)
- **FR-028**: System MUST limit display to 25 events maximum; if more exist, show the 25 soonest upcoming events
- **FR-029**: System MUST show event details when a pin is tapped: event name, date/time, venue, description, link
- **FR-030**: System MUST handle missing location permission gracefully by showing regional events with a prompt to enable location
- **FR-031**: System MUST allow users to swipe left or dismiss to return to the domain profile from the events map

#### User Profile & Data

- **FR-032**: System MUST store and display user profile data: display name, avatar, authentication status
- **FR-033**: System MUST retrieve domain profiles (stats, ratings, platform usernames) from the backend API
- **FR-034**: System MUST treat the backend API as the source of truth for all user and domain data
- **FR-035**: System MUST handle missing or incomplete domain stats gracefully by showing placeholders or "—" for unavailable fields

#### Public Share Page (External)

- **FR-036**: System MUST provide a public web-based profile page accessible via QR/NFC link
- **FR-037**: Public profile page MUST display only share-approved information: domain name, platform, username, key stats
- **FR-038**: Public profile page MUST NOT expose sensitive user data (email, authentication tokens, private settings)

#### Error Handling & Edge Cases

- **FR-039**: System MUST display friendly error messages for authentication failures with a retry option
- **FR-040**: System MUST display error states for network failures when loading events, with retry functionality
- **FR-041**: System MUST require internet connection for authentication and display a blocking error if offline on first launch
- **FR-042**: System MUST handle rapid gesture interactions (swipes, taps) without crashes, glitches, or stuttering

#### Observability & Logging

- **FR-043**: System MUST log all errors including: crashes, API failures, network timeouts, authentication failures
- **FR-044**: System MUST log critical user actions: successful login, domain profile views, QR/NFC share initiations, event views
- **FR-045**: System MUST NOT log sensitive data: authentication tokens, email addresses, passwords, or full API request/response bodies
- **FR-046**: Log entries MUST include: timestamp, user ID (anonymized if possible), event type, error message (if applicable)

#### UX & Interaction Principles

- **FR-047**: All screen transitions MUST feel fast and fluid (target <500ms for domain profile render per constitution performance principle)
- **FR-048**: All touch targets MUST be at least 44×44pt (per constitution accessibility requirements)
- **FR-049**: All text MUST be readable (minimum 16pt body text, WCAG AA color contrast per constitution)
- **FR-050**: System MUST use full-screen views with minimal visible chrome (no unnecessary headers, tabs, or navigation bars)
- **FR-051**: System MUST prioritize gesture-driven navigation over button-heavy interfaces

### Key Entities *(include if feature involves data)*

- **User**: Represents an authenticated user. Attributes: userId (unique identifier), displayName (user-chosen name), avatarUrl (link to avatar image), email (from Google OAuth), domains (list of DomainProfile IDs, maximum 10 domains per user).

- **DomainProfile**: Represents a user's profile for a specific game domain. Attributes: domainId (unique identifier for the domain, e.g., "chess"), domainName (e.g., "Chess"), domainIcon (URL or identifier for icon), primaryPlatform (e.g., "Chess.com"), platformUsername (e.g., "player123"), peakRating (highest rating achieved), currentRating (current rating), gamesPlayed (total games), rankTier (optional rank/tier label), lastUpdated (timestamp of last stat sync).

- **Event**: Represents a local event for a domain. Attributes: eventId (unique identifier), domainId (domain this event belongs to, e.g., "chess"), eventName (e.g., "City Chess Championship"), eventDate (date/time of event), venue (location name and address), latitude (for map display), longitude (for map display), description (event details), externalLink (URL to event page or registration).

- **SharePayload**: Represents data shared via QR/NFC. Attributes: userId (user sharing the profile), domainId (domain being shared), shareUrl (public profile link), displayName (user's name), platformUsername (platform username), peakRating (highlight stat for preview).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can complete first-time onboarding (authentication, display name, avatar) in under 90 seconds
- **SC-002**: Users can navigate from Domains Dashboard to a domain profile in under 500ms (tap to full render)
- **SC-003**: Users can generate and display a QR code for sharing in under 2 seconds from tapping the share button
- **SC-004**: 90% of users successfully complete authentication on their first attempt
- **SC-005**: Users can swipe between domain profile and events map with smooth transitions (no perceived lag or stuttering)
- **SC-006**: App launch to Domains Dashboard takes under 2 seconds for returning users on mid-range devices
- **SC-007**: Public profile pages load within 3 seconds when accessed via QR code scan
- **SC-008**: Events map displays local events within 5 seconds of opening (given network availability)
- **SC-009**: 95% of gesture interactions (swipes, taps, dismissals) respond within 100ms (immediate feedback)
- **SC-010**: Zero crashes during critical flows: authentication, domain profile viewing, QR code generation

## UX/UI Flows & Screen Definitions

### Screen 1: Splash Screen

**Purpose**: Brand introduction and value proposition on first launch.

**Layout**:
- Full-screen, centered AliasCore logo
- Tagline below logo: "Your Universal Gaming Identity"
- Minimal chrome, auto-advances after 2 seconds or user tap

**Behavior**:
- Displayed only on first launch (before authentication)
- Auto-advances to Welcome Screen after 2 seconds
- Can be skipped with a tap

---

### Screen 2: Welcome Screen

**Purpose**: Entry point for authentication.

**Layout**:
- Full-screen with AliasCore branding at top
- Centered "Sign in with Google" button (prominent, 44×44pt minimum)
- Brief value proposition text: "Aggregate your gaming profiles. Share your achievements. Discover events."

**Behavior**:
- Tapping "Sign in with Google" initiates OAuth flow via backend API
- On successful auth, new users proceed to Onboarding; returning users skip to Dashboard
- On auth failure, show error toast: "Sign-in failed. Please try again" with retry

---

### Screen 3: Onboarding Flow (New Users Only)

**Purpose**: Collect display name and avatar for new users.

**Layout**:
- **Step 1**: "What should we call you?" prompt with text input for display name, Continue button
- **Step 2**: "Choose your avatar" with options to upload image, choose from presets, or auto-generate, Continue button

**Behavior**:
- Display name must be 3-30 characters, alphanumeric plus spaces and basic punctuation (. - ' )
- Show validation error if name is too short, too long, or contains invalid characters
- Avatar is optional (auto-generate if not chosen)
- After completing both steps, user lands on Domains Dashboard
- Returning users skip this entirely

---

### Screen 4: Domains Dashboard

**Purpose**: Home screen showing all gaming domains the user participates in.

**Layout**:
- Full-screen vertical scrollable grid of domain cards
- Each card shows: domain icon (top), domain name (center), 1–2 highlight stats (bottom, e.g., "Peak: 2400 • Chess.com")
- Minimal header with user avatar (top-right corner, tappable for profile settings—future feature)
- No visible navigation bar (gesture-driven)

**Behavior**:
- Cards are loaded from backend API on screen load
- Tapping a card opens the Domain Profile Screen with a slide-up transition
- Pull-to-refresh gesture reloads domain data
- Empty state (no domains): centered message "No gaming domains yet. Connect your profiles to get started" with CTA button (future feature)

**Transitions**:
- Tap domain card → slide up to Domain Profile Screen

---

### Screen 5: Domain Profile Screen

**Purpose**: Display detailed stats for a specific gaming domain in a shareable "namecard" format.

**Layout**:
- Full-screen namecard-style plate (visually distinct, card-like UI element centered on screen)
- Top: User's display name and avatar
- Middle: Primary platform (e.g., "Chess.com") and platform username (e.g., "@player123")
- Center: Large peak rating display (e.g., "Peak Rating: 2400") and current rating (e.g., "Current: 2350")
- Bottom: Supporting stats in a grid (e.g., "Games Played: 1,234 | Rank: Expert")
- Share button (bottom-right corner, floating action button style)
- No visible header/navigation (swipe down to dismiss)

**Behavior**:
- Data loaded from backend API (DomainProfile entity)
- Share button opens Share Sheet (overlay)
- Swipe right opens Events Map (slide-right transition)
- Swipe down or back gesture dismisses to Domains Dashboard

**Transitions**:
- Swipe down → slide down to Domains Dashboard
- Swipe right → slide right to Events Map
- Tap share → overlay Share Sheet

---

### Screen 6: Share Sheet (Overlay)

**Purpose**: Present sharing options (QR, NFC) and communicate what will be shared.

**Layout**:
- Bottom sheet overlay (half-screen, rounded top corners)
- Top: "Share your Chess profile" header
- Middle: Summary preview (e.g., "Player123 | Peak: 2400 on Chess.com")
- Bottom: Two large buttons: "QR Code" and "NFC" (or "NFC - Coming Soon" if stubbed)
- Close button (top-right X icon)

**Behavior**:
- Tapping "QR Code" opens QR Code Screen
- Tapping "NFC" initiates NFC flow (or shows "Coming Soon" message)
- Tapping close or swiping down dismisses back to Domain Profile

**Transitions**:
- Tap QR Code → full-screen transition to QR Code Screen
- Swipe down → dismiss to Domain Profile

---

### Screen 7: QR Code Screen

**Purpose**: Display full-screen scannable QR code for sharing.

**Layout**:
- Full-screen with centered, large QR code
- Top: Small header text "Scan to view profile"
- Bottom: Domain name and username reminder (e.g., "Chess - Player123")
- Close button (top-right X icon or swipe down to dismiss)

**Behavior**:
- QR code generated instantly (<100ms per constitution performance target)
- QR encodes a public share URL (e.g., https://aliascore.app/share/user123/chess)
- Tapping close or swiping down returns to Domain Profile

**Transitions**:
- Swipe down → dismiss to Domain Profile

---

### Screen 8: Events Map

**Purpose**: Display local events for the selected domain on a map.

**Layout**:
- Full-screen map view with event pins
- Top: Small header showing domain name (e.g., "Chess Events Near You")
- Map centered on user's location (if permission granted) or default region
- Event pins (markers) for each event (maximum 25 pins shown)
- No navigation bar (swipe left to dismiss)

**Behavior**:
- Events loaded from backend API, filtered by domainId
- Maximum 25 events displayed; if more exist within radius, show the 25 soonest upcoming events
- Tapping a pin shows event details in a bottom sheet (overlay)
- Location permission requested on first access; if denied, show regional events with prompt to enable
- Network error: show error state with retry button
- Swipe left or back gesture returns to Domain Profile

**Transitions**:
- Swipe left → slide left back to Domain Profile
- Tap event pin → overlay Event Details bottom sheet

---

### Screen 9: Event Details (Bottom Sheet Overlay)

**Purpose**: Display details for a selected event.

**Layout**:
- Bottom sheet overlay (half-screen, rounded top corners)
- Top: Event name (header)
- Middle: Date/time, venue (address), description
- Bottom: "View Event" button (opens external link) or "Save Event" (future feature)
- Close button (top-right X icon)

**Behavior**:
- Tapping "View Event" opens external link in browser or in-app web view
- Tapping close or swiping down dismisses back to Events Map

**Transitions**:
- Swipe down → dismiss to Events Map

---

### Screen 10: Public Profile Page (External Web View)

**Purpose**: Public-facing profile page for sharing (viewed by strangers who scan QR or receive NFC).

**Layout**:
- Simple web page (mobile-optimized) with AliasCore branding
- Top: User's display name and avatar
- Middle: Domain name (e.g., "Chess"), platform, username
- Center: Key stats (peak rating, current rating, games played)
- Bottom: "Download AliasCore" CTA button (links to app store)

**Behavior**:
- Publicly accessible URL (no authentication required)
- Only displays share-approved data (no sensitive info like email or tokens)
- Loads within 3 seconds (per SC-007)

**Data Requirements**:
- Backend must provide an endpoint to generate/serve this page
- URL format: https://aliascore.app/share/{userId}/{domainId}

---

## Gesture Interactions Summary

| Gesture              | From Screen         | To Screen           | Behavior           |
| -------------------- | ------------------- | ------------------- | ------------------ |
| Tap domain card      | Domains Dashboard   | Domain Profile      | Slide-up transition |
| Swipe down           | Domain Profile      | Domains Dashboard   | Dismiss (slide down) |
| Swipe right          | Domain Profile      | Events Map          | Slide right        |
| Swipe left           | Events Map          | Domain Profile      | Slide left back    |
| Tap share button     | Domain Profile      | Share Sheet         | Overlay appears    |
| Tap QR Code          | Share Sheet         | QR Code Screen      | Full-screen transition |
| Swipe down           | QR Code Screen      | Domain Profile      | Dismiss            |
| Tap event pin        | Events Map          | Event Details       | Bottom sheet overlay |
| Swipe down           | Event Details       | Events Map          | Dismiss overlay    |
| Pull-to-refresh      | Domains Dashboard   | (refresh data)      | Reload domain cards |

---

## Data Refresh & State Management Rules

**When to show onboarding**:
- Only for new users after first successful authentication
- Returning users skip entirely

**When to refresh domain data**:
- On app launch (Domains Dashboard load)
- On pull-to-refresh gesture
- After returning from background (if last refresh >5 minutes ago)

**When to refresh events data**:
- On Events Map open (each time user swipes right)
- When user changes location (if location services enabled)
- On retry after network error

**Authentication state**:
- Persist authentication tokens securely (per constitution security principles)
- Check auth status on app launch
- If token expired, re-authenticate user (silent refresh if possible, else prompt login)
- **Mock mode**: When mock authentication is enabled (MOCK_AUTH=true), auth tokens persist across app restarts using the same secure storage mechanism, allowing testing of returning user flows without repeated onboarding

**Offline behavior**:
- Authentication requires internet (blocking error if offline on first launch)
- Cached domain data can be viewed offline (with "Last updated: X time ago" indicator)
- Events map requires internet (show error state if offline)
- QR code generation works offline (if share URL can be constructed from cached data)

---

## Product-Level Constraints & Assumptions

**Backend is the source of truth**:
- All user profile data, domain stats, and events come from the backend API
- Frontend does not calculate ratings or stats—displays backend-provided values
- Frontend must handle missing/incomplete data gracefully

**Domain limits**:
- Maximum 10 domains per user
- If user attempts to add an 11th domain, show error: "Maximum domains reached (10). Remove a domain to add a new one."

**QR/NFC sharing is domain-specific**:
- Each share action shares exactly one domain profile (not the entire user profile)
- Share payload includes: userId, domainId, shareUrl, displayName, platformUsername, peakRating

**Location permission is optional**:
- Events map works without location (shows regional events)
- Location enhances experience but is not required

**Avatar handling**:
- User can upload custom avatar, choose from presets, or use auto-generated avatar
- Backend stores avatar URL; frontend displays it

**Platform usernames**:
- Each domain profile has a primary platform (e.g., Chess.com, Lichess for Chess)
- Backend determines primary platform based on highest rating or user preference

**No multi-domain sharing in MVP**:
- Users cannot share multiple domains at once
- Future feature: "Share All Domains" or custom multi-domain cards

**No in-app event registration in MVP**:
- "View Event" opens external link
- Future feature: in-app RSVP or ticket purchase

**No user profile editing in MVP**:
- Display name and avatar set during onboarding
- Future feature: profile settings screen to edit name, avatar, privacy settings

---

## Assumptions

**Domain data sync frequency**:
- Assume backend syncs domain stats at least daily (user can manually refresh via pull-to-refresh)

**Events data coverage**:
- Assume backend aggregates events from multiple sources (e.g., Chess.com events, local tournament calendars)
- Events are pre-filtered by domain in the backend
- Backend returns events within a 20-mile (30 km) radius of the provided location (user's current location or fallback location)
- Maximum 25 events returned; if more exist, backend prioritizes by soonest event date (ascending chronological order)

**Public share page hosting**:
- Assume backend provides a public web endpoint for share URLs
- Frontend does not host or render the public page (it's a backend web view)

**Google OAuth flow**:
- Assume backend handles OAuth token exchange and validation
- Frontend receives an authentication token from backend after successful sign-in

**Mock authentication for development**:
- Mock mode (enabled via MOCK_AUTH=true environment variable) bypasses backend API calls for authentication
- Mock auth tokens persist across app restarts to allow realistic testing of returning user flows
- Mock authentication uses the same secure storage mechanism as production auth
- Mock mode generates consistent mock user data (ID, display name, email) for predictable testing
- Mock mode skips onboarding flow and navigates directly to Domains Dashboard with pre-set profile (display name, avatar)
- Mock mode provides 2-3 pre-populated domain profiles (e.g., Chess, Valorant) with realistic stats to enable testing of dashboard and domain profile screens without backend dependency
- Mock mode generates 5-10 mock events per domain with realistic event data (name, date/time, venue, coordinates) to enable complete testing of events map functionality
- Mock mode operates transparently without UI indicators; developers rely on console logs to confirm mock mode is active

**Avatar storage**:
- Assume backend provides avatar upload endpoint
- Avatar presets and auto-generated avatars are provided by backend or third-party service (e.g., Gravatar, DiceBear)

**Gesture sensitivity**:
- Swipe thresholds: right-swipe (>50% screen width), down-swipe (>30% screen height) to trigger transitions
- Tap targets: minimum 44×44pt (per constitution accessibility)

**NFC implementation**:
- MVP may stub NFC with "Coming Soon" message
- If implemented, NFC writes the same share URL as QR code (platform-specific NFC libraries required)

---

## Out of Scope for MVP

- Multi-domain sharing (share multiple domains in one QR/NFC payload)
- In-app event registration or RSVP
- User profile editing after onboarding (name, avatar changes)
- Social features (follow other users, comments, likes)
- Push notifications for new events or rating changes
- Domain profile customization (themes, layouts)
- Integration with additional gaming platforms beyond backend-provided domains
- Analytics or stats tracking beyond what backend provides
