/**
 * AppStack Navigator
 * Handles post-authentication screens with gesture-driven navigation
 * Per constitution: Snapchat-inspired UX with minimal chrome and gesture support
 *
 * Enhanced with:
 * - Fast transitions (250ms) for <500ms target (SC-004)
 * - Right-swipe gesture navigation to map (US3)
 * - Native driver for 60fps animations
 */

import React from 'react';
import { Dimensions } from 'react-native';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
import type { AppStackParamList } from '../common/types/navigation';
import { DomainsDashboardScreen } from '../domains/screens/DomainsDashboardScreen';
import { MapPlaceholderScreen } from '../map/screens/MapPlaceholderScreen';

// Temporary placeholder screens - will be implemented in later phases
const DomainProfileScreen = () => null;
const ShareSheetScreen = () => null;
const QRCodeScreen = () => null;

const Stack = createStackNavigator<AppStackParamList>();

// Screen width for gesture calculations
const { width: SCREEN_WIDTH } = Dimensions.get('window');

/**
 * Fast transition spec for <500ms requirement (SC-004)
 * Uses native driver for 60fps animations
 */
const FAST_TRANSITION_SPEC = {
  open: {
    animation: 'timing' as const,
    config: {
      duration: 250,           // 250ms < 500ms target ✓
      useNativeDriver: true,   // Bypass JS thread for 60fps ✓
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

export const AppStack: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false, // Minimal chrome per constitution
        gestureEnabled: true,
        gestureDirection: 'horizontal',
        transitionSpec: FAST_TRANSITION_SPEC,
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      }}
    >
      <Stack.Screen
        name="DomainsDashboard"
        component={DomainsDashboardScreen}
        options={{
          // Enable right-swipe gesture navigation to Map (US3)
          gestureEnabled: true,
          gestureDirection: 'horizontal',
          // 50% screen width threshold prevents accidental triggers
          gestureResponseDistance: SCREEN_WIDTH * 0.5,
          // Higher velocity impact favors intentional swipes
          gestureVelocityImpact: 0.4,
          transitionSpec: FAST_TRANSITION_SPEC,
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        }}
      />
      <Stack.Screen
        name="DomainProfile"
        component={DomainProfileScreen}
        options={{
          // Right-swipe to dismiss
          gestureDirection: 'horizontal',
        }}
      />
      <Stack.Screen
        name="ShareSheet"
        component={ShareSheetScreen}
        options={{
          // Modal presentation
          presentation: 'modal',
          cardStyleInterpolator: CardStyleInterpolators.forModalPresentationIOS,
        }}
      />
      <Stack.Screen
        name="QRCode"
        component={QRCodeScreen}
        options={{
          // Full-screen QR code
          presentation: 'transparentModal',
          cardStyleInterpolator: CardStyleInterpolators.forFadeFromBottomAndroid,
        }}
      />
      <Stack.Screen
        name="EventsMap"
        component={MapPlaceholderScreen}
        options={{
          // Enable left-swipe/back gesture to return to dashboard
          gestureEnabled: true,
          gestureDirection: 'horizontal',
          // Standard left-edge back gesture (50pt from edge)
          gestureResponseDistance: 50,
          transitionSpec: FAST_TRANSITION_SPEC,
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        }}
      />
    </Stack.Navigator>
  );
};
