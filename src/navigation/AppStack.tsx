/**
 * AppStack Navigator
 * Handles post-authentication screens with gesture-driven navigation
 * Per constitution: Snapchat-inspired UX with minimal chrome and gesture support
 */

import React from 'react';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
import type { AppStackParamList } from '../common/types/navigation';

// Placeholder screens - will be implemented in Phases 4-7
const DomainsDashboardScreen = () => null;
const DomainProfileScreen = () => null;
const ShareSheetScreen = () => null;
const QRCodeScreen = () => null;
const EventsMapScreen = () => null;

const Stack = createStackNavigator<AppStackParamList>();

export const AppStack: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false, // Minimal chrome per constitution
        gestureEnabled: true,
        gestureDirection: 'horizontal',
        // Fast transitions (<500ms) per constitution
        transitionSpec: {
          open: {
            animation: 'timing',
            config: {
              duration: 300, // 300ms transition
            },
          },
          close: {
            animation: 'timing',
            config: {
              duration: 300,
            },
          },
        },
        // Card-style modal presentation
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      }}
    >
      <Stack.Screen
        name="DomainsDashboard"
        component={DomainsDashboardScreen}
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
        component={EventsMapScreen}
        options={{
          // Right-swipe gesture from domain profile
          gestureDirection: 'horizontal',
        }}
      />
    </Stack.Navigator>
  );
};
