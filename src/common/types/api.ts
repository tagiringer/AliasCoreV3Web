/**
 * API request and response type definitions
 * These types define the contract between frontend and backend
 */

import type { User, DomainProfile, Event } from './entities';

/**
 * Standard API error response
 */
export interface ApiError {
  error: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
}

/**
 * Authentication API types
 */
export interface GoogleAuthRequest {
  idToken: string; // Google ID token from OAuth flow
}

export interface AuthResponse {
  token: string; // JWT auth token
  user: User;
  isNewUser: boolean; // Whether this is the first login
}

export interface GetCurrentUserResponse {
  user: User;
}

/**
 * Profile API types
 */
export interface UpdateProfileRequest {
  displayName: string; // 3-30 characters
  avatarUrl?: string | null; // Optional avatar URL
}

export interface UpdateProfileResponse {
  user: User;
}

/**
 * Domains API types
 */
export interface GetDomainsResponse {
  domains: DomainProfile[];
}

export interface GetDomainProfileRequest {
  domainKey: string;
}

export interface GetDomainProfileResponse {
  domain: DomainProfile;
}

/**
 * Events API types
 */
export interface GetEventsRequest {
  domainKey: string;
  latitude: number;
  longitude: number;
  radius?: number; // In miles, defaults to 20
  limit?: number; // Max events to return, defaults to 25
}

export interface GetEventsResponse {
  events: Event[];
  count: number; // Total matching events (may be > events.length if limited)
}

/**
 * Generic paginated response wrapper
 * (Not used in MVP but included for future expansion)
 */
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    hasMore: boolean;
  };
}
