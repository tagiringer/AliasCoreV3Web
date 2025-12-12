/**
 * Authentication API Service
 * Handles Google OAuth endpoints
 */

import Constants from 'expo-constants';
import { apiClient } from '../../common/services/apiClient';
import { MockApiInterceptor } from '../../common/services/mock';
import { logger } from '../../common/services/logger';
import type { GoogleAuthResponse, LoginRequest } from '../types';
import type { User } from '../../common/types/entities';

/**
 * Check if mock auth is enabled
 */
const isMockAuthEnabled = (): boolean => {
  return Constants.expoConfig?.extra?.mockAuth === true;
};

/**
 * Authenticate with Google ID token
 * POST /api/auth/google
 */
export async function authenticateWithGoogle(idToken: string): Promise<GoogleAuthResponse> {
  try {
    logger.info('Authenticating with Google');

    // Use mock interceptor if mock auth is enabled
    if (isMockAuthEnabled()) {
      const mockResponse = await MockApiInterceptor.authenticateWithGoogle(idToken);

      logger.critical('auth_success', {
        isNewUser: mockResponse.isNewUser,
        userId: mockResponse.user.id,
      });

      return mockResponse;
    }

    const response = await apiClient.post<GoogleAuthResponse>('/api/auth/google', {
      idToken,
    } as LoginRequest);

    logger.critical('auth_success', {
      isNewUser: response.isNewUser,
      userId: response.user.id,
    });

    return response;
  } catch (error) {
    logger.error('Google authentication failed', { error });
    throw error;
  }
}

/**
 * Get current authenticated user
 * GET /api/auth/me
 */
export async function getCurrentUser(): Promise<User> {
  try {
    logger.debug('Fetching current user');

    // Use mock interceptor if mock auth is enabled
    if (isMockAuthEnabled()) {
      const mockUser = await MockApiInterceptor.getUserProfile('mock-user-12345');
      return mockUser;
    }

    const response = await apiClient.get<{ user: User }>('/api/auth/me');

    return response.user;
  } catch (error) {
    logger.error('Failed to fetch current user', { error });
    throw error;
  }
}

/**
 * Sign out (invalidate token on backend)
 * POST /api/auth/signout
 */
export async function signOut(): Promise<void> {
  try {
    logger.info('Signing out');

    // Skip API call if mock auth is enabled
    if (isMockAuthEnabled()) {
      logger.info('Using mock signout (MOCK_AUTH=true)');

      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 200));

      logger.critical('auth_signout');
      return;
    }

    await apiClient.post('/api/auth/signout', {});

    logger.critical('auth_signout');
  } catch (error) {
    // Log error but don't throw - we'll clear local token anyway
    logger.error('Signout API call failed', { error });
  }
}
