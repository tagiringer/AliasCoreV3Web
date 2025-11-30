/**
 * AuthContext
 * Manages global authentication state
 */

import React, { createContext, useState, useEffect, useCallback } from 'react';
import type { User } from '../../common/types/entities';
import type { AuthContextValue, AuthState } from '../types';
import { authenticateWithGoogle, getCurrentUser, signOut as signOutApi } from '../services/authApi';
import { saveToken, getToken, clearToken } from '../services/tokenStorage';
import { apiClient } from '../../common/services/apiClient';
import { logger } from '../../common/services/logger';

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
  });

  /**
   * Initialize auth state on mount
   * Check for stored token and validate it
   */
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = await getToken();

        if (token) {
          // Set token in API client
          await apiClient.setAuthToken(token);

          // Fetch current user to validate token
          const user = await getCurrentUser();

          setState({
            user,
            isLoading: false,
            isAuthenticated: true,
          });

          logger.info('Auth initialized with existing token');
        } else {
          setState({
            user: null,
            isLoading: false,
            isAuthenticated: false,
          });

          logger.debug('No stored auth token found');
        }
      } catch (error) {
        // Token invalid or network error
        logger.warn('Failed to initialize auth with stored token', { error });

        // Clear invalid token
        await clearToken();

        setState({
          user: null,
          isLoading: false,
          isAuthenticated: false,
        });
      }
    };

    initializeAuth();
  }, []);

  /**
   * Sign in with Google ID token
   */
  const signIn = useCallback(async (idToken: string): Promise<void> => {
    try {
      setState((prev) => ({ ...prev, isLoading: true }));

      const response = await authenticateWithGoogle(idToken);

      // Store token securely
      await saveToken(response.token);

      // Set token in API client
      await apiClient.setAuthToken(response.token);

      setState({
        user: response.user,
        isLoading: false,
        isAuthenticated: true,
      });

      logger.critical('user_signed_in', {
        userId: response.user.id,
        isNewUser: response.isNewUser,
      });
    } catch (error) {
      setState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
      });

      logger.error('Sign in failed', { error });
      throw error;
    }
  }, []);

  /**
   * Sign out current user
   */
  const signOut = useCallback(async (): Promise<void> => {
    try {
      // Call backend signout endpoint
      await signOutApi();

      // Clear stored token
      await clearToken();

      // Clear API client token
      await apiClient.clearAuthToken();

      setState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
      });

      logger.critical('user_signed_out');
    } catch (error) {
      logger.error('Sign out failed', { error });
      throw error;
    }
  }, []);

  /**
   * Update current user (optimistic update)
   */
  const updateUser = useCallback((updates: Partial<User>): void => {
    setState((prev) => {
      if (!prev.user) return prev;

      return {
        ...prev,
        user: {
          ...prev.user,
          ...updates,
        },
      };
    });

    logger.debug('User updated locally', { updates });
  }, []);

  /**
   * Refresh user from backend
   */
  const refreshUser = useCallback(async (): Promise<void> => {
    try {
      const user = await getCurrentUser();

      setState((prev) => ({
        ...prev,
        user,
      }));

      logger.debug('User refreshed from backend');
    } catch (error) {
      logger.error('Failed to refresh user', { error });
      throw error;
    }
  }, []);

  const value: AuthContextValue = {
    ...state,
    signIn,
    signOut,
    updateUser,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
