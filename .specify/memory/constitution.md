<!--
SYNC IMPACT REPORT
==================
Version Change: [TEMPLATE] → 1.0.0
Rationale: Initial constitution creation for AliasCore Mobile project

Added Sections:
- Core Principles (7 principles defined)
  - I. Snapchat-Inspired UX
  - II. Feature-First Architecture
  - III. Type Safety & Modern React Native
  - IV. Critical Path Testing
  - V. Mobile-First Performance
  - VI. Security & Privacy by Default
  - VII. Explicit Over Implicit
- Architectural Constraints
- Code Quality Standards
- Governance

Template Consistency Status:
- ✅ .specify/templates/plan-template.md - No updates needed (constitution check section is generic)
- ✅ .specify/templates/spec-template.md - No updates needed (focuses on user stories, compatible with mobile UX principles)
- ✅ .specify/templates/tasks-template.md - No updates needed (task structure compatible with feature-first approach)
- ⚠️ .claude/commands/*.md - Verified no agent-specific references found

Follow-up TODOs: None - all placeholders filled

Deferred Items: None
-->

# AliasCore Mobile Constitution

## Core Principles

### I. Snapchat-Inspired UX

The user experience MUST feel fast, gesture-driven, and delightful. This principle is NON-NEGOTIABLE and applies to every screen and interaction in the application.

**Requirements:**
- Full-screen views with minimal visible chrome (no unnecessary headers, tabs, or navigation bars)
- Gesture-first navigation: swipes, taps, and dismissals over buttons and menus
- Fast transitions and micro-interactions that provide immediate feedback
- Domain cards and profiles MUST be visually consistent, legible, and optimized for at-a-glance understanding
- Navigation MUST be intuitive: dashboard as home, tap to drill into domain, swipe to access map, obvious dismissal/back actions
- Sharing flows (QR/NFC) MUST be one-tap, clearly communicating what is being shared before exposing QR or writing NFC

**Accessibility Requirements:**
- Readable text sizes (minimum 16pt for body text)
- Sufficient color contrast (WCAG AA minimum)
- Clear hit targets (minimum 44×44pt touch targets)
- Graceful degradation for users who cannot perform complex gestures (provide alternative tap-based navigation)

**Rationale:** Users expect social/gaming apps to feel modern and responsive. A Snapchat-inspired UX differentiates AliasCore Mobile from traditional rating platforms and creates a memorable, shareable experience.

### II. Feature-First Architecture

Code MUST be organized by feature/domain, not by technical layer. This enables independent development, testing, and potential extraction of features.

**Directory Structure:**
```
src/
├── auth/              # Authentication feature
├── profile/           # User profile feature
├── domains/           # Game domains feature
├── events/            # Events/map feature
├── sharing/           # QR/NFC sharing feature
├── common/            # Shared utilities, types, components
│   ├── components/    # Reusable UI components
│   ├── hooks/         # Shared React hooks
│   ├── types/         # Shared TypeScript types
│   └── utils/         # Pure utility functions
└── navigation/        # Navigation configuration
```

**Each feature folder MUST contain:**
- `screens/` - Screen components for this feature
- `components/` - Feature-specific components
- `hooks/` - Feature-specific React hooks
- `services/` - API calls and business logic
- `types.ts` - Feature-specific TypeScript types
- `index.ts` - Public exports from the feature

**Rationale:** Feature-first structure makes it easy to understand what the app does, enables parallel development, and prevents god-object folders like "components" or "utils" that become unmaintainable.

### III. Type Safety & Modern React Native

All code MUST use TypeScript with strict mode enabled. The codebase MUST follow modern React Native best practices.

**Requirements:**
- Functional components and hooks (no class components)
- Strict TypeScript: no `any` types except where absolutely necessary and explicitly justified
- Proper typing for API responses, navigation params, and component props
- Use of React Native's built-in types and community type definitions
- Prefer type inference over explicit typing where TypeScript can derive types accurately

**Anti-patterns to AVOID:**
- `any` types without explicit justification
- Complex logic inside render functions
- Prop drilling beyond 2 levels (use context or state management)
- Massive component files (>200 lines suggests need for decomposition)

**Rationale:** TypeScript catches errors at compile time, provides better IDE support, and serves as living documentation. Modern React patterns lead to more maintainable, testable code.

### IV. Critical Path Testing

Testing MUST focus on critical user flows and business logic. Testing for testing's sake is explicitly rejected.

**MVP Testing Priorities (in order):**
1. **Integration tests for critical flows:**
   - Login via Google OAuth
   - Viewing domains dashboard
   - Viewing a domain profile
   - Generating and displaying a QR code
2. **Unit tests for domain logic:**
   - Rating stat formatters (e.g., "2400 on Chess.com")
   - Sharing URL builders
   - Data transformations from API to UI models

**NOT required for MVP:**
- Component snapshot tests
- Tests for simple presentational components
- Tests for third-party library integrations (unless custom logic wraps them)

**Failure Handling:**
- API failures MUST show friendly error states with retry options (never crash)
- Network timeouts MUST be handled gracefully
- Auth token expiry MUST trigger re-authentication flow, not crashes

**Rationale:** Time spent writing tests for trivial code is time not spent shipping features. Focus on high-value tests that catch real bugs in critical flows.

### V. Mobile-First Performance

The app MUST optimize for startup time, perceived responsiveness, and network-constrained environments.

**Requirements:**
- Minimize work on app launch: defer non-critical initialization
- Use loading states and skeleton screens instead of blocking the entire UI
- Implement caching for domains and profile data (with appropriate invalidation)
- Use pagination or batching when fetching lists (domains, events)
- Avoid over-fetching: request only the data needed for the current screen
- Optimize images: use appropriate resolutions, formats, and lazy loading

**Performance Targets:**
- App launch to first interactive screen: <2 seconds on mid-range devices
- Domain profile screen render: <500ms after tap
- QR code generation: <100ms

**Network Handling:**
- Support offline viewing of previously loaded data
- Show partial data states (e.g., cached domains while fetching fresh data)
- Graceful degradation when network is slow or unavailable

**Rationale:** Mobile users expect instant responsiveness and have variable network conditions. Poor performance kills engagement and creates negative brand perception.

### VI. Security & Privacy by Default

Security and privacy MUST be baked into every feature, not retrofitted.

**Authentication & Tokens:**
- Store auth tokens in secure storage (react-native-keychain or equivalent)
- NEVER log tokens or sensitive user data
- Handle token renewal automatically and transparently
- Logout MUST clear all sensitive data from device storage

**API & Backend:**
- NEVER hard-code API URLs, secrets, or credentials in code
- Use environment variables for configuration
- Assume the existing backend API is the source of truth
- Do NOT invent or silently change backend contracts - if a new endpoint is needed, explicitly document it in specs

**Sharing & Public Data:**
- QR/NFC sharing MUST expose only minimal public profile data for the domain
- NEVER include auth tokens, email addresses, or other sensitive account data in shared payloads
- Clearly communicate to users what data is being shared before generating QR or writing NFC

**Logging & Error Messages:**
- NEVER log private user info, tokens, or API keys
- Error messages shown to users MUST NOT expose internal system details

**Rationale:** Security breaches destroy user trust and create legal liability. Privacy-first design protects users and aligns with modern expectations and regulations.

### VII. Explicit Over Implicit

When faced with ambiguity or uncertainty, MUST ask for clarification rather than guessing or making assumptions.

**Requirements:**
- If backend API contracts are unclear or missing, document as "NEEDS CLARIFICATION" in specs
- If multiple implementation approaches are valid, present options and trade-offs explicitly
- If a feature must be simplified or deferred (e.g., NFC implementation), mark it explicitly as stubbed/deferred and structure code for future upgrade
- Use `/speckit.clarify` to identify and resolve ambiguous requirements before implementation

**Trade-off Documentation:**
- When choosing one approach over another, document the decision and reasoning
- When deferring complexity, explain what was deferred and why
- When implementing a workaround, mark it with a TODO and explanation

**Rationale:** Implicit assumptions lead to misaligned implementations and wasted effort. Explicit communication and documentation prevent surprises and enable better collaboration.

## Architectural Constraints

### Separation of Concerns

The application MUST maintain clean separation between:

1. **UI Components** (`screens/`, `components/`): Pure presentation, minimal logic
2. **State Management** (`hooks/`, navigation state): Application state and side effects
3. **API/Data Access** (`services/`): Backend communication, request/response handling
4. **Domain Logic** (`services/`, `utils/`): Business rules, data transformations, calculations

### Backend Integration

- The existing backend API is the source of truth for:
  - Authentication (Google OAuth)
  - User profiles
  - Domain stats and ratings
  - Events data
- Backend contracts MUST NOT be invented or changed without explicit documentation
- If a new endpoint is needed, it MUST be called out in specs and plans with:
  - Endpoint path and method
  - Request/response schemas
  - Authentication requirements

### Configuration Management

- Use `react-native-config` or equivalent for environment variables
- Never commit `.env` files with real credentials
- Provide `.env.example` with placeholder values
- Support multiple environments: development, staging, production

## Code Quality Standards

### Component Guidelines

- Components SHOULD be small (<200 lines) and focused on a single responsibility
- Extract complex logic into custom hooks or service functions
- Prefer composition over inheritance
- Use TypeScript prop types for all component props

### Code Style

- Follow standard React Native and TypeScript conventions
- Use consistent naming: PascalCase for components, camelCase for functions/variables
- Meaningful names over terse abbreviations (except common conventions like `id`, `url`)
- Prefer explicit over clever: readability and maintainability trump DRY principles

### Simplicity Over Abstraction

- Implement the simplest solution that works
- Avoid premature abstraction: three instances of similar code is better than a premature abstraction
- Don't design for hypothetical future requirements
- Don't add error handling for scenarios that cannot happen
- Trust internal code and framework guarantees; validate only at system boundaries (user input, external APIs)

### Extensibility

- Write code that is easy for future developers to extend:
  - Adding new game domains beyond chess
  - Adding more stats to domain profiles
  - Enriching event details on the map
- Use clear interfaces and types to define extension points
- Document extension patterns where non-obvious

## Governance

### Amendment Procedure

This constitution is the ultimate authority for AliasCore Mobile. All future specifications, plans, tasks, and implementations MUST adhere to these principles.

**To amend this constitution:**
1. Propose changes with clear rationale
2. Assess impact on existing templates and code
3. Update constitution version according to semantic versioning rules:
   - MAJOR: Backward-incompatible governance changes or principle removals/redefinitions
   - MINOR: New principles or materially expanded guidance
   - PATCH: Clarifications, wording improvements, non-semantic refinements
4. Propagate changes to dependent templates and documentation
5. Document changes in the Sync Impact Report

### Compliance Review

- All `/speckit.specify` outputs MUST align with Product & UX principles
- All `/speckit.plan` outputs MUST verify architectural principles in the Constitution Check section
- All `/speckit.tasks` outputs MUST include tasks for security, testing, and performance requirements where applicable
- All AI-generated code MUST be reviewed for adherence to Type Safety, Security, and Code Quality principles

### Conflict Resolution

If this constitution conflicts with a specific feature requirement:
1. Stop and document the conflict
2. Use `/speckit.clarify` to resolve with the product owner
3. If the feature requirement is valid, amend the constitution
4. If the constitution principle stands, revise the feature requirement

### AI Collaboration

- AI agents (Claude Code, SpecKit commands) MUST treat this constitution as non-negotiable guardrails
- When in doubt, AI MUST ask for clarification via `/speckit.clarify` rather than guessing
- Trade-offs and simplifications MUST be made explicit (e.g., "NFC stubbed for post-MVP, structured for easy upgrade")
- AI MUST never silently invent backend API contracts or change existing ones

**Version**: 1.0.0 | **Ratified**: 2025-11-29 | **Last Amended**: 2025-11-29
