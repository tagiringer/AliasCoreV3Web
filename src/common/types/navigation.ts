/**
 * Navigation type definitions
 * Defines screen params for type-safe navigation
 */

import type { StackNavigationProp } from '@react-navigation/stack';
import type { RouteProp } from '@react-navigation/native';

/**
 * Auth Stack - Screens shown before user is authenticated
 */
export type AuthStackParamList = {
  Splash: undefined;
  Welcome: undefined;
  Onboarding: {
    userId: string; // User ID returned from backend after OAuth
  };
};

/**
 * App Stack - Screens shown after user is authenticated
 */
export type AppStackParamList = {
  DomainsDashboard: undefined;
  DomainProfile: {
    domainKey: string; // Which domain to display
  };
  ShareSheet: {
    domainKey: string; // Which domain to share
  };
  QRCode: {
    domainKey: string; // Which domain's QR code to display
  };
  EventsMap: {
    domainKey: string; // Which domain's events to show
  };
};

/**
 * Navigation prop types for each screen
 */
export type SplashScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Splash'>;
export type WelcomeScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Welcome'>;
export type OnboardingScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Onboarding'>;

export type DomainsDashboardNavigationProp = StackNavigationProp<
  AppStackParamList,
  'DomainsDashboard'
>;
export type DomainProfileNavigationProp = StackNavigationProp<AppStackParamList, 'DomainProfile'>;
export type ShareSheetNavigationProp = StackNavigationProp<AppStackParamList, 'ShareSheet'>;
export type QRCodeNavigationProp = StackNavigationProp<AppStackParamList, 'QRCode'>;
export type EventsMapNavigationProp = StackNavigationProp<AppStackParamList, 'EventsMap'>;

/**
 * Route prop types for screens with params
 */
export type OnboardingRouteProp = RouteProp<AuthStackParamList, 'Onboarding'>;
export type DomainProfileRouteProp = RouteProp<AppStackParamList, 'DomainProfile'>;
export type ShareSheetRouteProp = RouteProp<AppStackParamList, 'ShareSheet'>;
export type QRCodeRouteProp = RouteProp<AppStackParamList, 'QRCode'>;
export type EventsMapRouteProp = RouteProp<AppStackParamList, 'EventsMap'>;
