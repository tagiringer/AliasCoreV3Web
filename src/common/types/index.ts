/**
 * Central export for all type definitions
 */

export type {
  User,
  DomainProfile,
  Event,
  SharePayload,
} from './entities';

export type {
  AuthStackParamList,
  AppStackParamList,
  SplashScreenNavigationProp,
  WelcomeScreenNavigationProp,
  OnboardingScreenNavigationProp,
  DomainsDashboardNavigationProp,
  DomainProfileNavigationProp,
  ShareSheetNavigationProp,
  QRCodeNavigationProp,
  EventsMapNavigationProp,
  OnboardingRouteProp,
  DomainProfileRouteProp,
  ShareSheetRouteProp,
  QRCodeRouteProp,
  EventsMapRouteProp,
} from './navigation';

export type {
  ApiError,
  GoogleAuthRequest,
  AuthResponse,
  GetCurrentUserResponse,
  UpdateProfileRequest,
  UpdateProfileResponse,
  GetDomainsResponse,
  GetDomainProfileRequest,
  GetDomainProfileResponse,
  GetEventsRequest,
  GetEventsResponse,
  PaginatedResponse,
} from './api';
