/**
 * AuthStack Navigator
 * Handles pre-authentication screens: Splash, Welcome, Onboarding
 */

import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import type { AuthStackParamList } from '../common/types/navigation';
import { SplashScreen } from '../auth/screens/SplashScreen';
import { WelcomeScreen } from '../auth/screens/WelcomeScreen';
import { OnboardingScreen } from '../auth/screens/OnboardingScreen';

const Stack = createStackNavigator<AuthStackParamList>();

export const AuthStack: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false, // No headers per Snapchat-inspired UX (minimal chrome)
        gestureEnabled: true,
        gestureDirection: 'horizontal',
        cardStyleInterpolator: ({ current, layouts }) => ({
          cardStyle: {
            transform: [
              {
                translateX: current.progress.interpolate({
                  inputRange: [0, 1],
                  outputRange: [layouts.screen.width, 0],
                }),
              },
            ],
          },
        }),
      }}
    >
      <Stack.Screen
        name="Splash"
        component={SplashScreen}
      />
      <Stack.Screen
        name="Welcome"
        component={WelcomeScreen}
      />
      <Stack.Screen
        name="Onboarding"
        component={OnboardingScreen}
      />
    </Stack.Navigator>
  );
};
