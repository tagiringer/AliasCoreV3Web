/**
 * Authentication types
 */

import type { User } from '../common/types/entities';

/**
 * Auth state in context
 */
export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

/**
 * Auth context value
 */
export interface AuthContextValue extends AuthState {
  signIn: (idToken: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateUser: (updates: Partial<User>) => void;
  refreshUser: () => Promise<void>;
}

/**
 * Google OAuth response from backend
 */
export interface GoogleAuthResponse {
  token: string; // JWT auth token
  user: User;
  isNewUser: boolean; // Whether this is first-time login
}

/**
 * Login request payload
 */
export interface LoginRequest {
  idToken: string; // Google ID token
}
