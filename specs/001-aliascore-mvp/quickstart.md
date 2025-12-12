# Quickstart Guide: AliasCore Mobile MVP

**Last Updated**: 2025-12-11
**Target Audience**: Developers onboarding to the AliasCore Mobile project

---

## Overview

AliasCore Mobile is a React Native application built with Expo that aggregates gaming achievements across multiple domains (Chess, Valorant, etc.). This guide will get you up and running in under 10 minutes.

---

## Prerequisites

Before starting, ensure you have the following installed:

### Required
- **Node.js**: v18+ ([Download](https://nodejs.org/))
- **npm** or **yarn**: Comes with Node.js
- **Expo CLI**: Install globally with `npm install -g expo-cli`
- **Git**: For version control

### Platform-Specific (choose one or more)

**For iOS Development:**
- macOS required
- Xcode 14+ ([Mac App Store](https://apps.apple.com/app/xcode/id497799835))
- iOS Simulator (included with Xcode)
- CocoaPods: `sudo gem install cocoapods`

**For Android Development:**
- Android Studio ([Download](https://developer.android.com/studio))
- Android SDK Platform 33+
- Android Emulator configured

**For Web Development:**
- Any modern browser (Chrome, Firefox, Safari)

### Optional but Recommended
- **Expo Go App**: Install on your physical device ([iOS](https://apps.apple.com/app/expo-go/id982107779) | [Android](https://play.google.com/store/apps/details?id=host.exp.exponent))
- **React Native Debugger**: For advanced debugging ([Download](https://github.com/jhen0409/react-native-debugger))

---

## Setup Steps

### 1. Clone the Repository

```bash
git checkout 001-mock-auth-flow
cd /path/to/AliasCoreV3Web
```

### 2. Install Dependencies

```bash
npm install
```

This will install all dependencies from `package.json`, including:
- React Native 0.81.5
- Expo SDK ~54.0.0
- React Navigation
- TypeScript
- Jest (testing framework)

### 3. Configure Environment Variables

Copy the `.env.example` file to `.env`:

```bash
cp .env.example .env
```

Edit `.env` and set the following variables:

```bash
# API Configuration
API_BASE_URL=http://YOUR_LOCAL_IP:3000  # Replace with your local IP or backend URL

# Mock Authentication (set to true for frontend-only development)
MOCK_AUTH=true

# Google OAuth (only needed for production auth)
GOOGLE_CLIENT_ID=your-google-client-id-here
GOOGLE_CLIENT_SECRET=your-google-client-secret-here

# Environment
ENV=development
```

**Important Notes**:
- **For mobile testing**: Replace `YOUR_LOCAL_IP` with your computer's local IP address (e.g., `192.168.1.205`). Find it with `ipconfig` (Windows) or `ifconfig` (Mac/Linux).
- **For web testing**: You can use `http://localhost:3000`
- **MOCK_AUTH=true**: Enables mock authentication mode, bypassing all backend API calls. Perfect for frontend development without a running backend.

### 4. Start the Development Server

```bash
npm start
```

Or use Expo CLI directly:

```bash
expo start
```

This will:
1. Start the Metro bundler
2. Open the Expo DevTools in your browser
3. Show a QR code for connecting mobile devices

---

## Running the App

You have multiple options for running the app:

### Option 1: Physical Device (Recommended for Testing)

1. Install **Expo Go** on your iOS/Android device
2. Ensure your device is on the same WiFi network as your computer
3. Scan the QR code displayed in the terminal or Expo DevTools
4. The app will load on your device

### Option 2: iOS Simulator (macOS only)

```bash
npm run ios
```

Or press `i` in the Expo DevTools terminal.

### Option 3: Android Emulator

```bash
npm run android
```

Or press `a` in the Expo DevTools terminal.

Make sure an Android emulator is running before executing this command.

### Option 4: Web Browser (Development/Testing Only)

```bash
npm run web
```

Or press `w` in the Expo DevTools terminal.

**Note**: Web is not a production target for this app, but useful for rapid development testing.

---

## Mock Mode vs. Production Mode

### Mock Mode (MOCK_AUTH=true)

When `MOCK_AUTH=true` in your `.env`:
- Authentication bypasses backend API calls
- App generates mock user data (Test User, testuser@example.com)
- 2-3 mock domain profiles (Chess, Valorant) with realistic stats
- 5-10 mock events per domain
- All data persists across app restarts
- No visual indicator (check console logs for "Using mock authentication" messages)

**Use mock mode for**:
- Frontend development without backend
- UI/UX prototyping
- Testing navigation flows
- Rapid iteration

### Production Mode (MOCK_AUTH=false)

When `MOCK_AUTH=false`:
- App makes real API calls to `API_BASE_URL`
- Requires running backend server
- Uses real Google OAuth authentication
- Fetches real user data from backend

---

## Development Workflow

### Common Commands

```bash
# Start development server
npm start

# Run on specific platform
npm run ios
npm run android
npm run web

# Run tests
npm test

# Type check (no output = success)
npm run type-check

# Lint code
npm run lint

# Clear cache and restart (if you encounter issues)
expo start --clear
```

### Project Structure Overview

```
src/
├── auth/              # Authentication feature (COMPLETE)
├── domains/           # Game domains (PLACEHOLDER)
├── events/            # Events map (PLACEHOLDER)
├── profile/           # User profile (PLACEHOLDER)
├── sharing/           # QR/NFC sharing (PLACEHOLDER)
├── common/            # Shared components, utils, theme
└── navigation/        # Navigation config (COMPLETE)

specs/001-aliascore-mvp/
├── spec.md            # Feature specification
├── plan.md            # Implementation plan
├── data-model.md      # Data entities
├── contracts/         # OpenAPI specs
└── quickstart.md      # This file
```

### Key Files

- **App.tsx**: Root component with AuthProvider and navigation
- **app.config.js**: Expo configuration (exposes .env variables)
- **tsconfig.json**: TypeScript strict mode enabled
- **package.json**: Dependencies and scripts
- **.env**: Local environment variables (NOT committed to git)

---

## Testing

### Run All Tests

```bash
npm test
```

### Run Tests in Watch Mode

```bash
npm test -- --watch
```

### Run Specific Test File

```bash
npm test -- src/auth/services/authApi.test.ts
```

### Test Structure

```
__tests__/
├── integration/       # Integration tests for user flows
│   ├── auth/          # Login, onboarding flows
│   ├── domains/       # Dashboard, profile viewing
│   └── sharing/       # QR generation
└── unit/              # Unit tests for services, utils
    ├── services/      # API clients
    └── utils/         # Formatters, validators
```

**Testing Philosophy** (per constitution):
- Focus on **critical user flows** (login, dashboard, QR generation)
- Test **business logic** (formatters, validators, API transformations)
- **Skip** trivial presentational components
- **Skip** snapshot tests (unless specifically needed)

---

## Troubleshooting

### Issue: "Network request failed" error

**Cause**: App can't reach backend API.

**Solutions**:
1. Set `MOCK_AUTH=true` in `.env` to bypass backend
2. Verify `API_BASE_URL` uses your local IP (not `localhost`) for mobile testing
3. Ensure backend server is running on the specified port
4. Check firewall settings

### Issue: "Failed to retrieve auth token" error on web

**Cause**: `expo-secure-store` doesn't support web.

**Solution**: Already handled! The app automatically falls back to `localStorage` on web. If you see this error, restart the Expo server:

```bash
expo start --clear
```

### Issue: Metro bundler stuck or slow

**Solution**: Clear cache and restart:

```bash
expo start --clear
```

Or manually clear cache:

```bash
rm -rf node_modules/.cache
expo start
```

### Issue: TypeScript errors on IDE but not in terminal

**Solution**: Restart TypeScript server in your IDE (VS Code: `Cmd+Shift+P` → "TypeScript: Restart TS Server")

### Issue: App crashes on startup

**Solutions**:
1. Check console logs for error messages
2. Verify all dependencies installed: `npm install`
3. Clear cache: `expo start --clear`
4. Check `.env` file is properly configured

---

## Next Steps

Once you have the app running:

1. **Explore mock mode**: Sign in and explore the Domains Dashboard placeholder screen
2. **Read the spec**: Review `specs/001-aliascore-mvp/spec.md` for feature requirements
3. **Review data model**: Check `specs/001-aliascore-mvp/data-model.md` for entity structures
4. **Check API contracts**: See `specs/001-aliascore-mvp/contracts/` for backend API specs
5. **Run tests**: Familiarize yourself with the test suite structure
6. **Enable real backend**: Set `MOCK_AUTH=false` and point `API_BASE_URL` to your backend server

---

## Resources

### Documentation
- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/docs/getting-started)
- [React Navigation](https://reactnavigation.org/docs/getting-started)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

### Project-Specific
- [Feature Specification](./spec.md)
- [Implementation Plan](./plan.md)
- [Data Model](./data-model.md)
- [API Contracts](./contracts/)
- [Project Constitution](../../.specify/memory/constitution.md)

### Community
- [Expo Forums](https://forums.expo.dev/)
- [React Native Community](https://reactnative.dev/community/overview)
- [Stack Overflow - React Native](https://stackoverflow.com/questions/tagged/react-native)

---

## Getting Help

If you encounter issues:

1. Check this quickstart guide's troubleshooting section
2. Review console logs for error messages
3. Search project issues on GitHub (if applicable)
4. Ask the team in Slack/Discord (if applicable)

---

**Happy coding! 🚀**
